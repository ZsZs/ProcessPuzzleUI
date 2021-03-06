//UnconfiguredWidget.js

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var ResourceNotFoundException = new Class({
   Extends: WebUIException,
   options: {
      description: "Resource '{resourceName}' not found.",
      name: "ResourceNotFoundException"
   },
   
   //Constructor
   initialize : function( resourceName, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { resourceName : resourceName };
   }
});