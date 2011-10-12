/*
Name: DocumentImage

Description: Represents an element in the <resources> part of the SmartDocumentDefinition.

Requires:

Provides:
    - DocumentImage

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

var DocumentImage = new Class({
   Extends: DocumentResource,
   Binds: ['load'],
   
   options: {
      titleSelector : "@title"
   },
   
   //Constructor
   initialize: function( resourceElement ){
      this.options.type = "Image";
      this.parent( resourceElement );
      this.title = null;
   },
   
   //Public mutators and accessor methods
   load: function(){
      this.parent();
      this.loadImage();
   },

   unmarshall: function(){
      this.parent();
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.resourceElement );
   },

   //Properties
   getTitle: function() { return this.title; },
   
   //Protected, private helper methods
   loadImage: function(){
      Asset.image( this.resourceUri, {
         id: this.id,
         title: this.title,
         onLoad: function(){
            this.resourceChain.callChain();
         }.bind( this )
     });      
   }.protect()
});