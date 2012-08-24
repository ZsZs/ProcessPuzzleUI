window.TreeNodeTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onNodeSelected'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesNodeProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesMessageObject', isAsynchron : false },
         { method : 'construct_createsNodeWrapper', isAsynchron : false },
         { method : 'construct_whenHasPreviousSibling_insertsWrapperAfterSibling', isAsynchron : false },
         { method : 'construct_whenIsLastNode_createsRectangularImageElement', isAsynchron : false },
         { method : 'construct_whenHasNextNode_createsTImageElement', isAsynchron : false },
         { method : 'construct_createsNodeIcon', isAsynchron : false },
         { method : 'construct_createsCaptionElement', isAsynchron : false },
         { method : 'construct_whenParentIsLastNode_createsSpacerElement', isAsynchron : false },
         { method : 'construct_whenParentHasNextNode_createsLineElement', isAsynchron : false },
         { method : 'onCaptionClick_firesNodeSelected', isAsynchron : true },
         { method : 'destroy_removesAllElements', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../TreeWidget/WebUIConfiguration.xml",
      ELEMENT_AFTER_ID : "nodeAfter",
      ELEMENT_BEFORE_ID : "nodeBefore",
      LANGUAGE : "en",
      NODE_SELECTOR : "/tr:treeDefinition/tr:rootNode/tr:treeNode[1]",
      WIDGET_DATA_URI : "../TreeWidget/TreeDefinition.xml",
      WIDGET_CONTAINER_ID : "TreeWidget",
      WIDGET_DEFINITION_URI : "../TreeWidget/TreeWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );

      this.elementAfter;
      this.elementBefore;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.parentNode;
      this.resourceBundle;
      this.rootNode;
      this.treeDefinition;
      this.treeNode;
      this.treeNodeDefinition;
      this.treeNodeType;
      this.webUILogger;
      this.webUIConfiguration;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.treeDefinition = new XmlResource( this.constants.WIDGET_DATA_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com' xmlns:tr='http://www.processpuzzle.com/TreeDefinition'" });
      this.treeNodeDefinition = this.treeDefinition.selectNode( this.constants.NODE_SELECTOR );
      this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
      this.elementAfter = $( this.constants.ELEMENT_AFTER_ID );
      this.elementBefore = $( this.constants.ELEMENT_BEFORE_ID );
      this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
      this.treeNodeType = new TreeNodeType();
      this.rootNode = new RootTreeNode( this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.rootNode.containerElement = this.widgetContainerElement;
      this.parentNode = new CompositeTreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.parentNode.nodeWrapperElement = this.elementBefore;
      this.treeNode = new TreeNode( this.parentNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory, { onNodeSelected : this.onNodeSelected });
      
   },
   
   afterEachTest : function (){
      this.treeNode.destroy();
      this.treeNode = null;
      this.treeNodeType = null;
      this.treeDefinition.release();
      this.treeDefinition = null;
      this.widgetContainerElement = null;
   },
   
   unmarshall_determinesNodeProperties : function(){
      this.treeNode.unmarshall();
      
      assertThat( this.treeNode.getId(), equalTo( this.treeDefinition.selectNodeText( this.constants.NODE_SELECTOR + "/@nodeId" )));
      assertThat( this.treeNode.getCaption(), equalTo( this.treeDefinition.selectNodeText( this.constants.NODE_SELECTOR + "/@caption" )));
      assertThat( this.treeNode.getImageUri(), equalTo( this.treeDefinition.selectNodeText( this.constants.NODE_SELECTOR + "/@image" )));
      assertThat( this.treeNode.getOrderNumber(), equalTo( this.treeDefinition.selectNodeText( this.constants.NODE_SELECTOR + "/@orderNumber" )));
   },
   
   unmarshall_instantiatesMessageObject : function(){
      this.treeNode.unmarshall();

      assertThat( this.treeNode.getMessage(), JsHamcrest.Matchers.instanceOf( MenuSelectedMessage ));      
   },
   
   construct_createsNodeWrapper : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var nodeWrapper = this.widgetContainerElement.getChildren( 'div.' + this.treeNodeType.getNodeWrapperClass() )[0];
      assertThat( nodeWrapper.hasClass( this.treeNodeType.getNodeWrapperClass() ), is( true )); 
   },
   
   construct_whenHasPreviousSibling_insertsWrapperAfterSibling : function() {
      this.treeNode.unmarshall();
      var previousSibling = new TreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      previousSibling.nodeWrapperElement = this.elementBefore; 
      this.treeNode.previousSibling = previousSibling;
      
      this.treeNode.construct();
      
      var nodeWrapper = this.widgetContainerElement.getChildren( 'div.' + this.treeNodeType.getNodeWrapperClass() )[0];
      assertThat( nodeWrapper.hasClass( this.treeNodeType.getNodeWrapperClass() ), is( true )); 
      assertThat( nodeWrapper.getPrevious(), equalTo( this.elementBefore ));
   },
   
   construct_whenIsLastNode_createsRectangularImageElement : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getNodeHandlerClass() )[0];
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeHandlerClass() ), is( true )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getNodeHandlerSourceWhenLast() )); 
   },
   
   construct_whenHasNextNode_createsTImageElement : function() {
      this.treeNode.nextSibling = new TreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getNodeHandlerClass() )[0];
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeHandlerClass() ), is( true )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getNodeHandlerSourceWhenHasNext() )); 
   },
   
   construct_createsNodeIcon : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getNodeIconClass() )[0];
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeIconClass() ), is( true )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
   },
   
   construct_createsCaptionElement : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var captionElement = this.widgetContainerElement.getElements( 'span.' + this.treeNodeType.getCaptionClass() )[0];
      assertThat( captionElement.hasClass( this.treeNodeType.getCaptionClass() ), is( true )); 
      assertThat( captionElement.get( 'id' ), equalTo( this.treeNode.getId() )); 
      assertThat( captionElement.get( 'text' ), equalTo( this.resourceBundle.getText( this.treeNode.getCaption() ))); 
   },
   
   construct_whenParentIsLastNode_createsSpacerElement : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getTrailingImageClass() )[0];
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getTrailingImageWhenParentIsLast() )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
   },
   
   construct_whenParentHasNextNode_createsLineElement : function() {
      this.parentNode.nextSibling = new TreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.treeNode.unmarshall();
      this.treeNode.construct();
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getTrailingImageClass() )[1];
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getTrailingImageWhenParentHasNext() )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
   },
   
   onCaptionClick_firesNodeSelected : function() {
      this.testCaseChain.chain(
         function(){ 
            this.treeNode.unmarshall(); 
            this.treeNode.construct(); 
            this.treeNode.onCaptionClick();
         }.bind( this ),
         function(){
            assertThat( this.selectedNode, equalTo( this.treeNode ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllElements : function(){
      this.treeNode.unmarshall();
      this.treeNode.construct();
      this.treeNode.destroy();
      
      assertThat( this.widgetContainerElement.getElements( 'div.' + this.treeNodeType.getNodeWrapperClass() ).length, equalTo( 0 ));
   },
   
   //Protected, private helper methods
   onNodeSelected : function( selectedNode ){
      this.selectedNode = selectedNode;
      this.testCaseChain.callChain();
   }
});