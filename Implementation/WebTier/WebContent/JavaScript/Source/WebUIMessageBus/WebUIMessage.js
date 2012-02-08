//WebUIMessage.js

//= require_directory ../FundamentalTypes

var WebUIMessage = new Class({
   Implements: Options,
   options: {
      description: "Generic Browser Interface message. Normally this message should be overwritten by subclasses.",
      messageClass: null,
      name: "WebUIMessage",       //Please note, that subclasses should overwrite this.
      originator: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
   },
   
   //Public accessor and mutator methods
   
   //Properties
   getClass: function() { return this.options.messageClass; },
   getDescription: function() { return this.options.description; },
   getName: function() { return this.options.name; },
   getOriginator: function() { return this.options.originator; }
   
   //Private helper methods
});