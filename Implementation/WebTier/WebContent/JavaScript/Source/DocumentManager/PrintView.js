// PrintView.js

function PrintView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
	var ancestor = new DocumentView( theParentDocument, theName, theCaption, theURL );
  	inheritFrom( this, ancestor );
	this.getClassName = function() { return "PrintView"; }

	//private static variables 
	var COMMAND_NAME = "ShowPrintView";
	
	//private instance variables
	var logger = null;
	var self = this;

	//public accessor methods
	this.getContentUri = _DetermineContentUri; 

	//public mutator methods

	_PrintViewConstructor();
	
	//Constructors
	function _PrintViewConstructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.printView" );
		logger.debug( "New 'PrintView' was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl());
	}
	
	//private methods
	function _DetermineContentUri( theDocument ) {
		var contentUrl = ancestor.getContentUri( theDocument, COMMAND_NAME );
		return contentUrl;
	}
}