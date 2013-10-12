window.WebServiceClientTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDocumentReady', 'onDocumentError'],

   options : {
      testMethods : [
          { method : 'initialize_', isAsynchron : false }]
   },

   constants : {
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.webServiceClient;
   },   

   beforeEachTest : function(){
      this.webServiceClient = new WebServiceClient({ });
   },
   
   afterEachTest : function (){
      this.webServiceClient = null;
   },
   
   initialize_ : function() {
      assertThat( this.webServiceClient, JsHamcrest.Matchers.instanceOf( WebServiceClient ));
   }
   
});
