/*
Name: 
    - ToolBarWidget

Description: 
    - Represents a toolbar which is a user interface for user actions. 

Requires:
    - ToolBarButton
    
Provides:
    - ToolBarWidget

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

var ToolBarWidget = new Class({
   Extends : BrowserWidget,
   options : {
      buttonsSelector : "/pp:toolBarDefinition/buttons/button",
      componentName : "ToolBarWidget",
      descriptionSelector : "/pp:toolBarDefinition/description", 
      listStyleSelector : "/pp:toolBarDefinition/buttons/@elementStyle",
      nameSelector : "/pp:toolBarDefinition/name"
   },

   //Constructor
   initialize: function( options, internationalization ){
      this.setOptions( options );
      this.parent( options, internationalization );
      
      //Private attributes
      this.buttons = new LinkedHashMap();
      this.description;
      this.name;
      this.listElement;
      this.listStyle;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.constructHtmlElements();
      this.constructButtons();
      return this.parent();
   },
   
   destroy: function(){
      if( this.listElement ) this.listElement.destroy();
      if( this.wrapperElement ) this.wrapperElement.destroy();
      this.buttons.clear();
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallButtons();
      return this.parent();
   },
   
   //Properties
   getButtons: function() { return this.buttons; },
   getDescription: function() { return this.description; },
   getListStyle: function() { return this.listStyle; },
   getName: function() { return this.name; },
   
   //Protected and private helper methods
   constructButtons: function(){
      this.buttons.each( function( buttonEntry, index ){
         var toolBarButton = buttonEntry.getValue();
         toolBarButton.construct( this.listElement );
      }, this );
   }.protect(),
   
   constructHtmlElements: function(){
      this.wrapperElement = this.elementFactory.create( 'div', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { id : this.name });
      this.listElement = this.elementFactory.create( 'ul', null, this.wrapperElement, WidgetElementFactory.Positions.LastChild, { 'class' : this.listStyle } );
   }.protect(),
   
   unmarshallButtons: function(){
      var buttonDefinitions = this.definitionXml.selectNodes( this.options.buttonsSelector );
      buttonDefinitions.each( function( buttonDefinition, index ){
         var toolBarButton = new ToolBarButton( buttonDefinition, this.elementFactory );
         toolBarButton.unmarshall();
         this.buttons.put( toolBarButton.getName(), toolBarButton );
      }, this );
   }.protect(),
   
   unmarshallProperties: function(){
      this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
      this.listStyle = this.definitionXml.selectNodeText( this.options.listStyleSelector );
      this.name = this.definitionXml.selectNodeText( this.options.nameSelector );
   }
});