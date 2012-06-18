var JsTestClass = new Class({
   Implements: [Events, Options],
   options: {
      componentName: "JsTestClass",
      testCase: null,
      testMethods: []
   },
   
   initialize: function( options ){
      this.setOptions( options );
      this.testCaseChain = new Chain();
      this.tracer;
      
      this.setUp();
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
   debug : function( arguments ){
      this.tracer.debug( arguments );
   }.protect(),
   
   inform : function( arguments ){
      this.tracer.inform( arguments );
   }.protect(),
   
   setUp : function(){
      this.tracer = top.tracer;
   }.protect(),
   
   testMethodReady: function( error ){
      this.fireEvent( 'ready', error );      
   }.protect(),
         
   warn : function( arguments ){
      this.tracer.warn( arguments );
   }.protect()
   
});

