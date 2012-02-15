/*
* JsTestResult
*/

var JsTestCaseResult = new Class({
   //Constructor
   initialize : function( testCase ){
      this.error;
      this.exeption;
      this.testCase = testCase;
      this.traceMessages = new Array();
      this.whenFinished;
      this.whenStarted;
   },
   
   //Public accessors and mutators
   addTraceMessage : function( traceMessage ){
      this.traceMessages.include( traceMessage );
   },
   
   fullMessage : function(){
      var fullMessage = this.getName() + " - ";
      if( this.exception ){
         fullMessage += "failed! ";
         fullMessage += "\nName: " + this.determineExceptionName();
         fullMessage += "\nMessage: " + this.determineExceptionMesssage();
         fullMessage += "\nSource: " + this.determineExceptionSource();
         fullMessage += "\nStack trace:\n" + this.determineExceptionStackTrace() + "\n";
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
   getFullName : function() { return this.testCase.getFullName(); },
   getName : function() { return this.testCase.getName(); },
   getStarted : function() { return this.whenStarted; },
   getTestCase : function() { return this.testCase; },
   getTimeTaken : function() { return this.whenFinished - this.whenStarted; },
   isSuccess : function(){ return !( this.error || this.exception ); },
      
   //Protected, private helper methods
   determineExceptionMesssage : function(){
      var message = "";
      if( this.exception.jsUnitMessage ) message = this.exception.jsUnitMessage;
      else if( this.exception.getMessage ) message = this.exception.getMessage();
      else message = this.exception.message;
      
      return message;
   }.protect(),
   
   determineExceptionName : function(){
      var name = "";
      if( this.exception.getName ) name = this.exception.getName();
      else if( this.exception.name ) name = this.exception.name;
      else name = "Uknown";
      
      return name;
   }.protect(),
   
   determineExceptionSource : function(){
      var source = "";
      if( this.exception.getSource ) source = this.exception.getSource();
      else source = "Unknown";
      
      return source;
   }.protect(),
   
   determineExceptionStackTrace : function(){
      var stackTrace = "";
      if( this.exception.jsUnitMessage ) stackTrace = "not implemented yet";
      else if( this.exception.stackTrace ) stackTrace = this.exception.stackTrace();
      else stackTrace = this.exception.stack;
      
      return stackTrace;
   }.protect()
});