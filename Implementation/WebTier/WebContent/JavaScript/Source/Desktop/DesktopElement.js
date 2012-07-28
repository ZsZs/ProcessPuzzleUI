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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var DesktopElement = new Class({
   Implements: [AssertionBehavior, Events, Options, TimeOutBehaviour],
   Binds: ['checkTimeOut', 'constructed', 'createHtmlElement', 'destroyComponents', 'destroyHtmlElement', 'finalizeConstruction', 'finalizeDestruction', 'resetProperties', 'onConstructionError'],
   
   options: {
      componentContainerId: "desktop",
      componentName: "DesktopElement",
      defaultTag : "div",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com', xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration', xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      eventFireDelay : 2,
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
      this.destructionChain = new Chain();
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
   construct: function( containerElement ){
      if( this.state != DesktopElement.States.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      this.determineContainerElement( containerElement );
      this.assertThat( this.containerElement, not( nil() ), this.options.componentName + ".containerElement" );

      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
      
      try{ this.constructionChain.callChain(); }
      catch( exception ){ this.revertConstruction( new DesktopElementConfigurationException( this.id, { cause : exception })); }
   },
   
   destroy: function(){
      this.logger.trace( this.options.componentName + ".destroy() of '" + this.name + "' started." );
      if( this.state == DesktopElement.States.CONSTRUCTED ){
         this.startTimeOutTimer( 'destruct' );
         this.compileDestructionChain();
         this.destructionChain.callChain();
      }else this.finalizeDestruction();      
   },
   
   onConstructionError: function( error ){
      this.error = error;
      this.logger.error( this.error.getMessage() );
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.state = DesktopElement.States.UNMARSHALLED;
   },
   
   //Properties
   getComponentStateManager: function() { return this.componentStateManager; },
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
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyComponents, this.resetProperties, this.destroyHtmlElement, this.finalizeDestruction );
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
      
      this.constructionChain.callChain();
   }.protect(),
   
   definitionElementAttribute: function( selector ){
      var attributeNode = XmlResource.selectNode( selector, this.definitionElement );
      if( attributeNode ) return attributeNode.value;
      else return null;
   }.protect(),
   
   destroyComponents: function(){
      //Abstract method, should be overwritten
      this.destructionChain.callChain();
   }.protect(),
   
   destroyHtmlElement: function(){
      if( this.htmlElement ) this.htmlElement.destroy();      
      this.destructionChain.callChain();
   }.protect(),
   
   determineContainerElement: function( containerElement ){
      if( containerElement ) this.containerElement = containerElement;
      else this.containerElement = $( this.options.componentContainerId );
   }.protect(),
   
   finalizeConstruction: function(){
      this.stopTimeOutTimer();
      this.state = DesktopElement.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this, this.options.eventFireDelay ); 
   }.protect(),
   
   finalizeDestruction: function(){
      this.stopTimeOutTimer();
      this.state = DesktopElement.States.INITIALIZED;
      this.destructionChain.clearChain();
      this.fireEvent( 'destructed', this, this.options.eventFireDelay ); 
   }.protect(),
   
   resetProperties: function(){
      //Abstract method, should be overwritten.
      this.destructionChain.callChain();
   }.protect(),
   
   revertConstruction: function( exception ){
      this.error = exception;
      this.stopTimeOutTimer();
      this.constructionChain.clearChain();
      this.state = DesktopElement.States.INITIALIZED;
      this.logger.error( this.error.getMessage() + this.error.stackTrace() );
      this.fireEvent( 'error', this.error );
   }.protect(),
   
   setUp: function(){
      this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      this.configureLogger();
      this.containerElement = $( this.options.componentContainerId );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.state = DesktopElement.States.INITIALIZED;
   }.protect(),
   
   timeOut : function( exception ){
      this.revertConstruction( exception );
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