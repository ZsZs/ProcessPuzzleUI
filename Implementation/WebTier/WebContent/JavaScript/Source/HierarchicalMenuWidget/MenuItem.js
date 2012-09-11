/*
Name: 
    - MenuItem

Description: 
    - Implements common behaviour of a menu item. It is abstract. 

Requires:

Provides:
    - MenuItem

Part of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. 
http://www.processpuzzle.com

Authors: 
    - Zsolt Zsuffa

Copyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation, either version 3 of the License, 
or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var MenuItem = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: ['onClick'],
   
   options : {
      accordionBehaviour : false,
      accordionParent : "",
      captionSelector : "@caption",
      componentName : "MenuItem",
      contextItemId : "",
      href : "#",
      idPathSeparator : "/",
      isDefaultSelector : "@isDefault",
      menuItemIdSelector : "@menuItemId",
      messagePropertiesSelector : "pp:messageProperties",
      parentItemId : "",
      selectedItemStyle : 'selectedMenuItem',
      showSubItems : false,
      target : "_self"
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.setOptions( options );
      
      this.anchorElement;
      this.definitionXml = definition;
      this.caption;
      this.elementFactory = elementFactory;
      this.isDefault;
      this.listItemElement;
      this.menuItemId;
      this.messageProperties;
      this.parentHtmlElement;
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   addClassToListItem: function(){
      if( this.listItemElement ) this.listItemElement.addClass( this.options.selectedItemStyle );
   },
   
   construct: function( parentElement ){
      this.assertThat( parentElement, not( nil() ));
      this.parentHtmlElement = parentElement;
      if( this.state == BrowserWidget.States.UNMARSHALLED && this.needsToBeDisplayed() ) {
         this.instantiateHtmlElements();
         this.state = BrowserWidget.States.CONSTRUCTED;
         if( this.isDefault ) this.fireEvent( 'onDefaultItem', this );
      }
   },
   
   destroy: function(){
      if( this.anchorElement && this.anchorElement.destroy ) this.anchorElement.destroy();
      if( this.listItemElement && this.listItemElement.destroy ) this.listItemElement.destroy();
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   findItemById: function( itemFullId ){
      if( this.getFullId() == itemFullId ) return this;
      else return null;
   },
   
   needsToBeDisplayed: function(){
      return this.isContextItemUndefined() && this.isTheRootItem() ||
             this.isContextItemUndefined() && this.isDirectChildOfRootItem() ||
             this.isContextItemUndefined() && this.options.showSubItems ||
             this.isTheContextItem() ||
             this.isDirectChildOfContextItem() ||
             this.isChildOfContextItem() && this.options.showSubItems ||
             this.isDirectChildOfAccordionParent() && this.options.accordionBehaviour;
   },
   
   onClick : function() {
      this.addClassToListItem();
      this.fireEvent( 'onSelection', this );
   },
   
   removeClassFromListItem: function(){
      if( this.listItemElement && this.listItemElement.removeClass ) this.listItemElement.removeClass( this.options.selectedItemStyle );
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallMessage();
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getAnchorElement: function() { return this.anchorElement; },
   getCaption: function() { return this.caption; },
   getFullId: function() { return this.options.parentItemId + this.options.idPathSeparator + this.menuItemId; },
   getId: function() { return this.menuItemId; },
   getMessageProperties: function() { return this.messageProperties; },
   getListItemElement: function() { return this.listItemElement; },
   getParentElement: function() { return this.parentHtmlElement; },
   getSelectedItemClass: function() { return this.options.selectedItemStyle; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   instantiateHtmlElements: function(){
      this.listItemElement = this.elementFactory.create( 'li', null, this.parentHtmlElement, WidgetElementFactory.Positions.lastChild, { id : this.menuItemId } );
      this.anchorElement = this.elementFactory.createAnchor( this.caption, null, this.onClick, this.listItemElement, WidgetElementFactory.Positions.lastChild );
   }.protect(),
   
   isChildOfContextItem: function(){
      return this.options.parentItemId != "" && this.getFullId().contains( this.options.contextItemId + this.options.idPathSeparator );
   }.protect(),
   
   isAccordionParentUndefined: function(){
      return this.options.accordionParent == "";
   }.protect(),
   
   isContextItemUndefined: function(){
      return this.options.contextItemId == "";
   }.protect(),
   
   isDirectChildOfContextItem: function(){
      return !this.isContextItemUndefined() && (( this.options.contextItemId + this.options.idPathSeparator + this.menuItemId ) == this.getFullId());
   }.protect(),
   
   isDirectChildOfAccordionParent: function(){
      return !this.isAccordionParentUndefined() && (( this.options.accordionParent + this.options.idPathSeparator + this.menuItemId ) == this.getFullId());
   }.protect(),
   
   isDirectChildOfRootItem: function(){
      return ( this.options.parentItemId.lastIndexOf( this.options.idPathSeparator ) == 0 );
   }.protect(),
   
   isTheContextItem: function(){
      return !this.isContextItemUndefined() && this.options.contextItemId == this.getFullId();
   }.protect(),
   
   isTheRootItem: function(){
      return this.options.parentItemId == "";
   }.protect(),
   
   unmarshallMessage: function(){
      var messageText = XmlResource.selectNodeText( this.options.messagePropertiesSelector, this.definitionXml );
      this.messageProperties = messageText ? eval( "(" + messageText + ")" ) : {};
      this.messageProperties['contextItemId'] = this.getFullId();
   }.protect(),
   
   unmarshallProperties: function(){
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.definitionXml );
      this.isDefault = parseBoolean( XmlResource.selectNodeText( this.options.isDefaultSelector, this.definitionXml, null, false ));
      this.menuItemId = XmlResource.selectNodeText( this.options.menuItemIdSelector, this.definitionXml );
   }.protect()
});
