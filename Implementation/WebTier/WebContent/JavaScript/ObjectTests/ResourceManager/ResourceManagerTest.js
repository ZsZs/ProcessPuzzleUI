window.ResourceManagerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onResourcesLoaded', 'onResourceError'],

   options : {
      testMethods : [
          { method : 'initialize_instantiatesResourcesCollection', isAsynchron : false },
          { method : 'unmarshall_determinesResources', isAsynchron : false },
          { method : 'load_loadsStyleSheets', isAsynchron : true }, 
          { method : 'load_loadsImages', isAsynchron : true }, 
          { method : 'load_loadsScripts', isAsynchron : true }, 
          { method : 'load_preventsDuplicateScriptLoading', isAsynchron : true }, 
          { method : 'load_whenOneOfTheResourcesUnAvailable_FiresError', isAsynchron : true }, 
          { method : 'release_destroysLoadedElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../ResourceManager/WebUIConfiguration.xml",
      RESOURCES_DEFINITION_URI : "../ResourceManager/TestResourcesDefinition.xml",
      IMAGE_ID : "logoImage",
      IMAGE_URI : "../SmartDocument/Images/ProcessPuzzleLogo.jpg",
      RESOURCES_SELECTOR : "/testResources/resources",
      RESOURCE_ITEMS_SELECTOR : "/testResources/resources" + "/styleSheets/styleSheet | " + 
                                "/testResources/resources" + "/images/image | " +
                                "/testResources/resources" + "/javaScripts/javaScript",
      SCRIPT_URI : "../ResourceManager/DummyScript.js",
      SCRIPTS_SELECTOR : "/testResources/resources" + "/javaScripts",
      STYLE_SHEET_URI : "../ResourceManager/DummyCSS.css",
      STYLESHEETS_SELECTOR : "/testResources/resources" + "/styleSheets"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.resourcesDefinition;
      this.onResourceErrorWasCalled;
      this.onResourceLoadedWasCalled;
      this.resourceManager;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
        
      this.resourcesDefinition = new XmlResource( this.constants.RESOURCES_DEFINITION_URI );
      this.resourceManager = new ResourceManager( this.resourcesDefinition.selectNode( this.constants.RESOURCES_SELECTOR ), { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
        
      this.onResourceErrorWasCalled = false;
      this.onResourceLoadedWasCalled = false;
   },
   
   afterEachTest : function (){
      if( this.resourceManager ) this.resourceManager.release();
      this.resourceManager = null;

      if( this.resourcesDefinition ) this.resourcesDefinition.release();
      this.resourcesDefinition = null;
   },
   
   initialize_instantiatesResourcesCollection : function() {
      assertThat( this.resourceManager, not( nil() ));
      assertThat( this.resourceManager.getResources(), not( nil() ));
   },
   
   unmarshall_determinesResources : function() {
      this.resourceManager.unmarshall();
      assertThat( this.resourceManager.getResources().size(), equalTo( this.resourcesDefinition.selectNodes( this.constants.RESOURCE_ITEMS_SELECTOR ).length ));
   },
   
   load_loadsStyleSheets : function() {
      this.testCaseChain.chain(
         function(){
            this.resourceManager.unmarshall();
            this.resourceManager.load();
         }.bind( this ),
         function(){
            assertThat( this.onResourceLoadedWasCalled, is( true ));
            assertThat( this.onResourceErrorWasCalled, is( false ));
            assertThat( this.resourceManager.isSuccess(), is( true ));
            
            var linkElement = $$("link[href='" + this.constants.STYLE_SHEET_URI + "']");
            assertThat( linkElement.length, equalTo( 1 ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   load_loadsImages : function() {
      this.testCaseChain.chain(
         function(){
            this.resourceManager.unmarshall(); 
            this.resourceManager.load();
         }.bind( this ),
         function(){
            assertThat( this.onResourceLoadedWasCalled, is( true ));
            assertThat( this.onResourceErrorWasCalled, is( false ));
            assertThat( this.resourceManager.isSuccess(), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   load_loadsScripts : function() {
      this.testCaseChain.chain(
         function(){
            this.resourceManager.unmarshall(); 
            this.resourceManager.load();
         }.bind( this ),
         function(){
            var scriptElement = $$("script[src='" + this.constants.SCRIPT_URI + "']");
            assertThat( this.onResourceLoadedWasCalled, is( true ));
            assertThat( this.onResourceErrorWasCalled, is( false ));
            assertThat( this.resourceManager.isSuccess(), is( true ));
            assertThat( scriptElement, not( nil() ));
            assertThat( scriptElement.length, equalTo( 1 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   load_preventsDuplicateScriptLoading : function() {
      this.testCaseChain.chain(
         function(){
            var duplicateScript = this.resourcesDefinition.createElement( 'javaScript', { text : this.constants.SCRIPT_URI } );
            //var javaScriptsElement = this.resourcesDefinition.selectNode( this.constants.SCRIPTS_SELECTOR );
            this.resourcesDefinition.injectElement( duplicateScript, this.constants.SCRIPTS_SELECTOR );
            this.resourceManager.unmarshall(); 
            this.resourceManager.load();
         }.bind( this ),
         function(){
            var scriptElement = $$("script[src='" + this.constants.SCRIPT_URI + "']");
            assertThat( scriptElement.length, equalTo( 1 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   load_whenOneOfTheResourcesUnAvailable_FiresError : function() {
      this.testCaseChain.chain(
         function(){
            var unavailableResource = this.resourcesDefinition.createElement( 'styleSheet', { text : "UnAvailableStyleSheet.css" } );
            //var styleSheetsElement = this.resourcesDefinition.selectNode( this.constants.STYLESHEETS_SELECTOR );
            this.resourcesDefinition.injectElement( unavailableResource, this.constants.STYLESHEETS_SELECTOR );
            this.resourceManager.unmarshall(); 
            this.resourceManager.load(); 
         }.bind( this ),
         function(){
            assertThat( this.onResourceErrorWasCalled, is( true ));
            assertThat( this.resourceManager.isSuccess(), is( false ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   release_destroysLoadedElements : function() {
      this.testCaseChain.chain(
         function(){
            this.resourceManager.unmarshall(); 
            this.resourceManager.load();
         }.bind( this ),
         function(){
            assertThat( $$("link[href='" + this.constants.STYLE_SHEET_URI + "']").length, equalTo( 1 ));
            this.resourceManager.release();        
            assertThat( this.resourceManager.getResources().size(), equalTo( 0 ));
            assertThat( $$("link[href='" + this.constants.STYLE_SHEET_URI + "']").length, equalTo( 0 ));
            assertThat( $$("script[src='" + this.constants.SCRIPT_URI + "']").length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onResourceError : function( error ){
      this.onResourceErrorWasCalled = true;
   },

   onResourcesLoaded : function( resource ){
      this.onResourceLoadedWasCalled = true;
      this.testCaseChain.callChain();
   }

});