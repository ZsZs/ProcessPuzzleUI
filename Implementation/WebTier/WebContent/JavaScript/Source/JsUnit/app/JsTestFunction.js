var JsTestFunction = new Class({
   Implements : [Events, Options],
   
   initialize : function( testPage, testName ) {
      this.testPage = testPage;
      this.testName = testName;
      this.traceMessages = [];
      this.status = 'ready';

      this.listeners = [];
   },

   addTraceMessage : function( traceMessage ) {
      this.traceMessages.push( traceMessage );
   },

   listen : function( callback ) {
      JsUnit.Util.push( this.listeners, callback );
   },

   notify : function( event ) {
      for( var i = 0; i < this.listeners.length; i++ ){
         this.listeners[i].call( null, this, event );
      }
   },

});
