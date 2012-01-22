/*
* JsTestSuiteResults
*/

var JsTestSuiteResults = new Class({
   Implements : [Options],
   
   options : {
   },
   
   //Constructor
   initialize : function(){
      //Private instance variables
      this.errorCount = 0;
      this.failureCount = 0;
      this.testSuiteStack = new Array();
      this.testIndex = 0;
      this.testPages = new Array();
      this.testSuiteIndex = 0;
      this.totalCount = 0;
      this.totalNumberOfTestCases = 0;
   },
   
   //Public accessors and mutators
   processTestCaseResult : function( testCaseResult ){
      this.testIndex++;
      this.totalCount++;
      if( !testCaseResult.isSuccess() ) this.failureCount++;
   },
   
   processTestPage : function( testPage ){
      this.totalNumberOfTestCases += testPage.getTotalNumberOfTestCases();
      this.testPages.include( testPage );
   },
   
   processTestSuite : function( testSuite ){
      this.testSuiteStack.include( testSuite );
      this.testSuiteIndex++;
   },
   
   //Properties
   getErrorCount : function() { return this.errorCount; },
   getFailureCount : function() { return this.failureCount; },
   getTestIndex : function() { return this.testIndex; },
   getTestProgressProportion : function() { return this.calculateTestProportion(); },
   getTotalCount : function() { return this.totalCount; },
   getTotalNumberOfTestCases : function() { return this.totalNumberOfTestCases; },
   
   //Protected, private helper methods
   calculateTestProportion : function() {
      if( this.totalCount == 0 ) return 0;
      var currentDivisor = 1;
      var result = 0;

      for( var i = 0; i < this.testSuiteStack.length; i++ ){
         var testSuite = this.testSuiteStack[i];
         currentDivisor *= testSuite.getTestPages().length;
         result += (this.testSuiteIndex - 1) / currentDivisor;
      }
      
      result += this.testIndex / (this.totalNumberOfTestCases * currentDivisor);
      return result;
   },

   
});