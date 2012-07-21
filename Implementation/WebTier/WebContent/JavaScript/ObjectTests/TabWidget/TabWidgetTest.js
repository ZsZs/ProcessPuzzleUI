window.TabWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onDestroyed', 'onTabSelectedMessage'],

   options : {
      testMethods : [
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'unmarshall_instantiatesTabs', isAsynchron : false },
          { method : 'construct_createsUnorderedListsAndConstructsTabs', isAsynchron : true },
          { method : 'construct_activatesDefaultTab', isAsynchron : true },
          { method : 'construct_whenEnabled_createsCloseAndPrintButton', isAsynchron : true },
          { method : 'addTab_whenWidgetIsConstructed_instantiatesNewTabAndConstructs', isAsynchron : true },
          { method : 'addTab_whenOnlyInitialized_throwsException', isAsynchron : false },
          { method : 'removeTab_destroysHtmlElements', isAsynchron : true },
          { method : 'removeTab_whenActiveTabHasNext_activatesNext', isAsynchron : true },
          { method : 'removeTab_whenActiveTabIsLast_activatesPrevious', isAsynchron : true },
          { method : 'removeTab_whenOnlyInitialized_throwsException', isAsynchron : false },
          { method : 'activateTab_deactivatesPreviousAndActivatesTheGiven', isAsynchron : true },
          { method : 'activateTab_storesState', isAsynchron : true },
          { method : 'onTabSelected_activatesTabAndNotifiesSubscribers', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      TABS_DEFINITION_URI : "../TabWidget/TabsDefinition.xml",
      WEBUI_CONFIGURATION_URI : "../TabWidget/WebUIConfiguration.xml",
      WIDGET_CONTAINER_ID : "TabWidget",
      WIDGET_DEFINITION_URI : "../TabWidget/TabWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.callBackMessage;
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.containerElement;
      this.widgetDefinitionXml;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.resourceBundle;
      this.tabsDefinitionXml;
      this.tabWidget;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.messageBus = new WebUIMessageBus();
      this.componentStateManager = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      
      this.containerElement = $( this.constants.WIDGET_CONTAINER_ID );
      this.tabWidget = new TabWidget({ 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed,
         widgetContainerId : this.constants.WIDGET_CONTAINER_ID,
         widgetDataURI : this.constants.TABS_DEFINITION_URI,
         widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI
      }, this.resourceBundle  );
      
      this.widgetDefinitionXml = this.tabWidget.getDefinitionXml();
      this.tabsDefinitionXml = this.tabWidget.getDataXml();
   },
   
   afterEachTest : function (){
      if( this.tabWidget ) this.tabWidget.destroy();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
      this.tabWidget = null;
      this.webUIConfiguration = null;
      this.resourceBundle = null;
      this.callBackMessage = null;
      this.callBackWasCalled = false;
   },
   
   unmarshall_determinesProperties : function() {
      this.tabWidget.unmarshall();
      
      assertThat( this.tabWidget.getSelectedTabClass(), equalTo( eval( this.widgetDefinitionXml.selectNodeText( "/sd:widgetDefinition/sd:options/sd:option[@name='selectedTabClass']/@value" ))));
      assertThat( this.tabWidget.getShowCloseButton(), equalTo( parseBoolean( this.widgetDefinitionXml.selectNodeText( "/sd:widgetDefinition/sd:options/sd:option[@name='showCloseButton']/@value" ))));
      assertThat( this.tabWidget.getShowPrintButton(), equalTo( parseBoolean( this.widgetDefinitionXml.selectNodeText( "/sd:widgetDefinition/sd:options/sd:option[@name='showPrintButton']/@value" ))));
   },
   
   unmarshall_instantiatesTabs : function() {
      this.tabWidget.unmarshall();
      
      assertThat( this.tabWidget.getTabs().size(), equalTo( this.tabsDefinitionXml.selectNodes( '/td:tabsDefinition/td:tabs/td:tab' ).length ));
   },
   
   construct_createsUnorderedListsAndConstructsTabs : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            assertThat( this.containerElement.getElements( 'UL' ).length, equalTo( 2 ));
            assertThat( this.containerElement.getElements( 'UL' )[0].hasClass( this.tabWidget.options.TAB_LIST_STYLE ), is( true ));
            assertThat( this.containerElement.getElements( 'UL' )[0].getChildren( '*' ).length, equalTo( this.tabsDefinitionXml.selectNodes( '/td:tabsDefinition/td:tabs/td:tab' ).length ));
            assertThat( this.containerElement.getElements( 'UL' )[1].hasClass( this.tabWidget.options.BUTTONCLASSNAME ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_activatesDefaultTab : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabTwo" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenEnabled_createsCloseAndPrintButton : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            assertThat( this.tabWidget.isCloseButtonVisible(), is( true ));
            assertThat( this.tabWidget.isPrintButtonVisible(), is( true ));
            assertThat( this.containerElement.getElements( 'UL' )[1].getChildren( 'li' ).length, equalTo( 2 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   addTab_whenWidgetIsConstructed_instantiatesNewTabAndConstructs : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            this.tabWidget.addTab( "newTab", "TabWidget.addedTab" );
      
            assertThat( this.tabWidget.getTabs().size(), equalTo( this.tabsDefinitionXml.selectNodes( '/td:tabsDefinition/td:tabs/td:tab' ).length + 1 ));
            assertThat( this.containerElement.getElements( 'UL' )[0].getChildren( '*' ).length, equalTo( this.tabsDefinitionXml.selectNodes( '/td:tabsDefinition/td:tabs/td:tab' ).length +1 ));
            assertThat( this.tabWidget.getTabById( "newTab" ).isActive(), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   addTab_whenOnlyInitialized_throwsException : function() {
      try{
         this.tabWidget.addTab( "newTab", "newTabCaption" );
         fail( "Expected exception." );
      }catch( e ){ 
         assertThat( instanceOf( e, UnconfiguredWidgetException ), is( true ));
      }
   },
   
   removeTab_destroysHtmlElements : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            this.tabWidget.removeTab( "tab_tabTwo" );
      
            assertThat( this.containerElement.getElements( 'UL' )[0].getChildren( '*' ).length, equalTo( this.tabsDefinitionXml.selectNodes( '/td:tabsDefinition/td:tabs/td:tab' ).length -1 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   removeTab_whenActiveTabHasNext_activatesNext : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            this.tabWidget.removeTab( "tab_tabTwo" );
         
            assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabThree" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   removeTab_whenActiveTabIsLast_activatesPrevious : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            this.tabWidget.activateTab( "tab_tabThree" );
            this.tabWidget.removeTab( "tab_tabThree" );
            
            assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabTwo" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   removeTab_whenOnlyInitialized_throwsException : function() {
      try{
         this.tabWidget.removeTab( "tab_tabTwo" );
         fail( "Expected exception." );
      }catch( e ){ 
         assertThat( instanceOf( e, UnconfiguredWidgetException ), is( true ));
      }
   },
   
   activateTab_deactivatesPreviousAndActivatesTheGiven : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            assumeThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabTwo" ));
      
            this.tabWidget.activateTab( "tab_tabOne" );
      
            assertThat( this.tabWidget.getTabById( "tab_tabTwo" ).isActive(), is( false ));
            assertThat( this.tabWidget.getTabById( "tab_tabOne" ).isActive(), is( true ));
            assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabOne" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   activateTab_storesState : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            this.tabWidget.activateTab( "tab_tabOne" );
      
            assertThat( this.componentStateManager.retrieveComponentState( this.tabWidget.options.componentName ).currentTabId, equalTo( "tab_tabOne" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onTabSelected_activatesTabAndNotifiesSubscribers : function() {
      this.testCaseChain.chain(
         function(){ this.tabWidget.unmarshall(); this.tabWidget.construct(); }.bind( this ),
         function(){
            this.messageBus.subscribeToMessage( TabSelectedMessage, this.onTabSelectedMessage );
            this.tabWidget.onTabSelected( this.tabWidget.getTabById( "tab_tabOne" ));
      
            assertThat( this.callBackWasCalled, is( true ));
            assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabOne" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
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

   onTabSelectedMessage : function( message ){
      this.callBackWasCalled = true;
      assertThat( message.getId(), equalTo( "tab_tabOne" ));
   }
   
});