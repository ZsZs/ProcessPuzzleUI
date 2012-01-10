/*
* JsTestMethod
*/

var JsTestMethod = new Class({
   Extends : JsTestCase,
   Binds: ['runTestMethod'],
   options : {
      className : null
   },
   
   //Constructor
   initialize : function( testClassName, testClass, testMethodProperties, options ){
      this.parent( testMethodProperties['method'], options );
      this.asynchron = testMethodProperties['isAsynchron'] ? testMethodProperties['isAsynchron'] : false; 
      this.testClass = testClass;
      this.testClassName = testClassName;
      this.testObject;
   },
   
   //Public accessors and mutators   
   run : function(){
      this.testObject = new this.testClass({ onReady : this.onRunTestFinished });
      this.parent();
   },
   
   //Properties
   getFullName : function() { return this.options.url ? this.options.url + ":" + this.getName() : this.getName(); },
   getName : function() { return this.testClassName + "." + this.name; },

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