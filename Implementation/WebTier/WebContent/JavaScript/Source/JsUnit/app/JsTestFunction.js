var jsCurrentTestFunction;

var JsTestFunction = new Class({
   Extends : JsTestCase,
   
   options : {
      functionNamePrefix : ""
   },
   
   //Constructor
   initialize : function( name, options ) {
      this.parent( name, options );
      this.testFunction;
      this.traceMessages = new Array();
      this.status = 'ready';

      this.listeners = new Array();
   },

   //Public accessor and mutator methods
   addTraceMessage : function( traceMessage ) {
      this.traceMessages.include( traceMessage );
   },

   listen : function( callback ) {
      this.listeners.include( callback );
   },

   notify : function( event ) {
      for( var i = 0; i < this.listeners.length; i++ ){
         this.listeners[i].call( null, this, event );
      }
   },
   
   run : function(){
      this.testFunction = eval( this.options.functionNamePrefix + this.name );
      this.parent();
   },
   
   //Properties
   
   //Protected, private helper methods
   callAfterEachTest: function(){
      this.parent();
   }.protect(),
   
   callBeforeEachTest: function(){
      this.parent();
   }.protect(),
   
   notifyOnTestCaseStart : function(){
      eval( this.options.functionNamePrefix + "JsTestFunction.current = this" );
      eval( this.options.functionNamePrefix + "JsTestFunction.current.onReady = this.onRunTestFinished" );
      this.parent();
   }.protect(),
   
   runTest: function(){
      this.testFunction();
   }.protect(),   
});