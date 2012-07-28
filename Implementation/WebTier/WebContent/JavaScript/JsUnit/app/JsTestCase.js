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
   
   onAfterEachTestFinished : function(){
      this.testCaseChain.callChain();
   },
   
   onBeforeEachTestFinished : function(){
      this.testCaseChain.callChain();
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
   getFullName : function() { return this.options.url ? this.options.url.toLowerCase() + ":" + this.name : this.name; },
   isAsynchron : function() { return this.asynchron; },

   //Protected, private helper methods
   afterEachTestWrapper: function(){
      this.callAfterEachTest();
      if( this.options.isAfterEachTestAsynchron )
         this.waitForTestMethod();
      else
         this.testCaseChain.callChain();
   },
   
   beforeEachTestWrapper: function(){
      this.callBeforeEachTest();
      this.testResult.testStarted();
      if( this.options.isBeforeEachTestAsynchron )
         this.waitForTestMethod();
      else
         this.testCaseChain.callChain();
   },
   
   callAfterEachTest: function(){
      //Abstract method should be overwritten.
   }.protect(),
   
   callBeforeEachTest: function(){
      //Abstract method should be overwritten.
   }.protect(),
   
   compileTestCaseChain : function(){
      this.testCaseChain.chain(
         function(){ this.notifyOnTestCaseStart(); }.bind( this ),
         function(){ this.beforeEachTestWrapper(); }.bind( this ),
         function(){ this.testRunWrapper(); }.bind( this ), 
         function(){ this.afterEachTestWrapper(); }.bind( this ),
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