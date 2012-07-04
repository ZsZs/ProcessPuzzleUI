window.ImageElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesElementProperties', isAsynchron : false }]
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
      
   },   

   beforeEachTest : function(){
   },
   
   afterEachTest : function (){
   },
   
   unmarshall_determinesElementProperties : function() {
      this.tableCell.unmarshall();
      
      //VERIFY:
      assertThat( this.tableCell.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },

   onConstructionError : function(){
      this.testCaseChain.callChain();
   }
});