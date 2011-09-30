// Tab.js

var Tab = new Class({
   Implements : Options,
   Binds: ['onClickEventHandler', 'webUIMessageHandler'],
   
   options: {
      cssClass: "Tabs",
      idPrefix: "tab_"
   },
   
   //Constructor
   initialize: function( theName, theCaption, theWidgetElement, theObjectToSelect ) {
   	//check parameter assertions
   	if( theCaption==null || theCaption == "") throw new InvalidParameterException(theCaption);		//theCaption can't be "" or null
   	if( theName==null || theName=="") throw new InvalidParameterException(theName);				//theName can't be "" or null
   	if( theWidgetElement==null) throw new InvalidParameterException(theWidgetElement);			//theWidgetElement can't be "" or null
   	if( theObjectToSelect && theObjectToSelect.activate == null ) throw new InvalidParameterException("The ObbectToSelect should have implement activate() method!");

   	// inherit from CSimpleObservable to make this object an Observable
     	//inheritFrom(this, new CSimpleObservable());
   
   	//private instance variables
   	this.logger = null;
   	this.name = theName;
   	this.caption = theCaption;
   	this.widgetElement = theWidgetElement;
   	this.objectToSelect = theObjectToSelect;
   	this.visible = false;
   	this.active = false;
   	this.id = this.options.idPrefix + name;
   	this.self = this;
   
   	this.anchorElement;
   	this.anchorText;
   },
   
	//public mutators methods
   activate: function() {
      if( this.isVisible() ) {
         this.active = true;
         this.setListItemId( "current" );
         if(objectToSelect && objectToSelect.activate) objectToSelect.activate();
      }
   },
   
   changeCaption: function( controller ) {
      this.caption = controller.getText( this.name );
      if( this.anchorElement != null && this.anchorText != null) {
         this.anchorElement.removeChild( this.anchorText );
         var nb_caption = caption.replace(/ /g,String.fromCharCode( 160 ));
         this.anchorText = document.createTextNode( nb_caption );
         this.anchorElement.appendChild( this.anchorText );
      }
   },
   
   deActivate: function() {
      if( this.isVisible() ) {
         this.active = false;
         this.setListItemId( "" );
         if( this.objectToSelect && this.objectToSelect.deActivate ) this.objectToSelect.deActivate();
      }
   },
   
	hide: function() {
      if( this.isVisible() ) this.removeListItem(); //Removes the <li> html tag from the html document which represented the tab
      this.visible = false;
      this.active = false;
   },
   
	mayDeActivate: function() {
      if( this.objectToSelect && this.objectToSelect.mayDeActivate && !this.objectToSelect.mayDeActivate() ) return false;
      else return true;
   },

   onClickEventHandler: function( theEvent ) {
      this.browserEvent = new BrowserEvent( theEvent );  
      if(( this.browserEvent.getType() == "click" ) 
         && ( this.browserEvent.getSourceElement().tagName.toUpperCase() == "A" ) 
         && ( this.browserEvent.getSourceElement().id == this.id )){
         this.notify( this );
      }
   },
   
   show: function(){
      this.insertListItem();               //Add a <li> html tag into the html document to represent the tab
      this.visible = true;
   },

   replaceObjectToSelect: function() {
   },
   
   webUIMessageHandler: function( message ){
   },
		
   //Properties
   getCaption: function() { return this.caption; },
   getId: function() { return this.id; },
   getName: function() { return this.name; },
   getObjectToSelect: function() { return this.objectToSelect; },
   isActive: function() { return this.active; },
   isVisible: function() { return this.visible; },

	//private helper methods
	insertListItem: function() {
		if( this.widgetElement != null ) {
			//locate the <ul class='Tab"> list within tab division
			var elements = this.widgetElement.getElementsByTagName( "ul" );
			for( var i=0; i < elements.length; i++ ) {
				if( elements[i].getAttributeNode("class").value == "Tabs") {
					var tabList = elements[i];
					break;
				}
				else throw new UserException( "Unordered list not defined", "TabWidget.addTab()" );
			}
			if( tabList != null && tabList.tagName == "UL") {
				var listItem = document.createElement("li");
				var anchor = document.createElement("a");
				var nb_caption = this.caption.replace(/ /g,String.fromCharCode(160));
				this.anchorText = document.createTextNode(nb_caption);
				
				anchor.setAttribute("href", "#");
				anchor.setAttribute("id", id);
				this.anchorElement = anchor;

				//Add click event listener
				if( typeof anchor.addEventListener != 'undefined' ) {		//DOM 2 event handling
					anchor.addEventListener( 'click', onClickEventHandler, false );
				}else if(typeof anchor.attachEvent != 'undefined') {		// IE5+ event handling
					anchor.attachEvent('onclick', _OnClickEventHandler);
				}else {anchor.onclick = _OnClickEventHandler;}				// IE4 event handling
				
				anchor.appendChild(anchorText);
				listItem.appendChild(anchor);
				var tlFirstChild=tabList.childNodes[0];
				if (tlFirstChild!=null)
					tabList.insertBefore(listItem,tlFirstChild);
				else
					tabList.appendChild(listItem);				//append list item to 'tab' division

			}
			else {
				exception = new UserException("Unordered list not defined", "TabWidget.addTab()");
				throw exception;
			}
		}
		else {
			exception = new UserException("Division not defined", "TabWidget.Constructor()");
			throw exception;
		}
	}.protect(),

	removeListItem: function() {
		if( this.anchorElement != null) {
			this.listItem = this.anchorElement.parentNode;			
			this.list = this.listItem.parentNode;						
			var throwawayItem = this.list.removeChild( this.listItem );
		}
		else throw new UserException( "Specified tab can't be removed.", "TabWidget.removeTab()" );
	}.protect(),

	replaceObjectToSelect: function( theObjectToSelect ) {
		if( this.logger.getLevel() == log4javascript.Level.TRACE ) this.logger.trace( "Trying replace object:", theObjectToSelect );
		this.objectToSelect = theObjectToSelect;
		alert("Whith this tab:" + this.name + " this object can be selected. type:'" + this.objectToSelect.getDocumentType() + "', name:'" + this.objectToSelect.getDocumentName() + "', id:'" + objectToSelect.getDocumentId() + "'" );
	}.protect(),
	
	setListItemId: function( listItemId ) {
		if( this.anchorElement != null ) {
			this.listItem = this.anchorElement.parentNode;				//retreive the parent list item node
			this.listItem.set( "id", listItemId );
		}
		else throw new UserException("Specified tab not found", "TabWidget.activateTab()");
	}.protect()
});
