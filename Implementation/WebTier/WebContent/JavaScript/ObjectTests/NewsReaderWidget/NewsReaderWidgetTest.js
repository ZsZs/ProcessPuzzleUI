window.NewsReaderWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'initialize_loadsLocalizedRssVersion', isAsynchron : false },
         { method : 'unmarshall_instantiatesChannel', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../NewsReaderWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      LOCALIZED_RSS_URI : "../NewsReaderWidget/TestNews_en.xml",
      RSS_URI : "../NewsReaderWidget/TestNews.xml",
      WIDGET_CONTAINER_ID : "NewsReaderWidget",
      WIDGET_DEFINITION_URI : "../NewsReaderWidget/NewsReaderDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.newsReaderWidget;
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
      this.newsReaderWidget = new NewsReaderWidget({ 
         widgetContainerId : this.constants.WIDGET_CONTAINER_ID,
         onConstructed : this.onConstructed, 
         onDestroyed : this.onDestroyed,
         widgetDataURI : this.constants.RSS_URI,
         widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI
      }, this.resourceBundle );
      
      this.widgetContainerElement = this.newsReaderWidget.getContainerElement();
   },
   
   afterEachTest : function (){
      this.componentStateManager.reset();
      this.messageBus.tearDown();
      this.newsReaderWidget.destroy();
      this.newsReaderWidget = null;
      this.widgetContainerElement = null;
   },
   
   initialize_loadsLocalizedRssVersion : function() {
      assertThat( this.newsReaderWidget.getDataXml().getUri(), equalTo( this.constants.LOCALIZED_RSS_URI ));
   },
   
   unmarshall_instantiatesChannel : function(){
      this.newsReaderWidget.unmarshall();
      
      assertThat( this.newsReaderWidget.getChannel(), not( nil() ));
   },
   
   asynchronTestOne : function() {
      this.testCaseChain.chain(
         function(){
            //EXCERCISE:
         }.bind( this ),
         function(){
            //VERIFY:
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   asynchronTestOne : function() {
      this.testCaseChain.chain(
         function(){
            //EXCERCISE:
         }.bind( this ),
         function(){
            //VERIFY:
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