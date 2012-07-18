/*
Name: DiagramFigureFactory

Description: Instantiates a new subclass of DiagramFigure according to the given XML element.

Requires:

Provides:
    - DiagramFigureFactory

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
//= require ../DiagramWidget/DiagramWidget.js

var DiagramFigureFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, internationalization, options ){
      var newFigure;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "DD:ANNOTATION": 
         newFigure = new AnnotationFigure( definitionXmlElement, internationalization, options ); break;
      case "UML:CLASS": 
         newFigure = new ClassFigure( definitionXmlElement, internationalization, options ); break;
      case "UML:INHERITANCECONNECTION":
         newFigure = new InheritanceConnectionFigure( definitionXmlElement, internationalization, options ); break;
      default:
         throw new UnknownDiagramElementException( definitionXmlElement.tagName );
      }
      
      return newFigure;
   }
});

DiagramFigureFactory.create = function(  definitionXmlElement, internationalization, options ){
   var factory = new DiagramFigureFactory();
   var figure = factory.create( definitionXmlElement, internationalization, options );
   return figure;
};