window.TableElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
         { method : 'unmarshall_determinesRowNumber', isAsynchron : false },
         { method : 'unmarshall_instantiatesAndUnmarshallsTableHeader', isAsynchron : false },
         { method : 'unmarshall_instantiatesAndUnmarshallsTableBody', isAsynchron : false },
         { method : 'construct_createsTableComponentElements', isAsynchron : true },
         { method : 'construct_constructsTableHeader', isAsynchron : true },
         { method : 'construct_constructsTableBody', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/smartDocumentDefinition/documentBody/compositeElement/tableElement"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.tableElement;
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
      this.tableElement = new TableElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR ), this.bundle, this.documentContentResource, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.tableElement.getState() > DocumentElement.States.INITIALIZED ) this.tableElement.destroy();
      this.tableElement = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_determinesElementProperties : function() {
      this.tableElement.unmarshall();
      
      //VERIFY:
      assertThat( this.tableElement.getBind(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@bind" )));
      assertThat( this.tableElement.getId(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@id" ) ));
      assertThat( this.tableElement.getMaxOccures(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@maxOccures" )));
      assertThat( this.tableElement.isEditable(), equalTo( parseBoolean( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@isEditable" ))));
   },
   
   unmarshall_determinesRowNumber : function() {
      this.tableElement.unmarshall();
      
      //VERIFY:
      assertThat( this.tableElement.getDataElementsNumber(), equalTo( this.documentContentResource.selectNodes( "//rss/channel/item" ).length ));
   },
   
   unmarshall_instantiatesAndUnmarshallsTableHeader : function() {
      this.tableElement.unmarshall();
      
      //VERIFY:
      assertThat( this.tableElement.getHeader(), JsHamcrest.Matchers.instanceOf( TableHeader ));
      assertThat( this.tableElement.getHeader().getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   unmarshall_instantiatesAndUnmarshallsTableBody : function() {
      this.tableElement.unmarshall();
      
      //VERIFY:
      assertThat( this.tableElement.getBody(), JsHamcrest.Matchers.instanceOf( TableBody ));
      assertThat( this.tableElement.getBody().getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   construct_createsTableComponentElements : function() {
      this.testCaseChain.chain(
         function(){ this.tableElement.unmarshall(); this.tableElement.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren( 'div table' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getElements( 'div table thead' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getElements( 'div table tbody' ).length, equalTo( 1 ));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsTableHeader : function() {
      this.testCaseChain.chain(
         function(){ this.tableElement.unmarshall(); this.tableElement.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.tableElement.getHeader().getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsTableBody : function() {
      this.testCaseChain.chain(
         function(){ this.tableElement.unmarshall(); this.tableElement.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.tableElement.getBody().getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.tableElement.unmarshall(); this.tableElement.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableElement.destroy();
            assertThat( this.documentContainerElement.getChildren( '*' ).length, equalTo( 0 ));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },

   onConstructionError : function(){
      this.testCaseChain.callChain();
   }
});