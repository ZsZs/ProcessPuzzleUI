window.TreeWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onSelectCallBack'],

   options : {
      testMethods : [
         { method : 'initialize_loadsTreeDefinition', isAsynchron : false },
         { method : 'initialize_instantiatesNodeTypes', isAsynchron : false },
         { method : 'initialize_instantiatesNodeFactory', isAsynchron : false },
         { method : 'unmarshall_instantiatesRootNode', isAsynchron : false },
         { method : 'unmarshall_instantiatesChildNodes', isAsynchron : false },
         { method : 'construct_constructsChildNodes', isAsynchron : true },
         { method : 'construct_whenEnabled_constructsRootNode', isAsynchron : true },
         { method : 'onCaptionClick_broadcastMenuSelectedMessage', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../TreeWidget/WebUIConfiguration.xml",
      IMAGE_FOLDER : "../TreeWidget/Images/",
      LANGUAGE : "en",
      WIDGET_CONTAINER_ID : "TreeWidget",
      WIDGET_DATA_URI : "../TreeWidget/TreeDefinition.xml",
      WIDGET_DEFINITION_URI : "../TreeWidget/TreeWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.treeWidget;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.componentStateManager = new ComponentStateManager();
      this.messageBus = new WebUIMessageBus();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.treeWidget = new TreeWidget({ 
         widgetContainerId : this.constants.WIDGET_CONTAINER_ID,
         nodeTypeOptions : { imagesFolder : this.constants.IMAGE_FOLDER },
         onConstructed : this.onConstructed, 
         onDestroyed : this.onDestroyed,
         widgetDataURI : this.constants.WIDGET_DATA_URI,
         widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI
      }, this.resourceBundle );
      
      this.widgetContainerElement = this.treeWidget.getContainerElement();
   },
   
   afterEachTest : function (){
      this.componentStateManager.reset();
      this.messageBus.tearDown();
      this.treeWidget.destroy();
      this.treeWidget = null;
      this.widgetContainerElement = null;
      TreeNodeFactory.singleInstance = null;
   },
   
   initialize_loadsTreeDefinition : function() {
      assertThat( this.treeWidget.getDataXml().getUri(), containsString( this.constants.WIDGET_DATA_URI ));
   },
   
   initialize_instantiatesNodeTypes : function() {
      assertThat( this.treeWidget.getTreeNodeType(), not( nil() ));
      assertThat( instanceOf( this.treeWidget.getTreeNodeType(), TreeNodeType ), is( true ));
      assertThat( this.treeWidget.getTreeNodeType().getImagesFolder(), equalTo( this.constants.IMAGE_FOLDER ));
      
      assertThat( this.treeWidget.getCompositeTreeNodeType(), not( nil() ));
      assertThat( instanceOf( this.treeWidget.getCompositeTreeNodeType(), CompositeTreeNodeType ), is( true ));
      assertThat( this.treeWidget.getCompositeTreeNodeType().getImagesFolder(), equalTo( this.constants.IMAGE_FOLDER ));
   },
   
   initialize_instantiatesNodeFactory : function(){
      assertThat( TreeNodeFactory.singleInstance, not( nil() ));
      assertThat( instanceOf( TreeNodeFactory.singleInstance, TreeNodeFactory ), is( true ));
   },
   
   unmarshall_instantiatesRootNode : function(){
      this.treeWidget.unmarshall();
      
      assertThat( this.treeWidget.getRootNode(), not( nil() ));
   },
   
   unmarshall_instantiatesChildNodes : function(){
      this.treeWidget.unmarshall();
      
      assertThat( this.treeWidget.getRootNode().getChildNodes().size(), equalTo( this.treeWidget.getDataXml().selectNodes( "//pp:treeDefinition/rootNode/treeNode" ).length ));
   },
   
   construct_constructsChildNodes : function() {
      this.testCaseChain.chain(
         function(){ 
            this.treeWidget.unmarshall(); 
            this.treeWidget.construct(); 
         }.bind( this ),
         function(){
            assertThat( this.treeWidget.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            assertThat( this.treeWidget.getRootNode().getState(), equalTo( BrowserWidget.States.UNMARSHALLED ));
            
            this.treeWidget.getRootNode().getChildNodes().each( function( treeNode, index ){
               assertThat( treeNode.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            }.bind( this ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenEnabled_constructsRootNode : function() {
      this.testCaseChain.chain(
         function(){
            this.treeWidget.options.showRootNode = true;
            this.treeWidget.unmarshall();
            this.treeWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.treeWidget.getRootNode().getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onCaptionClick_broadcastMenuSelectedMessage : function() {
      this.testCaseChain.chain(
         function(){ 
            this.treeWidget.unmarshall(); 
            this.treeWidget.construct(); 
         }.bind( this ),
         function(){
            this.messageBus.subscribeToMessage( MenuSelectedMessage, this.onSelectCallBack );
            var leafNode = this.treeWidget.findNodeByPath( "TreeWidget.Root/TreeWidget.Branch1/TreeWidget.Document1" );
            leafNode.onCaptionClick();
         }.bind( this ),
         function(){
            assertThat( this.callBackWasCalled, is( true ));
            assertThat( this.callBackMessage.getActivityType(), equalTo( AbstractDocument.Activity.LOAD_DOCUMENT ));
            assertThat( this.callBackMessage.getOriginator(), equalTo( this.treeWidget.options.componentName ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.testCaseChain.callChain();
   },

   onSelectCallBack : function( webUIMessage ) {
      this.callBackMessage = webUIMessage;
      this.callBackWasCalled = true;
      this.testCaseChain.callChain();
   }
});