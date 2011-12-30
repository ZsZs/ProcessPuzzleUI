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
      this.testIndex = 0;
      this.totalCount = 0;
   },
   
   //Public accessors and mutators
   processTestCaseResult : function( testCaseResult ){
      this.testIndex++;
      this.totalCount++;
      if( !testCaseResult.isSuccess() ) this.failureCount++;
   },
   
   //Properties
   getErrorCount : function() { return this.errorCount; },
   getFailureCount : function() { return this.failureCount; },
   getTestIndex : function() { return this.testIndex; },
   getTotalCount : function() { return this.totalCount; }
   
   //Protected, private helper methods
});