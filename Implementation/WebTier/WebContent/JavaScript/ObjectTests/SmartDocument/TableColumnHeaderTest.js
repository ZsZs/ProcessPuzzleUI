window.TableColumnHeaderTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
         { method : 'construct_createsThElement', isAsynchron : true },
         { method : 'construct_constructsTableColumnHeaders', isAsynchron : true },
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
      this.columnHeader;
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
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_SELECTOR );
      this.columnHeader = new TableColumnHeader( this.elementDefinition, this.bundle, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      if( this.columnHeader.getState() > DocumentElement.States.INITIALIZED ) this.columnHeader.destroy();
      this.columnHeader = null;        
      this.documentContainerElement = null;
   },
   
   unmarshall_determinesElementProperties : function() {
      this.columnHeader.unmarshall();
      
      //VERIFY:
      assertThat( this.columnHeader.getBind(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@bind" )));
      assertThat( this.columnHeader.getLabel(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_SELECTOR + "/@label" ) ));
   },
   
   construct_createsThElement : function() {
      this.testCaseChain.chain(
         function(){ this.columnHeader.unmarshall(); this.columnHeader.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren( 'th' ).length, equalTo( 1 ));         
            assertThat( this.documentContainerElement.getChildren( 'th' )[0].get( 'text'), equalTo( this.bundle.getText( this.columnHeader.getLabel() )));         
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsTableColumnHeaders : function() {
      this.testCaseChain.chain(
         function(){ this.columnHeader.unmarshall(); this.columnHeader.construct( this.documentContainerElement, "bottom" ); }.bind( this ),
         function(){
            assertThat( this.columnHeader.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.columnHeader.unmarshall(); this.columnHeader.construct( this.documentContainerElement, "bottom" ); this.columnHeader.destroy(); }.bind( this ),
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