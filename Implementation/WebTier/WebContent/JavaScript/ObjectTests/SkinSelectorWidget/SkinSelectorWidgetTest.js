window.SkinSelectorWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onSkinChangeCallback'],

   options : {
      testMethods : [
          { method : 'initialize_whenConstructorArgumentsAreGiven', isAsynchron : false },
          { method : 'initialize_whenConstructorArgumentsAreMissing_usesWebUIController', isAsynchron : false },
          { method : 'configure_CreatesSelectElementWithOptions', isAsynchron : false },
          { method : 'onSelection_NotifiesMessageBusSubscribers', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../WebUIController/SampleConfiguration.xml",
      ELEMENT_SELECTOR : "SkinSelector",
      LANGUAGE : "hu",
      SKIN_ONE_NAME : "MochaUI",
      SKIN_ONE_PATH : "../DesktopConfigurator/Skins/MochaUI",
      SKIN_TWO_NAME : "ProcessPuzzle",
      SKIN_TWO_PATH : "../DesktopConfigurator/Skins/ProcessPuzzle",
      WIDGET_CONTAINER_ID : "SkinSelectorWidget"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.callBackMessage;
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.skinSelector;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
   	this.messageBus = new WebUIMessageBus();
   	this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
   	this.webUILogger = new WebUILogger( this.webUIConfiguration );
   	this.componentStateManager = new ComponentStateManager();
   	this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
   	this.resourceBundle.load( this.locale );
   	this.skinSelector = new SkinSelectorWidget({ widgetContainerId : this.constants.WIDGET_CONTAINER_ID }, this.resourceBundle, this.webUIConfiguration );
   	this.widgetContainerElement = this.skinSelector.getContainerElement();

   	this.callBackWasCalled = false;
   },
   
   afterEachTest : function (){
   	this.skinSelector.destroy();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
      this.callBackMessage = null;
   },
   
   initialize_whenConstructorArgumentsAreGiven : function() {
      assertEquals( $( this.constants.WIDGET_CONTAINER_ID ), this.skinSelector.getContainerElement() );
      assertEquals( "Initialization determines available skins.", 2, this.skinSelector.getAvailableSkins().size() ); 
      assertNotNull( this.skinSelector.getAvailableSkins().get( this.constants.SKIN_ONE_NAME ) );
      assertNotNull( this.skinSelector.getAvailableSkins().get( this.constants.SKIN_TWO_NAME ) );
   },
   
   initialize_whenConstructorArgumentsAreMissing_usesWebUIController : function() {
      //SETUP:
      var webUIController = new WebUIController({ configurationUri : "../WebUIController/SampleConfiguration.xml" });
      
      //EXCERCISE:
      var skinSelector = new SkinSelectorWidget();
      
      //VERIFY:
      assertTrue( "When 'SkinSelector' is instantiated without arguments, 'WebUIController' is used as data source.", true );
      assertEquals( webUIController.getResourceBundle(), skinSelector.getResourceBundle() );
      assertEquals( webUIController.getWebUIConfiguration(), skinSelector.getWebUIConfiguration() );
      assertEquals( 2, skinSelector.getAvailableSkins().size() );
      
      //TEARDOWN:
      webUIController.destroy();
   },
   
   configure_CreatesSelectElementWithOptions : function() {
      this.skinSelector.construct();
      
      var selectElement = this.widgetContainerElement.getElementById( this.constants.ELEMENT_SELECTOR );
      assertNotNull( selectElement );
      assertEquals( "The number of options elements:", 3, selectElement.getChildren().length );
   },
   
   onSelection_NotifiesMessageBusSubscribers : function() {
      this.skinSelector.construct();
      this.messageBus.subscribeToMessage( SkinChangedMessage, this.onSkinChangeCallback );
      
      var selectElement = this.widgetContainerElement.getElementById( this.constants.ELEMENT_SELECTOR );
      selectElement.fireEvent( 'change' );
   	  
      assertTrue( this.callBackWasCalled );
   },
   
   onSkinChangeCallback : function( message ) {
      this.callBackWasCalled = true;
      this.callBackMessage = message;
   }
});