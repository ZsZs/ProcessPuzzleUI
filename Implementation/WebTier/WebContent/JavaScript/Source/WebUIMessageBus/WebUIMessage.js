//WebUIMessage.js

//= require_directory ../FundamentalTypes

var WebUIMessage = new Class({
   Implements: Options,
   options: {
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
      this.activityType;
      this.actionType;
      this.messageProperties;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.activityType = null;
      this.actionType = null;
      this.messageProperties = null;
   },
   
   unmarshall: function(){
      if( this.options.messageResource ){
         this.unmarshallProperties();
         this.determineProperties();
      } 
   },
   
   //Properties
   getActionType: function() { return this.actionType; },
   getActivityType: function() { return this.activityType; },
   getClass: function() { return this.options.messageClass; },
   getDescription: function() { return this.options.description; },
   getMessageProperties: function() { return this.messageProperties },
   getName: function() { return this.options.name; },
   getOriginator: function() { return this.options.originator; },
   isDefault: function() { return this.options.isDefault; },
   
   //Private helper methods
   determineProperties: function(){
      this.activityType = this.messageProperties['activityType'];
      this.actionType = this.messageProperties['actionType'];
   },
   
   unmarshallProperties: function(){
      var messageText = XmlResource.determineNodeText( this.options.messageResource );
      this.messageProperties = messageText ? eval( "(" + messageText + ")" ) : {};
   }.protect()
});