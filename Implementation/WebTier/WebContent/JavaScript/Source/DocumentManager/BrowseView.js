// BrowseView.js

function BrowseView( theParentDocument, theName, theCaption, theURL ) {
	// inherit from DocumentView to make this object a View
	var ancestor = new DocumentView( theParentDocument, theName, theCaption, theURL );
  	inheritFrom( this, ancestor );
	this.getClassName = function() { return "BrowseView"; }

	//private static variables 
	var COMMAND_NAME = "ShowListView";
	
	//private instance variables
	var logger = null;
	var selectedId = null;
	var query = "";
	var listFromElement;
	var numberOflistedElement;
	var self = this;

	//public accessor methods
	this.getSelectedId = function() {return selectedId;}
	this.getQuery = function() {return query;}
	this.getListFromElement = function() {return listFromElement;}
	this.getNumberOflistedElement = function() {return numberOflistedElement;}
	this.getContentUri = _DetermineContentUri; 

	//public mutator methods
	this.setViewParameter = function(aQuery) {query = aQuery;}
	this.setSelectedId = function(selid) {selectedId = selid;}
	this.setListFromElement = function(aListFromElement) {listFromElement = aListFromElement;}
	this.setNumberOflistedElement = function(aNumberOflistedElement) {numberOflistedElement = aNumberOflistedElement;}

	_BrowseViewConstructor();
	
	//Constructors
	function _BrowseViewConstructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView.browseView" );
		logger.debug( "New 'BrowseView' was instantiated. name:" + self.getName() + "; caption:" + self.getCaption() + "; url:" + self.getBaseUrl() );
	}
	
	//private methods
	function _DetermineContentUri( theDocument ) {
		var contentUrl = ancestor.getContentUri( theDocument, COMMAND_NAME );
		if( query != null ) contentUrl += "&query=" + query;

		return contentUrl;
	}
}