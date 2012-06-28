window.TableCellTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
         { method : 'construct_createsTdElement', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/smartDocumentDefinition/documentBody/compositeElement/tableElement/tableColumn[1]"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.tableCell;
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
      this.bundle.load( new Locale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.cellData = this.documentContentResource.selectNode( "//rss/channel/item[1]/title" );
      
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR );
      this.tableCell = new TableCell( this.elementDefinition, this.bundle, this.cellData, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.tableCell.getState() > DocumentElement.States.INITIALIZED ) this.tableCell.destroy();
      this.tableCell = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_determinesElementProperties : function() {
      this.tableCell.unmarshall();
      
      //VERIFY:
      assertThat( this.tableCell.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   construct_createsTdElement : function() {
      this.testCaseChain.chain(
         function(){ this.tableCell.unmarshall(); this.tableCell.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren( 'td' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getChildren( 'td' )[0].get( "text" ), equalTo( XmlResource.determineNodeText( this.cellData )));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.tableCell.unmarshall(); this.tableCell.construct( this.documentContainerElement, "bottom" ); this.tableCell.destroy(); }.bind( this ),
         function(){
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