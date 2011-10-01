// Document.js

function Document( theController, theDocumentType, theName, theGivenUri, theViewSelector, theTarget, theDocumentId ) {
//check parameter assertions
	if(theName == null || theName == "") throw new InvalidParameterException();		//theName can't be "" or null
	if(theController == null) throw new InvalidParameterException();				//theController can't be null

// inherit from CSimpleObservable to make this object an Observable
  	inheritFrom(this, new CSimpleObservable());

//private contants
	var ARTIFACT_TYPE_ELEMENT = "artifactType";
	var VIEWLIST_ELEMENT = "availableViews";
	var VIEW_CAPTION_ELEMENT = "viewCaption";
	var VIEW_CLASS_ELEMENT = "viewClassName";
	var VIEW_ACCESS_URL_ELEMENT = "viewAccessUrl";
	var VIEW_LISTED_ARTIFACT_TYPE = "listedArtifactType";
	var MENULIST_ELEMENT = "associatedMenuItems";
	var MENU_NAME_ELEMENT = "menuItem";
	var MENU_COMMAND_ELEMENT = "command";
	var ARTIFACT_CAPTION = "caption";
	var ARTIFACT_BASEURI = "baseUri";

//private instance variables
	var logger = null;
	var self = this;
	var controller = theController;
	var name = theName;
	var nameToShow = (name.indexOf(":")<0 ? name : name.substring(name.indexOf(":")+1));
	var artifactType = (theDocumentType == null ? "" : theDocumentType);
	var givenUri = theGivenUri;
	var baseUri = ""; // from ArtifactType...
	var caption = null; // from ArtifactType...
	var target = (theTarget == null ? "" : theTarget);
	var artifactId = (theDocumentId != null ? theDocumentId : null);
	var containingFrame = window;
	var viewSelector = theViewSelector; //new InvertedTabWidget();
	var possibleViews = new Collection();
	var defaultView = null;
	var viewNameToActivate = null;
	var activeView = null;
	var propertyFile = null;
	var isActive = false;
	var possibleMenus = new Collection();
	var dirty = false;

	// for Document lists
	var listedDocumentType = null;
	var selectedInstanceId = null;
	var selectedInstanceName = null;

//public accessor methods	
	this.getActiveView = function() { return activeView; }
	this.getBaseUri = function() { return baseUri; }
	this.getContainingWindow = function() {return containingFrame;}
	this.getDocumentId = function() { return artifactId; }
	this.getDocumentName = function() {return name;}
	this.getDocumentType = function() {return artifactType;}
	this.getListedDocumentType = function() {return listedDocumentType;}
	this.getNameToShow = function() {return nameToShow;}
	this.getPossibleMenus = function() {return possibleMenus;}
	this.getPossibleViews = function() {return possibleViews;}
	this.getPropertyFile = function() {return propertyFile;}
	this.getSelectedInstanceId = function() {return selectedInstanceId;}
	this.getSelectedInstanceName = function() {return selectedInstanceName;}
	this.getTarget = function() {return target;}
	this.getUrl = function() {return givenUri;}
	this.getViewForName = function(viewName) {return possibleViews.item(viewName);}
	this.getViewNameToActivate = function() {return viewNameToActivate;}	
	this.getViewSelector = function() {return viewSelector;}
	this.isDirty = function() {return dirty;}

	//public mutator methods
	this.setDocumentId = function( newId ) { artifactId = newId; }
	this.setToClean = function() {dirty = false;}
	this.setToDirty = function() {dirty = true;}
	this.setUrl = function( newUrl ) { givenUri = newUrl; }
	this.setViewNameToActivate = function(viewName) {viewNameToActivate = viewName;}
	this.getViewByClass = _GetViewByClass;
	this.save = _Save;
	this.cancel = _Cancel;
	this.open = _Open;
	this.activate = _Activate;
	this.deActivate = _DeActivate;
	this.mayDeActivate = _MayDeActivate;
	this.activateView = _ActivateView;
	this.observe = _OnEvent;
	// for Document lists
	this.setListedDocumentType = function(ldType) {listedDocumentType = ldType;} 
	this.setSelectedInstance = function(instId,instName) { 
		selectedInstanceId=instId;
		selectedInstanceName=instName;
	}

	_Constructor();
	
//Constructors	
	function _Constructor() {
		logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".document" );
		logger.debug( "New Document was instantiated." + " name:" + name + ", type:" + artifactType + ", givenUri:" + givenUri + ", id:" + artifactId + ", view:" + viewSelector );

		logger.group( "Setting up new Document.", false );
		
		var propertiesXML = controller.getArtifactTypes().get( artifactType );
		if( propertiesXML ) {
			for(var i=0; i < propertiesXML.childNodes.length; i++) {
				var aChild = propertiesXML.childNodes[i];
				if( aChild.nodeName == ARTIFACT_CAPTION ) caption = aChild.text;
				else if( aChild.nodeName == ARTIFACT_BASEURI ) baseUri = aChild.text;
			}
			_SetUpPossibleViews(propertiesXML);
			_SetUpPossibleMenus(propertiesXML);
		}

		if(!defaultView && possibleViews.getCountOfObjects() > 0 ) defaultView = possibleViews.getItemByIndex(0);
		logger.debug( "Setting up new Document is finished. name:" + name + ", type:" + artifactType );
		logger.groupEnd();
	}

