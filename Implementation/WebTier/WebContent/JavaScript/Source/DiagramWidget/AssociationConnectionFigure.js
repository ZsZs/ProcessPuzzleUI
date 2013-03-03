/*
Name: 
    - AssociationConnectionFigure

Description: 
    - Represents a association connection between two figures. 

Requires:
    - ConnectionFigure

Provides:
    - AssociationConnectionFigure

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
//= require ../DiagramWidget/ConnectionFigure.js
//= require ../DiagramWidget/DiagramWidget.js

var AssociationConnectionFigure = new Class({
   Extends : ConnectionFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject'],
   
   options : {
      componentName : "InheritanceConnectionFigure",
      sourceRoleSelector : "/uml:sourceRole",
      targetRoleSelectgor : "/uml:targetRole",
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      this.sourceRole;
      this.targetRole;
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
   },
   
   //Properties
   getSourceRole: function(){ return this.sourceRole; },
   getTargetRole: function(){ return this.targetRole; },
   
   //Protected, private helper methods
   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.shape.uml.InheritanceConnection( this.name );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.unmarshallSourceRole();
      this.unmarshallTargetRole();
      this.parent();
   }.protect(),
   
   unmarshallRole: function( roleSelector ){
      var roleSpecification = {};
      
      return roleSpecification;
   }.protect(),
   
   unmarshallSourceRole: function(){
      this.sourceRole = this.unmarshallRole( this.options.sourceRoleSelector );
   }.protect(),
   
   unmarshallTargetRole: function(){
      this.targetRole = this.unmarshallRole( this.options.targetRoleSelector );
   }.protect()
});

