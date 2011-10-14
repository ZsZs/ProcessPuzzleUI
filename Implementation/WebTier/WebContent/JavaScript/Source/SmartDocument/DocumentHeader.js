/*
Name: DocumentHeader

Description: Represents the header element of a SmartDocument.

Requires:

Provides:
    - DocumentHeader

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

var DocumentHeader = new Class({
   Extends: CompositeDocumentElement,
   
   options: {
   },
   
   //Constructor
   initialize: function( headerDefinitionElement, bundle, data ){
      this.options.type = "DocumentHeader";
      this.parent( headerDefinitionElement, bundle, data );
   },
   
   //Public mutators and accessor methods
   unmarshall: function(){
      this.parent();
   }

   //Properties
});