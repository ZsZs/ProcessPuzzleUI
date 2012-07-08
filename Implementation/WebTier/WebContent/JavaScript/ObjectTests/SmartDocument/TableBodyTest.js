window.TableBodyTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_instantiatesAndUnmarshallsTableRows', isAsynchron : false },
         { method : 'construct_createsTbodyElement', isAsynchron : true },
         { method : 'construct_constructsTableRows', isAsynchron : true },
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
      this.tableBody;
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
      this.dataSet = this.documentContentResource.selectNodes( "//rss/channel/item" );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR );
      
      this.tableHeader = new TableHeader( this.elementDefinition, this.bundle, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.tableHeader.unmarshall();
      this.tableBody = new TableBody( this.elementDefinition, this.bundle, this.dataSet, this.tableHeader.getColumnHeaders(), { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.tableBody.getState() > DocumentElement.States.INITIALIZED ) this.tableBody.destroy();
      this.tableBody = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_instantiatesAndUnmarshallsTableRows : function() {
      this.tableBody.unmarshall();
      
      //VERIFY:
      assertThat( this.tableBody.getRows().size(), equalTo( this.documentContentResource.selectNodes( "//rss/channel/item" ).length ));
      this.tableBody.getRows().each( function( row, index ){
         assertThat( row.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
      }.bind( this ));
   },
      
   construct_createsTbodyElement : function() {
      this.testCaseChain.chain(
         function(){ this.tableBody.unmarshall(); this.tableBody.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.tableBody.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.documentContainerElement.getElements( 'tbody' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getElements( 'tbody tr' ).length, equalTo( this.tableBody.getRows().size() ));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsTableRows : function() {
      this.testCaseChain.chain(
         function(){ this.tableBody.unmarshall(); this.tableBody.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableBody.getRows().each( function( row, index ){
               assertThat( row.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            }.bind( this ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.tableBody.unmarshall(); this.tableBody.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableBody.destroy(); 
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