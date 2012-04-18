window.DocumentHeaderTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
          { method : 'initialize_storesDefinitionElementAndInternationalization', isAsynchron : false },
          { method : 'initialize_whenDefinitionElementOrInternationalizationIsNull_throwsException', isAsynchron : false },
          { method : 'unmarshall_unmarshallsHeaderProperties', isAsynchron : false }, 
          { method : 'construct_constructsHeaderElement', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../WebUIController/SampleConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "smartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.documentContainerElement;
      this.documentDefinition;
      this.documentHeader;
      this.headerDefinition;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new Locale({ language : "en" }) );
        
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI );
      this.headerDefinition = this.documentDefinition.selectNode( "/smartDocumentDefinition/documentHeader" );
      this.documentHeader = new DocumentHeader( this.headerDefinition, this.bundle, null, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.documentHeader.getState() > DocumentElement.States.INITIALIZED ) this.documentHeader.destroy();
      this.documentHeader = null;
   },
   
   initialize_storesDefinitionElementAndInternationalization : function() {
      assertThat( this.documentHeader.getState(), equalTo( DocumentElement.States.INITIALIZED ));
      assertThat( this.documentHeader.getDefinitionElement(), not( nil() ));
      assertThat( this.documentHeader.getResourceBundle(), not( nil() ));
   },
   
   initialize_whenDefinitionElementOrInternationalizationIsNull_throwsException : function() {
      assertThat( this.instantiateHeaderWithoutArguments, raises( JsUnit.Failure ));
   },
   
   unmarshall_unmarshallsHeaderProperties : function() {
      this.documentHeader.unmarshall();
      assertThat( this.documentHeader.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   construct_constructsHeaderElement : function() {
      this.testCaseChain.chain(
         function(){ this.documentHeader.unmarshall(); this.documentHeader.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            assertThat( this.documentHeader.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function( error ){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methods
   instantiateHeaderWithoutArguments : function(){
      new DocumentHeader();
   }

});