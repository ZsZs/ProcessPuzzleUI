window.DesktopPanelTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDocumentLoaded', 'onPanelConstructed'],

   options : {
      testMethods : [
          { method : 'initialize_linksToRelatedComponentsAndSetsState', isAsynchron : false },
          { method : 'unmarshall_setsState', isAsynchron : false },
          { method : 'unmarshall_determinesPanelProperties', isAsynchron : false },
          { method : 'unmarshall_unmarshallsPanelHeader', isAsynchron : false },
          { method : 'unmarshall_determinesDocumentProperties', isAsynchron : false },
          { method : 'construct_instantiatesMUIPanel', isAsynchron : true }, 
          { method : 'construct_constructsHeaderWithPlugin', isAsynchron : true }, 
          { method : 'construct_constructsSmartDocument', isAsynchron : true }, 
          { method : 'construct_whenSpecified_subscribesForMenuSelectedMessage', isAsynchron : true },
          { method : 'webUIMessageHandler_whenLoadDocumentReceived_loadsHtmlDocument', isAsynchron : true },
          { method : 'webUIMessageHandler_whenLoadDocumentReceived_loadsSmartDocument', isAsynchron : true }]
   },

   constants : {
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "desktop",
      COLUMN_DEFINITION : "/desktopConfiguration/columns/column[@name='mainColumn']",
      HTML_DOCUMENT_URI : "../Desktop/HtmlDocument.xml",
      SMART_DOCUMENT_URI : "../Desktop/StaticDocument.xml",
      PANEL_DEFINITION : "/desktopConfiguration/panels/panel[@name='documents-panel']",
      PANEL_DOCUMENT_WRAPPER_ID : "panelDocumentWrapper",
      PAGE_WRAPPER_ID : "pageWrapper",
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.column;
      this.columnDefinition;
      this.componentStateManager;
      this.desktopContainerElement;
      this.desktopDefinition;
      this.loadedDocumentUri;
      this.panelDefinition;
      this.pageWrapperElement;
      this.panel;
      this.resourceBundle;
      this.toolBox;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( new Locale({ language : "hu" }) );
      this.componentStateManager = new ComponentStateManager();

      this.desktopDefinition = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI, { nameSpaces : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration'"} );
      this.columnDefinition = this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION );
      this.column = new DesktopColumn( this.columnDefinition, { componentContainerId : this.constants.PAGE_WRAPPER_ID } );
      this.panelDefinition = this.desktopDefinition.selectNode( this.constants.PANEL_DEFINITION );
      this.panel = new DesktopPanel( this.panelDefinition, this.resourceBundle, { componentContainerId : this.constants.PAGE_WRAPPER_ID, onConstructed : this.onPanelConstructed, onDocumentLoaded : this.onDocumentLoaded } );
      this.desktopContainerElement = $( this.constants.DESKTOP_CONTAINER_ID );
      this.pageWrapperElement = $( this.constants.PAGE_WRAPPER_ID );
   },
   
   afterEachTest : function (){
      this.desktopDefinition.release();
      this.panel.destroy();
      this.column.destroy();
      this.componentStateManager.reset();
      this.webUIMessageBus.tearDown();
      this.desktopContainerElement = null;
      this.loadedDocumentUri = null;
   },
   
   initialize_linksToRelatedComponentsAndSetsState : function() {
      assertThat( this.panel.getLogger(), equalTo( this.webUILogger ) );
      assertThat( this.panel.getMessageBus(), equalTo( this.webUIMessageBus ) );
      assertThat( this.panel.getComponentStateManager(), equalTo( this.componentStateManager ) );
      assertThat( this.panel.getState(), equalTo( DesktopElement.States.INITIALIZED ) );
   },
   
   unmarshall_setsState : function() {
      this.panel.unmarshall();
      assertThat( this.panel.getState(), equalTo( DesktopElement.States.UNMARSHALLED ) );
   },
   
   unmarshall_determinesPanelProperties : function() {
      this.panel.unmarshall();
      assertThat( this.panel.getColumnReference(), equalTo( this.desktopDefinition.selectNode( this.constants.PANEL_DEFINITION + "/@columnReference" ).value ) );
      assertThat( this.panel.getContentUrl(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/contentURL" ) ) );
      assertThat( this.panel.getHeight(), equalTo( this.desktopDefinition.selectNode( this.constants.PANEL_DEFINITION + "/@height" ).value ) );
      assertThat( this.panel.getName(), equalTo( this.desktopDefinition.selectNode( this.constants.PANEL_DEFINITION + "/@name" ).value ) );
      assertThat( this.panel.getPlugin(), nil() );
      assertThat( this.panel.getToolBox(), not( nil() ) );
      assertThat( this.panel.getShowHeader(), equalTo( parseBoolean( this.desktopDefinition.selectNode( this.constants.PANEL_DEFINITION + "/@showHeader" ).value ) ) );
      assertThat( this.panel.getTitle(), equalTo( this.resourceBundle.getText( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/title" ) ) ) );
   },
   
   unmarshall_unmarshallsPanelHeader : function() {
      this.panel.unmarshall();

      assertThat( this.panel.getHeader(), not( nil() ) );
      assertThat( this.panel.getHeader().getState(), equalTo( DesktopPanelHeader.States.UNMARSHALLED ) );
   },
   
   unmarshall_determinesDocumentProperties : function() {
      this.panel.unmarshall();
      assertThat( this.panel.getDocument(), not( nil() ) );
      assertThat( instanceOf( this.panel.getDocument(), SmartDocument ), is( true ) );
      assertThat( this.panel.getDocumentDefinitionUri(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/documentDefinitionUri" ) ) );
      assertThat( this.panel.getDocumentContentUri(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/documentContentUri" ) ) );
      assertThat( this.panel.getDocumentWrapperId(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/@id" ) ) );
      assertThat( this.panel.getDocumentWrapperStyle(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/@elementStyle" ) ) );
      assertThat( this.panel.getDocumentWrapperTag(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/@tag" ) ) );
   },
   
   construct_instantiatesMUIPanel : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel(); }.bind( this ),
         function() {
            //after documentLoaded event
            assertThat( this.panel.getMUIPanel(), not( nil() ) );
         }.bind( this ),
         function(){
            //after this.panelConstructed event
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsHeaderWithPlugin : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel(); }.bind( this ),
         function(){
            assertThat( this.panel.getHeader().getState(), equalTo( DesktopPanelHeader.States.CONSTRUCTED ) );
         }.bind( this ),
         function(){
            assertThat( this.panel.getState(), equalTo( DesktopElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsSmartDocument : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel(); }.bind( this ),
         function(){
            //after documentLoaded event
            assertThat( this.panel.getDocument(), not( nil() ) );
            assertThat( $( this.constants.PANEL_DOCUMENT_WRAPPER_ID ), not( nil() ) );
         }.bind( this ),
         function(){
            //after this.panelConstructed event
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenSpecified_subscribesForMenuSelectedMessage : function() {
      this.testCaseChain.chain(
         function(){
            this.panel.options.handleDocumentLoadEvents = true;
            this.constructPanel();
         }.bind( this ),
         function(){
            //documentLoaded event was fired
         }.bind( this ),
         function(){
            assertThat( this.webUIMessageBus.getSubscribersToMessage( MenuSelectedMessage ).contains( this.panel.webUIMessageHandler ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenLoadDocumentReceived_loadsHtmlDocument : function() {
      this.testCaseChain.chain(
         function(){
            this.panel.options.handleDocumentLoadEvents = true;
            this.constructPanel();
         }.bind( this ),
         function(){
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/documentDefinitionUri" ) ) );            
         }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : AbstractDocument.Types.HTML, documentURI : this.constants.HTML_DOCUMENT_URI });
            this.webUIMessageBus.notifySubscribers( message );
         }.bind( this ),
         function(){
            assertThat( this.panel.getDocumentDefinitionUri(), equalTo( this.constants.HTML_DOCUMENT_URI ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenLoadDocumentReceived_loadsSmartDocument : function() {
      this.testCaseChain.chain(
         function(){
            this.panel.options.handleDocumentLoadEvents = true;
            this.constructPanel();
         }.bind( this ),
         function(){
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_DEFINITION + "/document/documentDefinitionUri" ) ) );
         }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : AbstractDocument.Types.SMART, documentURI : this.constants.SMART_DOCUMENT_URI });
            this.webUIMessageBus.notifySubscribers( message );
         }.bind( this ),
         function(){
            assertThat( this.panel.getDocumentDefinitionUri(), equalTo( this.constants.SMART_DOCUMENT_URI ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onDocumentLoaded : function( documentUri ) {
      this.loadedDocumentUri = documentUri;
      this.testCaseChain.callChain();
   },

   onPanelConstructed : function() {
      this.testCaseChain.callChain();
   },
   
   //Private helper methods
   constructPanel : function() {
      this.column.unmarshall();
      this.panel.unmarshall();
      MUI.myChain = new Chain();
      MUI.myChain.chain( function() {
         MUI.Desktop.initialize( {
            desktop : this.constants.DESKTOP_CONTAINER_ID,
            pageWrapper : this.constants.PAGE_WRAPPER_ID} );
      }.bind( this ));
      MUI.myChain.callChain();
      this.column.construct();
      this.panel.construct();
   }.protect(),

   transformToResourceUriToAbsolute: function( resourceUri ){
      var baseUri = new URI( document.location.href );
      var tempUri = new URI( resourceUri );
      return baseUri.get( 'scheme' ) + "://" + tempUri.toAbsolute( baseUri );
   }.protect()
});