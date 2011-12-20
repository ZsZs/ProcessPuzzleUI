/*
Name: FormField

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - FormField

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

var FormField = new Class({
   Extends: DataElement,
   
   options: {
      componentName : "FormField",
      labelSelector: "label"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      this.parent( definitionElement, bundle, data, options );
      
      //Private variables
      this.elementFactory;
      this.label;
      this.labelElement;
      this.valueElement;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.parent();
   },

   //Properties
   getElementFactory: function() { return this.elementFactory; },
   getLabel: function() { return this.label; },
   getLabelElement: function() { return this.labelElement; },
   getValueElement: function() { return this.valueElement; },
   
   //Protected, private helper methods
   associateEditor: function(){
      if( this.isEditable() ){
         this.editor = DocumentElementEditorFactory.create( this, this.valueElement, {} );
         this.editor.attach();
      }
      this.constructionChain.callChain();
   }.protect(),
   
   createHtmlElement : function(){
      this.htmlElement = this.elementFactory.createStaticRow( this.label, this.text, this.id, this.contextElement, WidgetElementFactory.Positions.LastChild );
      this.labelElement = this.htmlElement.getChildren( 'label' )[0];
      this.valueElement = this.htmlElement.getChildren( 'span' )[0];
      this.constructionChain.callChain();
   },
   
   unmarshallProperties: function(){
      this.label = this.resourceBundle.getText( XmlResource.determineAttributeValue( this.definitionElement, this.options.labelSelector ));
   }
});
