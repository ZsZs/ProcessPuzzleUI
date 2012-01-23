var jsCurrentTestFunction;

var JsTestFunction = new Class({
   Extends : JsTestCase,
   
   options : {
      functionNamePrefix : "",
      setUpFunctionName : "setUp",
      tearDownFunctionName : "tearDown"
   },
   
   //Constructor
   initialize : function( name, options ) {
      this.parent( name, options );
      this.listeners = new Array();
      this.setUpFunction;
      this.status = 'ready';
      this.tearDownFunction;
      this.testFunction;
      this.traceMessages = new Array();
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
      
      try{ this.setUpFunction = eval( this.options.functionNamePrefix + this.options.setUpFunctionName );
      }catch( e ){}
      
      try{ this.tearDownFunction = eval( this.options.functionNamePrefix + this.options.tearDownFunctionName );
      }catch( e ){}
      
      this.parent();
   },
   
   //Properties
   
   //Protected, private helper methods
   callAfterEachTest: function(){
      if( this.tearDownFunction ) this.tearDownFunction();
      this.parent();
   }.protect(),
   
   callBeforeEachTest: function(){
      if( this.setUpFunction ) this.setUpFunction();
      this.parent();
   }.protect(),
   
   notifyOnTestCaseStart : function(){
      eval( this.options.functionNamePrefix + "JsTestFunction.current = this" );
      eval( this.options.functionNamePrefix + "JsTestFunction.current.onReady = this.onRunTestFinished" );
      this.parent();
   }.protect(),
   
   runTest: function(){
      this.testFunction();
   }.protect()
});