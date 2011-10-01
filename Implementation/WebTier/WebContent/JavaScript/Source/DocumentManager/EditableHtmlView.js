// EditableHtmlView.js

function EditableHtmlView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
  	inheritFrom(this, new DocumentView( theParentDocument, theName, theCaption, theURL ));
	this.getClassName = function() { return "EditableHtmlView"; }

	//private instance variables
	var self = this;
	var logger = null;

	//public accessor methods

	//public mutator methods

	_Constructor();
	
	//Constructors
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.editableHtmView" );
		logger.debug( "New 'EditableHtmlView' view was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl());
	}
	
	//private methods
}