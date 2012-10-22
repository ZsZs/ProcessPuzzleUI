window.MediaPlayerWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'initialization_setsState', isAsynchron : false },
         { method : 'unmarshall_instantiatesAndUnmarshallsMedia', isAsynchron : false },
         { method : 'construct_constructsDisplay', isAsynchron : true },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      WIDGET_DATA_URI : "../MediaPlayerWidget/Slideshow/PhotoGaleryData.xml",
      WIDGET_DEFINITION_URI : "../MediaPlayerWidget/MediaPlayerWidgetDefinition.xml",
      WIDGET_CONTAINER_ID : "PhotoGaleryContainer",
      WEBUI_CONFIGURATION_URI : "../MediaPlayerWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.componentStateManager;
      this.messageBus;
      this.widget;
      this.widgetContainerElement;
      this.widgetData;
      this.widgetDefinition;
      this.widgetInternationalization;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.beforeEachTestChain.chain(
         function(){
            this.messageBus = new WebUIMessageBus();
            this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
            this.webUILogger = new WebUILogger( this.webUIConfiguration );
            this.componentStateManager = new ComponentStateManager();
            this.widgetInternationalization = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onLocalizationFailure, onSuccess : this.onLocalizationLoaded });
            this.widgetInternationalization.load( this.locale );
         }.bind( this ),
         function(){
            this.widgetData = new XmlResource( this.constants.WIDGET_DATA_URI, { nameSpaces : "xmlns:pg='http://www.processpuzzle.com/PhotoGalery'" });
            this.widgetDefinition = new XmlResource( this.constants.WIDGET_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" });
            
            this.widget = new MediaPlayerWidget( this.widgetInternationalization, {
               onConstructed : this.onConstructed,
               onDestroyed : this.onDestroyed,
               widgetContainerId : this.constants.WIDGET_CONTAINER_ID, 
               widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI, 
               widgetDataURI : this.constants.WIDGET_DATA_URI 
            });
            this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.widget.destroy();
      this.widgetData.release();
      this.widgetDefinition.release();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
   },
   
   initialization_setsState : function() {
      assertThat( this.widget.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
   },
   
   unmarshall_instantiatesAndUnmarshallsMedia : function(){
      this.widget.unmarshall();
      
      assertThat( this.widget.getState(), equalTo( BrowserWidget.States.UNMARSHALLED ));
      assertThat( this.widget.getMedia(), not( nil() ));
      assertThat( this.widget.getMedia(), JsHamcrest.Matchers.instanceOf( Media ));
   },
   
   construct_constructsDisplay : function() {
      this.testCaseChain.chain(
         function(){
            this.widget.unmarshall();
            this.widget.construct();
         }.bind( this ),
         function(){
            assertThat( this.widget.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            assertThat( this.widget.getDisplay(), JsHamcrest.Matchers.instanceOf( MediaPlayerDisplay ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.widget.unmarshall(); this.widget.construct(); }.bind( this ),
         function(){
            assumeThat( this.widget.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            this.widget.destroy();
         }.bind( this ),
         function(){
            assertThat( this.widget.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
            assertThat( this.widgetContainerElement.getElements( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Protected, private helper methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },
   
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
	  this.beforeEachTestChain.callChain();
   }

});