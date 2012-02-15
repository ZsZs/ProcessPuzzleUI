window.FormElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
          { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
          { method : 'construct_createsFormElement', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/smartDocumentDefinition/documentBody/compositeElement/formElement"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.formElement;
      this.documentContentResource;
      this.documentDefinition;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new Locale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.formElement = new FormElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR ), this.bundle, this.documentContentResource );
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.formElement.getState() > DocumentElement.States.INITIALIZED ) this.formElement.destroy();
      this.formElement = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_determinesElementProperties : function() {
      this.formElement.unmarshall();
      
      //VERIFY:
      assertThat( this.formElement.getBind(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@bind" )));
      assertThat( this.formElement.getId(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@id" ) ));
      assertThat( this.formElement.getMethod(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@method" ) ));
   },
   
   construct_createsFormElement : function() {
      this.formElement.unmarshall();
      this.formElement.construct( this.documentContainerElement, "bottom" );
      
      assertThat( this.documentContainerElement.getChildren( 'form' ).length, equalTo( 1 ));         
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});