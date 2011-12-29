/* JsTestRunner
*
*/

var JsTestRunner = new Class({
   Implements : [Events, Options],
   Binds : ['runTests', 'onTestCaseFinished'],
   
   options : {
      delay: 200,
      maxTries: 20
   },
   
   //Constructor
   initialize : function( testCases, options ){
      this.setOptions( options );
      this.numberOfTries;
      this.testCases = testCases;
      this.timer;
   },
   
   //Public accessor and mutator methods
   onTestCaseFinished : function( testCaseName ){
      if( testCaseName ) this.waitList.erase( testCaseName );
      clearInterval( this.timer );
      this.fireEvent( 'testCaseFinished', testCaseName );
   },
   
   runTests : function(){
      this.testCases.each( function( testCase, index ){
         this.runTestCase( testCase );
      }, this );
   },
   
   //Properties   
   
   //Protected, private helper methods
   checkTimeOut: function(){
      this.numberOfTries++;
      console.log( "time out checked" );
      if( this.numberOfTries >= this.options.maxTries ){
         clearInterval( this.timer );
         throw new Error( "One of your asynchron test methods: " + this.waitList.toString() + " didn't fired 'ready' event." );
      }
   },
   
   runTestCase : function( testCase ){
      //Abstract method, should be overwritten
   }.protect(),
      
   waitForTestMethod: function( testMethodName ){
      this.waitList.include( testMethodName );
      this.numberOfTries = 0;
      this.timer = this.checkTimeOut.periodical( this.options.delay );
   }.protect()
});