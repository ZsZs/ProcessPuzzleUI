/*
Name: 
    - DesktopColumn

Description: 
    - Represents vertical column of the desktop. It's wrapper of MochaUI column, which gets it's properties from an XML descriptor. 

Requires:

Provides:
    - DesktopColumn

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

var DesktopColumn = new Class({
   Implements: Options,
   options : {
      componentName : "DesktopColumn",
      maximumWidthSelector : "maximumWidth",
      minimumWidthSelector : "minimumWidth",
      nameSelector : "name",
      placementSelector : "placement",
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, options ){
      this.setOptions( options );
      this.definitionElement = definitionElement;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.maximumWidth;
      this.minimumWidth;
      this.MUIColumn;
      this.name;
      this.placement;
      this.state = DesktopColumn.States.INITIALIZED;
      this.width;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "' started." );
      this.MUIColumn = new MUI.Column({ id: this.name, placement: this.placement, width: this.width, resizeLimit: [this.minimumWidth, this.maximumWidth] });
   },
   
   destroy: function(){
   },
   
   unmarshall: function(){
      this.maximumWidth = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.maximumWidthSelector ));
      this.minimumWidth = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.minimumWidthSelector ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.placement = XmlResource.determineAttributeValue( this.definitionElement, this.options.placementSelector );
      this.width = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.widthSelector ));
      
      this.state = DesktopColumn.States.UNMARSHALLED;
   },
   
   //Properties
   getMaximumWidth: function() { return this.maximumWidth; },
   getMinimumWidth: function() { return this.minimumWidth; },
   getMUIColumn: function() { return this.MUIColumn; },
   getName: function() { return this.name; },
   getPlacement: function() { return this.placement; },
   getState: function() { return this.state; },
   getWidth: function() { return this.width; }
   
   //Protected, private helper methods
   
});

DesktopColumn.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };