/*
Name: 
    - OperationFigure

Description: 
    - Represents an operation of ClassFigure. 

Requires:

Provides:
    - OperationFigure

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
//= require ../DiagramWidget/DiagramFigure.js
//= require ../DiagramWidget/DiagramWidget.js

var OperationFigure = new Class({
   Extends : DiagramFigure,
   Binds: [],
   
   options : {
      argumentsSelector : "uml:arguments/uml:argument",
      componentName : "OperationFigure",
      nameSelector : "@name",
      typeSelector : "@type"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.arguments;
      this.type;
   },
   
   //Public accessor and mutator methods
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   erase: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
      this.unmarshallArguments();
   },
   
   //Properties
   getArguments : function() { return this.arguments; },
   getType : function() { return this.type; },
   
   //Protected, private helper methods
   unmarshallArguments : function(){
      var argumentsElement = this.definitionXml.selectNodes( this.options.argumentsSelector );
      if( argumentsElement ){
         if( !argumentsElement.each ) argumentsElement = Array.from( argumentsElement );
         argumentsElement.each( function( argumentElement, index ){
            var argumentName = XmlResource.selectNodeText( this.options.nameSelector, argumentElement );
            var argumentType = XmlResource.selectNodeText( this.options.typeSelector, argumentElement );
            if( this.arguments ) this.arguments += ", ";
            else this.arguments = "";
            this.arguments += argumentName + " : " + argumentType;
         }, this );
      }
      
   }.protect(),
   
   unmarshallProperties : function(){
      this.type = XmlResource.selectNodeText( this.options.typeSelector, this.definitionXml );
      this.parent();
   }.protect()
});

