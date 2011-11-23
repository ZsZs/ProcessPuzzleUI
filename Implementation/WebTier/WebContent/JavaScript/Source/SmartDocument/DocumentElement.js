/*
Name: DocumentElement

Description: Represents a constituent element of a Smart Document. This is an abstract class, specialized elements can be instantiated.

Requires:

Provides:
    - DocumentElement

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

var DocumentElement = new Class({
   Implements: [Events, Options],
   Binds: ['createHtmlElement', 'constructed', 'constructPlugin', 'injectHtmlElement', 'onPluginConstructed', 'onPluginError'],   
   
   options: {
      componentName : "DesktopElement",
      idPrefix : "Desktop-Element-",
      idSelector : "@id",
      pluginSelector : "plugin",
      referenceSelector : "@href",
      styleSelector : "@elementStyle",
      tagSelector : "@tag",
      type : null
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );

      //Protected, private variables
      this.definitionElement = definitionElement;
      this.resourceUri = null;
      
      this.constructionChain = new Chain();
      this.contextElement;
      this.error = null;
      this.htmlElement;
      this.id;
      this.logger = WebUILogger ? Class.getInstanceOf( WebUILogger ) : null;
      this.plugin;
      this.reference;
      this.resourceBundle = bundle;
      this.status = DocumentElement.States.INITIALIZED;
      this.style;
      this.tag;
      this.text;
      this.where;
      
      this.constructionChain.chain( this.createHtmlElement, this.injectHtmlElement, this.constructPlugin, this.constructed );
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      if( this.status != DocumentElement.States.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      this.logger.trace( this.options.componentName + ".construct() of '" + this.id + "'started." );
      assertThat( contextElement, not( nil() ));
      this.contextElement = contextElement;
      this.where = where;
      
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      if( this.status == DocumentElement.States.INITIALIZED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );

      if( this.plugin ) this.plugin.destroy();
      if( this.status == DocumentElement.States.CONSTRUCTED ) this.deleteHtmlElement();
      if( this.status <= DocumentElement.States.CONSTRUCTED )this.resetProperties();
      this.error = null;
      this.status = DocumentElement.States.INITIALIZED;
   },
   
   constructPlugin: function(){
      if( this.plugin ){ this.plugin.construct();
      }else this.constructionChain.callChain();
   },
   
   constructed: function(){
      this.status = DocumentElement.States.CONSTRUCTED;
      this.fireEvent( 'constructed', this );
      this.constructionChain.callChain();
   },
   
   onPluginConstructed: function(){
      this.constructionChain.callChain();
   },
   
   onPluginError: function( exception ){
      this.error = exception;
      this.revertConstruction();
      this.fireEvent( 'constructionError', this.error );
   },
   
   unmarshall: function(){
      this.unmarshallId();
      this.unmarshallReference();
      this.unmarshallStyle();
      this.unmarshallTag();
      this.unmarshallText();
      this.unmarshallPlugin();
      this.status = DocumentElement.States.UNMARSHALLED;
   },

   //Properties
   getDefinitionElement: function() { return this.definitionElement; },
   getBind: function() { return this.bind; },
   getHtmlElement: function() { return this.htmlElement; },
   getId: function() { return this.id; },
   getPlugin: function() { return this.plugin; },
   getReference: function() { return this.reference; },
   getState: function() { return this.status; },
   getStyle: function() { return this.style; },
   getTag: function() { return this.tag; },
   getText: function() { return this.text; },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return resourceUri; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   createHtmlElement: function(){
      if( this.tag ){
         this.htmlElement = new Element( this.tag );
         if( this.id ) this.htmlElement.set( 'id', this.id );
         if( this.style ) this.htmlElement.addClass( this.style );
         if( this.reference ){
            var anchorElement = new Element( 'a', { href : this.reference } );
            anchorElement.appendText( this.text );
            anchorElement.inject( this.htmlElement );
         }else {
            this.htmlElement.appendText( this.text );
         }
      }
      this.constructionChain.callChain();
   }.protect(),
   
   deleteHtmlElement: function(){
      if( this.htmlElement ) {
         this.htmlElement.destroy();
         this.htmlElement = null;
      }
   }.protect(),
   
   definitionElementAttribute: function( selector ){
      var attributeNode = XmlResource.selectNode( selector, this.definitionElement );
      if( attributeNode ) return attributeNode.value;
      else return null;
   }.protect(),
   
   injectHtmlElement: function(){
      this.htmlElement.inject( this.contextElement, this.where );
      this.constructionChain.callChain();
   }.protect(),
   
   resetProperties: function(){
      this.id = null;
      this.htmlElement = null;
      this.reference = null;
      this.style = null;
      this.tag = null;
      this.text = null;
   }.protect(),
   
   revertConstruction: function(){
      this.constructionChain.clearChain();
      if( this.plugin ) this.plugin.destroy();
      this.deleteHtmlElement();
   }.protect(),

   unmarshallId: function(){
      this.id = this.definitionElementAttribute( this.options.idSelector );
      if( !this.id ) this.id = this.options.idPrefix + (new Date().getTime());
      if( this.dataElementsIndex > 0 ) this.id += "#" + this.dataElementsIndex; 
   }.protect(),
   
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.resourceBundle, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginError } );
         this.plugin.unmarshall();
      }
   }.protect(),
   
   unmarshallReference: function(){
      this.reference = this.definitionElementAttribute( this.options.referenceSelector );
   }.protect(),
   
   unmarshallStyle: function(){
      this.style = this.definitionElementAttribute( this.options.styleSelector );
   }.protect(),
   
   unmarshallTag: function(){
      this.tag = this.definitionElementAttribute( this.options.tagSelector );
   }.protect(),
   
   unmarshallText: function(){
      this.text = XmlResource.determineNodeText( this.definitionElement );
      if( this.resourceBundle && this.text ) this.text = this.resourceBundle.getText( this.text.trim() );
      
      if( !this.text ) this.text = "";
   }
});

DocumentElement.States = { INITIALIZED : 0, UNMARSHALLED : 1, CONSTRUCTED : 2 };
