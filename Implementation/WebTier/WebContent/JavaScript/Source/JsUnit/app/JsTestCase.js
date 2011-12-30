/*
* JsTestCase
*/

var JsTestCase = new Class({
   Implements : [Events, Options],
   Binds : ['callAfterEachTest', 'callBeforeEachTest', 'checkTimeOut', 'notifyOnTestCaseReady', 'notifyOnTestCaseStart', 'onRunTestFinished', 'run', 'testRunWrapper'],
   options : {
      delay: 200,
      maxTries: 20
   },
   
   //Constructor
   initialize : function( options  ){
      this.setOptions( options );
      this.asynchron = false; 
      this.name;
      this.numberOfTries;
      this.testCaseChain = new Chain();
      this.testResult;
      this.timer;
   },
   
   //Public accessors and mutators
   checkTimeOut: function(){
      this.numberOfTries++;
      if( this.numberOfTries >= this.options.maxTries ){
         clearInterval( this.timer );
         this.testResult.testFailed( new JsTestCaseTimeOutException( this.name, this.options.delay * this.options.maxTries ));
      }
   },
   
   onRunTestFinished : function(){
      clearInterval( this.timer );
      this.testResult.testFinished();
      this.testCaseChain.callChain();
   },
   
   run : function(){
      this.testResult = new JsTestCaseResult( this );
      this.compileTestCaseChain();
      this.testCaseChain.callChain();
   },
   
   //Properties
   getName : function() { return this.name; },
   isAsynchron : function() { return this.asynchron; },

   //Protected, private helper methods
   callAfterEachTest: function(){
      this.testCaseChain.callChain();
   }.protect(),
   
   callBeforeEachTest: function(){
      this.testResult.testStarted();
      this.testCaseChain.callChain();
   }.protect(),
   
   compileTestCaseChain : function(){
      this.testCaseChain.chain(
         this.notifyOnTestCaseStart,
         this.callBeforeEachTest,
         this.testRunWrapper, 
         this.callAfterEachTest,
         this.notifyOnTestCaseReady
      );
   }.protect(),
   
   notifyOnTestCaseReady : function(){
      this.fireEvent( 'testCaseReady', this.testResult );
      this.testCaseChain.clearChain();
   }.protect(),
   
   notifyOnTestCaseStart : function(){
      this.fireEvent( 'testCaseStart', this.name );
      this.testCaseChain.callChain();
   }.protect(),
   
   testRunWrapper : function(){
      try{
         this.runTest();
         
         if( this.asynchron ) {
            this.waitForTestMethod();
         } else {
            this.testResult.testFinished();
            this.testCaseChain.callChain();      
         }
      }catch( e ){
         this.testResult.testFailed( e );
         this.testCaseChain.callChain();      
      }
      
   },
   
   waitForTestMethod: function(){
      this.numberOfTries = 0;
      this.timer = this.checkTimeOut.periodical( this.options.delay );
   }.protect()
});