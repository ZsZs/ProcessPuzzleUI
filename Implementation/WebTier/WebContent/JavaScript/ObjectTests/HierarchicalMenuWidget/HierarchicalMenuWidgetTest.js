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
         { method : 'destroy_destroysAllHtmlElements', isAsynchron : true }]
          /*
          { method : 'construct_whenShowSubItemsIsTrue_createsNestedLists', isAsynchron : true }, 
          { method : 'onSelection_broadcastMenuSelectedMessage', isAsynchron : true }, 
          { method : 'webUIMessageHandler_whenEnabled_subscribesToMenuSelectedMessages', isAsynchron : true }]
*/
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
      assertThat( this.menuWidget.getSelectedItemClass(), equalTo( eval( this.widgetDefinitionXml.selectNodeText( "//pp:widgetDefinition/options/option[@name='selectedItemClass']/@value" ))));
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
      
   
   construct_whenShowSubItemsIsTrue_createsNestedLists : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget = new HierarchicalMenuWidget({ onConstructed : this.onConstructed, onDestroyed : this.onDestroyed, widgetDefinitionURI : this.constants.MENU_DEFINITION_URI, showSubItems : true }, this.resourceBundle );
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            assertTrue( "MenuWidget when configured...", true );
            assertEquals( "... creates UL elemenst for nested menus too.", 4, this.widgetContainerElement.getElements( 'UL' ).length );
            var listElement = this.widgetContainerElement.getElements( "UL" )[1];
            assertEquals( "This should be the 1. sub item of 'mainItemOne'.", "itemOneOfOne", listElement.getChildren( "LI" )[0].get( 'id' ));
            assertEquals( "This should be the 2. sub item of 'mainItemOne'.", "itemTwoOfOne", listElement.getChildren( "LI" )[1].get( 'id' ));
            assertEquals( "This should be the 3. sub item of 'mainItemOne'.", "itemThreeOfOne", listElement.getChildren( "LI" )[2].get( 'id' ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destory_destroysAllHtmlElements : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget = new HierarchicalMenuWidget({ onConstructed : this.onConstructed, onDestroyed : this.onDestroyed, widgetDefinitionURI : this.constants.MENU_DEFINITION_URI }, this.resourceBundle );
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            this.menuWidget.destroy();
         }.bind( this ),
         function(){
            assertThat( this.menuWidget.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
            assertEquals( "Destroy removes all child elements of widget container.", 0, this.widgetContainerElement.getChildren().length );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onSelection_broadcastMenuSelectedMessage : function() {
      this.testCaseChain.chain(
         function(){
            this.messageBus.subscribeToMessage( MenuSelectedMessage, this.onSelectCallBack );
            
            this.menuWidget = new HierarchicalMenuWidget({ onConstructed : this.onConstructed, onDestroyed : this.onDestroyed, widgetDefinitionURI : this.constants.MENU_DEFINITION_URI }, this.resourceBundle );
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            var anchorElement = this.widgetContainerElement.getElementById( 'mainItemThree' ).getChildren( 'A' )[0];
            anchorElement.fireEvent( 'click' );
              
            assertTrue( this.callBackWasCalled );
            assertEquals( "Expected message argument is:", "loadMenu", this.callBackMessage.getActionType() );
            assertEquals( "Expected message argument is:", "mainItemThree", this.callBackMessage.getContextItemId() );
            assertEquals( "Expected message argument is:", "HierarchicalMenuWidget", this.callBackMessage.getOriginator() );
            assertTrue( "Sets 'class' property of the parent LI element.", anchorElement.getParent().hasClass( "selectedMenuItem" ));
            assertFalse( "Removes 'class' property from all other elements.", this.widgetContainerElement.getElementById( 'mainItemOne' ).hasClass( "selectedMenuItem" ));
            assertFalse( "Removes 'class' property from all other elements.", this.widgetContainerElement.getElementById( 'mainItemTwo' ).hasClass( "selectedMenuItem" ));

            assertEquals( "Stores selected item's id in ComponentStateManager.", "mainItemThree", this.componentStateManager.retrieveCurrentState( this.menuWidget.options.componentName )['currentItemId']) ; 
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenEnabled_subscribesToMenuSelectedMessages : function() {
      this.testCaseChain.chain(
         function(){
            this.menuWidget = new HierarchicalMenuWidget({ onConstructed : this.onConstructed, onDestroyed : this.onDestroyed, widgetDefinitionURI : this.constants.MENU_DEFINITION_URI, subscribeToWebUIMessages : [MenuSelectedMessage] }, this.resourceBundle );
            this.menuWidget.construct();
         }.bind( this ),
         function(){
            var menuMessage = new MenuSelectedMessage({actionType : 'loadMenu', contextItemId : 'mainItemTwo'});
            this.messageBus.notifySubscribers( menuMessage );
            
            //VERIFY:
            assertTrue( "MenuWidget should reconfigure the whole menu with the context item of 'mainItemTwo'.", true );
            assertEquals( "itemOneOfTwo", this.widgetContainerElement.getChildren( "UL" )[0].getChildren( "LI" )[0].get( 'id' ));
            assertEquals( "itemTwoOfTwo", this.widgetContainerElement.getChildren( "UL" )[0].getChildren( "LI" )[1].get( 'id' ));
            assertEquals( "itemThreeOfTwo", this.widgetContainerElement.getChildren( "UL" )[0].getChildren( "LI" )[2].get( 'id' ));
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