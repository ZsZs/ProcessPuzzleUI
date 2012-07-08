/*
Name: 
    - ToolBarDivider

Description: 
    - Represents a divider in a tool bar. It's a component of a ToolBar. 

Requires:

Provides:
    - ToolBarDivider

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

var ToolBarDivider = new Class({
   Implements : Options,
   
   options : {
      dividerStyle : "toolBarDivider",
      iconImageSelector : "iconImage",
      dividerIconImageUri : "Desktops/Images/ToolboxDivider.jpg",
      namePrefix : "divider_"
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.setOptions( options );
      this.definitionXml = definition;
      this.factory = elementFactory;
      this.dividerIconImageUri;
      this.imageElement;
      this.listItemElement;
      this.name = UniqueId.generate( this.options.namePrefix );
      this.parentElement;
      this.state = ToolBarButton.States.INITIALIZED;
      this.toolTipElement;
   },
   
   //Public accessor and mutator methods
   construct: function( parentElement ){
      assertThat( parentElement, not( nil() ));
      this.parentElement = parentElement;
      this.instantiateHtmlElements();
      this.state = ToolBarButton.States.CONSTRUCTED;
   },
   
   destroy: function(){
      if( this.imageElement && this.imageElement.destroy ) this.imageElement.destroy();
      if( this.spanElement && this.spanElement.destroy ) this.spanElement.destroy();
      if( this.listItemElement && this.listItemElement.destroy ) this.listItemElement.destroy();
      this.state = ToolBarButton.States.INITIALIZED;
   },
   
   onSelection: function(){
      
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = ToolBarButton.States.UNMARSHALLED;
   },
   
   //Properties
   getIconImage: function() { return this.dividerIconImageUri; },
   getName: function() { return this.name; },
   getParentElement: function() { return this.parentElement; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   instantiateHtmlElements: function(){
      this.listItemElement = this.factory.create( 'li', null, this.parentElement, WidgetElementFactory.Positions.lastChild, { id : this.name } );
      this.spanElement = this.factory.create( 'span', null, this.listItemElement, WidgetElementFactory.Positions.lastChild, { 'class' : this.options.dividerStyle });
      this.imageElement = this.factory.create( 'img', null, this.spanElement, WidgetElementFactory.Positions.lastChild, { src : this.dividerIconImageUri });
   },
   
   unmarshallProperties: function(){
      this.dividerIconImageUri = XmlResource.selectNodeText( this.options.iconImageSelector, this.definitionXml, null, this.options.dividerIconImageUri );
   }.protect(),
});
