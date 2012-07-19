//WebUIMessage.js

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var WebUIMessage = new Class({
   Implements: Options,
   options: {
      activityType: null,
      actionType: null,
      description: "Generic Browser Interface message. Normally this message should be overwritten by subclasses.",
      isDefault: false,
      messageClass: null,
      messageResource: null,
      name: "WebUIMessage",       //Please note, that subclasses should overwrite this.
      originator: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.options.activityType = null;
      this.options.actionType = null;
   },
   
   unmarshall: function(){
      if( this.options.messageResource ){
         this.unmarshallProperties();
      } 
   },
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getClass: function() { return this.options.messageClass; },
   getDescription: function() { return this.options.description; },
   getMessageProperties: function() { return this.messageProperties; },
   getName: function() { return this.options.name; },
   getOptions: function() { return this.options; },
   getOriginator: function() { return this.options.originator; },
   isDefault: function() { return this.options.isDefault; },
   
   //Private helper methods
   unmarshallProperties: function(){
      var messageText = XmlResource.determineNodeText( this.options.messageResource );
      var messageProperties = messageText ? eval( "(" + messageText + ")" ) : {};
      this.setOptions( messageProperties );
   }.protect()
});