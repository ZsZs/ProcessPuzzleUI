/*
Name: MenuItemFactory

Description: Instantiates a new subclass of MenuItem according to the given XML element.

Requires:

Provides:
    - MenuItemFactory

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

var MenuItemFactory = new Class({
   Implements: Options,
   
   options: {
   },
   
   //Constructor
   initialize: function( options ){
      this.setOptions( options );
      
   },

   //Public mutators and accessors
   create: function( menuItemDefinition, elementFactory, options ){
      var hasChildNodes = XmlResource.selectNodes( "menuItem", menuItemDefinition ).length > 0 ? true : false;
      var treeNode;
      
      if( hasChildNodes ) treeNode = new CompositeMenu( menuItemDefinition, elementFactory, options );
      else treeNode = new LeafMenuItem( menuItemDefinition, elementFactory, options );
      
      return treeNode;
   }
   
   //Properties
});

MenuItemFactory.create = function(  definitionXmlElement, htmlElementFactory, options ){
   if( !MenuItemFactory.singleInstance ) MenuItemFactory.singleInstance = new MenuItemFactory();
   return MenuItemFactory.singleInstance.create( definitionXmlElement, htmlElementFactory, options );
};

MenuItemFactory.singleInstance;