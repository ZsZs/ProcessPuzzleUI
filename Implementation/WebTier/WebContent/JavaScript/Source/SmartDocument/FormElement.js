/*
Name: FormElement

Description: Represents a composite constituent element of a SmartDocument which retrieves and presents data from a given data source.

Requires:
    - CompositeDocumentElement, DocumentElement

Provides:
    - FormElement

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
//= require ../SmartDocument/CompositeDataElement.js

var FormElement = new Class({
   Extends: CompositeDataElement,
   
   options: {
      componentName : "FormElement",
      methodSelector : "method"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, dataXml, options );
      this.controlsContainerElement;
      this.fieldsContainerElement;
      this.method;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function( dataElementIndex ){
      this.unmarshallProperties();
      this.parent();
   },

   //Properties
   getMethod: function() { return this.method; },
   
   //Protected, private helper methods
   constructNestedElements : function(){
      this.parent( this.fieldsContainerElement );
   }.protect(),
   
   createHtmlElement : function(){
      this.htmlElement = this.elementFactory.createForm( this.id, this.method, this.contextElement, WidgetElementFactory.Positions.LastChild );
      this.controlsContainerElement = this.htmlElement.getChildren()[1];
      this.fieldsContainerElement = this.htmlElement.getChildren()[0];
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.method = this.resourceBundle.getText( XmlResource.determineAttributeValue( this.definitionElement, this.options.methodSelector ));
   }   
});