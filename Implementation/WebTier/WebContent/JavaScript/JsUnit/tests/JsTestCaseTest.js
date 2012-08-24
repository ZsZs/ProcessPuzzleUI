window.JsTestCaseTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],
   options: {
      testMethods: [
         { method: 'asynchronuousTest', isAsynchron: true }, 
         { method: 'timedOutTest', isAsynchron: true }, 
         { method: 'failedTest' },
         { method: 'successTest' }
      ]
   },
   
   initialize: function( options ){
      this.setOptions( options );
   },

   //Test cases
   asynchronuousTest: function(){
      this.testMethodReady();
   },
   
   timedOutTest: function(){
      this.delayedMethod.delay( 5000 );
   },
   
   failedTest: function(){
      assertThat( false, is( true ));
   },
   
   successTest: function(){
      assertThat( false, is( false ));
   },
   
   //Protected, private methods
   delayedMethod: function(){
   }.protect()
   
});
