window.LanguageSelectorWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onLanguageChangeCallback', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
          { method : 'initialize_whenConstructorArgumentsAreGiven_usesThem', isAsynchron : false },
          { method : 'initialize_whenConstructorArgumentsAreMissing_usesWebUIController', isAsynchron : false },
          { method : 'construct_createsSelectElementWithOptions', isAsynchron : true }, 
          { method : 'destroy_destroysCreatedHtmlElements', isAsynchron : true }, 
          { method : 'onSelection_notifiesMessageBusSubscribers', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../LanguageSelectorWidget/WebUIConfiguration.xml",
      ELEMENT_SELECTOR : "LanguageSelector",
      LANGUAGE : "hu",
      WIDGET_CONTAINER_ID : "LanguageSelectorWidget"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.callBackMessage;
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.languageSelector;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.beforeEachTestChain.chain(
         function(){
            this.messageBus = new WebUIMessageBus();
            this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
            this.webUILogger = new WebUILogger( this.webUIConfiguration );
            this.componentStateManager = new ComponentStateManager();
            this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onLocalizationFailure, onSuccess : this.onLocalizationLoaded });
            this.resourceBundle.load( this.locale );
         }.bind( this ),
         function(){
            this.languageSelector = new LanguageSelectorWidget({ onConstructed : this.onConstructed, onDestroyed : this.onDestroyed, widgetContainerId : this.constants.WIDGET_CONTAINER_ID }, this.resourceBundle, this.webUIConfiguration );
            this.widgetContainerElement = this.languageSelector.getContainerElement();
            this.callBackWasCalled = false;
      
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.languageSelector.destroy();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
      this.callBackWasCalled = false;
      this.callBackMessage = null;
   },
   
   initialize_whenConstructorArgumentsAreGiven_usesThem : function() {
      assertEquals( $( this.constants.WIDGET_CONTAINER_ID ), this.languageSelector.getContainerElement() );
      assertEquals( "Initialization determines available locales.", 2, this.languageSelector.getAvailableLocales().size() ); 
      assertEquals( "hu", this.languageSelector.getAvailableLocales().get( 0 ).getLanguage() );
      assertEquals( "en", this.languageSelector.getAvailableLocales().get( 1 ).getLanguage() );
      assertEquals( "GB", this.languageSelector.getAvailableLocales().get( 1 ).getCountry() );
   },
   
   initialize_whenConstructorArgumentsAreMissing_usesWebUIController : function() {
      var webUIController = new WebUIController({ configurationUri : "../WebUIController/SampleConfiguration.xml" });
      webUIController = mock( webUIController );
      when( webUIController ).getResourceBundle().thenReturn( this.resourceBundle );
      when( webUIController ).getCurrentLocale().thenReturn( this.locale );
      when( webUIController ).getWebUIConfiguration().thenReturn( this.webUIConfiguration );
      WebUIController.prototype.replaceInstance( webUIController );
      
      //EXCERCISE:
      this.languageSelector = new LanguageSelectorWidget();
      
      //VERIFY:
      assertTrue( "When 'LanguageSelector' is instantiated without arguments, 'WebUIController' is used as data source.", true );
      assertEquals( this.resourceBundle, this.languageSelector.getResourceBundle() );
      assertEquals( this.webUIConfiguration, this.languageSelector.getWebUIConfiguration() );
      assertEquals( 2, this.languageSelector.getAvailableLocales().size() );
      
      webUIController.destroy();
   },
   
   construct_createsSelectElementWithOptions : function() {
      this.testCaseChain.chain(
         function(){ this.languageSelector.construct(); }.bind( this ),
         function(){
            var selectElement = this.widgetContainerElement.getElementById( this.constants.ELEMENT_SELECTOR );
            assertNotNull( selectElement );
            assertEquals( "The number of options elements:", 3, selectElement.getChildren().length );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysCreatedHtmlElements : function() {
      this.testCaseChain.chain(
         function(){ this.languageSelector.construct(); }.bind( this ),
         function(){
            this.languageSelector.destroy();
            
            assertThat( this.widgetContainerElement.getChildren( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onSelection_notifiesMessageBusSubscribers : function() {
      this.testCaseChain.chain(
         function(){ this.languageSelector.construct(); }.bind( this ),
         function(){
            this.messageBus.subscribeToMessage( LanguageChangedMessage, this.onLanguageChangeCallback );
            var selectElement = this.widgetContainerElement.getElementById( this.constants.ELEMENT_SELECTOR );
            selectElement.fireEvent( 'change' );
              
            assertTrue( callBackWasCalled );
            assertEquals( "en", callBackMessage.getNewLocale().getLanguage() );
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
   
   onLanguageChangeCallback : function( message ) {
      callBackWasCalled = true;
      callBackMessage = message;
   },

   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   }
});