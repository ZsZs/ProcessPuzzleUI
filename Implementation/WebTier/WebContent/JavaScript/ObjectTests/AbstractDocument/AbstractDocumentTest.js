window.AbstractDocumentTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDocumentReady', 'onDocumentError'],

   options : {
      testMethods : [
          { method : 'initialize_determinesFieldValues', isAsynchron : false },
          { method : 'initialize_loadsDocumentDefinitionAndContent', isAsynchron : false },
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'unmarshall_whenSpecified_instantiatesAndUnmarshallsResources', isAsynchron : false },
          { method : 'construct_instantiatesElementFactoryAndDocumentEditor', isAsynchron : true }, 
          { method : 'construct_subscribesToMenuSelectedEvents', isAsynchron : true }, 
          { method : 'destroy_whenUnmarshalled_resetsProperties', isAsynchron : false }]
   },

   constants : {
      WEBUI_CONFIGURATION_URI : "../HtmlDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "abstractDocument",
      DOCUMENT_CONTENT_URI : "../AbstractDocument/HtmlDocument_en.html",
      DOCUMENT_DEFINITION_URI : "../AbstractDocument/HtmlDocumentDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.abstractDocument;
      this.bundle;
      this.documentContainerElement;
      this.documentContentResource;
      this.documentDefinition;
      this.documentInternationalization;
      this.webUIConfiguration;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/HtmlDocument'" } );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/HtmlDocument'" } );
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
      this.abstractDocument = new AbstractDocument( this.bundle, { 
         documentContentUri : this.constants.DOCUMENT_CONTENT_URI, 
         documentContainerId : this.constants.DOCUMENT_CONTAINER_ID,
         documentDefinitionUri : this.constants.DOCUMENT_DEFINITION_URI, 
         rootElementName : "/htmlDocumentDefinition",
         onDocumentError : this.onDocumentError,
         onDocumentReady : this.onDocumentReady });
   },
   
   afterEachTest : function (){
      this.bundle.release();
      this.bundle = null;
      
      if( this.abstractDocument.getState() > AbstractDocument.States.INITIALIZED ) this.abstractDocument.destroy();
      this.abstractDocument = null;
      this.documentContainerElement = null;
   },
   
   initialize_determinesFieldValues : function() {
      assertThat( this.abstractDocument.getLogger(), equalTo( this.webUILogger ));
      assertThat( this.abstractDocument.getMessageBus(), equalTo( this.webUIMessageBus ));
   },
   
   initialize_loadsDocumentDefinitionAndContent : function() {
      assertThat( this.abstractDocument.getState(), equalTo( AbstractDocument.States.INITIALIZED ));
      assertThat( instanceOf( this.abstractDocument.getDocumentDefinition(), XmlResource ), is( true ));
      assertThat( instanceOf( this.abstractDocument.getDocumentContent(), XmlResource ), is( true ));
   },
   
   unmarshall_determinesProperties : function() {
      this.abstractDocument.unmarshall();
      
      assertThat( this.abstractDocument.getState(), equalTo( AbstractDocument.States.UNMARSHALLED ));
      assertThat( this.abstractDocument.getDescription(), equalTo( this.documentDefinition.selectNodeText( "/htmlDocumentDefinition/description" )));
      assertThat( this.abstractDocument.getHandleMenuSelectedEvents(), equalTo( parseBoolean( this.documentDefinition.selectNodeText( "/htmlDocumentDefinition/handleMenuSelectedEvents" ))));
      assertThat( this.abstractDocument.getName(), equalTo( this.documentDefinition.selectNodeText( "/htmlDocumentDefinition/name" )));
      assertThat( this.abstractDocument.getVersion(), equalTo( this.documentDefinition.selectNodeText( "/htmlDocumentDefinition/version" )));
      assertThat( this.abstractDocument.contentUri, equalTo( this.documentDefinition.selectNodeText( "/htmlDocumentDefinition/contentUri" )));
   },
   
   unmarshall_whenSpecified_instantiatesAndUnmarshallsResources : function() {
      this.abstractDocument.unmarshall();
      
      assertThat( this.abstractDocument.getResources(), not( nil() ));
   },
   
   construct_instantiatesElementFactoryAndDocumentEditor : function() {
      this.testCaseChain.chain(
         function(){ this.abstractDocument.unmarshall(); this.abstractDocument.construct(); }.bind( this ),
         function(){
            assertThat( instanceOf( this.abstractDocument.getEditor(), DocumentEditor), is( true ));
            assertThat( instanceOf( this.abstractDocument.getHtmlElementFactory(), WidgetElementFactory ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_subscribesToMenuSelectedEvents : function() {
      this.testCaseChain.chain(
         function(){ this.abstractDocument.unmarshall(); this.abstractDocument.construct(); }.bind( this ),
         function(){
            assertThat( this.webUIMessageBus.getSubscribersToMessage( MenuSelectedMessage ).contains( this.abstractDocument.webUIMessageHandler ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenUnmarshalled_resetsProperties : function() {
      this.abstractDocument.unmarshall();
      this.abstractDocument.destroy();

      assertThat( this.abstractDocument.getState(), equalTo( AbstractDocument.States.INITIALIZED ));
      assertThat( this.abstractDocument.getDescription(), nil() );
      assertThat( this.abstractDocument.getName(), nil() );
      assertThat( this.abstractDocument.getVersion(), nil() );
   },
   
   onDocumentReady : function(){
      this.testCaseChain.callChain();
   },
   
   onDocumentError : function( error ){
      this.testCaseChain.callChain();
   }

});
