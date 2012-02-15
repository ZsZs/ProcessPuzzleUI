window.SmartDocumentTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDocumentError', 'onDocumentReady'],

   options : {
      testMethods : [
          { method : 'initialize_setsStateToInitialized', isAsynchron : false },
          { method : 'unmarshall_determinesDefintionProperties', isAsynchron : false },
          { method : 'unmarshall_determinesResources', isAsynchron : false },
          { method : 'unmarshall_unmarshallsHeaderBodyAndFooter', isAsynchron : false },
          { method : 'construct_constructsHeaderBodyAndFooter', isAsynchron : true }, 
          { method : 'construct_whenErrorOccured_revertsConstructionAndFiresError', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DEFINITION_NAME : "Test Smart Document",
      DEFINITION_DESCRIPTION : "This configuration supports testing Smart Document.",
      DEFINITION_VERSION : "0.5",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_DATA_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ERRONEOUS_DOCUMENT_DEFINITION_URI : "../SmartDocument/ErroneousDocumentDefinition.xml",
      LANGUAGE : "hu",
      RESOURCE_ITEMS_SELECTOR : "/smartDocumentDefinition/resources/styleSheets/styleSheet | " + 
                                "/smartDocumentDefinition/resources/images/image | " +
                                "/smartDocumentDefinition/resources/javaScripts/javaScript"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.callBackWasCalled = false;
      this.componentStateManager;
      this.doumentContainerElement;
      this.documentDefinition;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.smartDocument;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.componentStateManager = new ComponentStateManager();
      this.messageBus = new WebUIMessageBus();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI );
      this.smartDocument = new SmartDocument( 
         this.resourceBundle, 
         {  documentContainerId : this.constants.DOCUMENT_CONTAINER_ID, 
            documentDefinitionUri : this.constants.DOCUMENT_DEFINITION_URI, 
            documentContentUri : this.constants.DOCUMENT_DATA_URI, 
            onDocumentReady : this.onDocumentReady, 
            onDocumentError : this.onDocumentError 
         });
      this.doumentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
      callBackWasCalled = false;
   },
   
   afterEachTest : function (){
      this.componentStateManager.reset();
      this.messageBus.tearDown();
      if( this.smartDocument.getState() > AbstractDocument.States.INITIALIZED ) this.smartDocument.destroy();
      this.smartDocument = null;
      this.doumentContainerElement = null;
   },
   
   initialize_setsStateToInitialized : function() {
      assertThat( this.smartDocument, not( nil() ));
      assertThat( this.smartDocument.getDocumentDefinition(), not( nil() ));
      assertThat( instanceOf( this.smartDocument.getDocumentDefinition(), XmlResource ), is( true ));

      assertThat( this.smartDocument.getDocumentContent(), not( nil() ));
      assertThat( instanceOf( this.smartDocument.getDocumentContent(), XmlResource ), is( true ));
      
      assertThat( this.smartDocument.getState(), equalTo( AbstractDocument.States.INITIALIZED ));
   },
   
   unmarshall_determinesDefintionProperties : function() {
      this.smartDocument.unmarshall();
      
      assertThat( this.smartDocument.getName(), equalTo( this.constants.DEFINITION_NAME ));
      assertThat( this.smartDocument.getDescription(), equalTo( this.constants.DEFINITION_DESCRIPTION ));
      assertThat( this.smartDocument.getVersion(), equalTo( this.constants.DEFINITION_VERSION ));
   },
   
   unmarshall_determinesResources : function() {
      this.smartDocument.unmarshall();
      
      assertThat( this.smartDocument.getResources().getResources().size(), equalTo( this.documentDefinition.selectNodes( this.constants.RESOURCE_ITEMS_SELECTOR ).length ));
   },
   
   unmarshall_unmarshallsHeaderBodyAndFooter : function() {
      this.smartDocument.unmarshall();
      
      assertThat( this.smartDocument.getHeader().getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
      assertThat( this.smartDocument.getBody().getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
      assertThat( this.smartDocument.getFooter().getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   construct_constructsHeaderBodyAndFooter : function() {
      this.testCaseChain.chain(
         function(){
            this.smartDocument.unmarshall();
            this.smartDocument.construct();
         }.bind( this ),
         function(){
            assertThat( this.smartDocument.getHeader().getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.smartDocument.getBody().getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.smartDocument.getFooter().getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.smartDocument.getContainerElement(), equalTo( this.doumentContainerElement ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenErrorOccured_revertsConstructionAndFiresError : function() {
      this.testCaseChain.chain(
         function(){
            this.smartDocument = new SmartDocument( 
                  this.resourceBundle, 
                  {  documentContainerId : this.constants.DOCUMENT_CONTAINER_ID, 
                     documentDefinitionUri : this.constants.ERRONEOUS_DOCUMENT_DEFINITION_URI, 
                     documentContentUri : this.constants.DOCUMENT_DATA_URI, 
                     onDocumentReady : this.onDocumentReady, 
                     onDocumentError : this.onDocumentError 
                  });
            this.smartDocument.unmarshall();
            this.smartDocument.construct();
         }.bind( this ),
         function(){
            assertThat( this.smartDocument.getState(), equalTo( AbstractDocument.States.INITIALIZED ));
            assertThat( this.smartDocument.getHeader(), is( nil() ));
            assertThat( this.smartDocument.getBody(), is( nil() ));
            assertThat( this.smartDocument.getFooter(), is( nil() ));
            assertThat( this.doumentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onDocumentError : function(){
      this.testCaseChain.callChain();
   },

   onDocumentReady : function(){
      this.testCaseChain.callChain();
   }

});