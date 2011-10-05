//UnconfiguredWidget.js

var ConfigurationTimeoutException = new Class({
   Extends: WebUIException,
   options: {
      description: "Configuring '{configurationPath}' exceeded the '{resourceLoadTimeout}'ms timeout period.",
      name: "ConfigurationTimeoutException"
   },
   
   //Constructor
   initialize : function( configurationPath, resourceLoadTimeout, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { configurationPath : configurationPath, resourceLoadTimeout : resourceLoadTimeout };
   }
});