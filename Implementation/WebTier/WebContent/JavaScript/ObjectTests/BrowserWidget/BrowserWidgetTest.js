window.BrowserWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onDestroyed', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
          { method : 'initialize_whenArgumentsAreGiven_deducesAssociatedObjects', isAsynchron : false },
          { method : 'initialize_whenNoArgumentsAreGiven_usesWebUiController', isAsynchron : false },
          { method : 'initialize_findsContainerElement', isAsynchron : false },
          { method : 'initialize_loadsI18Resources', isAsynchron : false },
          { method : 'initialize_instantiatesElementFactory', isAsynchron : false },
          { method : 'initialize_whenDefinitionUriIsGiven_loadsIt', isAsynchron : false },
          { method : 'initialize_whenDataUriIsGiven_loadsIt', isAsynchron : false },
          { method : 'initialize_whenUseLocalizedDataIsTrue_loadsLocalVersion', isAsynchron : false },
          { method : 'initialize_whenMessageSubsciptionsAreGiven_subscribesToMessages', isAsynchron : false },
          { method : 'initialize_whenContainerIdIsInValid_throwsExeption', isAsynchron : false },
          { method : 'initialize_whenResourceBundleIsNotLoaded_throwsException', isAsynchron : false },
          { method : 'getText_usesI18Resource', isAsynchron : false },
          { method : 'removeChild_destroysNestedChildElements', isAsynchron : false },
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'construct_broadcastsWidgetConstructedMessage', isAsynchron : true }, 
          { method : 'construct_whenConstructionTimesOut_revertsConstruction', isAsynchron : true }, 
          { method : 'destroy_destroysAllCreatedElements', isAsynchron : true }, 
          { method : 'webUIMessageHandler_whenConfigured_handlesMessages', isAsynchron : true }, 
          { method : 'webUIMessageHandler_whenNotConfigured_throwsException', isAsynchron : false }]
   },

   constants : {
      CHILD_ELEMENT_TYPE : "DIV",
      CONFIGURATION_URI : "../BrowserWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      LOCALIZED_WIDGET_DATA_URI : "../BrowserWidget/WidgetData_en.xml",
      RESOURCE_PATH : "../BrowserWidget/WidgetInternationalization",
      RESOURCE_KEY : "Widget.ItemOne",
      ROW_LABEL : "row label:",
      ROW_VALUE : "row value",
      ROW_VALUE_ID : "rowValueId",
      SEARCHED_ELEMENT_ID : "searchedElementId",
      WIDGET_CONTAINER_ID : "widgetContainer",
      WIDGET_DATA_URI : "../BrowserWidget/WidgetData.xml",
      WIDGET_DEFINITION_URI : "../BrowserWidget/WidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.browserWidget;
      this.componentStateManager;
      this.constructedMessageReceived = false;
      this.domDocument;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.beforeEachTestChain.chain(
         function(){
            this.domDocument = document;
            this.messageBus = new WebUIMessageBus();
            this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
            this.webUILogger = new WebUILogger( this.webUIConfiguration );
            this.componentStateManager = new ComponentStateManager();
            this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onLocalizationFailure, onSuccess : this.onLocalizationLoaded });
            this.resourceBundle.load( this.locale );
         }.bind( this ),
         function(){
            this.browserWidget = new BrowserWidget({
               maxTries : 2,
               onConstructed : this.onConstructed, 
               onConstructionError : this.onConstructionError, 
               onDestroyed : this.onDestroyed,
               subscribeToWebUIMessages : [TestMessageOne, TestMessageTwo],
               widgetContainerId : this.constants.WIDGET_CONTAINER_ID,
               widgetDataURI : this.constants.WIDGET_DATA_URI,
               widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI
            }, this.resourceBundle );
            this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
            
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.browserWidget.destroy();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
   },
   
   initialize_whenArgumentsAreGiven_deducesAssociatedObjects : function() {
      assertEquals( "Browser Widget uses the same locale as the ResourceBundle.", this.resourceBundle.getLocale(), this.browserWidget.getLocale() );
      assertEquals( "Holds a reference to the WebUIMessageBus", this.messageBus, this.browserWidget.getMessageBus() );
   },
   
   initialize_whenNoArgumentsAreGiven_usesWebUiController : function() {
      var webUIController = new WebUIController({ contextRootPrefix : "", configurationUri : this.constants.CONFIGURATION_URI });
      webUIController = mock( webUIController );
      when( webUIController ).getResourceBundle().thenReturn( this.resourceBundle );
      when( webUIController ).getCurrentLocale().thenReturn( this.locale );
      WebUIController.prototype.replaceInstance( webUIController );
      
      this.browserWidget = new BrowserWidget();
     
      assertNotNull( "Browser widget successfully instantiated.", this.browserWidget );
      assertNotNull( "Identifies container element.", this.widgetContainerElement );
      assertThat( this.browserWidget.getResourceBundle(), equalTo( this.resourceBundle ), "Browser Widget uses the Resource Bundle of WebUIController." );
   },
   
   initialize_findsContainerElement : function() {
      assertThat( this.browserWidget.getContainerElement(), equalTo( this.widgetContainerElement ) );
   },
   
   initialize_loadsI18Resources : function() {
      assertThat( this.browserWidget.getResourceBundle().isLoaded, is( true ));
   },
   
   initialize_instantiatesElementFactory : function() {
      assertThat( this.browserWidget.getElementFactory(), not( nil() ));
      assertThat( instanceOf( this.browserWidget.getElementFactory(), WidgetElementFactory ), is( true ));
   },
   
   initialize_whenDefinitionUriIsGiven_loadsIt : function() {
      this.browserWidget = new BrowserWidget({ widgetContainerId : this.constants.WIDGET_CONTAINER_ID, widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI }, this.resourceBundle );
      
      assertThat( this.browserWidget.getDefinitionXml(), not( nil() ));
   },
   
   initialize_whenDataUriIsGiven_loadsIt : function() {
      this.browserWidget = new BrowserWidget({ widgetContainerId : this.constants.WIDGET_CONTAINER_ID, widgetDataURI : this.constants.WIDGET_DATA_URI }, this.resourceBundle );
      
      assertThat( this.browserWidget.getDataXml(), not( nil() ));
   },
   
   initialize_whenUseLocalizedDataIsTrue_loadsLocalVersion : function() {
      this.browserWidget = new BrowserWidget({ useLocalizedData : true, widgetContainerId : this.constants.WIDGET_CONTAINER_ID, widgetDataURI : this.constants.WIDGET_DATA_URI }, this.resourceBundle );
      
      assertThat( this.browserWidget.getDataXml().getUri(), containsString( this.constants.LOCALIZED_WIDGET_DATA_URI ));
   },
   
   initialize_whenMessageSubsciptionsAreGiven_subscribesToMessages : function() {
      assertEquals( "BrowserWidget is registered to message:", this.browserWidget.webUIMessageHandler, this.messageBus.getSubscribersToMessage( TestMessageOne ).get(0) );
      assertEquals( "BrowserWidget is registered to message:", this.browserWidget.webUIMessageHandler, this.messageBus.getSubscribersToMessage( TestMessageTwo ).get(0) );
   },
   
   initialize_whenContainerIdIsInValid_throwsExeption : function() {
      try{
         new BrowserWidget( { widgetContainerId : "blabla" } , this.resourceBundle );
         fail( "Exception was expected. 'containerId' parameter should identify a valid dom element." );
       }catch( e ) {
          assertThat( e, JsHamcrest.Matchers.instanceOf( AssertionException ));
       }
   },
   
   initialize_whenResourceBundleIsNotLoaded_throwsException : function() {
      try{
         new BrowserWidget( { widgetContainerId : this.constants.WIDGET_CONTAINER_ID }, new LocalizationResourceManager( this.webUIConfiguration ) );
          fail( "Exception was expected. 'resourceBundle' parameter can't be null or empty." );
       }catch( e ) {
          assertThat( e, JsHamcrest.Matchers.instanceOf( AssertionException ));
       }
   },
   
   getText_usesI18Resource : function() {
      assertNotNull( this.browserWidget.getText( this.constants.RESOURCE_KEY ) );
      assertEquals( this.resourceBundle.getText( this.constants.RESOURCE_KEY ), this.browserWidget.getText( this.constants.RESOURCE_KEY ));
   },
   
   removeChild_destroysNestedChildElements : function() {
      var elementToRemove = this.browserWidget.getElementFactory().createStaticRow( this.constants.ROW_LABEL, this.constants.ROW_VALUE, this.constants.ROW_VALUE_ID );
      assertNotNull( this.widgetContainerElement.getElementById( this.constants.ROW_VALUE_ID ));
       
      //EXCERCISE:
      this.browserWidget.removeChild( elementToRemove );
      
      //VERIFY:
      assertNull( this.widgetContainerElement.getElementById( this.constants.ROW_VALUE_ID ) );
   },
   
   unmarshall_determinesProperties : function() {
      this.browserWidget.unmarshall();
      
      var definitionXml = this.browserWidget.getDefinitionXml();
      assertThat( this.browserWidget.getName(), equalTo( definitionXml.selectNodeText( "/sd:widgetDefinition/sd:name" )));
      assertThat( this.browserWidget.getDescription(), equalTo( definitionXml.selectNodeText( "/sd:widgetDefinition/sd:description" )));
   },
   
   construct_broadcastsWidgetConstructedMessage : function() {
      this.testCaseChain.chain(
         function(){
            this.messageBus.subscribeToMessage( WidgetConstuctedMessage, function( webUIMessage ){
               this.constructedMessageReceived = true;
               assertThat( webUIMessage.getOriginator(), equalTo( this.browserWidget.options.componentName ));
            }.bind( this ));
            this.browserWidget.unmarshall();
            this.browserWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.constructedMessageReceived, is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenConstructionTimesOut_revertsConstruction : function() {
      this.testCaseChain.chain(
         function(){
            this.browserWidget.compileConstructionChain = function(){
               this.browserWidget.constructionChain.chain( this.longTakingMethod );
            }.bind( this );
            this.browserWidget.unmarshall();
            this.browserWidget.construct();
         }.bind( this ),
         function(){
            //'constructionError' event received
            assertThat( this.browserWidget.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
            assertThat( this.browserWidget.getError(), JsHamcrest.Matchers.instanceOf( WidgetConstructionException ));
            assertThat( this.error, JsHamcrest.Matchers.instanceOf( WidgetConstructionException ));
            assertThat( this.error.getCause(), JsHamcrest.Matchers.instanceOf( TimeOutException ));
         }.bind( this ),
         function(){
            //'destroyed' event received
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){
            this.browserWidget.getElementFactory().createStaticRow( this.constants.ROW_LABEL, this.constants.ROW_VALUE, this.constants.ROW_VALUE_ID );
            this.browserWidget.unmarshall();
            this.browserWidget.construct();
         }.bind( this ),
         function(){
            assertTrue( this.widgetContainerElement.getChildren().length >= 1 );
            this.browserWidget.destroy();
            assertTrue( this.widgetContainerElement.getChildren().length == 0 );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenConfigured_handlesMessages : function() {
      this.testCaseChain.chain(
         function(){
            this.webUIMessageOne = new TestMessageOne();
            this.webUIMessageTwo = new TestMessageTwo();
            this.browserWidget.unmarshall();
            this.browserWidget.construct();
         }.bind( this ),
         function(){
            this.messageBus.notifySubscribers( this.webUIMessageOne );
            
            //VERIFY:
            assertEquals( "BrowserWidget stores the last handled WebUIMessage.", this.webUIMessageOne, this.browserWidget.getLastMessage() ); 
            this.messageBus.notifySubscribers( this.webUIMessageTwo );
            assertEquals( "BrowserWidget stores the last handled WebUIMessage.", this.webUIMessageTwo, this.browserWidget.getLastMessage() ); 
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenNotConfigured_throwsException : function() {
      var webUIMessageOne = new TestMessageOne();
      this.browserWidget = new BrowserWidget({ widgetContainerId : this.constants.WIDGET_CONTAINER_ID, subscribeToWebUIMessages : [TestMessageOne] }, this.resourceBundle );
      
      try{
         this.messageBus.notifySubscribers( webUIMessageOne );
         fail( "UnconfiguredWidgetExceptions was expected!" );
      }catch( e ) {
         assertTrue( instanceOf( e, UnconfiguredWidgetException ) );
      }
   },
   
   longTakingMethod : function(){
      //No operation
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.testCaseChain.callChain();
   },
   
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   }

});