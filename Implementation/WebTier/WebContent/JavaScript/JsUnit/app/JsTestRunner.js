/* JsTestRunner
*
*/

var JsTestRunner = new Class({
   Implements : [Events, Options],
   Binds : ['collectTestCases', 'finalizeTestRun', 'runTests', 'onTestCaseReady', 'onTestCaseStart'],
   
   options : {
      componentName : "JsTestRunner",
      url : null,
      verbose : false,
   },
   
   //Constructor
   initialize : function( testFrame, options ){
      this.setOptions( options );
      this.numberOfTestCaseReady;
      this.testCaseChain = new Chain();
      this.testCases = new Array();
      this.testFrame = testFrame;
   },
   
   //Public accessor and mutator methods
   configure : function(){
      this.collectTestCases();
   },
   
   onTestCaseReady : function( testResult ){
      this.numberOfTestCaseReady++;
      this.fireEvent( 'testCaseReady', testResult );
      if( this.options.verbose ) console.log( testResult.fullMessage() );

      if( this.numberOfTestCaseReady >= this.testCases.length ) {
         this.testCaseChain.callChain();
      }else this.testCaseChain.callChain();
   },
   
   onTestCaseStart : function( testResult ){
      this.fireEvent( 'testCaseStart', testResult );
   },
   
   runTests : function(){
      this.numberOfTestCaseReady = 0;
      this.addEventsToTestCases();
      this.compileTestCaseChain();
      this.fireEvent( 'testRunStart' );
      this.testCaseChain.callChain();
   },
   
   //Properties
   getTestCases : function() { return this.testCases; },
   
   //Protected, private helper methods
   addEventsToTestCases : function(){
      this.testCases.each( function( testCase, index ){
         testCase.addEvent( 'testCaseStart', function( arguments ){ this.onTestCaseStart( arguments ); }.bind( this ));
         testCase.addEvent( 'testCaseReady', function( arguments ){ this.onTestCaseReady( arguments ); }.bind( this ));
      }, this );
   }.protect(),
   
   compileTestCaseChain : function(){
      this.testCases.each( function( testCase, index ){
         this.testCaseChain.chain(
            function(){ testCase.run(); }.bind( this )
         );
      }, this );
      this.testCaseChain.chain( function(){ this.finalizeTestRun(); }.bind( this ));
   }.protect(),
   
   finalizeTestRun : function(){
      this.testCaseChain.clearChain();
      this.fireEvent( 'testRunReady', [], 50 );      
   }
});