var JsTestPage = new Class({
   Implements : [Events, Options],
   Binds : ['discoverTestSuites', 'onTestCaseFinished', 'onTestCaseStarted', 'onTestRunnerFinished', 'onTestRunnerStarted'],
   
   options : {
      verbose : false
   },
   
   //Constructor
   initialize : function( url, testFrame, options ) {
      this.setOptions( options );
      this.currentTestFunctionIndex;
      this.errorCount = 0;
      this.failureCount = 0;
      this.listeners = new Array();
      this.running = false;
      this.state;
      this.successCount = 0;
      this.testClassRunner;
      this.testFrame = testFrame;
      this.testFunctionRunner;
      this.testRunnerChain = new Chain();
      this.url = url;
      
      this.setUp();
   },

   //Public accessors and mutators
//   getStatus : function( testName ) {
//      if( this.testMethods.length == 0 ) return 'noTestsYet';
//      if( this.running ) return 'running';
//      if( this.errorCount > 0 ) return 'error';
//      if( this.failureCount > 0 ) return 'failure';
//      if( this.successCount > 0 ) return 'success';
//      return 'ready';
//   },
//   
//   listen : function( callback ) {
//      this.listeners.include( callback );
//   },
//   
//   nextTestFunction : function(){
//      if( !this.currentTestFunctionIndex ) this.currentTestFunctionIndex = 0;
//
//      if( this.currentTestFunctionIndex < this.testFunctions.length ) 
//         return this.testFunctions[this.currentTestFunctionIndex++];
//      else return null;
//   },
//
//   notify : function( event ) {
//      for( var i = 0; i < this.listeners.length; i++ ){
//         this.listeners[i].call( null, this, event );
//      }
//   },
//   
   onTestCaseFinished : function( testResult ){
      this.fireEvent( 'testCaseFinished', testResult );
   },
   
   onTestCaseStarted : function( testResult ){
      this.fireEvent( 'testCaseStarted', testResult );
   },
   
   onTestRunnerFinished : function(){
      if( this.state == JsTestPage.Status.RUNNING_TEST_METHODS ){
         this.testRunnerChain.callChain();         
      }else this.fireEvent( 'testPageFinished', this );
   },
   
   onTestRunnerStarted : function(){
      if( this.state == JsTestPage.Status.INITIALIZED ) {
         this.calculateTotalNumberOfTestCases();
         this.state = JsTestPage.Status.RUNNING_TEST_METHODS;
         this.fireEvent( 'testPageStarted', this );
      }else if( this.state == JsTestPage.Status.RUNNING_TEST_METHODS ) 
         this.state = JsTestPage.Status.RUNNING_TEST_FUNCTIONS;
   },
   
   runTests : function(){
      this.testRunnerChain.callChain();
   },
   
   //Properties
   getTotalNumberOfTestCases : function() { return this.totalNumberOfTestCases; },
   getUrl : function() { return this.url; },
   
   //Protected, private helper methods
   calculateTotalNumberOfTestCases : function(){
      this.totalNumberOfTestCases = this.testClassRunner.getTestCases().length;
      this.totalNumberOfTestCases += this.testFunctionRunner.getTestCases().length;
      return this.totalNumberOfTestCases;
   }.protect(),
   
   configureTestRunners : function(){
      this.testClassRunner.configure();
      this.testFunctionRunner.configure();
      this.testRunnerChain.callChain();
   }.protect(),
   
   discoverTestSuites : function( self ){
      if( this.testFrame.suite ){
         var allegedSuite = this.testFrame.suite();
         if( allegedSuite.isJsUnitTestSuite ){
            this.fireEvent( 'addTestSuite', allegedSuite );
         }
      }
      this.testRunnerChain.callChain();
   }.protect(),

   setUp : function(){
      this.testClassRunner = new JsTestClassRunner( this.testFrame, { 
         onTestCaseReady : function( arguments ){ this.onTestCaseFinished( arguments ); }.bind( this ), 
         onTestCaseStart : function( arguments ){ this.onTestCaseStarted( arguments ); }.bind( this ), 
         onTestRunReady : function( arguments ){ this.onTestRunnerFinished( arguments ); }.bind( this ), 
         onTestRunStart : function( arguments ){ this.onTestRunnerStarted( arguments ); }.bind( this ), 
         url : this.url,
         verbose : this.options.verbose 
      });
      
      this.testFunctionRunner = new JsTestFunctionRunner( this.testFrame, { 
         onTestCaseReady : function( arguments ){ this.onTestCaseFinished( arguments ); }.bind( this ), 
         onTestCaseStart : function( arguments ){ this.onTestCaseStarted( arguments ); }.bind( this ), 
         onTestRunReady : function( arguments ){ this.onTestRunnerFinished( arguments ); }.bind( this ), 
         onTestRunStart : function( arguments ){ this.onTestRunnerStarted( arguments ); }.bind( this ), 
         url : this.url,
         verbose : this.options.verbose 
      });
      
      this.testRunnerChain.chain(
         function() { this.discoverTestSuites(); }.bind( this ),
         function() { this.configureTestRunners(); }.bind( this ),
         function() { this.testClassRunner.runTests(); }.bind( this ),
         function() { this.testFunctionRunner.runTests(); }.bind( this )
      );
            
      this.state = JsTestPage.Status.INITIALIZED;
   }.protect()
});

JsTestPage.STATUS_CHANGE_EVENT = "statusChange";
JsTestPage.READY_EVENT = "ready";
JsTestPage.Status = { INITIALIZED : "testPageInitialized", RUNNING_TEST_FUNCTIONS : "runningTestFunctions", RUNNING_TEST_METHODS : "runningTestMethods", TESTS_FINISHED : "testFinished" };