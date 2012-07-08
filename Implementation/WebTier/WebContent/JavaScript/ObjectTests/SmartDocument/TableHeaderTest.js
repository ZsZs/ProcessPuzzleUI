window.TableHeaderTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_instantiatesAndUnmarshallsColumnHeaders', isAsynchron : false },
         { method : 'construct_createsTheadElement', isAsynchron : true },
         { method : 'construct_constructsColumnHeaders', isAsynchron : true },
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
      this.tableHeader;
      this.documentContentResource;
      this.documentDefinition;
      this.elementDefinition;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR );
      this.tableHeader = new TableHeader( this.elementDefinition, this.bundle, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.tableHeader.getState() > DocumentElement.States.INITIALIZED ) this.tableHeader.destroy();
      this.tableHeader = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_instantiatesAndUnmarshallsColumnHeaders : function() {
      this.tableHeader.unmarshall();
      
      //VERIFY:
      assertThat( this.tableHeader.getColumnHeaders().size(), equalTo( this.documentDefinition.selectNodes( this.constants.ELEMENT_DEFINITION_SELECTOR + "/tableColumn" ).length ));
      this.tableHeader.getColumnHeaders().each( function( columnHeader, index ){
         assertThat( columnHeader.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
      }.bind( this ));
   },
      
   construct_createsTheadElement : function() {
      this.testCaseChain.chain(
         function(){ this.tableHeader.unmarshall(); this.tableHeader.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.tableHeader.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.documentContainerElement.getElements( 'thead' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getElements( 'thead tr' ).length, equalTo( 1 ));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsColumnHeaders : function() {
      this.testCaseChain.chain(
         function(){ this.tableHeader.unmarshall(); this.tableHeader.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableHeader.getColumnHeaders().each( function( columnHeader, index ){
               assertThat( columnHeader.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            }.bind( this ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.tableHeader.unmarshall(); this.tableHeader.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableHeader.destroy(); 
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