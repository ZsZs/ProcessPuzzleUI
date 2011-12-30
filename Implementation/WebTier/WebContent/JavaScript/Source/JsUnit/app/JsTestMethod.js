/*
* JsTestMethod
*/

var JsTestMethod = new Class({
   Extends : JsTestCase,
   Binds: ['runTestMethod'],
   options : {
   },
   
   //Constructor
   initialize : function( testClass, testMethodProperties, options ){
      this.parent( options );
      this.asynchron = testMethodProperties['isAsynchron'] ? testMethodProperties['isAsynchron'] : false; 
      this.name = testMethodProperties['method'];
      this.testClass = testClass;
      this.testObject;
   },
   
   //Public accessors and mutators   
   run : function(){
      this.testObject = new this.testClass({ onReady : this.onRunTestFinished });
      this.parent();
   },
   
   //Properties

   //Protected, private helper methods
   callAfterEachTest: function(){
      this.testObject.afterEachTest();
      this.parent();
   }.protect(),
   
   callBeforeEachTest: function(){
      this.testObject.beforeEachTest();
      this.parent();
   }.protect(),
   
   runTest: function(){
      testMethod = eval( "this.testObject." + this.name );
      testMethod();
   }.protect(),   
});