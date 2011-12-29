var JsTestPage = new Class({
   Implements : [Events, Options],
   Binds : ['onTestCaseFinished', 'onTestSuiteFinished'],
   
   //Constructor
   initialize : function( url, testFrame, options ) {
      this.setOptions( options );
      this.currentTestFunctionIndex;
      this.errorCount = 0;
      this.failureCount = 0;
      this.listeners = new Array();
      this.running = false;
      this.successCount = 0;
      this.testClasses = new Array();
      this.testFrame = testFrame;
      this.testFunctions = new Array();
      this.testMethods = new Array();
      this.testSuiteChain = new Chain();
      this.url = url;
   },

   //Public accessors and mutators
   analyse : function(){
      this.determineTestClasses();
      this.determineTestFunctions();
   },
   
   getStatus : function( testName ) {
      if( this.testMethods.length == 0 ) return 'noTestsYet';
      if( this.running ) return 'running';
      if( this.errorCount > 0 ) return 'error';
      if( this.failureCount > 0 ) return 'failure';
      if( this.successCount > 0 ) return 'success';
      return 'ready';
   },
   
   listen : function( callback ) {
      this.listeners.include( callback );
   },
   
   nextTestFunction : function(){
      if( !this.currentTestFunctionIndex ) this.currentTestFunctionIndex = 0;

      if( this.currentTestFunctionIndex < this.testFunctions.length ) 
         return this.testFunctions[this.currentTestFunctionIndex++];
      else return null;
   },

   notify : function( event ) {
      for( var i = 0; i < this.listeners.length; i++ ){
         this.listeners[i].call( null, this, event );
      }
   },
   
   onTestCaseFinished : function( testCaseName, result ){
      this.fireEvent( 'testCaseFinished', [ testCaseName, result ] );
   },
   
   onTestSuiteFinished : function( testSuiteName ){
      this.fireEvent( 'testSuiteFinished', testSuiteName );
      this.testSuiteChain.callChain();
   },
   
   runTests : function(){
      this.notify( JsTestPage.READY_EVENT );
      var testClassRunner = new JsTestClassRunner( this.testClasses, { onTestCaseFinished : this.onTestCaseFinished, onTestSuiteFinished : this.onTestSuiteFinished });
      var testFunctionRunner = new JsTestFunctionRunner( this.testFunctions, { onTestCaseFinished : this.onTestCaseFinished, onTestSuiteFinished : this.onTestSuiteFinished });
      this.testSuiteChain.chain(
         testClassRunner.runTests,
         testFunctionRunner.runTests
      ).callChain();
   },
   
   totalNumberOfTestCases : function(){
      var totalNumberOfTestCases = 0;
      totalNumberOfTestCases += this.testFunctions.length;
      this.testClasses.each( function( testClassName, index ){
         totalNumberOfTestCases++;
      }, this );
      return totalNumberOfTestCases;
   },

   //Properties
   getTestFunctions : function() { return this.testFunctions; },
   getTestMethods : function() { return this.testMethods; },
   
   //Protected, private helper methods
   determineTestClasses : function(){
      var frameAnalyser = new JsTestFrameAnalyser( this.testFrame );
      frameAnalyser.getTestClassNames().each( function( className, index ){
         var testClass = eval( "this." + this.testFrame.name + "." + className );
         this.testClasses.include( testClass );
      }, this );
   }.protect(),
   
   determineTestFunctions : function(){
      var frameAnalyser = new JsTestFrameAnalyser( this.testFrame );
      var testFunctionNames = frameAnalyser.getTestFunctionNames();
      if( testFunctionNames ){
         testFunctionNames.each( function( functionName, index ){
            this.testFunctions.include( new JsTestFunction( this, functionName ));
         }, this );
      }
   }.protect(),
   
});

JsTestPage.STATUS_CHANGE_EVENT = "statusChange";
JsTestPage.READY_EVENT = "ready";
