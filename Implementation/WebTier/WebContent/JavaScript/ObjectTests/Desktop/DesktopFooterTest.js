var DesktopFooterTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onError'],

   options : {
      testMethods : [
          { method : 'initialize_inheritsParentBehaviour', isAsynchron : false }]
   },

   constants : {
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "Desktop",
      FOOTER_DEFINITION_SELECTOR : "/desktopConfiguration/footer",
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.desktopDefinition;
      this.desktopFooter;
      this.desktopFooterDefinition;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new Locale({ language : "en" }) );
        
      this.desktopDefinition = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI );
      this.desktopFooterDefinition = this.desktopDefinition.selectNode( this.constants.FOOTER_DEFINITION_SELECTOR );
      this.desktopFooter = new DesktopFooter( this.desktopFooterDefinition, this.bundle, 
         { componentContainerId : this.constants.DESKTOP_CONTAINER_ID, onConstructed : this.onConstructed, onError : this.onError } );
   },
   
   afterEachTest : function (){
      if( this.desktopFooter.getState() > DesktopElement.States.INITIALIZED ) this.desktopFooter.destroy();
      this.desktopFooter = null;
   },
   
   initialize_inheritsParentBehaviour : function() {
      assertThat( this.desktopFooter, not( nil() ));
      assertThat( this.desktopFooter.getDefinitionElement(), not( nil() ));
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onError : function( error ){
      this.testCaseChain.callChain();
   }

});