var JsTestPage = new Class({
   Implements : [Events, Options],
   Binds : ['discoverTestSuites', 'onTestCaseFinished', 'onTestCaseStarted', 'onTestRunnerFinished', 'onTestRunnerStarted'],
   
   options : {
      eventFireDelay : 10,
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
      this.testSuite;
      this.totalNumberOfTestCases;
      this.url = url;
      
      this.setUp();
   },

   //Public accessors and mutators
   onTestCaseFinished : function( testResult ){
      this.fireEvent( 'testCaseFinished', testResult );
   },
   
   onTestCaseStarted : function( testResult ){
      this.fireEvent( 'testCaseStarted', testResult );
   },
   
   onTestRunnerFinished : function(){
      this.testRunnerChain.callChain();         
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
            this.testSuite = allegedSuite;
            this.fireEvent( 'addTestSuite', this.testSuite );
         }
      }
      this.testRunnerChain.callChain();
   }.protect(),

   finalizeTestRun : function(){
      this.testRunnerChain.clearChain();
      if( this.totalNumberOfTestCases == 0 && this.testSuite == 'undefined' )
         alert( this.url + " test page doesn't defines any test case or suite. Check that you included JsObjectTest related files." );
      this.fireEvent( 'testPageFinished', this, this.options.eventFireDelay );
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
         function() { this.testFunctionRunner.runTests(); }.bind( this ),
         function() { this.finalizeTestRun(); }.bind( this )
      );
            
      this.state = JsTestPage.Status.INITIALIZED;
   }.protect()
});

JsTestPage.STATUS_CHANGE_EVENT = "statusChange";
JsTestPage.READY_EVENT = "ready";
JsTestPage.Status = { INITIALIZED : "testPageInitialized", RUNNING_TEST_FUNCTIONS : "runningTestFunctions", RUNNING_TEST_METHODS : "runningTestMethods", TESTS_FINISHED : "testFinished" };