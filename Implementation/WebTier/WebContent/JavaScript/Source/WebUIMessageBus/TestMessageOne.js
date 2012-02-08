//TestMessageOne.js

//= require_directory ../FundamentalTypes

var TestMessageOne = new Class({
   Extends: WebUIMessage,
   options: {
      description: "Test Message One description",
      name: "Test Message One"
   },
      
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = TestMessageOne;
   }
});

