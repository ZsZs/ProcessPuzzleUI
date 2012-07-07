/*
Name: 
    - AttributeFigure

Description: 
    - Represents an attribute of ClassFigure. 

Requires:

Provides:
    - AttributeFigure

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
//= require ../DiagramWidget/DiagramFigure.js
//= require ../DiagramWidget/DiagramWidget.js

var AttributeFigure = new Class({
   Extends : DiagramFigure,
   Binds: [],
   
   options : {
      componentName : "AttributeFigure",
      defaultValueSelector : "@defaultValue",
      nameSelector : "@name",
      typeSelector : "@type"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.setOptions( options );
      
      this.defaultValue;
      this.definitionXml = definition;
      this.internationalization = internationalization;
      this.name;
      this.type;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   getDefaultValue : function() { return this.defaultValue; },
   getType : function() { return this.type; },
   
   //Protected, private helper methods
   unmarshallProperties : function(){
      this.type = XmlResource.selectNodeText( this.options.typeSelector, this.definitionXml );
      this.defaultValue = XmlResource.selectNodeText( this.options.defaultValueSelector, this.definitionXml );
      this.parent();
   }.protect()
});

