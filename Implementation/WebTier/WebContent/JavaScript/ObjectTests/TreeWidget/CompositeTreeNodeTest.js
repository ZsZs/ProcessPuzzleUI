window.CompositeTreeNodeTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_instantiatesChildNodes', isAsynchron : false },
         { method : 'unmarshall_determinesChildNodeClass', isAsynchron : false },
         { method : 'unmarshall_determinesIfNodeIsOpened', isAsynchron : false },
         { method : 'unmarshall_setsPrevAndNextNode', isAsynchron : false },
         { method : 'construct_whenIsOpened_constructsChildNodes', isAsynchron : false },
         { method : 'construct_whenNodeIsClosed_createsPlusSign', isAsynchron : false },
         { method : 'close_whenNodeIsOpened_destroysChildNodes', isAsynchron : false },
         { method : 'close_whenNodeIsOpened_replacesPlusSign', isAsynchron : false },
         { method : 'open_whenNodeIsClosed_constructsChildNodes', isAsynchron : false },
         { method : 'open_whenNodeIsOpened_destroysChildNodes', isAsynchron : false },
         { method : 'findNodeByPath_returnsSpecifiedChildNode', isAsynchron : false }]
   },

   constants : {
      NODE_SELECTOR : "/tr:treeDefinition/tr:rootNode/tr:treeNode[1]",
      CONFIGURATION_URI : "../TreeWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      WIDGET_DATA_URI : "../TreeWidget/TreeDefinition.xml",
      WIDGET_CONTAINER_ID : "TreeWidget",
      WIDGET_DEFINITION_URI : "../TreeWidget/TreeWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.compositeTreeNode;
      this.compositeTreeNodeDefinition;
      this.compositeTreeNodeType;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.parentNode;
      this.resourceBundle;
      this.rootNode;
      this.treeDefinition;
      this.webUILogger;
      this.webUIConfiguration;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.treeDefinition = new XmlResource( this.constants.WIDGET_DATA_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com', xmlns:tr='http://www.processpuzzle.com/TreeDefinition" });
      this.compositeTreeNodeDefinition = this.treeDefinition.selectNode( this.constants.NODE_SELECTOR );
      this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
      this.compositeTreeNodeType = new CompositeTreeNodeType();
      this.rootNode = new RootTreeNode( this.compositeTreeNodeType, this.compositeTreeNodeDefinition, this.elementFactory );
      this.rootNode.containerElement = this.widgetContainerElement;
      this.compositeTreeNode = new CompositeTreeNode( this.rootNode, this.compositeTreeNodeType, this.compositeTreeNodeDefinition, this.elementFactory );
   },
   
   afterEachTest : function (){
      this.compositeTreeNode.destroy();
      this.compositeTreeNode = null;
      this.compositeTreeNodeType = null;
      this.treeDefinition.release();
      this.treeDefinition = null;
      this.widgetContainerElement = null;
   },
   
   unmarshall_instantiatesChildNodes : function(){
      this.compositeTreeNode.unmarshall();

      assertThat( this.compositeTreeNode.getChildNodes().size(), equalTo( this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode" ).length ));
   },
      
   unmarshall_determinesChildNodeClass : function(){
      this.compositeTreeNode.unmarshall();

      this.compositeTreeNode.getChildNodes().each( function( childNode, index ){
         var nodeIndex = index + 1;
         var grandChildDefinition = this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode[" + nodeIndex + "]/tr:treeNode" );
         if( grandChildDefinition.length > 0 )
            assertThat( instanceOf( childNode, CompositeTreeNode ), is( true ));
         else
            assertThat( instanceOf( childNode, LeafTreeNode ), is( true ));
      }.bind( this ));
   },
   
   
   unmarshall_determinesIfNodeIsOpened : function(){
      this.compositeTreeNode.unmarshall();
      
      assertThat( this.compositeTreeNode.isOpened, equalTo( parseBoolean( this.treeDefinition.selectNodeText( this.constants.NODE_SELECTOR + "/@isOpened" ))));
   },
   
   unmarshall_setsPrevAndNextNode : function(){
      this.compositeTreeNode.unmarshall();

      this.compositeTreeNode.getChildNodes().each( function( childNode, index ){
         var nextNodeIndex = index + 2;
         var previousChildDefinition = this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode[" + index + "]" );
         var nextChildDefinition = this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode[" + nextNodeIndex + "]" );
         
         if( previousChildDefinition.length > 0 ) assertThat( childNode.getPreviousSibling(), not( nil() ));
         if( nextChildDefinition.length > 0 ) assertThat( childNode.getNextSibling(), not( nil() ));
      }.bind( this ));
   },
   
   construct_whenIsOpened_constructsChildNodes : function(){
      this.constructCompositeTreeNode();

      var nodeElements = this.widgetContainerElement.getChildren( 'div.' + this.compositeTreeNodeType.getNodeWrapperClass() );
      assertThat( nodeElements.length, equalTo( this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode" ).length +1 ));
   },
   
   construct_whenNodeIsClosed_createsPlusSign : function(){
      this.constructCompositeTreeNode();

      var handlerElement = this.widgetContainerElement.getElementById( this.compositeTreeNode.getId() ).getPrevious().getPrevious();
      assertThat( handlerElement.get( "src" ), equalTo( this.compositeTreeNodeType.determineNodeHandlerImage( this.compositeTreeNode )));
   },
   
   close_whenNodeIsOpened_destroysChildNodes : function(){
      this.constructCompositeTreeNode();
      
      this.compositeTreeNode.close();
      
      assertThat( this.compositeTreeNode.isOpened, is( false ));
      assertThat( this.widgetContainerElement.getChildren( 'div.' + this.compositeTreeNodeType.getNodeWrapperClass() ).length, equalTo( 1 ));
   },
   
   close_whenNodeIsOpened_replacesPlusSign : function(){
      this.constructCompositeTreeNode();
      
      this.compositeTreeNode.close();
      
      var handlerElement = this.widgetContainerElement.getElementById( this.compositeTreeNode.getId() ).getPrevious().getPrevious();
      assertThat( handlerElement.get( "src" ), equalTo( this.compositeTreeNodeType.determineNodeHandlerImage( this.compositeTreeNode )));
   },
   
   open_whenNodeIsClosed_constructsChildNodes : function(){
      this.constructCompositeTreeNode();
      var previousNumberOfConstructedNodes = this.widgetContainerElement.getChildren( 'div.' + this.compositeTreeNodeType.getNodeWrapperClass() ).length;
      var compositeNode = this.compositeTreeNode.findLastVisibleChild();      
      compositeNode.open();
      
      assertThat( compositeNode.isOpened, is( true ));
      var expectedNumberOfNodes = previousNumberOfConstructedNodes + this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode[@nodeId='13']/tr:treeNode" ).length;
      assertThat( this.widgetContainerElement.getChildren( 'div.' + this.compositeTreeNodeType.getNodeWrapperClass() ).length, equalTo( expectedNumberOfNodes ));
   },
   
   open_whenNodeIsOpened_destroysChildNodes : function(){
      this.constructCompositeTreeNode();
      this.compositeTreeNode.close();
      assumeThat( this.compositeTreeNode.isOpened, is( false ));
      
      this.compositeTreeNode.open();
      
      assertThat( this.compositeTreeNode.isOpened, is( true ));
      var expectedNumberOfNodes = this.treeDefinition.selectNodes( this.constants.NODE_SELECTOR + "/tr:treeNode" ).length +1;
      assertThat( this.widgetContainerElement.getChildren( 'div.' + this.compositeTreeNodeType.getNodeWrapperClass() ).length, equalTo( expectedNumberOfNodes ));
   },
   
   findNodeByPath_returnsSpecifiedChildNode : function(){
      this.constructCompositeTreeNode();

      assertThat( this.compositeTreeNode.findNodeByPath( "TreeWidget.Branch1/TreeWidget.Document1" ), JsHamcrest.Matchers.instanceOf( LeafTreeNode ));
      assertThat( this.compositeTreeNode.findNodeByPath( "TreeWidget.Branch1/TreeWidget.Document1" ).getCaption(), equalTo( "TreeWidget.Document1" ));
   },
   
   //Protected, private helper methods
   constructCompositeTreeNode : function(){
      this.compositeTreeNode.unmarshall();
      this.compositeTreeNode.construct();
      assumeThat( this.compositeTreeNode.isOpened, is( true ));
   }.protect()
});