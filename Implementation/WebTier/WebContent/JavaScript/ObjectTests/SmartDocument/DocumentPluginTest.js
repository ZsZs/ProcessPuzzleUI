window.DocumentPluginTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onResourcesLoaded'],

   options : {
      testMethods : [
          { method : 'initialize_setsState', isAsynchron : false },
          { method : 'unmarshall_determinesResources', isAsynchron : false },
          { method : 'unmarshall_determinesWidgetProperties', isAsynchron : false },
          { method : 'construct_loadsResources', isAsynchron : true }, 
          { method : 'construct_instantiatesWidget', isAsynchron : true }, 
          { method : 'construct_whenResourceLoadFails_firesError', isAsynchron : true }, 
          { method : 'construct_whenWidgetConstructionFails_firesError', isAsynchron : true }, 
          { method : 'destroy_releasesResourcesAndDestroysPlugin', isAsynchron : true }]
   },

   constants : {
      DOCUMENT_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      ERRONEOUS_DOCUMENT_URI : "../SmartDocument/ErroneousDocumentDefinition.xml",
      ERRONEOUS_PLUGIN_DEFINITION_ELEMENT : "/sd:smartDocumentDefinition/sd:documentBody/sd:compositeElement/sd:element[@id='skinSelector']/sd:plugin",
      PLUGIN_DEFINITION_ELEMENT : "/sd:smartDocumentDefinition/sd:documentBody/sd:compositeElement/sd:element[@id='languageSelector']/sd:plugin",
      PLUGIN_STYLE_SHEET : "../HierarchicalMenuWidget/HorizontalLayout.css",
      WEBUI_CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.constants.RESOURCE_ITEMS_SELECTOR = this.constants.PLUGIN_DEFINITION_ELEMENT + "/sd:resources/sd:styleSheets/sd:styleSheet | " + 
                                               this.constants.PLUGIN_DEFINITION_ELEMENT + "/sd:resources/sd:images/sd:image | " +
                                               this.constants.PLUGIN_DEFINITION_ELEMENT + "/sd:resources/sd:javaScripts/sd:javaScript",
      this.loadCallbackWasCalled = false;
      this.desktopContainerElement;
      this.documentDefinition;
      this.erroneousDocumentDefinition;
      this.internationalization;
      this.pluginDefinitionElement;
      this.plugin;
      this.waitTries = 0;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIController = new WebUIController( { configurationUri : this.constants.WEBUI_CONFIGURATION_URI } );
      this.webUIConfiguration = this.webUIController.getWebUIConfiguration(); //new WebUIConfiguration( WEBUI_CONFIGURATION_URI );
      this.webUILogger = this.webUIController.getLogger(); 
      this.internationalization = this.webUIController.getResourceBundle();
	   
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.erroneousDocumentDefinition = new XmlResource( this.constants.ERRONEOUS_DOCUMENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      var pluginDefinitionElement = this.documentDefinition.selectNode( this.constants.PLUGIN_DEFINITION_ELEMENT );
      this.plugin = new DocumentPlugin( pluginDefinitionElement, this.internationalization, { onResourcesLoaded : this.onResourcesLoaded, onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );
      this.desktopContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
   	this.documentDefinition.release();
   	this.erroneousDocumentDefinition.release();
   	if( this.plugin.getState() > DocumentElement.States.INITIALIZED ) this.plugin.destroy();
   	this.desktopContainerElement = null;
   	this.loadCallbackWasCalled = false;
   },
   
   initialize_setsState : function() {
      assertThat( this.plugin.getState(), equalTo( DocumentElement.States.INITIALIZED ));
   },
   
   unmarshall_determinesResources : function() {
      this.plugin.unmarshall();
      assertThat( this.plugin.getResources(), not( nil() ));
      assertThat( this.plugin.getResources().getResources().size(), equalTo( this.documentDefinition.selectNodes( this.constants.RESOURCE_ITEMS_SELECTOR ).length ));               
   },
   
   unmarshall_determinesWidgetProperties : function() {
      this.plugin.unmarshall();
      
      assertThat( this.plugin.getWidgetName(), equalTo( this.documentDefinition.selectNodeText( this.constants.PLUGIN_DEFINITION_ELEMENT + "/sd:widget/@name" ) ));
      assertThat( "'" + this.plugin.getWidgetOptions()['widgetContainerId'] + "'", equalTo( this.documentDefinition.selectNodeText( this.constants.PLUGIN_DEFINITION_ELEMENT + "/sd:widget/sd:options/sd:option[@name='widgetContainerId']/@value" )) );
   },
   
   construct_loadsResources : function() {
      this.testCaseChain.chain(
         function(){
            this.plugin.unmarshall();
            this.plugin.construct( this.desktopContainerElement );
         }.bind( this ),
         function(){
            assertThat( this.plugin.getResources().getResources().size(), equalTo( this.documentDefinition.selectNodes( this.constants.RESOURCE_ITEMS_SELECTOR ).length ));
         }.bind( this ),         
         function(){
            assertThat( this.plugin.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_instantiatesWidget : function() {
      this.testCaseChain.chain(
         function(){ this.plugin.unmarshall(); this.plugin.construct( this.desktopContainerElement ); }.bind( this ),
         function(){ /* wait for 'onResourcesLoaded' event */ },
         function(){
            assertThat( this.plugin.getWidget(), not( nil() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenResourceLoadFails_firesError : function() {
      this.testCaseChain.chain(
         function(){
            var pluginDefinitionElement = this.erroneousDocumentDefinition.selectNode( this.constants.PLUGIN_DEFINITION_ELEMENT );
            this.plugin = new DocumentPlugin( pluginDefinitionElement, this.internationalization, { onResourcesLoaded : this.onResourcesLoaded, onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );
            this.plugin.unmarshall();
            this.plugin.construct( this.desktopContainerElement );
         }.bind( this ),
         function(){
            assertThat( this.plugin.isSuccess(), is( false ));
            assertThat( instanceOf( this.plugin.getError(), UndefinedDocumentResourceException ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenWidgetConstructionFails_firesError : function() {
      this.testCaseChain.chain(
         function(){
            var pluginDefinitionElement = this.erroneousDocumentDefinition.selectNode( this.constants.ERRONEOUS_PLUGIN_DEFINITION_ELEMENT );
            this.plugin = new DocumentPlugin( pluginDefinitionElement, this.internationalization, { onResourcesLoaded : this.onResourcesLoaded, onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );
            this.plugin.unmarshall();
            this.plugin.construct( this.desktopContainerElement );
         }.bind( this ),
         function(){
            assertThat( this.plugin.isSuccess(), is( false ));
            assertThat( instanceOf( this.plugin.getError(), IllegalArgumentException ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_releasesResourcesAndDestroysPlugin : function() {
      this.testCaseChain.chain(
         function(){
            this.plugin.unmarshall();
            this.plugin.construct( this.desktopContainerElement );
         }.bind( this ),
         function(){ /* wait for 'onResourcesLoaded' event */ },
         function(){
            var widgetDestroy = spy( this.plugin.getWidget().destroy );
            this.plugin.destroy();
           
            assertThat( $$("link[href='" + this.constants.PLUGIN_STYLE_SHEET + "']").length, equalTo( 0 ));
            verify( widgetDestroy );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onResourcesLoaded : function(){
      this.testCaseChain.callChain();
   },
	
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function(){
      this.testCaseChain.callChain();
   },
   
});