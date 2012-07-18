window.TableRowTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_instantiatesAndUnmarshallsTableCells', isAsynchron : false },
         { method : 'construct_createsTrElement', isAsynchron : true },
         { method : 'construct_constructsTableCells', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/sd:smartDocumentDefinition/sd:documentBody/sd:compositeElement/sd:tableElement"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.tableRow;
      this.documentContentResource;
      this.documentDefinition;
      this.elementDefinition;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.rowData = this.documentContentResource.selectNode( "/rss/channel/item[1]" );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR );
      
      this.tableHeader = new TableHeader( this.elementDefinition, this.bundle, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.tableHeader.unmarshall();
      
      this.tableRow = new TableRow( this.elementDefinition, this.bundle, this.rowData, this.tableHeader.getColumnHeaders(), { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.tableRow.getState() > DocumentElement.States.INITIALIZED ) this.tableRow.destroy();
      this.tableRow = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_instantiatesAndUnmarshallsTableCells : function() {
      this.tableRow.unmarshall();
      
      //VERIFY:
      assertThat( this.tableRow.getTableCells().size(), equalTo( this.documentDefinition.selectNodes( this.constants.ELEMENT_DEFINITION_SELECTOR + "/tableColumn" ).length ));
      this.tableRow.getTableCells().each( function( tableCell, index ){
         assertThat( tableCell.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
      }.bind( this ));
   },
      
   construct_createsTrElement : function() {
      this.testCaseChain.chain(
         function(){ this.tableRow.unmarshall(); this.tableRow.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.tableRow.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.documentContainerElement.getElements( 'tr' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getElements( 'tr td' ).length, equalTo( this.tableRow.getTableCells().size() ));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsTableCells : function() {
      this.testCaseChain.chain(
         function(){ this.tableRow.unmarshall(); this.tableRow.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableRow.getTableCells().each( function( tableCell, index ){
               assertThat( tableCell.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            }.bind( this ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.tableRow.unmarshall(); this.tableRow.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            this.tableRow.destroy(); 
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