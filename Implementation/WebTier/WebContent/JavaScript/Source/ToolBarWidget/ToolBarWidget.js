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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js

var ToolBarWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['constructButtons', 'constructHtmlElements', 'destroyButtons', 'destroyHtmlElements', 'onButtonSelection'],
   options : {
      buttonsSelector : "/tb:toolBarDefinition/tb:buttons/tb:button | /tb:toolBarDefinition/tb:buttons/tb:divider",
      componentName : "ToolBarWidget",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com', xmlns:tb='http://www.processpuzzle.com/ToolBar",
      descriptionSelector : "/tb:toolBarDefinition/tb:description", 
      dividerIconImageUri : "Desktops/Images/ToolboxDivider.jpg",
      listStyleSelector : "/tb:toolBarDefinition/tb:buttons/@elementStyle",
      nameSelector : "/tb:toolBarDefinition/tb:name",
      showCaptions : false
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
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   
   onButtonSelection: function( button ){
      var argumentText = button.getMessageProperties();
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : null;
      arguments['originator'] = this.name;
      
      this.messageBus.notifySubscribers( new MenuSelectedMessage( arguments ));
   },
   
   //Properties
   getButtons: function() { return this.buttons; },
   getDescription: function() { return this.description; },
   getListStyle: function() { return this.listStyle; },
   getName: function() { return this.name; },
   
   //Protected and private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructHtmlElements, this.constructButtons, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyButtons, this.destroyHtmlElements, this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
      
   constructButtons: function(){
      this.buttons.each( function( buttonEntry, index ){
         var toolBarButton = buttonEntry.getValue();
         toolBarButton.construct( this.listElement );
      }, this );
      this.constructionChain.callChain();
   }.protect(),
   
   constructHtmlElements: function(){
      this.wrapperElement = this.elementFactory.create( 'div', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { id : this.name });
      this.listElement = this.elementFactory.create( 'ul', null, this.wrapperElement, WidgetElementFactory.Positions.LastChild, { 'class' : this.listStyle } );
      this.constructionChain.callChain();
   }.protect(),
   
   destroyButtons: function(){
      this.buttons.each( function( buttonEntry, index ) {
         var button = buttonEntry.getValue();
         button.destroy();
      }, this );
      
      this.buttons.clear();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyHtmlElements: function(){
      if( this.listElement && this.listElement.destroy ) this.listElement.destroy();
      if( this.wrapperElement && this.wrapperElement.destroy ) this.wrapperElement.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   unmarshallButtons: function(){
      var buttonDefinitions = this.dataXml.selectNodes( this.options.buttonsSelector );
      buttonDefinitions.each( function( buttonDefinition, index ){
         var toolBarButton = ToolBarButtonFactory.create( buttonDefinition, this.elementFactory, { onSelection : this.onButtonSelection, showCaption : this.options.showCaptions, dividerIconImageUri : this.options.dividerIconImageUri } );
         toolBarButton.unmarshall();
         this.buttons.put( toolBarButton.getName(), toolBarButton );
      }, this );
   }.protect(),
   
   unmarshallComponents: function(){
      this.unmarshallButtons();
   }.protect(),
   
   unmarshallProperties: function(){
      this.parent();
      this.description = this.dataXml.selectNodeText( this.options.descriptionSelector );
      this.listStyle = this.dataXml.selectNodeText( this.options.listStyleSelector );
      this.name = this.dataXml.selectNodeText( this.options.nameSelector );
   }.protect()

});