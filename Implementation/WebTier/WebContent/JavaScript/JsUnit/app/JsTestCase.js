/*
* JsTestCase
*/

var JsTestCase = new Class({
   Implements : [Events, Options],
   Binds : ['callAfterEachTest', 'callBeforeEachTest', 'checkTimeOut', 'notifyOnTestCaseReady', 'notifyOnTestCaseStart', 'onRunTestFinished', 'run', 'testRunWrapper'],
   options : {
      delayAfterTest : 10,
      eventFireDelay : 10,
      maxTries: 20,
      url: null,
      waitDelay: 200
   },
   
   //Constructor
   initialize : function( name, options  ){
      this.setOptions( options );
      this.asynchron = false; 
      this.name = name;
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
         this.testResult.testFailed( new JsTestCaseTimeOutException( this.name, this.options.waitDelay * this.options.maxTries ));
         this.testCaseChain.callChain();      
      }
   },
   
   onRunTestFinished : function( error ){
      clearInterval( this.timer );
      if( error ) this.testResult.testFailed( error );
      else this.testResult.testFinished();
      this.testCaseChain.callChain();
   },
   
   run : function(){
      this.testResult = new JsTestCaseResult( this );
      this.compileTestCaseChain();
      this.testCaseChain.callChain();
   },
   
   //Properties
   getName : function() { return this.name; },
   getFullName : function() { return this.options.url ? this.options.url + ":" + this.name : this.name; },
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
         function(){ this.notifyOnTestCaseStart(); }.bind( this ),
         function(){ this.callBeforeEachTest(); }.bind( this ),
         function(){ this.testRunWrapper(); }.bind( this ), 
         function(){ this.callAfterEachTest(); }.bind( this ),
         function(){ this.notifyOnTestCaseReady(); }.bind( this )
      );
   }.protect(),
   
   notifyOnTestCaseReady : function(){
      this.fireEvent( 'testCaseReady', this.testResult, this.options.eventFireDelay );
      this.testCaseChain.clearChain();
   }.protect(),
   
   notifyOnTestCaseStart : function(){
      this.fireEvent( 'testCaseStart', this.testResult );
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
      this.timer = this.checkTimeOut.periodical( this.options.waitDelay, this );
   }.protect()
});