/*
Name: DesktopContentArea

Description: Represents the content area of the desktop.

Requires:

Provides:
    - DesktopContentArea

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
//= require ../Desktop/DesktopElement.js

var DesktopContentArea = new Class({
   Extends: DesktopElement,
   
   options: {
      componentName : "DesktopContentArea",
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.options.type = "DesktopContentArea";
      this.parent( definitionElement, bundle, options );
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallElementProperties();
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.createHtmlElement, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyHtmlElement, this.finalizeDestruction );
   }.protect()
   
});