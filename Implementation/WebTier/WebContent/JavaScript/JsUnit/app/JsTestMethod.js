/*
* JsTestMethod
*/

var JsTestMethod = new Class({
   Extends : JsTestCase,
   Binds: ['onRunTestFinished', 'runTestMethod'],
   options : {
      className : null,
      componentName : "JsTestMethod"
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
      this.testObject = new this.testClass({ 
         onAfterEachTestReady : function( arguments ) { this.onAfterEachTestFinished( arguments ); }.bind( this ),
         onBeforeEachTestReady : function( arguments ) { this.onBeforeEachTestFinished( arguments ); }.bind( this ),
         onReady : function( arguments ) { this.onRunTestFinished( arguments ); }.bind( this ) 
      });
      this.parent();
   },
   
   //Properties
   getFullName : function() { return this.options.url ? this.options.url.toLowerCase() + ":" + this.getName() : this.getName(); },
   getName : function() { return this.testClassName + "." + this.name; },

   //Protected, private helper methods
   callAfterEachTest: function(){
      this.testObject.afterEachTest();
   }.protect(),
   
   callBeforeEachTest: function(){
      this.testObject.beforeEachTest();
   }.protect(),
   
   runTest: function(){
      var testMethod = eval( "this.testObject." + this.name );
      var testMethodOfTestObject = testMethod.bind( this.testObject );
      testMethodOfTestObject();
   }.protect(),   
});