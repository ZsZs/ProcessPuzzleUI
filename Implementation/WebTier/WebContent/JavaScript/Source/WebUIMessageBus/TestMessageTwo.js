//TestMessageTwo.js

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var TestMessageTwo = new Class({
   Extends: WebUIMessage,
   options: {
      description: "Test Message Two description",
      name: "Test Message Two"
   },
      
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = TestMessageTwo;
   }
});

