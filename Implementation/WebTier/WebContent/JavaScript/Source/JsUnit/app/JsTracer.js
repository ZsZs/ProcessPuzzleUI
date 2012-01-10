var JsTracer = new Class({
   Implements : [Events],
   //Constructor
   initialize : function( testManager, params ) {
      this.currentTestCaseResult;
      this._testManager = testManager;
      this._params = params;
   },

   //Public accessors and mutators
   debug : function() {
      this.addTraceData( arguments[0], arguments[1], JsTraceLevel.DEBUG );
   },

   inform : function() {
      this.addTraceData( arguments[0], arguments[1], JsTraceLevel.INFO );
   },

   onTestCaseFinished : function( testCaseResult ){
      this.currentTestCaseResult = null;
   },
   
   onTestCaseStarted : function( testCaseResult ){
      this.currentTestCaseResult = testCaseResult;
   },
   
   warn : function() {
      this.addTraceData( arguments[0], arguments[1], JsTraceLevel.WARNING );
   },

   //Protected, private helper methods
   addTraceData : function( message, value, traceLevel ) {
      var traceMessage = new JsTraceMessage( message, value, traceLevel );
      if( this.currentTestCaseResult ) this.currentTestCaseResult.addTraceMessage( traceMessage );

      this.fireEvent( 'traceMessage', traceMessage );
   },
});
