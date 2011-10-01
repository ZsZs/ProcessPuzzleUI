// NativeView.js

function NativeView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
  	inheritFrom( this, new DocumentView( theParentDocument, theName, theCaption, theURL ));
	this.getClassName = function() { return "NativeView"; }

	//private instance variables
	var logger = null;
	var self = this;

	_NativeViewConstructor();
	
	//Constructors	
	function _NativeViewConstructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.nativeView" );
		logger.debug( "New 'NativeView' was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl() );
	}

	//public accessor methods

	//public mutator methods

	//private methods
}