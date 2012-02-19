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

var AttributeFigure = new Class({
   Implements : [Events, Options],
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
   construct: function( canvas ){
      this.parent( canvas );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
   },
   
   //Properties
   getDefaultValue : function() { return this.defaultValue; },
   getName : function() { return this.name; },
   getType : function() { return this.type; },
   
   //Protected, private helper methods
   unmarshallProperties : function(){
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
      this.type = XmlResource.selectNodeText( this.options.typeSelector, this.definitionXml );
      this.defaultValue = XmlResource.selectNodeText( this.options.defaultValueSelector, this.definitionXml );
   }.protect()
});

