/*
Name: ToolBarButtonFactory

Description: Instantiates a new subclass of ToolBarButton according to the given XML element.

Requires:

Provides:
    - ToolBarButtonFactory

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


var ToolBarButtonFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, htmlElementFactory, options ){
      var newButton;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "DIVIDER": 
         newButton = new ToolBarDivider( definitionXmlElement, htmlElementFactory, options ); break;
      case "BUTTON":
      default:
         newButton = new ToolBarButton( definitionXmlElement, htmlElementFactory, options ); break;
      }
      
      return newButton;
   }
});

ToolBarButtonFactory.create = function(  definitionXmlElement, htmlElementFactory, options ){
   var factory = new ToolBarButtonFactory();
   var button = factory.create( definitionXmlElement, htmlElementFactory, options );
   return button;
};
