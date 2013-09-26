window.RemoteResourceTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'prepareWindowConstruction'],

   options : {
      testMethods : [
          { method : 'initialize_SetsState', isAsynchron : false },
          { method : 'unmarshall_SetsState', isAsynchron : false },
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'unmarshall_whenSpecificed_unmarshallsDocument', isAsynchron : false },
          { method : 'construct_instantiatesMUIWindowAndDeterminesWindowElement', isAsynchron : true}, 
          { method : 'construct_whenSpecified_loadsContentHtml', isAsynchron : true }, 
          { method : 'construct_whenSpecified_loadsSmartDocument', isAsynchron : true }, 
          { method : 'destroy_destroysAllNestedHtmlElementsAndEvents', isAsynchron : true }],
      windowUnderlayElementId : "windowUnderlay"          
   },

   constants : {
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "desktop",
      WINDOW_DEFINITION_WITH_HTMLCONTENT : "/dc:desktopConfiguration/dc:windows/dc:window[@name='aboutDialog']",
      WINDOW_DEFINITION_WITH_SMARTCONTENT : "/dc:desktopConfiguration/dc:windows/dc:window[@name='newDocumentDialog']",
      PAGE_WRAPPER_ID : "pageWrapper",
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      //Private instance variables
      this.desktopContainerElement;
      this.desktopDefinition;
      this.desktopInternationalization;
      this.pageWrapperElement;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.windowWithHtmlContent;
      this.windowWithSmartDocument;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.desktopInternationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.desktopInternationalization.load( new ProcessPuzzleLocale({ language : "en" }) );
        
      this.desktopDefinition = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI, { nameSpaces : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration'" } );
      var elementDefinition = this.desktopDefinition.selectNode( this.constants.WINDOW_DEFINITION_WITH_HTMLCONTENT );
      this.windowWithHtmlContent = new DesktopWindow( elementDefinition, this.desktopInternationalization, { componentContainerId : this.constants.PAGE_WRAPPER_ID, onConstructed : this.onConstructed } );
      
      elementDefinition = this.desktopDefinition.selectNode( this.constants.WINDOW_DEFINITION_WITH_SMARTCONTENT );
      this.windowWithSmartContent = new DesktopWindow( elementDefinition, this.desktopInternationalization, { componentContainerId : this.constants.PAGE_WRAPPER_ID, onConstructed : this.onConstructed } );
      
      this.desktopContainerElement = $( this.constants.DESKTOP_CONTAINER_ID );
      this.pageWrapperElement = $( this.constants.PAGE_WRAPPER_ID );
   },
   
   afterEachTest : function (){
      this.desktopDefinition.release();
      this.windowWithHtmlContent.destroy();
      this.windowWithSmartContent.destroy();
      this.desktopContainerElement = null;
   },
   
   //Test methods
   initialize_SetsState : function(){
      assertThat( this.windowWithHtmlContent.getState(), equalTo( DesktopElement.States.INITIALIZED ));
   },
   
   unmarshall_SetsState : function(){
      this.windowWithHtmlContent.unmarshall();
      assertThat( this.windowWithHtmlContent.getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
   },
             
   unmarshall_determinesProperties : function(){
      this.windowWithHtmlContent.unmarshall();
        
      assertThat( this.windowWithHtmlContent.getContentUrl(), equalTo( this.desktopDefinition.selectNodeText( this.constants.WINDOW_DEFINITION_WITH_HTMLCONTENT + "/contentURL" ) ));
      assertThat( this.windowWithHtmlContent.getHeight(), equalTo( this.desktopDefinition.selectNode( this.constants.WINDOW_DEFINITION_WITH_HTMLCONTENT + "/@height" ).value ));
      assertThat( this.windowWithHtmlContent.getName(), equalTo( this.desktopDefinition.selectNode( this.constants.WINDOW_DEFINITION_WITH_HTMLCONTENT + "/@name" ).value ));
      assertThat( this.windowWithHtmlContent.getTitle(), equalTo( this.desktopInternationalization.getText( this.desktopDefinition.selectNodeText( this.constants.WINDOW_DEFINITION_WITH_HTMLCONTENT + "/title" ) )));
      assertThat( this.windowWithHtmlContent.getWidth(), equalTo( this.desktopDefinition.selectNode( this.constants.WINDOW_DEFINITION_WITH_HTMLCONTENT + "/@width" ).value ));
   },
     
   unmarshall_whenSpecificed_unmarshallsDocument : function(){
      this.windowWithSmartContent.unmarshall();
      assertThat( this.windowWithSmartContent.getDocument(), not( nil() ));
   },
   
   construct_instantiatesMUIWindowAndDeterminesWindowElement : function() {
      this.testCaseChain.chain(
         function(){
            this.prepareWindowConstruction();
            this.windowWithHtmlContent.unmarshall();
            this.windowWithHtmlContent.construct();
         }.bind( this ),
         function(){
            assertThat( this.windowWithHtmlContent.getMUIWindow(), not( nil() ));
            assertThat( this.windowWithHtmlContent.getWindowElement(), equalTo( this.pageWrapperElement.getElementById( this.windowWithHtmlContent.getName() )));
            assertThat( this.windowWithHtmlContent.getWindowContentElement(), equalTo( this.pageWrapperElement.getElementById( this.windowWithHtmlContent.getName() + "_content" )));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenSpecified_loadsContentHtml : function() {
      this.testCaseChain.chain(
         function(){
            this.prepareWindowConstruction();
            this.windowWithHtmlContent.unmarshall();
            this.windowWithHtmlContent.construct();
         }.bind( this ),
         function(){
            assertThat( this.windowWithHtmlContent.getWindowContentElement().getChildren('h1').length, equalTo( 1 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenSpecified_loadsSmartDocument : function() {
      this.testCaseChain.chain(
         function(){
            this.prepareWindowConstruction();
            this.windowWithSmartContent.unmarshall();
            this.windowWithSmartContent.construct();
         }.bind( this ),
         function(){
            assertThat( this.windowWithSmartContent.getDocument().getState(), equalTo( AbstractDocument.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllNestedHtmlElementsAndEvents : function() {
      this.testCaseChain.chain(
         function(){
            this.prepareWindowConstruction();
            this.windowWithHtmlContent.unmarshall();
            this.windowWithHtmlContent.construct();
         }.bind( this ),
         function(){
            this.windowWithHtmlContent.destroy();
            this.destroyWindowUnderlay();
            assertThat( this.pageWrapperElement.getElements( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Event handlers
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methdos
   destroyWindowUnderlay : function(){
      var windowUnderlayElement = this.pageWrapperElement.getElementById( this.options.windowUnderlayElementId );
      if( windowUnderlayElement ) windowUnderlayElement.destroy();
   }.protect(),
   
   prepareWindowConstruction : function(){
      var desktopId = this.constants.DESKTOP_CONTAINER_ID;
      var pageWrapperId = this.constants.PAGE_WRAPPER_ID;
      MUI.myChain = new Chain();
      MUI.myChain.chain( function(){ MUI.Desktop.initialize({ desktop : desktopId, pageWrapper : pageWrapperId });} );
      MUI.myChain.callChain();
   }

});