// ListQueryView.js

function ListQueryView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
  	inheritFrom(this, new DocumentView( theParentDocument, theName, theCaption, theURL ));
	this.getClassName = function() { return "ListQueryView"; }

	//private instance variables
	var self = this;
	var logger = null;

	_Constructor();
	
	//Constructors
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.listQueryView" );
		logger.debug( "New 'ListQueryView' view was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl());
	}
	
	//public accessor methods

	//public mutator methods

	//private methods
}