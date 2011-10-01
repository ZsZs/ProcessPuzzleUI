// EditableTextView.js

function EditableTextView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
  	inheritFrom( this, new DocumentView( theParentDocument, theName, theCaption, theURL ));
	this.getClassName = function() { return "EditableTextView"; }

	//private instance variables
	var self = this;
	var logger = null;

	_Constructor();
	
	//Constructors
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.editableTextView" );
		logger.debug( "New 'EditableTextView' view was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl());
	}
	

	//public accessor methods

	//public mutator methods

	//private methods
}