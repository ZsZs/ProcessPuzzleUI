window.TreeNodeTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesNodeProperties', isAsynchron : false },
         { method : 'unmarshall_determinesChildNodes', isAsynchron : false },
         { method : 'construct_createsNodeWrapper', isAsynchron : false },
         { method : 'construct_whenParentIsLastNode_createsSpacerElement', isAsynchron : false },
         { method : 'construct_whenParentHasNextNode_createsLineElement', isAsynchron : false },
         { method : 'construct_whenIsLastNode_createsRectagularImageElement', isAsynchron : false },
         { method : 'construct_whenHasNextNode_createsTImageElement', isAsynchron : false },
         { method : 'construct_createsNodeIcon', isAsynchron : false },
         { method : 'construct_createsCaptionElement', isAsynchron : false },
         { method : 'destroy_removesAllElements', isAsynchron : false }]
   },

   constants : {
      NODE_SELECTOR : "//pp:treeDefinition/rootNode/treeNode[1]",
      CONFIGURATION_URI : "../TreeWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      WIDGET_DATA_URI : "../TreeWidget/TreeDefinition.xml",
      WIDGET_CONTAINER_ID : "TreeWidget",
      WIDGET_DEFINITION_URI : "../TreeWidget/TreeWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.elementFactory;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
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
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.treeDefinition = new XmlResource( this.constants.WIDGET_DATA_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com'" });
      this.treeNodeDefinition = this.treeDefinition.selectNode( this.constants.NODE_SELECTOR );
      this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
      this.treeNodeType = new TreeNodeType();
      this.rootNode = new RootTreeNode( this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.parentNode = new CompositeTreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.treeNode = new TreeNode( this.parentNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      
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
   
   unmarshall_determinesChildNodes : function(){
      this.treeNode.unmarshall();

      //assertThat( instanceOf( this.treeNode, CompositeTreeNode ), is( true ));
      //assertThat( this.treeNode.getChildNodes().size(), equalTo( this.treeWidget.getDataXml().selectNodes( this.constants.NODE_SELECTOR + "/treeNode" ).length ));
   },
   
   construct_createsNodeWrapper : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var nodeWrapper = this.widgetContainerElement.getChildren( 'div' )[0];
      assertThat( nodeWrapper.hasClass( this.treeNodeType.getNodeWrapperClass() ), is( true )); 
   },
   
   construct_whenParentIsLastNode_createsSpacerElement : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getTrailingImageClass() )[0];
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getTrailingImageWhenParentIsLast() )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
   },
   
   construct_whenParentHasNextNode_createsLineElement : function() {
      this.parentNode.nextNode = new TreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getTrailingImageClass() )[1];
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getTrailingImageWhenParentHasNext() )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
   },
   
   construct_whenIsLastNode_createsRectagularImageElement : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getNodeHandlerClass() )[0];
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeHandlerClass() ), is( true )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getNodeHandlerSourceWhenLast() )); 
   },
   
   construct_whenHasNextNode_createsTImageElement : function() {
      this.treeNode.nextNode = new TreeNode( this.rootNode, this.treeNodeType, this.treeNodeDefinition, this.elementFactory );
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getNodeHandlerClass() )[0];
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeHandlerClass() ), is( true )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
      assertThat( imageElement.get( 'src' ), equalTo( this.treeNodeType.getNodeHandlerSourceWhenHasNext() )); 
   },
   
   construct_createsNodeIcon : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var imageElement = this.widgetContainerElement.getElements( 'img.' + this.treeNodeType.getNodeIconClass() )[0];
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeIconClass() ), is( true )); 
      assertThat( imageElement.hasClass( this.treeNodeType.getNodeImageClass() ), is( true )); 
   },
   
   construct_createsCaptionElement : function() {
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      
      var captionElement = this.widgetContainerElement.getElements( 'span.' + this.treeNodeType.getCaptionClass() )[0];
      assertThat( captionElement.hasClass( this.treeNodeType.getCaptionClass() ), is( true )); 
      assertThat( captionElement.get( 'id' ), equalTo( this.treeNode.getId() )); 
      assertThat( captionElement.get( 'text' ), equalTo( this.resourceBundle.getText( this.treeNode.getCaption() ))); 
   },
   
   destroy_removesAllElements : function(){
      this.treeNode.unmarshall();
      this.treeNode.construct( this.widgetContainerElement );
      this.treeNode.destroy();
      
      assertThat( this.widgetContainerElement.getElements( '*' ).length, equalTo( 0 ));
   }
});