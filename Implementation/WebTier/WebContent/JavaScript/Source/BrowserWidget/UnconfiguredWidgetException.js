//UnconfiguredWidget.js

//= require_directory ../MochaUI
//= require ../FundamentalTypes/WebUIException.js

var UnconfiguredWidgetException = new Class({
   Extends: WebUIException,
   options: {
      description: "Browser Widget is unconfigured therefore the requested operation can't be carried out.",
      name: "UnconfiguredWidgetException"
   },
   
   //Constructor
   initialize : function( options ){
      this.setOptions( options );
      this.parent( options );
   }
});