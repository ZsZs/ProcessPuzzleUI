/*
Name: DocumentElement

Description: Represents a constituent element of a SmartDocument. This is an abstract class, specialized elements can be instantiated.

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
   Implements: Options,
   
   options: {
      bindSelector : "@bind",
      maxOccuresSelector : "@maxOccures",
      minOccuresSelector : "@minOccures",
      nameSelector : "@name",
      possibleStates : { INITIALIZED : 0, UNMARSHALLED : 1, CONSTRUCTED : 2 },
      referenceSelector : "@href",
      styleSelector : "@elementStyle",
      tagSelector : "@tag",
      type : null
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, index ){
      this.definitionElement = definitionElement;
      this.resourceUri = null;
      
      //Private variables
      this.bind;
      this.data = data;
      this.dataElementsIndex = index ? index : 0;
      this.dataElementsNumber = 0;
      this.maxOccures;
      this.minOccures;
      this.name;
      this.htmlElement;
      this.reference;
      this.resourceBundle = bundle;
      this.status = this.options.possibleStates.INITIALIZED;
      this.style;
      this.tag;
      this.text;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      if( this.status != this.options.possibleStates.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      assertThat( contextElement, not( nil() ));
      
      this.retrieveData();
      this.createHtmlElement();
      this.injectHtmlElement( contextElement, where );
      this.status = this.options.possibleStates.CONSTRUCTED;
   },
   
   destroy: function(){
      if( this.status == this.options.possibleStates.INITIALIZED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      
      if( this.status == this.options.possibleStates.CONSTRUCTED ) this.deleteHtmlelement();
      if( this.status <= this.options.possibleStates.CONSTRUCTED )this.resetProperties();
      this.status = this.options.possibleStates.INITIALIZED;
   },
   
   unmarshall: function(){
      this.bind = this.definitionElementAttribute( this.options.bindSelector );
      this.maxOccures = this.definitionElementAttribute( this.options.maxOccuresSelector );
      this.minOccures = this.definitionElementAttribute( this.options.minOccuresSelector );
      this.name = this.definitionElementAttribute( this.options.nameSelector );
      if( this.dataElementsIndex > 0 ) this.name += "#" + this.dataElementsIndex; 
      this.reference = this.definitionElementAttribute( this.options.referenceSelector );
      this.style = this.definitionElementAttribute( this.options.styleSelector );
      this.tag = this.definitionElementAttribute( this.options.tagSelector );
      this.text = XmlResource.determineNodeText( this.definitionElement );
      if( this.resourceBundle ) this.text = this.resourceBundle.getText( this.text );
      this.determineDataElementsNumber();
      this.status = this.options.possibleStates.UNMARSHALLED;
   },

   //Properties
   getDataElementsIndex: function() { return this.dataElementsIndex; },
   getDataElementsNumber: function() { return this.dataElementsNumber; },
   getDefinitionElement: function() { return this.definitionElement; },
   getBind: function() { return this.bind; },
   getHtmlElement: function() { return this.htmlElement; },
   getName: function() { return this.name; },
   getReference: function() { return this.reference; },
   getStatus: function() { return this.status; },
   getStyle: function() { return this.style; },
   getTag: function() { return this.tag; },
   getText: function() { return this.text; },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return resourceUri; },
   
   //Protected, private helper methods
   createHtmlElement: function(){
      if( this.tag ){
         this.htmlElement = new Element( this.tag );
         if( this.name ) this.htmlElement.set( 'id', this.name );
         if( this.style ) this.htmlElement.addClass( this.style );
         if( this.reference ){
            var anchorElement = new Element( 'a', { href : this.reference } );
            anchorElement.appendText( this.text );
            anchorElement.inject( this.htmlElement );
         }else {
            this.htmlElement.appendText( this.text );
         }
      }
   }.protect(),
   
   deleteHtmlelement: function(){
      this.htmlElement.destroy();
   }.protect(),
   
   definitionElementAttribute: function( selector ){
      var attributeNode = XmlResource.selectNode( selector, this.definitionElement );
      if( attributeNode ) return attributeNode.value;
      else return null;
   }.protect(),
   
   determineDataElementsNumber: function(){
      this.dataElementsNumber = 1;
      var bindedData = this.data.selectNodes( this.bind );
      if( this.maxOccures == 'unbounded' && bindedData.length > 1 ) this.dataElementsNumber = bindedData.length;
      if( this.maxOccures > 1 && this.maxOccures < bindedData.length ) this.dataElementsNumber = this.maxOccures;
   }.protect(),
   
   injectHtmlElement: function( contextElement, where ){
      this.htmlElement.inject( contextElement, where );
   }.protect(),
   
   resetProperties: function(){
      this.bind = null;
      this.name = null;
      this.htmlElement = null;
      this.reference = null;
      this.style = null;
      this.tag = null;
      this.text = null;
   }.protect(),
   
   retrieveData: function(){
      if( this.bind && this.data && instanceOf( this.data, XmlResource ) ){
         if( this.bind.contains( "{index}" ) )
            this.bind = this.bind.substitute( { index : this.dataElementsIndex +1 } );
         this.text = this.data.selectNodeText( this.bind );
      }
   }.protect()
});