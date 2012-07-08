window.TabWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onTabSelectedMessage'],

   options : {
      testMethods : [
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'unmarshall_instantiatesTabs', isAsynchron : false },
          { method : 'construct_createsUnorderedListsAndConstructsTabs', isAsynchron : false },
          { method : 'construct_activatesDefaultTab', isAsynchron : false },
          { method : 'construct_whenEnabled_createsCloseAndPrintButton', isAsynchron : false },
          { method : 'addTab_whenWidgetIsConstructed_instantiatesNewTabAndConstructs', isAsynchron : false },
          { method : 'addTab_whenOnlyInitialized_throwsException', isAsynchron : false },
          { method : 'removeTab_destroysHtmlElements', isAsynchron : false },
          { method : 'removeTab_whenActiveTabHasNext_activatesNext', isAsynchron : false },
          { method : 'removeTab_whenActiveTabIsLast_activatesPrevious', isAsynchron : false },
          { method : 'removeTab_whenOnlyInitialized_throwsException', isAsynchron : false },
          { method : 'activateTab_deactivatesPreviousAndActivatesTheGiven', isAsynchron : false },
          { method : 'activateTab_storesState', isAsynchron : false },
          { method : 'onTabSelected_activatesTabAndNotifiesSubscribers', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      TAB_WIDGET_ID : "TabWidget",
      WEBUI_CONFIGURATION_URI : "../TabWidget/WebUIConfiguration.xml",
      WIDGET_DEFINITION_URI : "TabsDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.callBackMessage;
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.containerElement;
      this.definitionXml;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.resourceBundle;
      this.tabWidget;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.messageBus = new WebUIMessageBus();
      this.componentStateManager = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      
      this.containerElement = $( this.constants.TAB_WIDGET_ID );
      this.tabWidget = new TabWidget( { widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI }, this.resourceBundle  );
      this.definitionXml = this.tabWidget.getDefinitionXml();
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
      
      assertThat( this.tabWidget.getId(), equalTo( this.definitionXml.selectNodeText( '/pp:tabWidgetDefinition/tabWidget/@tabWidgetId' )));
      assertThat( this.tabWidget.getSelectedTabClass(), equalTo( this.definitionXml.selectNodeText( '/pp:tabWidgetDefinition/tabWidget/@selectedTabClass' )));
      assertThat( this.tabWidget.getShowCloseButton(), equalTo( parseBoolean( this.definitionXml.selectNodeText( '/pp:tabWidgetDefinition/tabWidget/@showCloseButton' ))));
      assertThat( this.tabWidget.getShowPrintButton(), equalTo( parseBoolean( this.definitionXml.selectNodeText( '/pp:tabWidgetDefinition/tabWidget/@showPrintButton' ))));
   },
   
   unmarshall_instantiatesTabs : function() {
      this.tabWidget.unmarshall();
      
      assertThat( this.tabWidget.getTabs().size(), equalTo( this.definitionXml.selectNodes( '/pp:tabWidgetDefinition/tabWidget/tab' ).length ));
   },
   
   construct_createsUnorderedListsAndConstructsTabs : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();

      assertThat( this.containerElement.getElements( 'UL' ).length, equalTo( 2 ));
      assertThat( this.containerElement.getElements( 'UL' )[0].hasClass( this.tabWidget.options.TAB_LIST_STYLE ), is( true ));
      assertThat( this.containerElement.getElements( 'UL' )[0].getChildren( '*' ).length, equalTo( this.definitionXml.selectNodes( '/pp:tabWidgetDefinition/tabWidget/tab' ).length ));
      assertThat( this.containerElement.getElements( 'UL' )[1].hasClass( this.tabWidget.options.BUTTONCLASSNAME ), is( true ));
   },
   
   construct_activatesDefaultTab : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabTwo" ));
   },
   
   construct_whenEnabled_createsCloseAndPrintButton : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      assertThat( this.tabWidget.isCloseButtonVisible(), is( true ));
      assertThat( this.tabWidget.isPrintButtonVisible(), is( true ));
      assertThat( this.containerElement.getElements( 'UL' )[1].getChildren( 'li' ).length, equalTo( 2 ));
   },
   
   addTab_whenWidgetIsConstructed_instantiatesNewTabAndConstructs : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      this.tabWidget.addTab( "newTab", "TabWidget.addedTab" );
      
      assertThat( this.tabWidget.getTabs().size(), equalTo( this.definitionXml.selectNodes( '/pp:tabWidgetDefinition/tabWidget/tab' ).length + 1 ));
      assertThat( this.containerElement.getElements( 'UL' )[0].getChildren( '*' ).length, equalTo( this.definitionXml.selectNodes( '/pp:tabWidgetDefinition/tabWidget/tab' ).length +1 ));
      assertThat( this.tabWidget.getTabById( "newTab" ).isActive(), is( true ));
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
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      
      this.tabWidget.removeTab( "tab_tabTwo" );
      
      assertThat( this.containerElement.getElements( 'UL' )[0].getChildren( '*' ).length, equalTo( this.definitionXml.selectNodes( '/pp:tabWidgetDefinition/tabWidget/tab' ).length -1 ));
   },
   
   removeTab_whenActiveTabHasNext_activatesNext : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      this.tabWidget.removeTab( "tab_tabTwo" );
         
      assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabThree" ));
   },
   
   removeTab_whenActiveTabIsLast_activatesPrevious : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      this.tabWidget.activateTab( "tab_tabThree" );
      this.tabWidget.removeTab( "tab_tabThree" );
            
      assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabTwo" ));
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
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabTwo" ));
      
      this.tabWidget.activateTab( "tab_tabOne" );
      
      assertThat( this.tabWidget.getTabById( "tab_tabTwo" ).isActive(), is( false ));
      assertThat( this.tabWidget.getTabById( "tab_tabOne" ).isActive(), is( true ));
      assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabOne" ));
   },
   
   activateTab_storesState : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      
      this.tabWidget.activateTab( "tab_tabOne" );
      
      assertThat( this.componentStateManager.retrieveComponentState( this.tabWidget.options.componentName ).currentTabId, equalTo( "tab_tabOne" ));
   },
   
   onTabSelected_activatesTabAndNotifiesSubscribers : function() {
      this.tabWidget.unmarshall();
      this.tabWidget.construct();
      
      this.messageBus.subscribeToMessage( TabSelectedMessage, this.onTabSelectedMessage );
      this.tabWidget.onTabSelected( this.tabWidget.getTabById( "tab_tabOne" ));
      
      assertThat( this.callBackWasCalled, is( true ));
      assertThat( this.tabWidget.getActiveTab().getId(), equalTo( "tab_tabOne" ));
   },
   
   onTabSelectedMessage : function( message ){
      this.callBackWasCalled = true;
      assertThat( message.getId(), equalTo( "tab_tabOne" ));
   }

});