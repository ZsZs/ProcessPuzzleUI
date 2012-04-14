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
         { method : 'unmarshall_whenEnabled_includesComponentInUri', isAsynchron : false },
         { method : 'construct_instantiatesMUIPanel', isAsynchron : true }, 
         { method : 'construct_constructsHeaderWithPlugin', isAsynchron : true }, 
         { method : 'construct_whenNotDisabled_createsScrollBars', isAsynchron : true }, 
         { method : 'construct_whenEnabled_restoresComponentState', isAsynchron : true }, 
         { method : 'construct_whenSpecified_constructsPlugin', isAsynchron : true }, 
         { method : 'construct_whenSpecified_constructsSmartDocument', isAsynchron : true }, 
         { method : 'construct_whenSpecified_subscribesForMenuSelectedMessage', isAsynchron : true },
         { method : 'webUIMessageHandler_whenLoadDocumentReceived_loadsHtmlDocument', isAsynchron : true },
         { method : 'webUIMessageHandler_whenLoadDocumentReceived_loadsSmartDocument', isAsynchron : true },
         { method : 'webUIMessageHandler_whenEventOriginatorIsNotListed_bypassesDocument', isAsynchron : true },
         { method : 'loadDocument_whenEnabled_storesComponentState', isAsynchron : true }]
   },

   constants : {
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "desktop",
      COLUMN_DEFINITION : "/desktopConfiguration/columns/column[@name='mainColumn']",
      HTML_DOCUMENT_URI : "../Desktop/HtmlDocument.xml",
      SMART_DOCUMENT_URI : "../Desktop/StaticDocument.xml",
      PANEL_DOCUMENT_WRAPPER_ID : "panelDocumentWrapper",
      PANEL_NAME : "documents-panel",
      PANEL_WITH_DOCUMENT_DEFINITION : "/desktopConfiguration/panels/panel[@name='documents-panel']",
      PANEL_WITH_PLUGIN_DEFINITION : "/desktopConfiguration/panels/panel[@name='newsPanel']",
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
      this.pageWrapperElement;
      this.panelWithDocument;
      this.panelWithDocumentDefinition;
      this.panelWithPlugin;
      this.panelWithPluginDefinition;
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
      
      this.panelWithDocumentDefinition = this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION );
      this.panelWithDocument = new DesktopPanel( this.panelWithDocumentDefinition, this.resourceBundle, { componentContainerId : this.constants.PAGE_WRAPPER_ID, onConstructed : this.onPanelConstructed, onDocumentLoaded : this.onDocumentLoaded } );
      
      this.panelWithPluginDefinition = this.desktopDefinition.selectNode( this.constants.PANEL_WITH_PLUGIN_DEFINITION );
      this.panelWithPlugin = new DesktopPanel( this.panelWithPluginDefinition, this.resourceBundle, { componentContainerId : this.constants.PAGE_WRAPPER_ID, onConstructed : this.onPanelConstructed, onDocumentLoaded : this.onDocumentLoaded } );
      
      this.desktopContainerElement = $( this.constants.DESKTOP_CONTAINER_ID );
      this.pageWrapperElement = $( this.constants.PAGE_WRAPPER_ID );
   },
   
   afterEachTest : function (){
      this.desktopDefinition.release();
      this.panelWithDocument.destroy();
      this.panelWithPlugin.destroy();
      this.column.destroy();
      this.componentStateManager.reset();
      this.webUIMessageBus.tearDown();
      this.desktopContainerElement = null;
      this.loadedDocumentUri = null;
   },
   
   initialize_linksToRelatedComponentsAndSetsState : function() {
      assertThat( this.panelWithDocument.getLogger(), equalTo( this.webUILogger ) );
      assertThat( this.panelWithDocument.getMessageBus(), equalTo( this.webUIMessageBus ) );
      assertThat( this.panelWithDocument.getComponentStateManager(), equalTo( this.componentStateManager ) );
      assertThat( this.panelWithDocument.getState(), equalTo( DesktopElement.States.INITIALIZED ) );
   },
   
   unmarshall_setsState : function() {
      this.panelWithDocument.unmarshall();
      assertThat( this.panelWithDocument.getState(), equalTo( DesktopElement.States.UNMARSHALLED ) );
   },
   
   unmarshall_determinesPanelProperties : function() {
      this.panelWithDocument.unmarshall();
      assertThat( this.panelWithDocument.getColumnReference(), equalTo( this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@columnReference" ).value ) );
      assertThat( this.panelWithDocument.getContentUrl(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/contentURL" ) ) );
      assertThat( this.panelWithDocument.getEventSources(), equalTo( eval( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@eventOriginators" ))));
      assertThat( this.panelWithDocument.getHeight(), equalTo( this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@height" ).value ) );
      assertThat( this.panelWithDocument.getName(), equalTo( this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@name" ).value ) );
      assertThat( this.panelWithDocument.getPlugin(), nil() );
      assertThat( this.panelWithDocument.getShowHeader(), equalTo( parseBoolean( this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@showHeader" ).value ) ) );
      assertThat( this.panelWithDocument.getStoreState(), equalTo( parseBoolean( this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@storeState" ).value ) ) );
      assertThat( this.panelWithDocument.getStoreStateInUri(), equalTo( parseBoolean( this.desktopDefinition.selectNode( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/@storeStateInUri" ).value ) ) );
      assertThat( this.panelWithDocument.getToolBox(), not( nil() ) );
      assertThat( this.panelWithDocument.getTitle(), equalTo( this.resourceBundle.getText( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/title" ) ) ) );
   },
   
   unmarshall_unmarshallsPanelHeader : function() {
      this.panelWithDocument.unmarshall();

      assertThat( this.panelWithDocument.getHeader(), not( nil() ) );
      assertThat( this.panelWithDocument.getHeader().getState(), equalTo( DesktopPanelHeader.States.UNMARSHALLED ) );
   },
   
   unmarshall_determinesDocumentProperties : function() {
      this.panelWithDocument.unmarshall();
      assertThat( this.panelWithDocument.getDocument(), not( nil() ) );
      assertThat( instanceOf( this.panelWithDocument.getDocument(), SmartDocument ), is( true ) );
      assertThat( this.panelWithDocument.getDocumentDefinitionUri(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentDefinitionUri" ) ) );
      assertThat( this.panelWithDocument.getDocumentContentUri(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentContentUri" ) ) );
      assertThat( this.panelWithDocument.getDocumentWrapperId(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/@id" ) ) );
      assertThat( this.panelWithDocument.getDocumentWrapperStyle(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/@elementStyle" ) ) );
      assertThat( this.panelWithDocument.getDocumentWrapperTag(), equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/@tag" ) ) );
   },
   
   unmarshall_whenSpecified_subscribesForMenuSelectedMessage : function() {
      this.panelWithDocument.unmarshall();
      assertThat( this.webUIMessageBus.getSubscribersToMessage( MenuSelectedMessage ).contains( this.panelWithDocument.webUIMessageHandler ), is( true ));
   },
   
   unmarshall_whenEnabled_includesComponentInUri : function() {
      this.panelWithDocument.unmarshall();
      assertThat( this.panelWithDocument.getComponentStateManager().getUriTransformer().getComponentNames(), hasItem( this.panelWithDocument.getName() ));
   },
   
   construct_instantiatesMUIPanel : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel( this.panelWithDocument ); }.bind( this ),
         function() {
            //after documentLoaded event
            assertThat( this.panelWithDocument.getMUIPanel(), not( nil() ) );
         }.bind( this ),
         function(){
            //after this.panelConstructed event
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsHeaderWithPlugin : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel( this.panelWithDocument ); }.bind( this ),
         function(){
            assertThat( this.panelWithDocument.getHeader().getState(), equalTo( DesktopPanelHeader.States.CONSTRUCTED ) );
         }.bind( this ),
         function(){
            assertThat( this.panelWithDocument.getState(), equalTo( DesktopElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenNotDisabled_createsScrollBars : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel( this.panelWithDocument ); }.bind( this ),
         function(){
         }.bind( this ),
         function(){
            //assertThat( this.panelWithDocument.getVerticalScrollBar(), not( nil() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenEnabled_restoresComponentState : function() {
      this.testCaseChain.chain(
         function(){ 
            var componentState = { documentDefinitionURI : this.constants.HTML_DOCUMENT_URI, documentType : AbstractDocument.Types.HTML };
            this.componentStateManager.storeComponentState( this.constants.PANEL_NAME, componentState );
            this.constructPanel( this.panelWithDocument ); 
         }.bind( this ),
         function(){
            assertThat( this.panelWithDocument.getDocument().getDocumentDefinitionUri(), equalTo( this.constants.HTML_DOCUMENT_URI ));
            assertThat( instanceOf( this.panelWithDocument.getDocument(), HtmlDocument ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
      
   construct_whenSpecified_constructsPlugin : function() {
      this.testCaseChain.chain(
         function(){ 
            this.constructPanel( this.panelWithPlugin ); 
         }.bind( this ),
         function(){
            assertThat( this.panelWithPlugin.getPlugin(), not( nil() ) );
            assertThat( this.panelWithPlugin.getPlugin().getState(), equalTo( DesktopElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenSpecified_constructsSmartDocument : function() {
      this.testCaseChain.chain(
         function(){ this.constructPanel( this.panelWithDocument ); }.bind( this ),
         function(){
            //after documentLoaded event
            assertThat( this.panelWithDocument.getDocument(), not( nil() ) );
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
            this.panelWithDocument.options.handleDocumentLoadEvents = true;
            this.constructPanel( this.panelWithDocument );
         }.bind( this ),
         function(){
            //documentLoaded event was fired
         }.bind( this ),
         function(){
            assertThat( this.webUIMessageBus.getSubscribersToMessage( MenuSelectedMessage ).contains( this.panelWithDocument.webUIMessageHandler ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenLoadDocumentReceived_loadsHtmlDocument : function() {
      this.testCaseChain.chain(
         function(){
            this.panelWithDocument.options.handleDocumentLoadEvents = true;
            this.constructPanel( this.panelWithDocument );
         }.bind( this ),
         function(){
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentDefinitionUri" ) ) );            
         }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : AbstractDocument.Types.HTML, documentURI : this.constants.HTML_DOCUMENT_URI, originator : "verticalMenuColumn" });
            this.webUIMessageBus.notifySubscribers( message );
         }.bind( this ),
         function(){
            assertThat( this.panelWithDocument.getDocumentDefinitionUri(), equalTo( this.constants.HTML_DOCUMENT_URI ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenLoadDocumentReceived_loadsSmartDocument : function() {
      this.testCaseChain.chain(
         function(){
            this.panelWithDocument.options.handleDocumentLoadEvents = true;
            this.constructPanel( this.panelWithDocument );
         }.bind( this ),
         function(){
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentDefinitionUri" ) ) );
         }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : AbstractDocument.Types.SMART, documentURI : this.constants.SMART_DOCUMENT_URI, originator : "verticalMenuColumn" });
            this.webUIMessageBus.notifySubscribers( message );
         }.bind( this ),
         function(){
            assertThat( this.panelWithDocument.getDocumentDefinitionUri(), equalTo( this.constants.SMART_DOCUMENT_URI ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenEventOriginatorIsNotListed_bypassesDocument : function() {
      this.testCaseChain.chain(
         function(){
            this.panelWithDocument.options.handleDocumentLoadEvents = true;
            this.constructPanel( this.panelWithDocument );
         }.bind( this ),
         function(){
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentDefinitionUri" ) ) );
         }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : AbstractDocument.Types.SMART, documentURI : this.constants.SMART_DOCUMENT_URI, originator : "invalidSource" });
            this.webUIMessageBus.notifySubscribers( message );
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentDefinitionUri" ) ) );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   loadDocument_whenEnabled_storesComponentState : function() {
      this.testCaseChain.chain(
         function(){
            this.panelWithDocument.options.handleDocumentLoadEvents = true;
            this.constructPanel( this.panelWithDocument );
         }.bind( this ),
         function(){
            assertThat( this.loadedDocumentUri, equalTo( this.desktopDefinition.selectNodeText( this.constants.PANEL_WITH_DOCUMENT_DEFINITION + "/document/documentDefinitionUri" ) ) );
         }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : AbstractDocument.Types.SMART, documentURI : this.constants.SMART_DOCUMENT_URI, originator : "verticalMenuColumn" });
            this.webUIMessageBus.notifySubscribers( message );
         }.bind( this ),
         function(){
            assertThat( this.componentStateManager.retrieveComponentState( this.constants.PANEL_NAME )['documentDefinitionURI'], equalTo( this.constants.SMART_DOCUMENT_URI ));
            assertThat( this.componentStateManager.retrieveComponentState( this.constants.PANEL_NAME )['documentType'], equalTo( AbstractDocument.Types.SMART ));
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
   constructPanel : function( panelToConstruct ) {
      this.column.unmarshall();
      panelToConstruct.unmarshall();
      
      MUI.myChain = new Chain();
      MUI.myChain.chain( function() {
         MUI.Desktop.initialize( {
            desktop : this.constants.DESKTOP_CONTAINER_ID,
            pageWrapper : this.constants.PAGE_WRAPPER_ID} );
      }.bind( this ));
      MUI.myChain.callChain();
      this.column.construct();
      
      panelToConstruct.construct();
   }.protect(),

   transformToResourceUriToAbsolute: function( resourceUri ){
      var baseUri = new URI( document.location.href );
      var tempUri = new URI( resourceUri );
      return baseUri.get( 'scheme' ) + "://" + tempUri.toAbsolute( baseUri );
   }.protect()
});