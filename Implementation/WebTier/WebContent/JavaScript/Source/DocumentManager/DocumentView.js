// DocumentView.js

function DocumentView( theParentDocument, theName, theCaption, theURI ) {

	// inherit from CSimpleObservable to make this object an Observable
  	inheritFrom( this, new CSimpleObservable() );

	//private static variables 
	var COMMAND_NAME = "ShowView";
	
	//private instance variables
	var logger = null;
	var parentDocument = theParentDocument;
	var name = theName;
	var caption = theCaption;
	var uri = theURI;
	var isStatic = true;
	var viewParameter = null;
	var isActive = false;
	var self = this;
	var possibleMenus = new Collection();

	//public accessor methods
	this.isStatic = function() { return isStatic; }
	this.isActive = function() { return isActive; }
	this.getBaseUrl = function() { return uri; }
	this.getCaption = function() { return caption; }
	this.getClassName = function() { return "DocumentView"; }
	this.getContentUri = _DetermineContentUri; 
	this.getName = function() { return name; }
	this.getParentDocument = function() { return parentDocument; }
	this.getPossibleMenus = function() { return possibleMenus; }

	//public mutator methods
	this.setBaseUrl = function( newUri ) { uri = newUri; } 
	this.setToDynamic = function() { isStatic = false; }
	this.setPossibleMenus = function(posMenus) { possibleMenus = posMenus; }
	this.setViewParameter = function(aParameter) { viewParameter = aParameter; }
	this.activate = _Activate;
	this.deActivate = _DeActivate;

	_Constructor();
	
	//Constructors
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document.documentView" );
		logger.trace( "New document view was instantiated. name:" + name + "; caption:" + caption + "; uri:" + uri );
	}
	
	//private methods
	function _Activate() { 
		if(!isActive) {
			isActive = true;
			logger.debug( "Document view:" + name + " was activated." );
			self.notify( new ViewActivationEvent( this ));
		}
	}

	function _DeActivate() {
		if(isActive) {
			isActive = false;
			logger.debug( "Document view:" + name + " was deactivated." );
			self.notify( new ViewDeActivationEvent( this ));
		}
	}

	function _DetermineContentUri( theDocument, theCommand ) {
		logger.group( "Determine content uri.", false );
		var command = ( theCommand != null ? theCommand : COMMAND_NAME );
		var determinedContentUri = null;
		if( isStatic ) { 
			determinedContentUri = theDocument.getBaseUri() + uri;
			logger.trace( "View is static, so the uri is:" + determinedContentUri );
		}
		else {
			determinedContentUri = theDocument.getBaseUri() + FRONT_CONTROLLER;
			determinedContentUri += "?action=" + command;
			if( theDocument.getDocumentId() != null ) {
				determinedContentUri += "&artifactId=" + theDocument.getDocumentId() + "&artifactType=" + theDocument.getDocumentType() + "&viewName=" + name;
				logger.trace("The document has id, so the content uri is: " + determinedContentUri );
			}else {
				determinedContentUri += "&artifactName=" + theDocument.getDocumentName() + "&artifactType=" + theDocument.getDocumentType() + "&viewName=" + name;
				logger.trace("The document itselft has no id, so the content uri is: " + determinedContentUri );
			}
		}
		
		if( viewParameter != null ) determinedContentUri += "&viewParam=" + viewParameter;
		logger.trace( "View's determined uri is:" + determinedContentUri );
		logger.groupEnd();
		return determinedContentUri;
	}
}