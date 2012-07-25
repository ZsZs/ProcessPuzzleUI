window.TableCellTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
         { method : 'construct_createsTdElement', isAsynchron : true },
         { method : 'construct_whenHrefIsValid_wrapsTextWithAnchor', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }]
   },

   constants : {
      CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/SampleDocumentContent.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_DEFINITION_SELECTOR : "/sd:smartDocumentDefinition/sd:documentBody/sd:compositeElement/sd:tableElement/sd:tableColumn[1]"
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
      this.bundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.cellData = this.documentContentResource.selectNode( "/pn:rss/pn:channel/pn:item[1]/pn:title" );
      
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR );
      this.tableCell = new TableCell( this.elementDefinition, this.bundle, this.cellData, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError,
         relaxedBinding : false
      });
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
            assertThat( this.documentContainerElement.getChildren( 'td a' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getChildren( 'td a' )[0].get( "text" ), equalTo( XmlResource.determineNodeText( this.cellData )));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenHrefIsValid_wrapsTextWithAnchor : function() {
      this.testCaseChain.chain(
         function(){ this.tableCell.unmarshall(); this.tableCell.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren( 'td a' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getChildren( 'td a' )[0].get( "text" ), equalTo( XmlResource.determineNodeText( this.cellData )));         
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