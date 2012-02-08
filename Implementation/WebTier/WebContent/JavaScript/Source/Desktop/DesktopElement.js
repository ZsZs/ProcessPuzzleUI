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

//= require_directory ../FundamentalTypes

var DesktopElement = new Class({
   Implements: [Events, Options, TimeOutBehaviour],
   Binds: ['constructed', 'finalizeConstruction', 'onConstructionError'],
   
   options: {
      componentContainerId: "desktop",
      componentName: "DesktopElement",
      defaultTag : "div",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      eventFireDelay : 5,
      idSelector : "@id",
      tagSelector : "@tag",
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.setOptions( options );
      this.componentStateManager;
      this.constructionChain = new Chain();
      this.containerElement;
      this.definitionElement = definitionElement;
      this.error;
      this.htmlElement;
      this.id;
      this.internationalization = internationalization;
      this.logger;
      this.messageBus;
      this.state = DesktopElement.States.UNINITIALIZED;
      this.tag;
      
      this.setUp();
   },
   
   //Public accessors and mutators
   construct: function(){
      if( this.state != DesktopElement.States.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      this.logger.trace( this.options.componentName + ".construct() of '" + this.id + "'started." );
      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      this.logger.trace( this.options.componentName + ".destroy() of '" + this.name + "' started." );
      if( this.state == DesktopElement.States.CONSTRUCTED ) this.destroyComponents();
      this.resetProperties();
      if( this.htmlElement ) this.htmlElement.destroy();      
      this.state = DesktopElement.States.INITIALIZED;
   },
   
   onConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'error', this.error );
   },
   
   unmarshall: function(){
      this.state = DesktopElement.States.UNMARSHALLED;
   },
   
   //Properties
   getContainerElement: function() { return this.containerElement; },
   getContainerElementId: function() { return this.options.componentContainerId; }, 
   getDefinitionElement: function() { return this.definitionElement; },
   getId: function() { return this.id; },
   getState: function() { return this.state; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.finalizeConstruction );
   }.protect(),
   
   configureLogger : function() {
      if( this.webUIController == null ){
         this.logger = Class.getInstanceOf( WebUILogger );
         if( this.logger == null )
            this.logger = new WebUILogger();
      }else
         this.logger = this.webUIController.getLogger();
   }.protect(),
   
   createHtmlElement: function(){
      if( this.tag ){
         this.htmlElement = new Element( this.tag );
         if( this.id ) this.htmlElement.set( 'id', this.id );
         this.htmlElement.inject( this.containerElement );
      }
   }.protect(),
   
   definitionElementAttribute: function( selector ){
      var attributeNode = XmlResource.selectNode( selector, this.definitionElement );
      if( attributeNode ) return attributeNode.value;
      else return null;
   }.protect(),
   
   destroyComponents: function(){
      //Abstract method, should be overwritten
   }.protect(),
   
   finalizeConstruction: function(){
      this.stopTimeOutTimer();
      this.state = DesktopElement.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.fireEvent('constructed', this, this.options.eventFireDelay ); 
   }.protect(),
   
   resetProperties: function(){
      //Abstract method, should be overwritten.
   }.protect(),
   
   revertConstruction: function(){
      this.state = DesktopElement.States.INITIALIZED;
   }.protect(),
   
   setUp: function(){
      this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      this.configureLogger();
      this.containerElement = $( this.options.componentContainerId );
      if( this.containerElement == null ) 
         throw new IllegalArgumentException( "Parameter 'componetContainerId' in invalid." );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.state = DesktopElement.States.INITIALIZED;
   }.protect(),
   
   unmarshallElementProperties: function(){
      this.id = this.definitionElementAttribute( this.options.idSelector );
      if( !this.id ) this.id = this.options.idPrefix + (new Date().getTime());
      if( this.dataElementsIndex > 0 ) this.id += "#" + this.dataElementsIndex; 
      
      this.tag = this.definitionElementAttribute( this.options.tagSelector );
      if( !this.tag ) this.tag = this.options.defaultTag;
   }.protect()
});

DesktopElement.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };