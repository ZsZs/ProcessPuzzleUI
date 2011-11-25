//Tab.js
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

var Tab = new Class({
   Implements : Options,
   Binds: ['onClickEventHandler', 'webUIMessageHandler'],
   
   options: {
      componentName: "Tab",
      currentTabId: "current",
      idPrefix: "tab_",
      tabsStyle: "Tabs"
   },
   
   //Constructor
   initialize: function( theName, theCaption, theWidgetElement, theObjectToSelect ) {
      //check parameter assertions
      if( theCaption == null || theCaption == "") throw new IllegalArgumentException( "caption", theCaption );
      if( theName == null || theName == "") throw new IllegalArgumentException( "name", theName );	
      if( theWidgetElement == null ) throw new IllegalArgumentException( "widgetElement", theWidgetElement );
      if( theObjectToSelect && theObjectToSelect.activate == null ) throw new IllegalArgumentException( "objectToSelect", theObjectToSelect );

      //private instance variables
      this.active = false;
      this.anchorElement;
      this.caption = theCaption;
      this.id = this.options.idPrefix + theName;
      this.listItemElement;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus =  Class.getInstanceOf( WebUIMessageBus );
      this.name = theName;
      this.objectToSelect = theObjectToSelect;
      this.visible = false;
      this.widgetElement = theWidgetElement;
   },
   
   //public mutators methods
   activate: function() {
      if( this.isVisible() ) {
         this.active = true;
         this.setListItemId( this.options.currentTabId );
         if( this.objectToSelect && this.objectToSelect.activate ) this.objectToSelect.activate();
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
   
   construct: function(){
      this.insertNewLIElement();
      this.visible = true;
   },

   deActivate: function() {
      if( this.isVisible() ) {
         this.active = false;
         this.setListItemId( "" );
         if( this.objectToSelect && this.objectToSelect.deActivate ) this.objectToSelect.deActivate();
      }
   },
   
   destroy: function() {
      if( this.isVisible() ) this.removeLIElement();
      this.visible = false;
      this.active = false;
   },
   
   equals: function( otherTab ){
   	if( !instanceOf( otherTab, Tab )) return false;
   	return this.id.equals( otherTab.id );
   },
   
   mayDeActivate: function() {
      if( this.objectToSelect && this.objectToSelect.mayDeActivate && !this.objectToSelect.mayDeActivate() ) return false;
      else return true;
   },

   onSelection: function( theTab ) {
   	this.activate();
      this.messageBus.notifySubscribers( new TabSelectedMessage( { tabId : this.name } ));
   },
   
   replaceObjectToSelect: function() {
   },
   
   //Properties
   getCaption: function() { return this.caption; },
   getId: function() { return this.id; },
   getName: function() { return this.name; },
   getObjectToSelect: function() { return this.objectToSelect; },
   isActive: function() { return this.active; },
   isVisible: function() { return this.visible; },

	//private helper methods
	insertNewLIElement: function() {
		if( !this.widgetElement ) throw new UnconfiguredWidgetException( {message : "Can't find tabwidget container element.", source : "Tab.createLIElement"} );
		
		//locate the <ul class='Tab"> list within tab division
		var ulElements = this.widgetElement.getElements( "UL." + this.options.tabsStyle );
		if( ulElements.length < 1 ) throw new UnconfiguredWidgetException( {message : "Can't find new tab's parent UL element.", source : "Tab.createLIElement"} );
		var parentULElement = ulElements[0];
		
		var nb_caption = this.caption.replace(/ /g,String.fromCharCode(160));
		this.anchorElement = new Element( 'a' );
		this.anchorElement.appendText( nb_caption );
		this.anchorElement.set( 'href', '#' );
		this.anchorElement.set( 'id', this.id );
		var thisTab = this;
		this.anchorElement.addEvent( 'click', function() { thisTab.onSelection( this ); } );

		this.listItemElement = new Element( 'li' );
		this.listItemElement.appendChild( this.anchorElement );
		
		parentULElement.grab( this.listItemElement, 'top' );
		this.logger.trace( this.options.componentName + ".insertNewLIElement added a 'LI' element to represent tab: " + this.name );
	}.protect(),

    removeLIElement: function() {
       if( this.listItemElement != null) {
          if( this.anchorElement.destroy ){
             this.anchorElement.removeEvents();
             this.anchorElement.destroy();
          }else this.anchorElement.removeNode();
          this.anchorElement = null;
          
          if( this.listItemElement.destroy ) this.listItemElement.destroy();
          else this.listItemElement.removeNode();
          this.listItemElement = null;
       }
       else throw new UnconfiguredWidgetException( {message : "Can't remove tab's parent LI element.", source : "Tab.removeLIElement"} );
	}.protect(),

	replaceObjectToSelect: function( theObjectToSelect ) {
		if( this.logger.getLevel() == log4javascript.Level.TRACE ) this.logger.trace( "Trying replace object:", theObjectToSelect );
		this.objectToSelect = theObjectToSelect;
	}.protect(),
	
	setListItemId: function( listItemId ) {
		if( this.listItemElement != null ) {
			this.listItemElement.set( 'id', listItemId );
		}
		else throw new UnconfiguredWidgetException( {message : "Can't set undefined LI element's id.", source : "Tab.setListItemId"} );
	}.protect()
});