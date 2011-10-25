/*
Name: 
    - DesktopPlugin

Description: 
    - Represents an embedable active element of ProcessPuzzle UI Desktop. The dynamic behaviour of ProcessPuzzleUI is provided by plugins. 

Requires:

Provides:
    - DesktopElement

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

var DesktopPlugin = new Class({
   Implements: [Events, Options],
   Binds: ['callOnLoad', 'loadResources', 'onResourcesLoaded'],   
   
   options: {
      onLoadSelector : "onLoad",
      resourcesSelector : "resources"
   },
   
   //Constructor
   initialize: function( definitionElement, options ){
      this.setOptions( options );

      //Protected, private variables
      this.constructChain = new Chain();
      this.definitionElement = definitionElement;
      this.onLoad;
      this.resources;
      this.state = DesktopPlugin.States.INITIALIZED;
      this.widget;
      
      this.constructChain.chain( this.loadResources, this.callOnLoad );
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.constructChain.callChain();
   },
   
   destroy: function(){
      if( this.resources ) this.resources.release();
      if( this.widget && this.widget.destroy && typeOf( this.widget.destroy ) == 'function' ) this.widget.destroy();
      this.state = DesktopPlugin.States.INITIALIZED;
   },
   
   loadResources: function(){
      if( this.resources ) this.resources.load();
      else this.constructChain.callChain();
   },
   
   onResourcesLoaded: function(){
      this.state = DesktopPlugin.States.LOADED;
      this.fireEvent( 'resourcesLoaded', this );
      this.constructChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallResources();
      this.unmarshallOnLoad();
      this.state = DesktopPlugin.States.UNMARSHALLED;
   },

   //Properties
   getDefinitionElement: function() { return this.definitionElement; },
   getOnLoad: function() { return this.onLoad; },
   getResources: function() { return this.resources; },
   getState: function() { return this.state; },
   getWidget: function() { return this.widget; },

   //Protected, pirvated helper methods
   callOnLoad: function(){
      if( this.onLoad ) {
         this.widget = this.onLoad();
      }
      this.state = DesktopPlugin.States.CONSTRUCTED;
      this.fireEvent( 'constructed', this );
      this.constructChain.callChain();
   }.protect(),
   
   unmarshallOnLoad: function(){
      var onLoadElement = XmlResource.selectNode( this.options.onLoadSelector, this.definitionElement );
      if( onLoadElement ){
         var functionAsText = XmlResource.selectNodeText( this.options.onLoadSelector, this.definitionElement );
         this.onLoad = eval( "(" + functionAsText + ")" );
      }
   }.protect(),
   
   unmarshallResources: function() {
      var resourcesElement = XmlResource.selectNode( this.options.resourcesSelector, this.definitionElement );
      if( resourcesElement ){
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded } );
         this.resources.unmarshall();
      }
   }.protect()
});

DesktopPlugin.States = { INITIALIZED : 0, UNMARSHALLED : 1, LOADED : 2, CONSTRUCTED : 3 };