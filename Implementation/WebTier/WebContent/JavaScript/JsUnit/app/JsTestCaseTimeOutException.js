/* 
 * JsTestCaseTimeOutException
 */

var JsTestCaseTimeOutException = new Class({
   Implements : [Options],
   options : {
      description : "Running '{testCaseName}' test case took longer than {timeOutValue} milliseconds.",
   },
   
   initialize : function( testCaseName, timeOutValue ){
      this.parameters = { testCaseName : testCaseName, timeOutValue : timeOutValue };
      this.testCaseName = testCaseName;
      this.timeOutValue = timeOutValue;
   },
   
   //Properties
   getMessage: function() { return this.options.description.substitute( this.parameters ); },   
});
