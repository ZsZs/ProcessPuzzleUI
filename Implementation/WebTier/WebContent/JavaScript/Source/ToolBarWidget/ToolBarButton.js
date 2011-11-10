/*
Name: 
    - ToolBarButton

Description: 
    - Represents a button in a toolbar. It's a component of a ToolBar. 

Requires:

Provides:
    - ToolBarButton

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

var ToolBarButton = new Class({
   Implements : Options,
   
   options : {
      captionSelector : "caption",
      iconImageSelector : "iconImage",
      nameSelector : "@name"
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.setOptions( options );
      this.anchorElement;
      this.definitionXml = definition;
      this.caption;
      this.factory = elementFactory;
      this.iconImageUri;
      this.imageElement;
      this.listItemElement;
      this.name = new Date().getTime();
      this.parentElement;
      this.spanElement;
      this.state = ToolBarButton.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   construct: function( parentElement ){
      assertThat( parentElement, not( nil() ));
      this.parentElement = parentElement;
      this.instantiateHtmlElements();
      this.state = ToolBarButton.States.CONSTRUCTED;
   },
   
   destroy: function(){
      if( this.anchorElement ) this.anchorElement.destroy();
      if( this.listItemElement ) this.listItemElement.destroy();
      if( this.spanElement ) this.spanElement.destroy();
      this.state = ToolBarButton.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = ToolBarButton.States.UNMARSHALLED;
   },
   
   //Properties
   getCaption: function() { return this.caption; },
   getIconImage: function() { return this.iconImageUri; },
   getName: function() { return this.name; },
   getParentElement: function() { return this.parentElement; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   instantiateHtmlElements: function(){
      this.listItemElement = this.factory.create( 'li', null, this.parentElement, WidgetElementFactory.Positions.lastChild, { id : this.name } );
      this.achorElement = this.factory.createAnchor( null, null, null, this.listItemElement, WidgetElementFactory.Positions.lastChild );
      this.spanElement = this.factory.create( 'span', this.caption, this.achorElement, WidgetElementFactory.Positions.lastChild );
      this.imageElement = this.factory.create( 'img', null, this.spanElement, WidgetElementFactory.Positions.firstChild, { src : this.iconImageUri, alt : this.caption });
   },
   
   unmarshallProperties: function(){
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.definitionXml );
      this.iconImageUri = XmlResource.selectNodeText( this.options.iconImageSelector, this.definitionXml );
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
   }.protect(),
});

ToolBarButton.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
