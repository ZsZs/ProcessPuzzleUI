/*
* JsTestCase
*/

var JsTestCase = new Class({
   Implements : [Events, Options],
   Binds : ['afterEachTestWrapper', 'beforeEachTestWrapper', 'callAfterEachTest', 'callBeforeEachTest', 'checkTimeOut', 'notifyOnTestCaseReady', 'notifyOnTestCaseStart', 'onRunTestFinished', 'run', 'testRunWrapper'],
   options : {
      delayAfterTest : 10,
      eventFireDelay : 10,
      isAfterEachTestAsynchron : false,
      isBeforeEachTestAsynchron : false,
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
      this.state = JsTestCase.States.INITIALIZED;
      this.testCaseActionChain = new Chain();
      this.testResult;
      this.timer;
   },
   
   //Public accessors and mutators
   checkTimeOut: function(){
      this.numberOfTries++;
      if( this.numberOfTries >= this.options.maxTries ){
         clearInterval( this.timer );
         this.testResult.testFailed( new JsTestCaseTimeOutException( this.name, this.options.waitDelay * this.options.maxTries ));
         this.testCaseActionChain.callChain();      
      }
   },
   
   onAfterEachTestFinished : function(){
      this.testCaseActionChain.callChain();
   },
   
   onBeforeEachTestFinished : function(){
      this.testCaseActionChain.callChain();
   },
   
   onRunTestFinished : function( error ){
      clearInterval( this.timer );
      if( error ) this.testResult.testFailed( error );
      else this.testResult.testFinished();
      this.testCaseActionChain.callChain();
   },
   
   run : function(){
      this.testResult = new JsTestCaseResult( this );
      this.compileTestCaseChain();
      try{
         this.testCaseActionChain.callChain();
      }catch( exception ){
         this.testResult.testFailed( exception );
         this.testCaseActionChain.callChain();
      }
   },
   
   //Properties
   getName : function() { return this.name; },
   getFullName : function() { return this.options.url ? this.options.url.toLowerCase() + ":" + this.name : this.name; },
   getState : function() { return this.state; },
   isAsynchron : function() { return this.asynchron; },

   //Protected, private helper methods
   afterEachTestWrapper: function(){
      this.callAfterEachTest();
      if( this.options.isAfterEachTestAsynchron )
         this.waitForTestMethod();
      else{
         this.testCaseActionChain.callChain();
      }
   },
   
   beforeEachTestWrapper: function(){
      this.callBeforeEachTest();
      this.testResult.testStarted();
      if( this.options.isBeforeEachTestAsynchron )
         this.waitForTestMethod();
      else{
         this.testCaseActionChain.callChain();
      }
   },
   
   compileTestCaseChain : function(){
      this.testCaseActionChain.chain(
         function(){ this.notifyOnTestCaseStart(); }.bind( this ),
         function(){ this.beforeEachTestWrapper(); }.bind( this ),
         function(){ this.testRunWrapper(); }.bind( this ), 
         function(){ this.afterEachTestWrapper(); }.bind( this ),
         function(){ this.notifyOnTestCaseReady(); }.bind( this )
      );
   }.protect(),
   
   notifyOnTestCaseReady : function(){
      this.state = JsTestCase.States.INITIALIZED;
      this.fireEvent( 'testCaseReady', this.testResult, this.options.eventFireDelay );
      this.testCaseActionChain.clearChain();
   }.protect(),
   
   notifyOnTestCaseStart : function(){
      this.fireEvent( 'testCaseStart', this.testResult );
      this.testCaseActionChain.callChain();
   }.protect(),
   
   testRunWrapper : function(){
      try{
         this.runTest();
         
         if( this.asynchron ) {
            this.waitForTestMethod();
         } else {
            this.testResult.testFinished();
            this.testCaseActionChain.callChain();      
         }
      }catch( e ){
         this.testResult.testFailed( e );
         this.testCaseActionChain.callChain();      
      }
      
   },
   
   waitForTestMethod: function(){
      this.numberOfTries = 0;
      this.timer = this.checkTimeOut.periodical( this.options.waitDelay, this );
   }.protect()
});

JsTestCase.States = { INITIALIZED : "initialized", SETUP : "setUp", VERIFY : "verify", TEARDOWN : "tearDown" };