//private methods
	function _GetText(key,defaultValue) {
		return controller.getText(key,defaultValue);
	}

	function _Save() {
		//...
		dirty = false;
	}

	function _Cancel() {
		//...
		dirty = false;
	}

	function _Open() {
		_RefreshContent();
	}

	function _RefreshContent() {
		var contentUri = null;
		if(parent.frames.length != 0 && parent.frames[target] != undefined) {
			containingFrame = parent.frames[target];
			contentUri = activeView.getContentUri( self );
			containingFrame.location.href = contentUri;
			logger.debug( "Refreshing document: '" + name + "' in frame: '" + containingFrame.name + "' with VIEW's uri: '" + contentUri + "' was refreshed.");
		}
		else {
			containingFrame = window.open( activeView.getContentUri(self), "newWindow" );
		}
	}

	function _RefreshContentWithUrl() {
		if(parent.frames.length != 0 && parent.frames[target] != undefined) {
			containingFrame = parent.frames[target];
			containingFrame.location.href = givenUri;
			logger.debug( "Refreshing document: '" + name + "' in frame: '" + containingFrame + "' with DOCUMENT's uri: '" + givenUri + "' was refreshed.");
		}
		else {
			containingFrame = window.open(givenUri, "newWindow");
		}
	}

	function _Activate() {
		if(!isActive) {
			isActive = true;
			if( possibleViews.getCountOfObjects() > 0 ) {
				possibleViews.moveFirst();
				var aView;
				while(aView = possibleViews.getNext()) {
					viewSelector.addNewTab(aView.getCaption(), controller.getText(aView.getCaption()), aView, true);
				}
				viewSelector.show(true);
				if(viewNameToActivate) _ActivateView(viewNameToActivate);
				else _ActivateView(defaultView.getName());
			}
			else {
				_RefreshContentWithUrl();
			}
		}
	}

	function _DeActivate() {
		if(isActive) {
			isActive = false;
			if(possibleViews.getCountOfObjects() > 0) {
				if(activeView) activeView.deActivate();
				viewSelector.hide();
				viewSelector.removeAllTabs();
			}
		}
	}

	function _DetermineViewAccessUri( predefinedViewAccessUri ) {
		var determinedUri = null;
		if( predefinedViewAccessUri != null && predefinedViewAccessUri != "" ) {
			determinedUri = predefinedViewAccessUri;
		}else determinedUri = null;
		
		/*
		if( artifactType == "" ) determinedUri = givenUri;
		else determinedUri = aViewElement.text;
		
		if( artifactType != null && artifactType != "" ) { // ha van artifactType,
			if( givenUri != null && givenUri != "") determinedUri += givenUri; // akkor az 'givenUri' a plusz parameter!
			if( baseUri != null && baseUri != "") determinedUri = baseUri + determinedUri; // akkor a tenyleges givenUri a 'baseUri'-el kezdodik!
		}
		*/
		
		return determinedUri;
	}
	
	function _DetermineViewName( viewClassName, predefinedViewName ) {
		var determinedViewName;
		if( viewClassName != null && viewClassName != "" ) {
			var lastDot = viewClassName.lastIndexOf(".");
			determinedViewName = viewClassName.substr( lastDot + 1 );
		}else determinedViewName = predefinedViewName;
		
		return determinedViewName;
	}
		
	function _MayDeActivate() {
		if(dirty && !confirm("Modositas tortent! Az OK gomb lenyomasara az adatok elvesznek!\nBiztosan kilep?")) return false;
		else if(dirty) _Cancel();
		return true;
	}

	function _ActivateView(viewName) {
		if(isActive) {
			activeView = possibleViews.item(viewName);
			viewSelector.activateTab(activeView.getCaption());
		}
	}

	function _OnEvent( theEvent ) {
		logger.trace( "Handling event.", theEvent );
		if(theEvent instanceof ViewActivationEvent) {
			activeView = possibleViews.item(theEvent.getDocumentView().getName());
			_RefreshContent();
			theEvent.setDocument(self);
			self.notify(theEvent);
		}
		if(theEvent instanceof ViewDeActivationEvent) {
			theEvent.setDocument(self);
			self.notify(theEvent);
			viewNameToActivate = theEvent.getDocumentView().getName();
		}
	}

	function _RetrieveMenus( menuItemsXML ) {
		var retmenus = new Collection();
		logger.trace( "Determining view's menus.", menuItemsXML );

		for(var rj = 0; rj < menuItemsXML.childNodes.length; rj++) {	//retrieve associated menus
			var aMenu = menuItemsXML.childNodes[rj];
			var menuName = null, menuCommand = null;

			if( aMenu.nodeName == MENU_NAME_ELEMENT ) {
				for( var i=0; i < aMenu.attributes.length; i++ ) {
					var attributeNode = aMenu.attributes[i];
					if( attributeNode.name == "name" )
						menuName = attributeNode.value;
				}
			}
			
			logger.trace( "Menu element found: ", menuName );
			
			for( var rk = 0; rk < aMenu.childNodes.length; rk++ ) {	//retrieve sub elements
				var aMenuElement = aMenu.childNodes[rk];
				
				if( aMenuElement.nodeName == MENU_COMMAND_ELEMENT ) {
					var commandName=null, commandType=null, commandStatement=null, commandDesc=null;
					var customPrefix=null;

					for(ra = 0; ra < aMenuElement.attributes.length; ra++) {	//retrieve element attributes
						var attributeNode = aMenuElement.attributes[ra];
						if(attributeNode.name == "name") commandName = attributeNode.value;
						if(attributeNode.name == "type") commandType = attributeNode.value;
						if(attributeNode.name == "actionStatement") commandStatement = attributeNode.value;
						if(attributeNode.name == "description") commandDesc = attributeNode.value;
						if(attributeNode.name == "customPrefix") customPrefix = attributeNode.value;
					}

					logger.trace( "Command element found: ", commandName );
					
					switch( commandType ) {
					case 'CustomCommand':
						if (customPrefix != null && customPrefix != "" )
							menuCommand = eval("new "+customPrefix+"CustomCommand()");
						else
							menuCommand = new CustomCommand(commandStatement);
						break;
					case 'PrintActiveDocumentCommand':
						menuCommand = new PrintActiveDocumentCommand();
						break;
					case 'CloseActiveDocumentCommand':
						menuCommand = new CloseActiveDocumentCommand();
						break;
					case 'OpenDocumentSelectedInListCommand':
						menuCommand = new OpenDocumentSelectedInListCommand();
						break;
					default:
						exception = new UserException("Undefined command: " + commandType, "Document._SetUpPossibleViews()");
						throw exception;
					}										
				}					
			}
			var menuObject = new Object();
			menuObject.name = menuName;
			menuObject.command = menuCommand;
			retmenus.add(menuName,menuObject);
		}
		return retmenus;	
	}

	function _SetUpPossibleViews( propertiesXML ) {
		logger.trace( "Setting up possible views.", propertiesXML );
		
		if( propertiesXML ) {
			//Instantiate possible views
			var views = propertiesXML.getElementsByTagName( VIEWLIST_ELEMENT );
			if( views.length > 0 ) {
				for( n = 0; n < views[0].childNodes.length; n++ ) {	//retrieve associated views
					var aView = views[0].childNodes[n];
					var isDefaultView = false;
					var isStatic = false;
					var viewName = null, viewType = null, viewAccessUri = null, viewCaption = null, viewClassName = null;

					for(a = 0; a < aView.attributes.length; a++) {	//retrieve element attributes
						var attributeNode = aView.attributes[a];
						if(attributeNode.name == "name") viewName = attributeNode.value;
						if(attributeNode.name == "clientType") viewType = attributeNode.value; 
						if(attributeNode.name == "viewClassName") viewClassName = attributeNode.value; 
						if(attributeNode.name == "isDefault" && attributeNode.value == "true" ) isDefaultView = true;
						if(attributeNode.name == "isStatic" && attributeNode.value == "false" ) isStatic = false;
					}
					
					viewName = _DetermineViewName( viewClassName, viewName );
					logger.trace( "View element found in business definition. name:" + viewName + ", type:" + viewType + ", isDefault:" + isDefaultView + ", isStatic:" + isStatic );

					for(i = 0; i < aView.childNodes.length; i++) {	//retrieve sub elements
						var aViewElement = aView.childNodes[i];
						if( aViewElement.nodeName == VIEW_CAPTION_ELEMENT ) {
							viewCaption = aViewElement.text;
						}else if( aViewElement.nodeName == VIEW_ACCESS_URL_ELEMENT ) {
							viewAccessUri = _DetermineViewAccessUri( aViewElement.text );
						}
					}

					//Instantiate a new view, and assign to the document
					switch( viewType ) {
						case 'PropertyView':
							logger.trace( "'PropertyView' should be instantiated." );
							var theView = new PropertyView( this, viewName, viewCaption, viewAccessUri );
							break;
						case 'NativeView':
							logger.trace( "'NativeView' should be instantiated." );
							var theView = new NativeView( this, viewName, viewCaption, viewAccessUri );
							break;
						case 'BrowseView':
							logger.trace( "'BrowseView' should be instantiated." );
							var theView = new BrowseView( this, viewName, viewCaption, viewAccessUri );
							listedDocumentType = aView.getAttribute(VIEW_LISTED_ARTIFACT_TYPE );
							break;
						case 'PrintView':
							logger.trace( "'PrintView' should be instantiated." );
							var theView = new PrintView( this, viewName, viewCaption, viewAccessUri );
							break;
						case 'EditableHtmlView':
							logger.trace( "'EditableHtmlView' should be instantiated." );
							var theView = new EditableHtmlView( this, viewName, viewCaption, viewAccessUri );
							break;
						case 'EditableTextView':
							logger.trace( "'EditableTextView' should be instantiated." );
							var theView = new EditableTextView( this, viewName, viewCaption, viewAccessUri );
							break;
						case 'ListQueryView' :
							logger.trace( "'ListQueryView' should be instantiated." );
							var theView = new ListQueryView( this, viewName, viewCaption, viewAccessUri );
							break;
						case 'CustomFormView':
							logger.trace( "'CustomFormView' should be instantiated." );
							var theView = new CustomFormView( this, viewName, viewCaption, viewAccessUri );
							break;
						default:
							exception = new UserException("Undefined view: " + viewType, "Document._SetUpPossibleViews()");
							throw exception;
					}

					logger.trace( "New View was instantiated: " + theView.getName() );
					
					if( isStatic == false ) theView.setToDynamic();

					// ********** SEARCHING MENU ITEMS FOR VIEW **********
					for(i = 0; i < aView.childNodes.length; i++) {	
						var aViewElement = aView.childNodes[i];
						if( aViewElement.nodeName == MENULIST_ELEMENT ) {
							var menuCollection = _RetrieveMenus(aViewElement);
							theView.setPossibleMenus(menuCollection);
						}
					}
				
					possibleViews.add(theView.getName(), theView);
					theView.addObserver(self);
					if(isDefaultView) defaultView = theView;
				}
			} else {} // kulonben nincs viewje....

			//Instantiate possible menus
			var menus = propertiesXML.getElementsByTagName(MENULIST_ELEMENT);
			if(menus.length > 0) {
					possibleMenus=_RetrieveMenus(menus[0]);
			}
		}
	}

	function _SetUpPossibleMenus(propertiesXML) {
		logger.debug( "Setting up possible menus.", propertiesXML );
	}

	function _GetViewByClass(className) {
		if (possibleViews.getCountOfObjects() > 0) {
			possibleViews.moveFirst();
			var aView;
			while(aView = possibleViews.getNext()) {
				if(aView.getClassName() == className) return aView;
			}
		}
		return null;
	}
}