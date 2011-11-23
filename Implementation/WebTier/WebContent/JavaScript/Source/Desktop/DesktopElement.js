/*
Name: DesktopElement

Description: Represents a single desktop component.

Requires:
    - 
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

var DesktopElement = new Class({
   Implements: [Events, Options],
   Binds: ['constructed'],
   
   options: {
      componentContainerId: "Desktop",
      componentName: "DesktopElement",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.setOptions( options );
      this.constructionChain = new Chain();
      this.containerElement;
      this.definitionElement = definitionElement;
      this.internationalization = internationalization;
      this.logger;
      this.state = DesktopElement.States.UNINITIALIZED;
      
      this.setUp();
   },
   
   //Public accessors and mutators
   construct: function(){
      if( this.state != DesktopElement.States.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      this.logger.trace( this.options.componentName + ".construct() of '" + this.id + "'started." );
      
      this.compileConstructionChain();
      this.constructionChain.callChain();
   },
   
   constructed: function(){
      this.status = DesktopElement.States.CONSTRUCTED;
      this.fireEvent( 'constructed', this );
      this.constructionChain.clearChain();
   },
   
   destroy: function(){
      this.state = DesktopElement.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.state = DesktopElement.States.UNMARSHALLED;
   },
   
   //Properties
   getContainerElement: function() { return this.containerElement; },
   getContainerElementId: function() { return this.options.componentContainerId; }, 
   getDefinitionElement: function() { return this.definitionElement; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructed );
   }.protect(),
   
   configureLogger : function() {
      if( this.webUIController == null ){
         this.logger = Class.getInstanceOf( WebUILogger );
         if( this.logger == null )
            this.logger = new WebUILogger();
      }else
         this.logger = this.webUIController.getLogger();
   }.protect(),
   
   setUp: function(){
      this.configureLogger();
      this.containerElement = $( this.options.componentContainerId );
      if( this.containerElement == null ) throw new IllegalArgumentException( "Parameter 'componetContainerId' in invalid." );
      this.state = DesktopElement.States.INITIALIZED;
   }.protect()
});

DesktopElement.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };