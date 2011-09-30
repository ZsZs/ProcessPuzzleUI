// TabWidget.js
/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var TabWidget  = new Class({
   Extends : BrowserWidget,
   Binds : ['onClose', 'webUIMessageHandler'],
   
   options : {
   	TABCLASSNAME : "Tabs",
   	BUTTONCLASSNAME : "Buttons",
		backgroundImage : "Images/bg.gif",
   	buttonPrefix : "button_",
   	closeButtonCaptionKey : "TabWidget.Close",
   	printButtonCaptionKey : "TabWidget.Print",
      showCloseButton : false,
      showCloseButtonSelector : "/pp:tabWidgetDefinition/tabWidget/@showCloseButton",
		showPrintButton : false,
      showPrintButtonSelector : "/pp:tabWidgetDefinition/tabWidget/@showPrintButton",
      subscribeToWebUIMessages : [TabSelectedMessage],
      tabCaptionSelector : "@caption",
      tabIdSelector : "@tabId",
      tabIsDefaultSelector : "@isDefault",
		tabLeftImage : "Images/left.gif",
		tabRightImage : "Images/right.gif",
		tabLeftOnImage : "Images/left_on.gif",
		tabRightOnImage : "Images/right_on.gif",
      tabsSelector : "tab",
		widgetContainerId : "TabWidget",
		widgetContainerIdSelector : "/pp:tabWidgetDefinition/tabWidget/@tabWidgetId",
		widgetDefinitionSelector : "/pp:tabWidgetDefinition/tabWidget",
      widgetDefinitionURI : "TabsDefinition.xml"
   },
   
   //Constructor
   initialize: function( options, resourceBundle ){
      this.setOptions( options );
      this.parent( options, resourceBundle );

      //Private instance variables
   	this.activeTab = null;
   	this.buttonsContainerElement = null;
   	this.isVisible = false;
   	this.tabs = new LinkedHashMap();
   	this.tabsContainerElement;
   },
   
	//Public accessor and mutator methods
	activateTab: function( tabName ) {
		if( this.activeTab != null ) this.activeTab.deActivate();
		this.tabs.get( tabName ).activate();
		this.activeTab = this.tabs.get( tabName );
		//this.notify( new TabActivationEvent( this, activeTab, "TabActivationEvent" ));
	},
	
	addNewTab : function( tabName, tabCaption, objectToSelect, doNotActivate ){
		if( this.tabs.get( tabName ) != null ) throw new DuplicatedTabException( {tabName : tabName} );

		var newTab = new Tab( tabName, this.getText( tabCaption ), this.containerElement, objectToSelect );
		if( this.isVisible ) newTab.configure();
		this.tabs.put( tabName, newTab );
		
		if( doNotActivate == null || ( doNotActivate != null && doNotActivate == false )) 
			this.activateTab( tabName );
	},
	
	changeCaptions : function( controller ) {
		tabs.moveFirst();
		var aTab;
		while(aTab = tabs.getNext()) {
			if(aTab.changeCaption != null) aTab.changeCaption(controller);
		}
	},
	
	configure : function( doNotActivate ) {
		if( this.isVisible ) return;
		this.insertULElement();
		this.processWidgetDefinition();
		this.configureTabs( doNotActivate );
		this.configureButtons();
		this.isVisible = true;
		this.parent();
	},
	
	destroy: function() {
		if( this.tabsContainerElement ){
			this.tabs.each( function( entry, index ){ entry.getValue().destroy(); }, this );
			this.tabsContainerElement.removeEvents();
			this.tabsContainerElement.destroy();
		}
		
		if( this.buttonsContainerElement ){
			this.buttonsContainerElement.removeEvents();
			this.buttonsContainerElement.destroy();
		}
		
      this.parent();
	},
	
	moveFirstToLast : function() {
		var tabList=null;
		if(htmlDivElement != null) {
			var tabLists = htmlDivElement.getElementsByTagName("ul");
			for(var i=0; i < tabLists.length; i++)
				if(tabLists[i].className == TABCLASSNAME) tabList = tabLists[i];
		}
		if(tabList == null) return;
		var firstChild=tabList.firstChild;
		if(firstChild != null)
			tabList.appendChild(firstChild);
	},
	
	moveLastToFirst : function() {
		var tabList=null;
		if(htmlDivElement != null) {
			var tabLists = htmlDivElement.getElementsByTagName("ul");
			for(var i=0; i < tabLists.length; i++)
				if(tabLists[i].className == TABCLASSNAME) tabList = tabLists[i];
		}
		if (tabList == null) return;
		var firstChild=tabList.firstChild;
		if(firstChild != null) {
			var lastChild=tabList.lastChild;
			if(firstChild!=lastChild) tabList.insertBefore(lastChild,firstChild);
		}
	},

	onClose : function() {
		if( this.activeTab ) {
			this.removeTab( this.activeTab.getName() );
		}
	},
	
	onPrint : function() {
	},

	removeAllTabs : function() {
		this.tabs.each( function( entry, index ){
			var tab = entry.getValue();
			tab.destroy();
		}, this );
		
		this.tabs.clear();
		this.activeTab = null;
	},
	
	removeTab : function( tabName ) {
		var nextTab = this.tabs.next( this.activeTab.getName() );
		var previousTab = this.tabs.previous( this.activeTab.getName() );
				
		if( nextTab != null && !nextTab.getName().equals( tabName )) this.activateTab( nextTab.getName() );
		else if( previousTab != null && !previousTab.getName().equals( tabName ) ) this.activateTab( previousTab.getName() );
			
		this.tabs.get( tabName ).destroy();
		this.tabs.remove( tabName );
		if( this.tabs.size() == 0 ) this.activeTab = null;
	},
	
	replaceDocumentOfTab : function( tabName, objectToSelect ) {
		if( logger.getLevel() == log4javascript.Level.TRACE ) logger.trace( "Replace document of the tab.", tabName, objectToSelect );
		var tab = tabs.item( tabName );
		if( tab == 'undefined' ) throw new UndefinedItemException( tabName );
		
		tab.replaceObjectToSelect( objectToSelect );
	},
   
	webUIMessageHandler: function( webUIMessage ){
		if( !webUIMessage.getTabId().equals( this.activeTab.getId() )){
			this.activeTab.deActivate();
			this.activeTab = this.tabs.get( webUIMessage.getTabId() );
			this.activeTab.activate();
	}
   	
		this.parent();
   },
		
   //Properties
	activeTabId : function() { return ( tabs.getCountOfObjects() > 0 ? activeTab.getId() : "undefined"); },
	isCloseButtonVisible : function() { return this.options.showCloseButton; },
	isPrintButtonVisible : function() { return this.options.showPrintButton; },
	isVisible : function() { return this.isVisible; },
	getActiveTab : function() { return this.activeTab; },
	getCloseButtonId : function() { return this.options.buttonPrefix + this.options.closeButtonCaptionKey; }, 
	getPrintButtonId : function() { return this.options.buttonPrefix + this.options.printButtonCaptionKey; }, 
	getTabByName : function( tabName ) { return this.tabs.get( tabName ); },
	getTabCount : function() { return this.tabs.size(); },
	getTabExist : function( tabName ) {return tabs.exists(tabName); },
	setCloseButtonVisibility : function( value ) { this.options.showCloseButton = value; },
	setPrintButtonVisibility : function( value ) { this.options.showPrintButton = value; },
	setBackgroundImage : function(image) {backgroundImage = (image == null ? backgroundImage : image);},
	setTabLefImage : function(image) {tabLeftImage = (image == null ? tabLeftImage : image);},
	setTabRightImage : function(image) {tabRightImage = (image == null ? tabRightImage : image);},
	setTabLeftOnImage : function(image) {tabLeftOnImage = (image == null ? tabLeftOnImage : image);},
	setTabRightOnImage : function(image) {tabRightOnImage = (image == null ? tabRightOnImage : image);},
	
	//Private methods
	configureButtons: function() {
		if( this.options.showCloseButton || this.options.showPrintButton ) {
			this.buttonsContainerElement = this.appendNewUnOrderedList({ 'class': this.options.BUTTONCLASSNAME });
			if( this.options.showCloseButton ) this.createButton( this.options.closeButtonCaptionKey, this.onClose );
			if( this.options.showPrintButton ) this.createButton( this.options.printButtonCaptionKey, this.onPrint );
		}
	}.protect(),
	
	configureTabs: function( doNotActivate ){
		this.tabs.each( function( mapEntry, index ){
			var tabName = mapEntry.getKey();
			var tab = mapEntry.getValue();
			tab.configure();
		}, this );

		if( ( doNotActivate == null || ( doNotActivate != null && doNotActivate == false ) ) && ( this.tabs.size() > 0 ) )
			this.activateTab( this.tabs.get( this.tabs.firstKey() ).getName() );
	}.protect(),
	
	createButton: function( caption, onClickHandler ) {
		var listItem = this.appendNewListItem( null, this.buttonsContainerElement );
		var anchorProperties = { href : "#", id : this.options.buttonPrefix + caption };
		var anchor = this.appendNewAnchor( anchorProperties, caption.replace( / /g, String.fromCharCode(160)), onClickHandler, listItem );
	}.protect(),
	
	determineShowCloseButton: function() {
		return this.definitionXml.selectNode( this.options.showCloseButtonSelector ).nodeValue;
	}.protect(),
	
	determineShowPrintButton: function() {
		return this.definitionXml.selectNode( this.options.showPrintButtonSelector ).nodeValue;
	}.protect(),
	
	determineTabDefinition: function( parentDefinitionElement, index ){
		return this.definitionXml.selectNodes( this.options.tabsSelector, parentDefinitionElement )[index];
	}.protect(),
	
	determineTabDefinitions: function( parentDefinitionElement ){
		return this.definitionXml.selectNodes( this.options.tabsSelector, parentDefinitionElement );
	}.protect(),
	
	determineTabCaption: function( tabDefinition ){
		var tabCaption = this.definitionXml.selectNode( this.options.tabCaptionSelector, tabDefinition ).nodeValue; 
		return this.getText( tabCaption );
	}.protect(),
	
	determineTabId: function( tabDefinition ){
		return this.definitionXml.selectNode( this.options.tabIdSelector, tabDefinition ).nodeValue;
	}.protect(),
	
	determineTabIsDefault: function( tabDefinition ){
		var node = this.definitionXml.selectNode( this.options.tabIsDefaultSelector, tabDefinition );
		if( node ) return node.nodeValue;
		else return false;
	}.protect(),
	
	determineTabWidgetId: function() { 
		return this.definitionXml.selectNode( this.options.widgetContainerIdSelector ).nodeValue;
	}.protect(),
	
	determineWidgetDefinitionElement: function() {
		return this.definitionXml.selectNode( this.options.widgetDefinitionSelector );
	}.protect(),
	
	processWidgetDefinition: function(){
		if( this.definitionXml == null ) return;
		
		var widgetDefinitionElement = this.determineWidgetDefinitionElement();
		this.options.widgetContainerId = this.determineTabWidgetId();
		this.options.showCloseButton = this.determineShowCloseButton();
		this.options.showPrintButton = this.determineShowPrintButton();
		
		for( var i = 0; i < this.determineTabDefinitions( widgetDefinitionElement ).length; i++ ){
			var tabDefinition = this.determineTabDefinition( widgetDefinitionElement, i );
			var id = this.determineTabId( tabDefinition );
			var caption = this.determineTabCaption( tabDefinition );
			var isDefault = this.determineTabIsDefault( tabDefinition );
			var tab = new Tab( id, caption, this.containerElement );
			this.tabs.put( id, tab );
		}
	}.protect(),

	hideButtons: function() {
		if(htmlDivElement != null) {
			var tabLists = htmlDivElement.getElementsByTagName("ul");
			for(var i=0; i<tabLists.length; i++){
				if(tabLists[i].className == BUTTONCLASSNAME) {
					var tabList = tabLists[i];
					htmlDivElement.removeChild(tabList);			//removes the list to 'tab' division
				}
			}
		}
		else throw new UserException("Division not defined", "TabWidget._RemoveUnorderedListTag()");
	}.protect(),

	insertULElement : function() {
		this.tabsContainerElement = this.appendNewUnOrderedList({ 'class': this.options.TABCLASSNAME });
	}.protect(),

	removeUnorderedListTag: function() {
		if(htmlDivElement != null) {
			var tabLists = htmlDivElement.getElementsByTagName("ul");
			for(var i=0; i<tabLists.length; i++){
				if(tabLists[i].className == this.options.TABCLASSNAME ) {
					var tabList = tabLists[i];
					htmlDivElement.removeChild(tabList);			//removes the list to 'tab' division
				}
			}
		}
		else throw new UserException("Division not defined", "TabWidget._RemoveUnorderedListTag()");
	}.protect(),
	
	saveComponentState: function( delimiter ) {
		var save = "";
		if(this.activeTab != null) save = save + delimiter + this.activeTab.caption;
		else save = save + delimiter + "null";
		for(var i=1; i<=this.tabs.getCountOfObjects(); i++) {
			var atab = this.tabs.getItemByIndex(i-1);
			save = save + delimiter +
			atab.caption + delimiter +
			atab.state + delimiter +
			atab.id;
		}
		return save;
	}.protect()

});