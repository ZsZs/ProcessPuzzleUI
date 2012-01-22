var TestClassTemplate = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : 
         [{ method : 'synchronTest', isAsynchron : false },
          { method : 'asynchronTestOne', isAsynchron : true }, 
          { method : 'asynchronTestTwo', isAsynchron : true }]
   },

   constants : {
   },
   
   initialize : function( options ) {
      this.setOptions( options );
   },   

   beforeEachTest : function(){
   },
   
   afterEachTest : function (){
   },
   
   synchronTest : function() {
      //EXCERCISE:
      
      //VERIFY:
   },
   
   asynchronTestOne : function() {
      this.testCaseChain.chain(
         function(){
            //EXCERCISE:
         }.bind( this ),
         function(){
            //VERIFY:
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   asynchronTestOne : function() {
      this.testCaseChain.chain(
         function(){
            //EXCERCISE:
         }.bind( this ),
         function(){
            //VERIFY:
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});