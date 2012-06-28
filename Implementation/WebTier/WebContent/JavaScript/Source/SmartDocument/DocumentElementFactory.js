/*
Name: DocumentElementFactory

Description: Instantiates a new subclass of DocumentElement according to the given XML element.

Requires:

Provides:
    - DocumentElementFactory

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

var DocumentElementFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, bundle, data, options ){
      var newDocumentElement;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "COMPOSITEDATAELEMENT": 
         newDocumentElement = new CompositeDataElement( definitionXmlElement, bundle, data, options ); break;
      case "COMPOSITEELEMENT": 
         newDocumentElement = new CompositeDocumentElement( definitionXmlElement, bundle, data, options ); break;
      case "DATAELEMENT": 
         newDocumentElement = new DataElement( definitionXmlElement, bundle, data, options ); break;
      case "DOCUMENTBODY": 
         newDocumentElement = new DocumentBody( definitionXmlElement, bundle, data, options ); break;
      case "DOCUMENTFOOTER": 
         newDocumentElement = new DocumentFooter( definitionXmlElement, bundle, data, options ); break;
      case "DOCUMENTHEADER": 
         newDocumentElement = new DocumentHeader( definitionXmlElement, bundle, data, options ); break;
      case "FORMELEMENT": 
         newDocumentElement = new FormElement( definitionXmlElement, bundle, data, options ); break;
      case "FORMFIELD": 
         newDocumentElement = new FormField( definitionXmlElement, bundle, data, options ); break;
      case "TABLEELEMENT": 
         newDocumentElement = new TableElement( definitionXmlElement, bundle, data, options ); break;
      case "TABLECOLUMN": 
         newDocumentElement = new TableColumn( definitionXmlElement, bundle, data, options ); break;
      case "ELEMENT":
      default:
         newDocumentElement = new DocumentElement( definitionXmlElement, bundle, options ); break;
      }
      
      return newDocumentElement;
   }
});

DocumentElementFactory.create = function(  definitionXmlElement, bundle, data, options ){
   var factory = new DocumentElementFactory();
   var element = factory.create( definitionXmlElement, bundle, data, options );
   return element;
};