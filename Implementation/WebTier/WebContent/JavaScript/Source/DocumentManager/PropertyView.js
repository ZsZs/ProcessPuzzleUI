// PropertyView.js

function PropertyView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
  	inheritFrom( this, new DocumentView( theParentDocument, theName, theCaption, theURL ));
	this.getClassName = function() { return "PropertyView"; }

	//private instance variables
	var logger = null;
	var self = this;

	//public accessor methods

	//public mutator methods

	_Constructor();
	
	//Constructors	
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.propertyView" );
		logger.debug( "New 'PropertyView' was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl() );
	}

	//private methods
}