var JsTraceLevel = new Class({
   //Constructor
   initialize : function( levelNumber, color ) {
      this._levelNumber = levelNumber;
      this._color = color;
   },

   //Public accessors and mutators
   findByLevelNumber : function( levelNumber ) {
      switch( levelNumber ){
      case 0:
         return JsTraceLevel.NONE;
      case 1:
         return JsTraceLevel.WARNING;
      case 2:
         return JsTraceLevel.INFO;
      case 3:
         return JsTraceLevel.DEBUG;
      }
      return null;
   },
   
   matches : function( otherTraceLevel ) {
      return this._levelNumber >= otherTraceLevel._levelNumber;
   },

   //Properties
   getColor : function() { return this._color; },
});

JsTraceLevel.NONE = new JsTraceLevel( 0, null );
JsTraceLevel.WARNING = new JsTraceLevel( 1, "#FF0000" );
JsTraceLevel.INFO = new JsTraceLevel( 2, "#009966" );
JsTraceLevel.DEBUG = new JsTraceLevel( 3, "#0000FF" );

JsTraceLevel.findByLevelNumber = function( levelNumber ){
   var traceLevel = new JsTraceLevel();
   return traceLevel.findByLevelNumber( levelNumber );
};