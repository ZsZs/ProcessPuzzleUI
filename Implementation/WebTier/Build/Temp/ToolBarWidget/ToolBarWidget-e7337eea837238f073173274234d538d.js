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
   Binds : ['onButtonSelection'],
   options : {
      buttonsSelector : "/toolBarDefinition/buttons/button | /toolBarDefinition/buttons/divider",
      componentName : "ToolBarWidget",
      descriptionSelector : "/toolBarDefinition/description", 
      dividerIconImageUri : "Desktops/Images/ToolboxDivider.jpg",
      listStyleSelector : "/toolBarDefinition/buttons/@elementStyle",
      nameSelector : "/toolBarDefinition/name",
      showCaptionsSelector : "/toolBarDefinition/showCaptions"
   },

   //Constructor
   initialize: function( options, internationalization ){
      //this.setOptions( options );
      this.parent( options, internationalization );
      
      //Private attributes
      this.buttons = new LinkedHashMap();
      this.description;
      this.dividers = new ArrayList();
      this.name;
      this.listElement;
      this.listStyle;
      this.showCaptions = false;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.constructHtmlElements();
      this.constructButtons();
      return this.parent();
   },
   
   destroy: function(){
      this.destroyButtons();
      this.destroyDividers();
      if( this.listElement ) this.listElement.destroy();
      if( this.wrapperElement ) this.wrapperElement.destroy();
      this.parent();
   },
   
   onButtonSelection: function( button ){
      var argumentText = button.getMessageProperties();
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : null;
      arguments['originator'] = this.name;
      
      this.messageBus.notifySubscribers( new MenuSelectedMessage( arguments ));
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
   
   destroyButtons: function(){
      this.buttons.each( function( buttonEntry, index ) {
         var button = buttonEntry.getValue();
         button.destroy();
      }, this );
      
      this.buttons.clear();
   }.protect(),
   
   destroyDividers: function(){
      this.buttons.each( function( divider, index ) {
         divider.destroy();
      }, this );
      
      this.buttons.clear();
   }.protect(),
   
   unmarshallButtons: function(){
      var buttonDefinitions = this.definitionXml.selectNodes( this.options.buttonsSelector );
      buttonDefinitions.each( function( buttonDefinition, index ){
         var toolBarButton = ToolBarButtonFactory.create( buttonDefinition, this.elementFactory, { onSelection : this.onButtonSelection, showCaption : this.showCaptions, dividerIconImageUri : this.options.dividerIconImageUri } );
         toolBarButton.unmarshall();
         this.buttons.put( toolBarButton.getName(), toolBarButton );
      }, this );
   }.protect(),
   
   unmarshallProperties: function(){
      this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
      this.listStyle = this.definitionXml.selectNodeText( this.options.listStyleSelector );
      this.name = this.definitionXml.selectNodeText( this.options.nameSelector );
      this.showCaptions = parseBoolean( this.definitionXml.selectNodeText( this.options.showCaptionsSelector, null, false ));
   }
});
