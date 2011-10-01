// DocumentList.js

// Constructor
function DocumentList(theListedDocumentType, theName, theUrl, theDocumentType, theViewSelector, theTarget ) {
	// inherit from Document
  	inheritFrom( this, new Document(theName, theUrl, theDocumentType, theViewSelector, theTarget ));

	//private contants

	//private instance variables
	var listedDocumentType = theListedDocumentType;
	var selectedInstanceId = null;
	var selectedInstanceName = null;
	var self = this;

	//public accessor methods
	this.getListedDocumentType = function () { return listedDocumentType; }
	this.getSelectedInstanceId = function () { return selectedInstanceId; }
	this.getSelectedInstanceName = function () { return selectedInstanceName; }

	//public mutator methods
	this.setSelectedInstance = function( id, name ) { 
		selectedInstanceId = id;
		selectedInstanceName = name;
	}

	_Constructor();

	//Constructors	
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".documentList" );
		logger.debug( "New DocumentList should be created.", name, documentType, url, documentId, viewSelector );
	}
	//private methods
}