window.DesktopPanelHeaderTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['onHeaderConstructed', 'onHeaderConstructionError', 'onHeaderDestructed'],

   options : {
      testMethods : [
         { method : 'initialize_setsState', isAsynchron : false },
         { method : 'unmarshall_determinesHeaderProperties', isAsynchron : false }, 
         { method : 'construct_constructsPlugin', isAsynchron : true },
         { method : 'construct_whenSpecified_addsElementStyleToHeaderContent', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml",
      DESKTOP_CONFIGURATION_NAMESPACE : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration' xmlns:pp='http://www.processpuzzle.com' xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      PANEL_HEADER_SELECTOR : "/dc:desktopConfiguration/dc:panels/dc:panel[@name='console']/dc:panelHeader"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.componentStateManager;
      this.desktopConfiguration;
      this.messageBus;
      this.panelHeader;
      this.panelHeaderDefinition;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
        
      this.componentStateManager = new ComponentStateManager();
      this.messageBus = new WebUIMessageBus();
      this.desktopConfiguration = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI, { nameSpaces : this.constants.DESKTOP_CONFIGURATION_NAMESPACE });
      this.panelHeaderDefinition = this.desktopConfiguration.selectNode( this.constants.PANEL_HEADER_SELECTOR );
      this.panelHeader = new DesktopPanelHeader( this.panelHeaderDefinition, this.bundle, {
         componentContainerId : "console_header",
         onConstructed : this.onHeaderConstructed, 
         onDestructed : this.onHeaderDestructed, 
         onError : this.onHeaderConstructionError
      });
   },
   
   afterEachTest : function (){
      if( this.panelHeader.getState() > DesktopElement.States.INITIALIZED ) this.panelHeader.destroy();
      this.componentStateManager.reset();
      this.messageBus.tearDown();
      this.panelHeader = null;
   },
   
   initialize_setsState : function() {
      assertThat( this.panelHeader, not( nil() ));
      assertThat( this.panelHeader.getDefinitionElement(), not( nil() ));
      assertThat( this.panelHeader.getState(), equalTo( DesktopElement.States.INITIALIZED ));
   },
   
   unmarshall_determinesHeaderProperties : function() {
      this.panelHeader.unmarshall();
      assertThat( this.panelHeader.getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      assertThat( this.panelHeader.getPlugin(), not( nil() ));
      assertThat( this.panelHeader.getContentStyle(), equalTo( this.desktopConfiguration.selectNodeText( this.constants.PANEL_HEADER_SELECTOR + "/@contentStyle" )));
      assertThat( this.panelHeader.getToolBoxUrl(), equalTo( this.desktopConfiguration.selectNodeText( this.constants.PANEL_HEADER_SELECTOR + "/@toolBoxUrl" )));
   },
   
   construct_constructsPlugin : function() {      
      this.testCaseChain.chain(
         function(){
            this.panelHeader.unmarshall();
            this.panelHeader.construct();
         }.bind( this ),
         function(){
            assertThat( this.panelHeader.getState(), equalTo( DesktopElement.States.CONSTRUCTED ));
            assertThat( this.panelHeader.getPlugin().getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenSpecified_addsElementStyleToHeaderContent : function() {      
      this.testCaseChain.chain(
         function(){
            this.panelHeader.unmarshall();
            this.panelHeader.construct();
         }.bind( this ),
         function(){
            assertThat( $( "console_headerContent" ).hasClass( this.panelHeader.getContentStyle() ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onHeaderConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onHeaderConstructionError : function( error ){
      this.testCaseChain.callChain();
   },

   onHeaderDestructed : function(){
      this.testCaseChain.callChain();
   }
   
});