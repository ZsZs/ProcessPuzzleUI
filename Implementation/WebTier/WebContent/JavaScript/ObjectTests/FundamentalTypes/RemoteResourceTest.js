window.RemoteResourceTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : 
         [{ method : 'retrieve_whenCSSExists_firesSuccessEvent', isAsynchron : true},
          { method : 'retrieve_whenJavaScriptExists_firesSuccessEvent', isAsynchron : true}, 
          { method : 'retrieve_whenResourceNotExists_firesFailureEvent', isAsynchron : true }]
   },

   constants : {
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.remoteResource;
      this.onFailureWasCalled = false;
      this.onSuccessWasCalled = false;
   },

   beforeEachTest : function(){
      this.inform( "beforeEachTest" );
      this.onFailureWasCalled = false;
      this.onSuccessWasCalled = false;
   },
   
   afterEachTest : function (){
      this.remoteResource.cancel();
      this.remoteResource = null;
      this.inform( "afterEachTest" );
   },
   
   retrieve_whenCSSExists_firesSuccessEvent : function() {
      this.testCaseChain.chain(
         function(){
            this.remoteResource = new RemoteResource( "../FundamentalTypes/DummyCSS.css", { onFailure: this.onFailure, onSuccess: this.onSuccess });
            this.remoteResource.retrieve();
         }.bind( this ),
         function(){
            assertThat( this.onSuccessWasCalled, is( true )); 
            assertThat( this.onFailureWasCalled, is( false )); 
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   retrieve_whenJavaScriptExists_firesSuccessEvent : function() {
      this.testCaseChain.chain(
         function(){
            this.remoteResource = new RemoteResource( "../FundamentalTypes/RemoteResourceTest.js", { onFailure: this.onFailure, onSuccess: this.onSuccess });
            this.remoteResource.retrieve();
         }.bind( this ),
         function(){
            assertThat( this.onSuccessWasCalled, is( true )); 
            assertThat( this.onFailureWasCalled, is( false )); 
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   retrieve_whenResourceNotExists_firesFailureEvent : function() {
      this.testCaseChain.chain(
         function(){
            this.remoteResource = new RemoteResource( "NoneExistingResource.js", { onFailure: this.onFailure, onSuccess: this.onSuccess });
            this.remoteResource.retrieve();
         }.bind( this ),
         function(){
            assertThat( this.onSuccessWasCalled, is( false )); 
            assertThat( this.onFailureWasCalled, is( true )); 
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onSuccess : function(){
      this.onSuccessWasCalled = true;
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.onFailureWasCalled = true;
      this.testCaseChain.callChain();
   }

});