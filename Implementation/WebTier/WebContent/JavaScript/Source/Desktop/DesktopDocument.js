/*
Name: DesktopDocument

Description: Represents the header component of the desktop.

Requires:
    - CompositeDesktopElement
Provides:
    - DesktopDocument

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

var DesktopDocument = new Class({
   Extends: DesktopElement,
   Binds: ['constructHeaderDocument', 'instantiateDocument', 'onDocumentReady'],
   
   options: {
      componentName : "DesktopDocument",
      documentDataNameSpace: "",
      documentDataUriSelector: "@documentData",
      documentDefinitionNameSpace: "xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      documentDefinitionUriSelector: "@documentDefinition"
   },
   
   //Constructor
   initialize: function( headerDefinitionElement, bundle, options ){
      this.parent( headerDefinitionElement, bundle, options );
      this.document;
      this.documentDataUri;
      this.documentDefinitionUri;
   },
   
   //Public mutators and accessor methods
   destroy: function(){
      if( this.document ) this.document.destroy();
      this.document = null;
      this.documentDataUri = null;
      this.documentDefinitionUri = null;
      this.parent();
   },
   
   onDocumentReady: function(){
      this.constructionChain.callChain();      
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.instantiateDocument();
      this.parent();
   },

   //Properties
   getDocument: function() { return this.document; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructHeaderDocument, this.constructed );
   }.protect(),
   
   constructHeaderDocument: function(){
      this.document.construct();
   }.protect(),
   
   instantiateDocument: function(){
      this.document = new SmartDocument( this.internationalization, {  
         widgetContainerId : this.options.componentContainerId, 
         documentDefinitionUri : this.documentDefinitionUri, 
         documentContentUri : this.documentDataUri, 
         onDocumentReady : this.onDocumentReady 
      });
      this.document.unmarshall();
   }.protect(),
   
   unmarshallProperties: function(){
      this.documentDefinitionUri = XmlResource.selectNodeText( this.options.documentDefinitionUriSelector, this.definitionElement, [this.options.definitionXmlNameSpace, this.options.documentDefinitionNameSpace] );
   }.protect()
});