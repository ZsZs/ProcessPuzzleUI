/*
Name: 
    - RootMenu

Description: 
    - Represents a series of menu items directly associated with the menu widget. 

Requires:

Provides:
    - RootMenu

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
//= require ../HierarchicalMenuWidget/CompositeMenu.js

var RootMenu = new Class({
   Extends : CompositeMenu,
   Binds: [],
   
   options : {
      componentName : 'RootMenu',
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.parent( definition, elementFactory, options );
   },
   
   //Public accessor and mutator methods
   construct: function( parentElement ){
      this.parent( parentElement );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   
   //Protected, private helper methods
   destroySubItems: function(){
      this.subItems.each( function( subItem, index ){
         subItem.destroy();
      }.bind( this ));
   }.protect(),
   
   instantiateHtmlElements: function(){
      this.listElement = this.elementFactory.create( 'ul', null, this.parentHtmlElement, WidgetElementFactory.Positions.lastChild, { id : this.menuItemId } );
      this.listElement.addClass( this.options.menuStyle );
      this.parentHtmlElement = this.listElement;
   }.protect()
   
});