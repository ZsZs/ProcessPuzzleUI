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

//= require_directory ../FundamentalTypes
//= require ../ResourceManager/DocumentResource.js

var DocumentImage = new Class({
   Extends: DocumentResource,
   Binds: ['loadResource'],   
   
   options: {
      titleSelector : "@title"
   },
   
   //Constructor
   initialize: function( resourceElement, options ){
      this.options.type = "Image";
      this.parent( resourceElement, options );
      this.title = null;
   },
   
   //Public mutators and accessor methods
   release: function(){
      this.parent();
   },

   unmarshall: function(){
      this.parent();
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.resourceElement );
   },

   //Properties
   getTitle: function() { return this.title; },
   
   //Protected, private helper methods
   checkResourceAvailability: function(){
      this.resourceAvailable = true;
      this.availabilityCheckIsRunning = false;
      this.loadChain.callChain();
   }.protect(),
   
   isResourceLoaded: function(){
      return false;
   }.protect(),
   
   loadResource: function(){
      Asset.image( this.resourceUri, {
         id: this.id,
         title: this.title,
         onAbort: function(){
            this.onResourceError();
         }.bind( this ),
         
         onError: function(){
            this.onResourceError();
         }.bind( this ),
         
         onLoad: function(){
            this.onResourceLoaded();
         }.bind( this )
     });      
   }.protect()
});