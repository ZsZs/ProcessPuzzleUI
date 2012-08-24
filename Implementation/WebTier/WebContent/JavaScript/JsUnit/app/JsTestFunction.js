var jsCurrentTestFunction;

var JsTestFunction = new Class({
   Extends : JsTestCase,
   
   options : {
      componentName : "JsTestFunction",
      functionNamePrefix : "",
      setUpFunctionName : "setUp",
      tearDownFunctionName : "tearDown"
   },
   
   //Constructor
   initialize : function( name, options ) {
      this.parent( name, options );
      this.fakeClassName;
      this.listeners = new Array();
      this.setUpFunction;
      this.status = 'ready';
      this.tearDownFunction;
      this.testFunction;
      this.traceMessages = new Array();
      this.deriveFakeClassNameFromUrl();
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
   getFullName : function() { return this.options.url ? this.options.url.toLowerCase() + ":" + this.fakeClassName + "." + this.name : this.name; },
   
   //Protected, private helper methods
   callAfterEachTest: function(){
      if( this.tearDownFunction ) this.tearDownFunction();
   }.protect(),
   
   callBeforeEachTest: function(){
      if( this.setUpFunction ) this.setUpFunction();
   }.protect(),
   
   deriveFakeClassNameFromUrl: function(){
      this.fakeClassName = this.options.url.substring( this.options.url.lastIndexOf( "/" ) +1, this.options.url.indexOf( ".htm" ));
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