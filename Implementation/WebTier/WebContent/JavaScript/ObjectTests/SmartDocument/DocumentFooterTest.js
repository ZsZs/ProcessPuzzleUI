window.DocumentFooterTest = new Class( {
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
      this.documentFooter;
      this.footerDefinition;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
        
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI );
      this.footerDefinition = this.documentDefinition.selectNode( "/smartDocumentDefinition/documentFooter" );
      this.documentFooter = new DocumentFooter( this.footerDefinition, this.bundle, null, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.documentFooter.getState() > DocumentElement.States.INITIALIZED ) this.documentFooter.destroy();
      this.documentFooter = null;
   },
   
   initialize_storesDefinitionElementAndInternationalization : function() {
      assertThat( this.documentFooter.getState(), equalTo( DocumentElement.States.INITIALIZED ));
      assertThat( this.documentFooter.getDefinitionElement(), not( nil() ));
      assertThat( this.documentFooter.getResourceBundle(), not( nil() ));
   },
   
   initialize_whenDefinitionElementOrInternationalizationIsNull_throwsException : function() {
      assertThat( this.instantiateHeaderWithoutArguments, raises( JsUnit.Failure ));
   },
   
   unmarshall_unmarshallsHeaderProperties : function() {
      this.documentFooter.unmarshall();
      assertThat( this.documentFooter.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   construct_constructsHeaderElement : function() {
      this.testCaseChain.chain(
         function(){ this.documentFooter.unmarshall(); this.documentFooter.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            assertThat( this.documentFooter.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
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
      new DocumentFooter();
   }

});