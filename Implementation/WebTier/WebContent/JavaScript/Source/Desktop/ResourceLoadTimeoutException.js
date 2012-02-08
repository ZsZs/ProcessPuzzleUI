//UnconfiguredWidget.js

//= require_directory ../FundamentalTypes

var ResourceLoadTimeoutException = new Class({
   Extends: WebUIException,
   options: {
      description: "Loading one or more resources exceeded the '{resourceLoadTimeout}' ms timeout period.",
      name: "ResourceLoadTimeoutException"
   },
   
   //Constructor
   initialize : function( resourceLoadTimeout, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { resourceLoadTimeout : resourceLoadTimeout };
   }
});