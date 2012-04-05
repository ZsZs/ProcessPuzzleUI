window.HierarchicalMenuWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onSelectCallBack'],

   options : {
      testMethods : [
         { method : 'initialize_instantiatesMenuItemFactory', isAsynchron : false },
         { method : 'initialize_whenComponentStateIsAvailable_overwritesDefaultValues', isAsynchron : false },
         { method : 'unmarshall_determinesWidgetProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesAndUnmarshallsRootMenu', isAsynchron : false },
         { method : 'findItemById_findsItemBasedOnFullPath', isAsynchron : false },
         { method : 'construct_whenShowSubItemsIsFalse_createsSingleLevelListElements', isAsynchron : true },
         { method : 'construct_whenShowSubItemsIsTrue_createsEntireList', isAsynchron : true },
         { method : 'construct_whenContextItemIdIsGiven_skipsOutOfContextElementsCreation', isAsynchron : true },
         { method : 'construct_whenComponentStateIsAvailable_overwritesDefaultValues', isAsynchron : true },
         { method : 'onSelection_broadcastMenuSelectedMessage', isAsynchron : true }, 
         { method : 'webUIMessageHandler_whenWidgetSubscribesToMenuMessages_reloadsMenu', isAsynchron : true },
         { method : 'destroy_destroysAllHtmlElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../HierarchicalMenuWidget/WebUIConfiguration.xml",
      LANGUAGE : "hu",
      MENU_WIDGET_DATA_URI : "../HierarchicalMenuWidget/MenuDefinition.xml",
      MENU_WIDGET_DEFINITION_URI : "../HierarchicalMenuWidget/MenuWidgetDefinition.xml",
      MENU_WIDGET_ID : "HierarchicalMenuWidget",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.callBackMessage;
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.menuWidget;
      this.messageBus;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.messageBus = new WebUIMessageBus();
      this.componentStateManager = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.widgetContainerElement = $( this.constants.MENU_WIDGET_ID );
      this.menuWidget = new HierarchicalMenuWidget({ 
         onConstructed : this.onConstructed, 
         onDestroyed : this.onDestroyed, 
         widgetDataURI : this.constants.MENU_WIDGET_DATA_URI, 
         widgetDefinitionURI : this.constants.MENU_WIDGET_DEFINITION_URI 
      }, this.resourceBundle );
      this.widgetDefinitionXml = this.menuWidget.getDefinitionXml();
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
      this.componentStateManager.storeCurrentState( "HierarchicalMenuWidget", { currentItemId : 'itemThreeOfThree', contextItemId : 'mainItemThree' } );
      
      this.menuWidget = new HierarchicalMenuWidget({ widgetDataURI : this.constants.MENU_WIDGET_DATA_URI, widgetDefinitionURI : this.constants.MENU_WIDGET_DEFINITION_URI }, this.resourceBundle );
      
      assertThat( this.menuWidget.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
      assertEquals( "Current itemId sould be the stored one:", "itemThreeOfThree", this.menuWidget.currentItemId );
   },
   
   unmarshall_determinesWidgetProperties : function(){
      this.menuWidget.unmarshall();
      
      assertThat( this.menuWidget.getState(), equalTo( BrowserWidget.States.UNMARSHALLED ));
      assertThat( this.menuWidget.getSelectedItemClass(), equalTo( eval( this.widgetDefinitionXml.selectNodeText( "//pp:widgetDefinition/options/option[@name='selectedItemStyle']/@value" ))));
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
            assertThat( this.widgetContainerElement.getChildren( "UL LI" ).length, equalTo( this.menuWidget.getDataXml().selectNodes( "//pp:menuWidgetDefinition/menuItem/menuItem" ).length ));
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
            assertThat( this.widgetContainerElement.getChildren( "UL LI" ).length, equalTo( this.menuWidget.getDataXml().selectNodes( "//menuItem" ).length -1 ));
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
            assertThat( this.widgetContainerElement.getChildren( "UL > LI" ).length, equalTo( this.menuWidget.getDataXml().selectNodes( "//pp:menuWidgetDefinition/menuItem/menuItem" ).length ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenComponentStateIsAvailable_overwritesDefaultValues : function() {
      this.testCaseChain.chain(
         function(){
            this.componentStateManager.storeCurrentState( "HierarchicalMenuWidget", { contextItemId : '/MenuWidget/mainItemThree', currentItemId : '/MenuWidget/mainItemThree/itemTwoOfThree' } );

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

            assertThat( this.componentStateManager.retrieveCurrentState( this.menuWidget.options.componentName )['currentItemId'], equalTo( "/MenuWidget/mainItemThree" ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenWidgetSubscribesToMenuMessages_reloadsMenu : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget = new HierarchicalMenuWidget({ 
               contextItemId : "/MenuWidget/mainItemOne",
               onConstructed : this.onConstructed, 
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

   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methods
   onSelectCallBack : function( webUIMessage ) {
      this.callBackMessage = webUIMessage;
      this.callBackWasCalled = true;
   }

});