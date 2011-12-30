/* JsTestRunner
*
*/

var JsTestRunner = new Class({
   Implements : [Events, Options],
   Binds : ['runTests', 'onTestCaseReady', 'onTestCaseStart'],
   
   options : {
      verbose : false,
   },
   
   //Constructor
   initialize : function( testDefinitions, options ){
      this.setOptions( options );
      this.numberOfTestCaseReady;
      this.testCaseChain = new Chain();
      this.testCases = new Array();
      this.testDefinitions = testDefinitions;
   },
   
   //Public accessor and mutator methods
   onTestCaseReady : function( testResult ){
      this.numberOfTestCaseReady++;
      this.fireEvent( 'testCaseReady', testResult );
      if( this.options.verbose ) console.log( testResult.fullMessage() );

      if( this.numberOfTestCaseReady >= this.testCases.length ) {
         this.testCaseChain.clearChain();
         this.fireEvent( 'testSuiteReady' );
      }else this.testCaseChain.callChain();
   },
   
   onTestCaseStart : function( testCaseName ){
      this.fireEvent( 'testCaseStart', testCaseName );
      if( this.numberOfTestCaseReady == 0 ) this.fireEvent( 'testSuiteStart' );
   },
   
   runTests : function(){
      this.numberOfTestCaseReady = 0;
      this.collectTestCases();
      this.addEventsToTestCases();
      this.compileTestCaseChain();
      this.testCaseChain.callChain();
   },
   
   //Properties   
   
   //Protected, private helper methods
   addEventsToTestCases : function(){
      this.testCases.each( function( testCase, index ){
         testCase.addEvent( 'testCaseStart', this.onTestCaseStart );
         testCase.addEvent( 'testCaseReady', this.onTestCaseReady );
      }, this );
   }.protect(),
   
   compileTestCaseChain : function(){
      this.testCases.each( function( testCase, index ){
         this.testCaseChain.chain(
            testCase.run
         );
      }, this );
   },
   
   collectTestCases : function(){
      //Abstract method, should be overwritten
   }.protect(),
   
});