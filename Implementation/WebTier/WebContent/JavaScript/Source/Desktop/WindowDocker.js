/*
Name: WindowDocker

Description: Represents the window docker component of a the desktop.

Requires:

Provides:
    - WindowDocker

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

var WindowDocker = new Class({
   Extends: DesktopElement,
   Binds: ['createDockerElements', 'injectDockerElement'],   
   options: {
      componentName : "WindowDocker",
      dockerAutoHideId : 'dockAutoHide',
      dockerClearId : 'dockClear',
      dockerClearClass : 'clear',
      dockerControlsId : 'dock',
      dockerPlacementId : 'dockPlacement',
      dockerSelector : '/desktopConfiguration/windowDocker',
      dockerSortId : 'dockSort',
      dockerWrapperId : 'dockWrapper'
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.dockerAutoHideElement;
      this.dockerClearElement;
      this.dockerControlsElement;
      this.dockerPlacementElement;
      this.dockerSortElement;
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.parent();
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallElementProperties();
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.createDockerElements, this.createHtmlElement, this.injectDockerElement, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyComponents, this.resetProperties, this.destroyHtmlElement, this.finalizeDestruction );
   }.protect(),
   
   createDockerElements: function(){
      this.dockerControlsElement = new Element( 'div', { id : this.options.dockerControlsId });
      this.dockerPlacementElement = new Element( 'div', { id : this.options.dockerPlacementId });
      this.dockerAutoHideElement = new Element( 'div', { id : this.options.dockerAutoHideId });
      this.dockerSortElement = new Element( 'div', { id : this.options.dockerSortId } );
      this.dockerClearElement = new Element( 'div', { id : this.options.dockerClearId, 'class' : this.options.dockerClearClass });
      
      this.constructionChain.callChain();
   }.protect(),
   
   destroyComponents: function(){
      this.dockerClearElement.destroy();
      this.dockerSortElement.destroy();
      this.dockerAutoHideElement.destroy();
      this.dockerPlacementElement.destroy();
      
      this.destructionChain.callChain();
   }.protect(),
   
   injectDockerElement: function(){
      this.htmlElement.grab( this.dockerControlsElement, 'bottom' );
      this.dockerControlsElement.grab( this.dockerPlacementElement, 'bottom' );
      this.dockerControlsElement.grab( this.dockerAutoHideElement, 'bottom' );
      this.dockerControlsElement.grab( this.dockerSortElement, 'bottom' );
      this.dockerSortElement.grab( this.dockerClearElement, 'bottom' );
      
      this.constructionChain.callChain();
   }.protect(),
   
   resetProperties: function(){
      this.dockerAutoHideElement = null;
      this.dockerClearElement = null;
      this.dockerControlsElement = null;
      this.dockerPlacementElement = null;
      this.dockerSortElement = null;
      
      this.destructionChain.callChain();
   }.protect()
   
});