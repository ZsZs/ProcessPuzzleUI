// CustomFormView.js

function CustomFormView(theName, theCaption, theURL) {
	// inherit from DocumentView to make this object a View
  	inheritFrom(this, new DocumentView(theName,theCaption,theURL));
	this.getClassName = function() { return "CustomFormView"; }

	//private instance variables
	var self = this;
	var logger = null;

	_Constructor();
	
	//Constructors
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.customFormView" );
		logger.debug( "New 'CustomFormView' view was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl());
	}
	
	//public accessor methods

	//public mutator methods

	//private methods
}