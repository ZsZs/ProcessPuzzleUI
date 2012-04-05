/*
Name: 
    - CompositeMenu

Description: 
    - Represents a series of menu items. Can be part of another menu and can contain sub menus too.
      Tipically presented by UL tags. 

Requires:

Provides:
    - CompositeMenu

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

//= require_directory ../FundamentalTypes
//= require ../HierarchicalMenuWidget/MenuItem.js

var CompositeMenu = new Class({
   Extends : MenuItem,
   Binds: ['onDefaultItem', 'onSelection'],
   
   options : {
      componentName : 'CompositeMenu',
      menuStyle : 'menuWidget',
      subItemsSelector : 'menuItem'
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.parent( definition, elementFactory, options );

      this.listElement;
      this.subItems = new ArrayList();
   },
   
   //Public accessor and mutator methods
   construct: function( parentElement ){
      this.parent( parentElement );
      this.constructSubItems();
   },
   
   destroy: function(){
      if( this.options.showSubItems ) this.destroySubItems();
      if( this.listElement && this.listElement.destroy ) this.listElement.destroy();
      this.parent();
   },
   
   findItemById: function( itemFullId ){
      var foundItem = this.parent( itemFullId );
      
      if( foundItem ){ 
         return foundItem;
      }else {
         this.subItems.each( function( subItem, index ){
            var returnedValue = subItem.findItemById(  itemFullId  );
            if( returnedValue ) foundItem = returnedValue;
         }.bind( this ));
      }
      
      return foundItem;
   },
   
   onDefaultItem: function( menuItem ){
      this.fireEvent( 'onDefaultItem', menuItem );
   },
   
   onSelection: function( menuItem ){
      this.fireEvent( 'onSelection', menuItem );
   },
      
   unmarshall: function(){
      this.parent();
      this.unmarshallSubItems();
   },
   
   //Properties
   getMenuStyle : function() { return this.options.menuStyle; },
   getSelectedElementClass : function() { return this.options.selectedElementClass; },
   getState: function() { return this.state; },
   getSubItems: function() { return this.subItems; },
   
   //Protected, private helper methods
   anyChildNeedsToBeDisplayed: function(){
      var anyChildNeedsToBeDisplayed = false;
      this.subItems.each( function( subItem, index ){
         if( subItem.needsToBeDisplayed() ) anyChildNeedsToBeDisplayed = true;
      }.bind( this ));
      
      return anyChildNeedsToBeDisplayed;
   }.protect(),
   
   constructSubItems: function(){
      this.subItems.each( function( subItem, index ){
         subItem.construct( this.parentHtmlElement );
      }.bind( this ));
   }.protect(),
   
   destroySubItems: function(){
      this.subItems.each( function( subItem, index ){
         subItem.destroy();
      }.bind( this ));
      
      this.subItems.clear();
   }.protect(),
   
   instantiateHtmlElements: function(){
      if( !this.isTheContextItem() ) this.parent();
      
      if( this.anyChildNeedsToBeDisplayed() ){
         this.listElement = this.elementFactory.create( 'ul', null, this.listItemElement, WidgetElementFactory.Positions.lastChild, { id : this.menuItemId } );
         this.listElement.addClass( this.options.menuStyle );
         this.parentHtmlElement = this.listElement;
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.parent();
   }.protect(),
   
   unmarshallSubItems: function(){
      var subElements = XmlResource.selectNodes( this.options.subItemsSelector, this.definitionXml );
      if( subElements ){
         subElements.each( function( subItemElement, index ){
            var subItem = MenuItemFactory.create( subItemElement, this.elementFactory, { 
               contextItemId : this.options.contextItemId,
               idPathSeparator : this.options.idPathSeparator,
               menuStyle : this.options.menuStyle,
               onDefaultItem : this.onDefaultItem,
               onSelection : this.onSelection,
               parentItemId : this.getFullId(),
               selectedItemStyle : this.options.selectedItemStyle, 
               showSubItems : this.options.showSubItems 
            });
            subItem.unmarshall();
            this.subItems.add( subItem );
         }.bind( this ));
      }      
      
   }.protect()
});