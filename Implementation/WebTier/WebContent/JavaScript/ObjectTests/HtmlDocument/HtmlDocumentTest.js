window.HtmlDocumentTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDocumentError', 'onDocumentReady'],

   options : {
      testMethods : [
          { method : 'construct_createsTextAreaAndInstantiatesEditor', isAsynchron : true }, 
          { method : 'webUIMessageHandler_invokesEditor', isAsynchron : true }]
   },

   constants : {
      WEBUI_CONFIGURATION_URI : "../HtmlDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "HtmlDocument",
      DOCUMENT_CONTENT_URI : "../HtmlDocument/HtmlDocument_en.html",
      DOCUMENT_DEFINITION_URI : "../HtmlDocument/HtmlDocumentDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.bundle;
      this.documentContainerElement;
      this.documentContentResource;
      this.documentDefinition;
      this.dataElement;
      this.documentInternationalization;
      this.htmlDocument;
      this.webUIConfiguration;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new Locale({ language : "en" }) );
        
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/HtmlDocument'" } );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/HtmlDocument'" } );
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
      this.htmlDocument = new HtmlDocument( this.bundle, { 
         documentContentUri : this.constants.DOCUMENT_CONTENT_URI, 
         documentContainerId : this.constants.DOCUMENT_CONTAINER_ID,
         documentDefinitionUri : this.constants.DOCUMENT_DEFINITION_URI,
         onDocumentError : this.onDocumentError,
         onDocumentReady : this.onDocumentReady,
         rootElementName : "/htmlDocumentDefinition" });
      this.htmlDocument.unmarshall();
   },
   
   afterEachTest : function (){
      this.webUIMessageBus.tearDown();
      this.bundle.release();
      this.bundle = null;
        
      if( this.htmlDocument.getState() > AbstractDocument.States.INITIALIZED ) this.htmlDocument.destroy();
      this.htmlDocument = null;
      this.documentContainerElement = null;
   },
   
   construct_createsTextAreaAndInstantiatesEditor : function() {
      this.testCaseChain.chain(
         function(){
            this.htmlDocument.construct();
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getElements( 'textarea' ).length, equalTo( 1 ));
            assertThat( instanceOf( this.htmlDocument.getEditor(), TextAreaEditor ), is( true ));
            assertThat( this.htmlDocument.getEditor().getSubjectElement(), equalTo( this.htmlDocument.getTextArea() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_invokesEditor : function() {
      this.testCaseChain.chain(
         function(){
            this.htmlDocument.construct();
         }.bind( this ),
         function(){
            this.htmlDocument.editor = spy( this.htmlDocument.getEditor() );
            var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.MODIFY_DOCUMENT, actionType : AbstractDocument.Action.BOLD });
            this.webUIMessageBus.notifySubscribers( message );
            
            verify( this.htmlDocument.editor ).textBold();
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Event handling methods
   onDocumentError : function(){
      this.testCaseChain.callChain();
   },
   
   onDocumentReady : function(){
      this.testCaseChain.callChain();
   }   

});