window.NewsReaderWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'initialize_loadsLocalizedRssVersion', isAsynchron : false },
         { method : 'unmarshall_instantiatesChannel', isAsynchron : false },
         { method : 'unmarshall_passesElementFactoryToChannel', isAsynchron : false },
         { method : 'unmarshall_passesOptionsToChannel', isAsynchron : false },
         { method : 'construct_constructsChannel', isAsynchron : true }]
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
      assertThat( this.newsReaderWidget.getDataXml().getUri(), containsString( this.constants.LOCALIZED_RSS_URI ));
   },
   
   unmarshall_instantiatesChannel : function(){
      this.newsReaderWidget.unmarshall();
      
      assertThat( this.newsReaderWidget.getChannel(), not( nil() ));
      assertThat( instanceOf( this.newsReaderWidget.getChannel(), RssChannel ), is( true ));
   },
   
   unmarshall_passesElementFactoryToChannel : function(){
      this.newsReaderWidget.unmarshall();
      
      assertThat( this.newsReaderWidget.getChannel().getElementFactory(), equalTo( this.newsReaderWidget.getElementFactory() ));
   },
   
   unmarshall_passesOptionsToChannel : function(){
      this.newsReaderWidget.options.channelOptions = { showDescription : true, showTitle : true, itemOptions : { showDescription : false, showTitle : false } };
      this.newsReaderWidget.unmarshall();
      
      assertThat( this.newsReaderWidget.getChannel().options.showDescription, is( true ));
      assertThat( this.newsReaderWidget.getChannel().options.showTitle, is( true ));
   },
   
   construct_constructsChannel : function() {
      this.testCaseChain.chain(
         function(){
            this.newsReaderWidget.unmarshall();
            this.newsReaderWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.newsReaderWidget.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            assertThat( this.newsReaderWidget.getChannel().getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
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