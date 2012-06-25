window.CompositeDataElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructionError', 'onConstructed'],

   options : {
      testMethods : [
          { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
          { method : 'unmarshall_whenMaxOccuresIsGiven_instantiatesSiblingElements', isAsynchron : false },
          { method : 'construct_whenMaxOccuresIsGiven_constructsSiblingElements', isAsynchron : true },
          { method : 'destroy_whenConstructed_destroysHtmlElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/smartDocumentDefinition/documentBody/compositeElement/compositeDataElement",
      NESTED_COMPOSITE_ELEMENT_NAME : "bodyWrapper",
      NESTED_SIMPLE_ELEMENT_NAME : "copyright"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.compositeDataElement;
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
      this.compositeDataElement = new CompositeDataElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR ), this.bundle, this.documentContentResource, 
         { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError }
      );
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.compositeDataElement.getState() > DocumentElement.States.INITIALIZED ) this.compositeDataElement.destroy();
      this.compositeDataElement = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_determinesElementProperties : function() {
      this.compositeDataElement.unmarshall();
      assertThat( this.compositeDataElement.getBind(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@bind" )));
      assertThat( this.compositeDataElement.getMaxOccures(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@maxOccures" ) ));
      assertThat( this.compositeDataElement.getMinOccures(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@minOccures" ) ));
   },
   
   unmarshall_whenMaxOccuresIsGiven_instantiatesSiblingElements : function() {
      this.compositeDataElement.unmarshall();
      assertThat( this.compositeDataElement.getSiblings().size(), equalTo( this.documentContentResource.selectNodes( "/rss/channel/item" ).length -1 ));
   },
   
   construct_whenMaxOccuresIsGiven_constructsSiblingElements : function() {
      this.testCaseChain.chain(
         function(){
            this.compositeDataElement.unmarshall();
            this.compositeDataElement.construct( this.documentContainerElement, 'bottom' );
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren( 'ul' ).length, equalTo( this.documentContentResource.selectNodes( "/rss/channel/item" ).length ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenConstructed_destroysHtmlElements : function() {
      this.testCaseChain.chain(
         function(){
            this.compositeDataElement.unmarshall();
            this.compositeDataElement.construct( this.documentContainerElement, 'bottom' );
         }.bind( this ),
         function(){
            this.compositeDataElement.destroy();
            assertThat( this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructionError : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   }

});