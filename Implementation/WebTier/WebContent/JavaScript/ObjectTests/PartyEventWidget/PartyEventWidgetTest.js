window.PartyEventWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'initialize_loadsLocalizedRssVersion', isAsynchron : false },
         { method : 'unmarshall_instantiatesEvents', isAsynchron : false },
         { method : 'unmarshall_passesElementFactoryToChannel', isAsynchron : false },
         { method : 'unmarshall_passesOptionsToEvents', isAsynchron : false },
         { method : 'construct_constructsEvents', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../PartyEventWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      LOCALIZED_DATA_URI : "../PartyEventWidget/TestEvents_en.xml",
      WIDGET_CONTAINER_ID : "EventWidget",
      WIDGET_DATA_URI : "../PartyEventWidget/TestEvents.xml",
      WIDGET_DEFINITION_URI : "../PartyEventWidget/EventWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.eventWidget;
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
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.eventWidget = new PartyEventWidget({ 
         widgetContainerId : this.constants.WIDGET_CONTAINER_ID,
         onConstructed : this.onConstructed, 
         onDestroyed : this.onDestroyed,
         widgetDataURI : this.constants.WIDGET_DATA_URI,
         widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI
      }, this.resourceBundle );
      
      this.widgetContainerElement = this.eventWidget.getContainerElement();
   },
   
   afterEachTest : function (){
      this.componentStateManager.reset();
      this.messageBus.tearDown();
      this.eventWidget.destroy();
      this.eventWidget = null;
      this.widgetContainerElement = null;
   },
   
   initialize_loadsLocalizedRssVersion : function() {
      assertThat( this.eventWidget.getDataXml().getUri(), containsString( this.constants.LOCALIZED_DATA_URI ));
   },
   
   unmarshall_instantiatesEvents : function(){
      this.eventWidget.unmarshall();
      
      assertThat( this.eventWidget.getEvents().size(), equalTo( this.eventWidget.getDataXml().selectNodes( "/pe:eventList/pe:events/pe:event" ).length ));
   },
   
   unmarshall_passesElementFactoryToChannel : function(){
      this.eventWidget.unmarshall();
      
      this.eventWidget.getEvents().each( function( event, index ){
         assertThat( event.getElementFactory(), equalTo( this.eventWidget.getElementFactory() ));
      }.bind( this ));
   },
   
   unmarshall_passesOptionsToEvents : function(){
      this.eventWidget.options.eventOptions = { showDescription : true, showTitle : true, itemOptions : { showDescription : false, showTitle : false } };
      this.eventWidget.unmarshall();
      
      this.eventWidget.getEvents().each( function( event, index ){
         assertThat( event.options.showDescription, is( true ));
         assertThat( event.options.showTitle, is( true ));
      }.bind( this ));
   },
   
   construct_constructsEvents : function() {
      this.testCaseChain.chain(
         function(){
            this.eventWidget.unmarshall();
            this.eventWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.eventWidget.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            this.eventWidget.getEvents().each( function( event, index ){
               assertThat( event.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            }.bind( this ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.testCaseChain.callChain();
   }

});