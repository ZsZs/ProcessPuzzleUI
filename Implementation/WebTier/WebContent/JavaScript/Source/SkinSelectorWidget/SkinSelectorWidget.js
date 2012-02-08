//LanguageSelectorWidget.js
/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//= require_directory ../FundamentalTypes

var SkinSelectorWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['onSelection'],
   
   options : {
      componentPrefix : "SkinSelectorWidget",
      selectElementId : "SkinSelector",
      selectTextKey : "SkinSelectorWidget.select",
      widgetContainerId : "SkinSelectorWidget",
      wrapperElementStyle : "SkinSelectorWrapper"
   },
   
   //Constructor
   initialize : function( options, resourceBundle, webUIConfiguration ){
      this.setOptions( options );
      this.parent( options, resourceBundle );
      
      this.availableSkins = new HashMap();
      this.isConfigured = false;
      this.selectElement = null;
      this.selectElementContainer = null;
      this.webUIConfiguration = webUIConfiguration;
      
      this.determineInitializationArguments();
      this.determineAvailableSkins();
   },

   //Public accessor and mutator methods
   construct : function() {
      this.createSpanElements();
      this.createSelectElement();
      this.createSelectElementOptions();
      return this.parent();
   },
   
   destroy : function() {
      this.availableSkins.clear();
      this.parent();
   },
   
   onSelection : function() {
      var currentSkin = this.skin;
      var newSkin = this.selectElement.options[this.selectElement.selectedIndex].value;
      var message = new SkinChangedMessage({ previousSkin : currentSkin, newSkin : newSkin, originator : this.options.widgetContainerId });
      this.messageBus.notifySubscribers( message );
   },
   
   //Properties
   getAvailableSkins : function() { return this.availableSkins; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   
   //Private helper methods
   createSelectElement : function(){
      this.selectElement = this.elementFactory.create( 'select', null, this.selectElementContainer, WidgetElementFactory.Positions.FirstChild, { id : this.options.selectElementId } );
      this.selectElement.addEvent( 'change', this.onSelection );
   }.protect(),
   
   createSelectElementOptions : function() {
      var selectedOption = this.elementFactory.createOption( "", this.options.selectTextKey, this.selectElement, WidgetElementFactory.Positions.LastChild );
      selectedOption.set( 'selected' );
      
      this.availableSkins.each( function( skinEntry, index ){
         this.elementFactory.createOption( skinEntry.getKey(), skinEntry.getKey(), this.selectElement, WidgetElementFactory.Positions.LastChild );
      }, this );
   }.protect(),
   
   createSpanElements: function() {
      var skinSelectorWrapper = this.elementFactory.create( 'span', null, null, null, {'class': this.options.wrapperElementStyle });
      this.selectElementContainer = this.elementFactory.create( 'span', null, skinSelectorWrapper, WidgetElementFactory.Positions.LastChild );
   }.protect(),
   
   determineAvailableSkins : function(){
      for( var i = 0; i < this.webUIConfiguration.getAvailableSkinElements().length; i++ ) {
         var skinName = this.webUIConfiguration.getSkinNameByIndex( i );
         var skinPath = this.webUIConfiguration.getSkinPathByIndex( i );
         this.availableSkins.put( skinName, skinPath );
      }
   }.protect(),
   
   determineInitializationArguments : function(){
      if( !this.webUIConfiguration ){
         var webUIController = Class.getInstanceOf( WebUIController );
         this.webUIConfiguration = webUIController.getWebUIConfiguration();
      }
   }.protect()
   
});