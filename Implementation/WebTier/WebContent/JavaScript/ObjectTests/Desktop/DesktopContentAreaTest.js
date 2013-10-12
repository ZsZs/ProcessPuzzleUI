window.DesktopContentAreaTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onError'],

   options : {
      testMethods : [
          { method : 'initialize_inheritsDesktopElementBehaviour', isAsynchron : false }]
   },

   constants : {
      DESKTOP_CONFIGURATION_NAMESPACE : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration' xmlns:pp='http://www.processpuzzle.com' xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "desktop",
      CONTENT_AREA_DEFINITION : "/dc:desktopConfiguration/dc:contentArea",
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.desktopDefinition;
      this.contentArea;
      this.contentAreaDefinition;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.desktopDefinition = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI, { nameSpaces : this.constants.DESKTOP_CONFIGURATION_NAMESPACE });
      this.contentAreaDefinition = this.desktopDefinition.selectNode( this.constants.CONTENT_AREA_DEFINITION );
      this.contentArea = new DesktopContentArea( this.contentAreaDefinition, this.bundle, { onConstructed : this.onConstructed, onError : this.onError } );
   },
   
   afterEachTest : function (){
      if( this.contentArea.getState() > DesktopElement.States.INITIALIZED ) this.contentArea.destroy();
      this.contentArea = null;
   },
   
   initialize_inheritsDesktopElementBehaviour : function() {
      assertThat( this.contentArea, not( nil() ));
      assertThat( this.contentArea.getDefinitionElement(), not( nil() ));
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onError : function( error ){
      this.testCaseChain.callChain();
   }

});