/*
Name: DocumentElementEditorFactory

Description: Instantiates a new instance of DocumentElementEditor or one of it's subclass depending on the type of DocumentElement.

Requires:

Provides:
    - DocumentElementEditorFactory

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

var DocumentElementEditorFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( subjectDocumentElement, options ){
      var subjectHtmlElement = subjectDocumentElement.getHtmlElement(); 
      var documentElementEditor = null;
      switch( subjectDocumentElement.options.componentName ){
      case "CompositeDataElement": 
      case "FormField": 
         documentElementEditor = new DataElementEditor( subjectDocumentElement.getValueElement(), options ); break;
      case "DataElement": 
         documentElementEditor = new DataElementEditor( subjectHtmlElement, options ); break;
      case "CompositeDocumentElement": 
      case "DocumentElement": 
         documentElementEditor = new DocumentElementEditor( subjectHtmlElement, options ); break;
      }
      
      return documentElementEditor;
   }
});

DocumentElementEditorFactory.create = function( subjectDocumentElement, options ){
   var factory = new DocumentElementEditorFactory();
   var elementEditor = factory.create( subjectDocumentElement, options );
   return elementEditor;
};