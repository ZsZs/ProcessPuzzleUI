window.FormFieldTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
          { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
          { method : 'construct_createsDivWithLableAndSpan', isAsynchron : false }, 
          { method : 'construct_associatesEditorWithTheValueElement', isAsynchron : false }, 
          { method : 'destroy_destroysCreatedHtmlElements', isAsynchron : false }]
   },

   constants : {
      WEBUI_CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/sd:smartDocumentDefinition/sd:documentBody/sd:compositeElement/sd:formElement/sd:formField[@id='link']"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.documentContainerElement;
      this.documentContentResource;
      this.documentDefinition;
      this.formField;
      this.documentInternationalization;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.formField = new FormField( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR ), this.bundle, this.documentContentResource );
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.bundle.release();
      this.bundle = null;
      
      if( this.formField.getState() > DocumentElement.States.INITIALIZED ) this.formField.destroy();
      this.formField = null;
      this.documentContainerElement = null;
   },
   
   unmarshall_determinesElementProperties : function(){
      this.formField.unmarshall();
      
      //VERIFY:
      assertThat( this.formField.getBind(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@bind" )));
      assertThat( this.formField.getId(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@id" ) ));
      assertThat( this.formField.getLabel(), equalTo( this.bundle.getText( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@label" ) )));
   },
      
   construct_createsDivWithLableAndSpan : function(){
      //SETUP: see also setUp() method
      this.formField.unmarshall();
      
      //EXCERCISE:
      this.formField.construct( this.documentContainerElement, "bottom" );
      
      //VERIFY:
      assertThat( this.formField.getElementFactory, not( nil() ));
      assertThat( this.documentContainerElement.getChildren( 'div' ).length, equalTo( 1 ));
      assertThat( this.formField.getLabelElement().get( 'tag' ), equalTo( 'label' ));
      assertThat( this.formField.getValueElement().get( 'tag' ), equalTo( 'span' ));
   },
   
   construct_associatesEditorWithTheValueElement : function(){
      this.formField.unmarshall();
      this.formField.construct( this.documentContainerElement, "bottom" );
      
      assertThat( this.formField.getEditor().getSubjectElement(), equalTo( this.formField.getValueElement() ));
   },
   
   destroy_destroysCreatedHtmlElements : function(){
      this.formField.unmarshall();
      this.formField.construct( this.documentContainerElement, "bottom" );
      this.formField.destroy();
      
      assertThat( this.documentContainerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }
});