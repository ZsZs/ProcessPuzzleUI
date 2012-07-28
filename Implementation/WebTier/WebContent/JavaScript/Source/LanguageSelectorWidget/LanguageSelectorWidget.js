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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js

var LanguageSelectorWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['createSpanElements', 'createSelectElement', 'createSelectElementOptions', 'onSelection'],
   
   options : {
      componentName : "LanguageSelectorWidget",
      componentPrefix : "LanguageSelectorWidget",
      selectElementId : "LanguageSelector",
      selectTextKey : "LanguageSelectorWidget.select",
      widgetContainerId : "LanguageSelectorWidget",
      wrapperElementStyle : "LanguageSelectorWrapper"
   },
   
   //Constructor
   initialize : function( options, resourceBundle, webUIConfiguration ){
      this.setOptions( options );
      this.parent( options, resourceBundle );
      
      this.availableLocales = new ArrayList();
      this.isConfigured = false;
      this.selectElement = null;
      this.selectElementContainer = null;
      this.webUIConfiguration = webUIConfiguration;
      
      this.determineInitializationArguments();
      this.determineAvailableLocales();
   },

   //Public accessor and mutator methods
   onSelection : function() {
      var currentLocale = this.locale;
      var newLocale = new ProcessPuzzleLocale();
      newLocale.parse( this.selectElement.options[this.selectElement.selectedIndex].value );
      var message = new LanguageChangedMessage({ previousLocale : currentLocale, newLocale : newLocale, originator : this.options.widgetContainerId });
      this.messageBus.notifySubscribers( message );
   },
   
   //Properties
   getAvailableLocales : function() { return this.availableLocales; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   
   //Private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.createSpanElements, this.createSelectElement, this.createSelectElementOptions, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   createSelectElement : function(){
      this.selectElement = this.elementFactory.create( 'select', null, this.selectElementContainer, WidgetElementFactory.Positions.LastChild, { id : this.options.selectElementId } );
      this.selectElement.addEvent( 'change', this.onSelection );
      this.constructionChain.callChain();
   }.protect(),
   
   createSelectElementOptions : function() {
      var selectedOption = this.elementFactory.createOption( "", this.options.selectTextKey, this.selectElement, WidgetElementFactory.Positions.LastChild );
      selectedOption.set( 'selected' );
      
      this.availableLocales.each( function( locale, index ){
         this.elementFactory.createOption( locale.getLanguage(), this.options.componentPrefix + "." + locale.getLanguage(), this.selectElement, WidgetElementFactory.Positions.LastChild );
      }, this );
      
      this.constructionChain.callChain();
   }.protect(),
   
   createSpanElements: function() {
      var languageSelectorWrapper = this.elementFactory.create( 'span', null, null, null, {'class': this.options.wrapperElementStyle });
      this.selectElementContainer = this.elementFactory.create( 'span', null, languageSelectorWrapper );
      this.constructionChain.callChain();
   }.protect(),
   
   determineAvailableLocales : function(){
      for( var i = 0; i < this.webUIConfiguration.getI18LocaleElements().length; i++ ) {
         var i18LocaleText = this.webUIConfiguration.getI18Locale( i );
         var locale = new ProcessPuzzleLocale();
         locale.parse( i18LocaleText );
         this.availableLocales.add( locale );
      }
   }.protect(),
   
   determineInitializationArguments : function(){
      if( !this.webUIConfiguration ){
         var webUIController = Class.getInstanceOf( WebUIController );
         if( webUIController ) this.webUIConfiguration = webUIController.getWebUIConfiguration();
         else this.webUIConfiguration = Class.getInstanceOf( WebUIConfiguration );
      }
   }.protect(),
   
   finalizeDestruction: function(){
      this.availableLocales.clear();
   }.protect()
   
});