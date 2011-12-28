
JsHamcrest.Integration.JsUnit();
JsMockito.Integration.JsUnit();   

var JsTestClass = new Class({
   Implements: [Events, Options],
   options: {
      testMethods: []
   },
   
   initialize: function( options ){
      this.setOptions( options );
   },
   
   afterAllTests: function(){
      //Abstract method, should be overwritten by test the test class
   },
   
   afterEachTest: function(){
      //Abstract method, should be overwritten by test the test class
   },
   
   beforeAllTests: function(){
      //Abstract method, should be overwritten by test the test class
   },
   
   beforeEachTest: function(){
      //Abstract method, should be overwritten by test the test class
   },
   
   //Properties
   getTestMethods: function() { return this.options.testMethods; },
   isJsTestClass: function() { return true; },
   
   //Protected, private helper methods
   testMethodReady: function( testMethod ){
      this.fireEvent( 'ready', testMethod );      
   }
         
});

