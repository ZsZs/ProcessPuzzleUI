/*
* JsTestResult
*/

var JsTestCaseResult = new Class({
   //Constructor
   initialize : function( testCase ){
      this.error;
      this.exeption;
      this.testCase = testCase;
      this.whenFinished;
      this.whenStarted;
   },
   
   //Public accessors and mutators
   fullMessage : function(){
      var fullMessage = this.getName() + " - ";
      if( this.exception ){
         fullMessage += "failed! ";
         if( this.exception.jsUnitMessage ) fullMessage += this.exception.jsUnitMessage;
         else fullMessage += this.exception.getMessage();
      } else fullMessage += "sucseeded. ";
      
      fullMessage += "Execution time was: " + this.getTimeTaken();
      return fullMessage;
   },
   
   testFailed : function( failure ){
      this.exception = failure;
   },
   
   testFinished : function(){
      this.whenFinished = (new Date().getTime());
   },
   
   testStarted : function(){
      this.whenStarted = (new Date().getTime());
   },
   
   //Properties
   getError : function() { return this.error; },
   getException : function() { return this.exception; },
   getFinished : function() { return this.finished; },
   getName : function() { return this.testCase.getName(); },
   getStarted : function() { return this.whenStarted; },
   getTestCase : function() { return this.testCase; },
   getTimeTaken : function() { return this.whenFinished - this.whenStarted; },
   isSuccess : function(){ return !( this.error || this.exception ); },
      
   //Protected, private helper methods
});