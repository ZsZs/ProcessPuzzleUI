window.DesktopTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestructed', 'onError', 'onWindowReady'],

   options : {
      testMethods : [
          { method : 'initialize_loadsDesktopConfiguration', isAsynchron : false },
          { method : 'unmarshall_unmarshallsDesktopComponents', isAsynchron : false },
          { method : 'construct_constructsWholeDekstop', isAsynchron : true },
          { method : 'construct_subscribesForMenuSelectedMessage', isAsynchron : true }, 
          { method : 'showNotification_delegatesToMUI', isAsynchron : true }, 
          { method : 'showWindow_constructsDesktopWindow', isAsynchron : true },
          { method : 'destroy_destroysCreatedElements', isAsynchron : true }]
   },

   constants : {
      DESKTOP_CONFIGURATION_NAMESPACE : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration' xmlns:pp='http://www.processpuzzle.com' xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "desktop",
      DESKTOP_DOCKER_AUTOHIDE_ELEMENT_ID : 'dockAutoHide',
      DESKTOP_DOCKER_CLEAR_ELEMENT_ID : 'dockClear',
      DESKTOP_DOCKER_CONTROLS_ELEMENT_ID : 'dock',
      DESKTOP_DOCKER_PLACEMENT_ELEMENT_ID : 'dockPlacement',
      DESKTOP_DOCKER_SORT_ELEMENT_ID : 'dockSort',
      DESKTOP_DOCKER_WRAPPER_ELEMENT_ID : 'dockWrapper',
      DESKTOP_DOCKER_ELEMENT_ID : 'dock',
      DESKTOP_DOCUMENT_CONTAINER_ELEMENT_ID : 'pageWrapper',
      DESKTOP_ELEMENT_ID : 'desktopContainer',
      DESKTOP_FOOTER_ELEMENT_ID : 'desktopFooterWrapper',
      DESKTOP_FOOTER_BAR_ELEMENT_ID : 'desktopFooter',
      DESKTOP_HEADER_ELEMENT_ID : 'desktopHeader',
      DESKTOP_HEADER_LANGUAGE_SELECTOR_ELEMENT_ID : 'LanguageSelectorWidget',
      DESKTOP_HEADER_MENU_ID : 'HorizontalMenuBar',
      DESKTOP_NAVIGATION_BAR_ID : 'desktopNavigationBar',
      DESKTOP_TITLE_BAR_WRAPPER_ID : 'desktopTitlebarWrapper',
      DESKTOP_TITLE_BAR_ID : 'desktopTitleBar',
      DESKTOP_WINDOW_NAME : 'aboutDialog',
      DOCKER_ONLY_CONFIGURATION_PATH : 'Skins/ProcessPuzzle/Configuration/WindowDockerOnlyConfiguration.xml',
      DOCUMENT_BROWSER_PANEL_CONTENT_URL : '../DesktopConfigurator/Content/TreeView.html',
      DOCUMENT_PANEL_CONTENT_URL : '../DesktopConfigurator/Content/HelloWorldContent.html',
      DOCUMENT_PANEL_ID : 'documents-panel',
      DOCUMENT_SELECTOR_ID : 'documentSelector',
      EMPTY_CONFIGURATION_PATH : 'Skins/ProcessPuzzle/Configuration/EmptyConfiguration.xml',
      ERROR_DOCUMENT_URI : "ErrorDocument.xml",
      FOOTER_ONLY_CONFIGURATION_PATH : 'Skins/ProcessPuzzle/Configuration/FooterOnlyConfiguration.xml',
      FULL_CONFIGURATION_PATH : 'Skins/ProcessPuzzle/Configuration/DesktopConfiguration.xml',
      HEADER_ONLY_CONFIGURATION_PATH : 'Skins/ProcessPuzzle/Configuration/HeaderOnlyConfiguration.xml',
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.desktopConfiguration;
      this.desktopElement;
      this.desktop;
      this.desktopWindow;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger = null;
      this.webUIController;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.webUIController = new WebUIController({ contextRootPrefix : "../../../", configurationUri : this.constants.WEBUI_CONFIGURATION_URI } );
      this.webUIConfiguration = this.webUIController.getWebUIConfiguration();
      this.webUILogger = this.webUIController.getLogger();
      this.webUIMessageBus = new WebUIMessageBus();
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( new ProcessPuzzleLocale({ language : "hu" }));
      
      this.desktop = new Desktop( this.webUIConfiguration, this.resourceBundle, { 
         configurationURI : this.constants.DESKTOP_CONFIGURATION_URI, 
         errorDocumentUri : this.constants.ERROR_DOCUMENT_URI,
         onConstructed : this.onConstructed, 
         onDestructed : this.onDestructed, 
         onError : this.onError 
      });
      this.desktopConfiguration = this.desktop.getConfigurationXml();
      this.desktopElement = $( this.constants.DESKTOP_ELEMENT_ID );
   },
   
   afterEachTest : function (){
      if( this.desktopWindow ) this.desktopWindow.destroy();
      if( this.desktop ) this.desktop.destroy();
      if( this.webUIController.isConfigured ) this.webUIController.destroy();
      this.desktop = null;
   },
   
   initialize_loadsDesktopConfiguration : function() {
      assertThat( this.desktop.getConfigurationXml(), not( nil() ));
   },
   
   unmarshall_unmarshallsDesktopComponents : function() {
      this.desktop.unmarshall();
      
      assertThat( this.desktop.getName(), equalTo( this.desktopConfiguration.selectNodeText( "/dc:desktopConfiguration/dc:name" )));
      assertThat( this.desktop.getDescription(), equalTo( this.desktopConfiguration.selectNodeText( "/dc:desktopConfiguration/dc:description" )));
      assertThat( this.desktop.getVersion(), equalTo( this.desktopConfiguration.selectNodeText( "/dc:desktopConfiguration/dc:version" )));
      assertThat( this.desktop.getContainerId(), equalTo( this.desktopConfiguration.selectNodeText( "/dc:desktopConfiguration/dc:containerId" )));
      
      assertThat( this.desktop.getResources().getState(), equalTo( ResourceManager.States.UNMARSHALLED ));
      assertThat( this.desktop.getHeader().getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      assertThat( this.desktop.getFooter().getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      assertThat( this.desktop.getWindowDocker().getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      
      assertThat( this.desktop.getColumns().size(), equalTo( this.desktopConfiguration.selectNodes( "/dc:desktopConfiguration/dc:columns/dc:column" ).length ));
      this.desktop.getColumns().each( function( columnEntry, index ){
         assertThat( columnEntry.getValue().getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      });
      
      assertThat( this.desktop.getPanels().size(), equalTo( this.desktopConfiguration.selectNodes( "/dc:desktopConfiguration/dc:panels/dc:panel" ).length ));
      this.desktop.getPanels().each( function( panelEntry, index ){
         assertThat( panelEntry.getValue().getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      });
      
      assertThat( this.desktop.getWindows().size(), equalTo( this.desktopConfiguration.selectNodes( "/dc:desktopConfiguration/dc:windows/dc:window" ).length ));
      this.desktop.getWindows().each( function( windowEntry, index ){
         assertThat( windowEntry.getValue().getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      });
   },
   
   construct_constructsWholeDekstop : function() {
      this.testCaseChain.chain(
         function(){ this.desktop.unmarshall(); this.desktop.construct(); }.bind( this ),
         function(){
            assertThat( this.desktop.getState(), equalTo( DesktopElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_subscribesForMenuSelectedMessage : function() {
      this.testCaseChain.chain(
         function(){ this.desktop.unmarshall(); this.desktop.construct(); }.bind( this ),
         function(){
            assertThat( this.webUIMessageBus.getSubscribersToMessage( MenuSelectedMessage ).contains( this.desktop.webUIMessageHandler ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   showNotification_delegatesToMUI : function() {
      this.testCaseChain.chain(
         function(){ this.desktop.unmarshall(); this.desktop.construct(); }.bind( this ),
         function(){
            var mockedMUINotification = spy( MUI.notification );
            MUI.notification = mockedMUINotification; 
            this.desktop.showNotification( "underDevelopment" );
            verify( mockedMUINotification )( this.resourceBundle.getText( "DesktopNotification.underDevelopment" ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   showWindow_constructsDesktopWindow : function() {
      this.testCaseChain.chain(
         function(){ this.desktop.unmarshall(); this.desktop.construct(); }.bind( this ),
         function(){
            this.desktopWindow = this.desktop.showWindow( this.constants.DESKTOP_WINDOW_NAME, this.onWindowReady );
         }.bind( this ),
         function(){
            assertThat( this.desktopWindow.getState(), equalTo( DesktopElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.desktop.unmarshall(); this.desktop.construct(); }.bind( this ),
         function(){
            this.desktop.destroy();
         }.bind( this ),
         function(){
            assertThat( this.desktop.getState(), equalTo( DesktopElement.States.INITIALIZED ));
            assertThat( this.desktopElement.getElements( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestructed : function(){
      this.testCaseChain.callChain();
   },
   
   onError : function(){
      this.testCaseChain.callChain();
   },
   
   onWindowReady : function(){
      this.testCaseChain.callChain();
   }
});