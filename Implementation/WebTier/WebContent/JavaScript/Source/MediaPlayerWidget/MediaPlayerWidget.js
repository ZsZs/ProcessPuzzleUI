/*
Name: 
    - MediaPlayerWidget

Description: 
    - Plays different type of media like audio, video or slide show. 

Requires:
    - BrowserWidget
    
Provides:
    - MediaPlayerWidget

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

// = require_directory ../FundamentalTypes

var MediaPlayerWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['constructDisplay', 'destroyDisplay', 'onDisplayConstructed', 'onDisplayDestroyed', 'releaseMedia'],
   constants : {
   },
   
   options : {
   },

   initialize : function( resourceBundle, options ) {
      this.parent( options, resourceBundle );
      
      this.display;
      this.media;
   },
   
   onDisplayConstructed : function(){
      this.constructionChain.callChain();
   },
   
   onDisplayDestroyed : function(){
      this.destructionChain.callChain();
   },
   
   //Properties
   getDisplay : function(){ return this.display; },
   getMedia : function(){ return this.media; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructDisplay, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyDisplay, this.releaseMedia, this.finalizeDestruction );
   }.protect(),
   
   constructDisplay: function(){
      this.display = new MediaPlayerDisplay( this.containerElement, { onConstructed : this.onDisplayConstructed, onDestroyed : this.onDisplayDestroyed });
      this.display.construct();
   }.protect(),
   
   destroyDisplay: function(){
      if( this.display ) this.display.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   releaseMedia : function(){
      if( this.media ) this.media.relase();
      this.destructionChain.callChain();
   }.protect(),
   
   unmarshallComponents : function(){
      this.media = new SlideShow( this.i18Resource, this.dataXml );
      this.media.unmarshall();
   }.protect()
});
