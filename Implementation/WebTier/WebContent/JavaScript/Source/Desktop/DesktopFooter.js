/*
Name: DocumentFooter

Description: Represents the body component of a SmartDocument.

Requires:

Provides:
    - DocumentFooter

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
//= require ../Desktop/DesktopElement.js

var DesktopFooter = new Class({
   Extends: DesktopDocument,
   
   options: {
      componentName : "DesktopFooter",
      subElementsSelector : "footerBar | compositeElement | element",
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.footerId;
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
      this.footerId = this.document.getBody().elements.first().getId();
   },

   //Properties
   getId: function() { return this.document.getBody().getId(); },
   getFooterId: function() { return this.footerId; }
});