window.HierarchicalMenuWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onDestroyed', 'onLocalizationFailure', 'onLocalizationLoaded', 'onSelectCallBack'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'initialize_instantiatesMenuItemFactory', isAsynchron : false },
         { method : 'initialize_whenComponentStateIsAvailable_overwritesDefaultValues', isAsynchron : false },
         { method : 'unmarshall_determinesWidgetProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesAndUnmarshallsRootMenu', isAsynchron : false },
         { method : 'findItemById_findsItemBasedOnFullPath', isAsynchron : false },
         { method : 'construct_whenShowSubItemsIsFalse_createsSingleLevelListElements', isAsynchron : true },
         { method : 'construct_whenShowSubItemsIsTrue_createsEntireList', isAsynchron : true },
         { method : 'construct_whenContextItemIdIsGiven_skipsOutOfContextElementsCreation', isAsynchron : true },
         { method : 'construct_whenContextItemIdIsInvalid_throwsException', isAsynchron : false },
         { method : 'construct_whenComponentStateIsAvailable_overwritesDefaultValues', isAsynchron : true },
         { method : 'onSelection_broadcastMenuSelectedMessage', isAsynchron : true }, 
         { method : 'webUIMessageHandler_whenWidgetSubscribesToMenuMessages_reconstrutsMenu', isAsynchron : true },
         { method : 'destroy_destroysAllHtmlElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../HierarchicalMenuWidget/WebUIConfiguration.xml",
      LANGUAGE : "hu",
      MENU_WIDGET_DATA_URI : "../HierarchicalMenuWidget/MenuDefinition.xml",
      MENU_WIDGET_DEFINITION_URI : "../HierarchicalMenuWidget/MenuWidgetDefinition.xml",
      MENU_WIDGET_ID : "HierarchicalMenuWidget"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.callBackMessage;
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.menuWidget;
      this.messageBus;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.beforeEachTestChain.chain(
         function(){
            this.messageBus = new WebUIMessageBus();
            this.componentStateManager = new ComponentStateManager();
            this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
            this.webUILogger = new WebUILogger( this.webUIConfiguration );
            this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onLocalizationFailure, onSuccess : this.onLocalizationLoaded });
            this.resourceBundle.load( this.locale );
         }.bind( this ),
         function(){
            this.widgetContainerElement = $( this.constants.MENU_WIDGET_ID );
            this.menuWidget = new HierarchicalMenuWidget({ 
               onConstructed : this.onConstructed, 
               onConstructionError : this.onConstructionError, 
               onDestroyed : this.onDestroyed, 
               widgetDataURI : this.constants.MENU_WIDGET_DATA_URI, 
               widgetDefinitionURI : this.constants.MENU_WIDGET_DEFINITION_URI 
            }, this.resourceBundle );
            this.widgetDefinitionXml = this.menuWidget.getDefinitionXml();
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.menuWidget.destroy();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
      this.menuWidget = null;
      this.webUIConfiguration = null;
      this.resourceBundle = null;
      this.callBackMessage = null;
      this.callBackWasCalled = false;
      this.widgetDefinitionXml.release();
      this.widgetDefinitionXml = null;
   },
   
   initialize_instantiatesMenuItemFactory : function() {
      assertThat( MenuItemFactory.singleInstance, not( nil() ));
      assertThat( instanceOf( MenuItemFactory.singleInstance, MenuItemFactory ), is( true ));
   },
      
   initialize_whenComponentStateIsAvailable_overwritesDefaultValues : function() {
      this.componentStateManager.storeComponentState( "HierarchicalMenuWidget", { currentItemId : 'itemThreeOfThree', contextItemId : 'mainItemThree' } );
      
      this.menuWidget = new HierarchicalMenuWidget({ widgetDataURI : this.constants.MENU_WIDGET_DATA_URI, widgetDefinitionURI : this.constants.MENU_WIDGET_DEFINITION_URI }, this.resourceBundle );
      
      assertThat( this.menuWidget.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
      assertEquals( "Current itemId sould be the stored one:", "itemThreeOfThree", this.menuWidget.currentItemId );
   },
   
   unmarshall_determinesWidgetProperties : function(){
      this.menuWidget.unmarshall();
      
      assertThat( this.menuWidget.getState(), equalTo( BrowserWidget.States.UNMARSHALLED ));
      assertThat( this.menuWidget.getSelectedItemClass(), equalTo( eval( this.widgetDefinitionXml.selectNodeText( "/sd:widgetDefinition/sd:options/sd:option[@name='selectedItemStyle']/@value" ))));
      assertThat( this.menuWidget.getAccordionBehaviour(), equalTo( eval( this.widgetDefinitionXml.selectNodeText( "/sd:widgetDefinition/sd:options/sd:option[@name='accordionBehaviour']/@value" ))));
   },
   
   unmarshall_instantiatesAndUnmarshallsRootMenu : function(){
      this.menuWidget.unmarshall();
      
      assertThat( this.menuWidget.getRootMenu(), not( nil() ));
      assertThat( instanceOf( this.menuWidget.getRootMenu(), RootMenu ), is( true ));
      assertThat( this.menuWidget.getRootMenu().options.showSubItems, is( true ));
   },
   
   findItemById_findsItemBasedOnFullPath : function(){
      this.menuWidget.unmarshall();
      
      assertThat( this.menuWidget.findItemById( "/MenuWidget/mainItemTwo/itemThreeOfTwo" ).getId(), equalTo( "itemThreeOfTwo" ));
      assertThat( this.menuWidget.findItemById( "/MenuWidget/noneExistingItem" ), is( nil() ));
   },
   
   construct_whenShowSubItemsIsFalse_createsSingleLevelListElements : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget.givenOptions.showSubItems = false;
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.widgetContainerElement.getChildren( "UL" ).length, equalTo( 1 ));
            assertThat( this.widgetContainerElement.getChildren( "UL LI" ).length, equalTo( this.menuWidget.getDataXml().selectNodes( "/md:menuDefinition/md:menuItem/md:menuItem" ).length ));
            assertThat( this.menuWidget.getCurrentItemId(), equalTo( "/MenuWidget/mainItemOne" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenShowSubItemsIsTrue_createsEntireList : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget.givenOptions.showSubItems = true;
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.widgetContainerElement.getChildren( "UL" ).length, equalTo( 1 ));
            assertThat( this.widgetContainerElement.getChildren( "UL LI" ).length, equalTo( this.menuWidget.getDataXml().selectNodes( "//md:menuItem" ).length -1 ));
            assertThat( this.menuWidget.getCurrentItemId(), equalTo( "/MenuWidget/mainItemOne/itemOneOfOne" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenContextItemIdIsGiven_skipsOutOfContextElementsCreation : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget.givenOptions.contextItemId = "/MenuWidget/mainItemOne";
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.widgetContainerElement.getChildren( "UL" ).length, equalTo( 1 ));
            assertThat( this.widgetContainerElement.getChildren( "UL > LI" ).length, equalTo( this.menuWidget.getDataXml().selectNodes( "/md:menuDefinition/md:menuItem/md:menuItem" ).length ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenContextItemIdIsInvalid_throwsException : function() {
      this.menuWidget.givenOptions.contextItemId = "/invalidContext";
      this.menuWidget.unmarshall();
      
      try{
         this.menuWidget.construct();         
      }catch( e ){
         assertThat( e, JsHamcrest.Matchers.instanceOf( WidgetConstructionException ));
      }
   },
   
   construct_whenComponentStateIsAvailable_overwritesDefaultValues : function() {
      this.testCaseChain.chain(
         function(){
            this.componentStateManager.storeComponentState( "HierarchicalMenuWidget", { contextItemId : '/MenuWidget/mainItemThree', currentItemId : '/MenuWidget/mainItemThree/itemTwoOfThree' } );

            this.menuWidget = new HierarchicalMenuWidget({ 
               onConstructed : this.onConstructed, 
               onDestroyed : this.onDestroyed, 
               widgetDataURI : this.constants.MENU_WIDGET_DATA_URI, 
               widgetDefinitionURI : this.constants.MENU_WIDGET_DEFINITION_URI 
            }, this.resourceBundle );
            
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            assertThat( this.menuWidget.getContextItemId(), equalTo( '/MenuWidget/mainItemThree' ));
            assertThat( this.menuWidget.getCurrentItemId(), equalTo( '/MenuWidget/mainItemThree/itemTwoOfThree' ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onSelection_broadcastMenuSelectedMessage : function() {
      this.testCaseChain.chain(
         function(){
            this.messageBus.subscribeToMessage( MenuSelectedMessage, this.onSelectCallBack );
            this.menuWidget.givenOptions.showSubItems = false;
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            var currentItem = this.menuWidget.findItemById( "/MenuWidget/mainItemOne" );
            var itemToSelect = this.menuWidget.findItemById( "/MenuWidget/mainItemThree" );
            assumeThat( currentItem.getListItemElement().hasClass( this.menuWidget.getSelectedItemClass() ), is( true ));
            
            this.menuWidget.onSelection( itemToSelect );
            
            assertThat( this.callBackWasCalled, is( true ));
            assertThat( this.callBackMessage.getActionType(), equalTo( "loadMenu" ));
            assertThat( this.callBackMessage.getContextItemId(), equalTo( "/MenuWidget/mainItemThree" ));
            assertThat( this.callBackMessage.getOriginator(), equalTo( this.menuWidget.options.componentName ));
            assertThat( currentItem.getListItemElement().hasClass( this.menuWidget.getSelectedItemClass() ), is( false ));

            assertThat( this.componentStateManager.retrieveComponentState( this.menuWidget.options.componentName )['currentItemId'], equalTo( "/MenuWidget/mainItemThree" ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenWidgetSubscribesToMenuMessages_reconstrutsMenu : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget = new HierarchicalMenuWidget({ 
               contextItemId : "/MenuWidget/mainItemOne",
               onConstructed : this.onConstructed, 
               onConstructionError : this.onConstructionError, 
               onDestroyed : this.onDestroyed, 
               subscribeToWebUIMessages : [MenuSelectedMessage],
               widgetDataURI : this.constants.MENU_WIDGET_DATA_URI, 
               widgetDefinitionURI : this.constants.MENU_WIDGET_DEFINITION_URI 
            }, this.resourceBundle );
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            assumeThat( this.menuWidget.getCurrentItemId(), equalTo( "/MenuWidget/mainItemOne/itemOneOfOne" ));
            var menuMessage = new MenuSelectedMessage({ actionType : 'loadMenu', contextItemId : '/MenuWidget/mainItemTwo'});
            this.messageBus.notifySubscribers( menuMessage );
         }.bind( this ),
         function(){ //Destructed message fired as part of rebuild
         }.bind( this ),
         function(){ //Constructed message fired again
            assertThat( this.menuWidget.getCurrentItemId(), equalTo( "/MenuWidget/mainItemTwo/itemTwoOfTwo" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllHtmlElements : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget.unmarshall();
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            this.menuWidget.destroy();
         }.bind( this ),
         function(){
            assertThat( this.widgetContainerElement.getChildren( "*" ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },

   //Protected, private helper methods
   callMenuWidgetConstruct : function(){
      this.menuWidget.construct();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function( error ){
      this.error = error;
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
   },
   
   onSelectCallBack : function( webUIMessage ) {
      this.callBackMessage = webUIMessage;
      this.callBackWasCalled = true;
   }

});