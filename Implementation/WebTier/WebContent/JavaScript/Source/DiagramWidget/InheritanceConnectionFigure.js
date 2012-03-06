/*
Name: 
    - InheritanceConnectionFigure

Description: 
    - Represents a inheritance connection between two figures. 

Requires:

Provides:
    - InheritanceConnectionFigure

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

var InheritanceConnectionFigure = new Class({
   Extends : ConnectionFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject'],
   
   options : {
      componentName : "InheritanceConnectionFigure"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
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
   
   //Protected, private helper methods
   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.shape.uml.InheritanceConnection( this.name );
      this.drawChain.callChain();
   }.protect()
});

