/*
Name: 
   - HtmlDocument

Description: A specialized subclass of AbstractDocument which presents and provides editing possibilities for plain HTML content.

Requires:
   - AbstractDocument

Provides:
   - HtmlDocument

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

var HtmlDocument = new Class({
   Extends: AbstractDocument,
   Binds: ['attachEditor', 'createTextArea'],
   
   options: {
      componentName : "HtmlDocument",
      documentContentExtension : ".html",
      documentDefinitionNameSpace: "xmlns:sd='http://www.processpuzzle.com/HtmlDocument'",
      documentEditorClass : "TextAreaEditor",
      rootElementName : "/htmlDocumentDefinition",
   },
   
   //Constructor
   initialize: function( i18Resource, options ){
      this.parent( i18Resource, options );
      
      //Private variables
      this.textArea;
   },
   
   //Public mutators and accessor methods
   attachEditor: function(){
      this.editor.attach( this.textArea, this.documentContent.xmlAsText );
   }.protect(),
   
   construct: function(){
      this.parent();
   },
   
   destroy: function(){
      this.textArea.destroy();
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
   },

   //Properties
   getTextArea: function() { return this.textArea; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.determineContainerElement, 
         this.instantiateEditor, 
         this.createTextArea, 
         this.attachEditor, 
         this.subscribeToWebUIMessages, 
         this.finalizeConstruction );
   }.protect(),
   
   createTextArea: function(){
      this.textArea = this.htmlElementFactory.create( 'textArea', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { id : this.name } );
      this.textArea.set( 'html', this.documentContent.xmlAsText );
      this.constructionChain.callChain();
   }
      
});
