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

var LanguageSelectorWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['onSelection'],
   
   options : {
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
   configure : function() {
      this.createSpanElements();
      this.createSelectElement();
      this.createSelectElementOptions();
      this.parent();
   },
   
   destroy : function() {
      this.availableLocales.clear();
      this.parent();
   },
   
   onSelection : function() {
      var currentLocale = this.locale;
      var newLocale = new Locale();
      newLocale.parse( this.selectElement.options[this.selectElement.selectedIndex].value );
      var message = new LanguageChangedMessage({ previousLocale : currentLocale, newLocale : newLocale, originator : this.options.widgetContainerId });
      this.messageBus.notifySubscribers( message );
   },
   
   //Properties
   getAvailableLocales : function() { return this.availableLocales; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   
   //Private helper methods
   createSelectElement : function(){
      this.selectElement = this.appendNewSelect( { id : this.options.selectElementId }, this.selectElementContainer );
      this.selectElement.addEvent( 'change', this.onSelection );
   }.protect(),
   
   createSelectElementOptions : function() {
      var selectedOption = this.appendNewOption( "", this.getText( this.options.selectTextKey ), this.selectElement );
      selectedOption.set( 'selected' );
      
      this.availableLocales.each( function( locale, index ){
         this.appendNewOption( locale.getLanguage(), this.options.componentPrefix + "." + locale.getLanguage(), this.selectElement );
      }, this );
   }.protect(),
   
   createSpanElements: function() {
      var languageSelectorWrapper = this.appendNewSpan( {'class': this.options.wrapperElementStyle });
      this.selectElementContainer = this.appendNewSpan( null, languageSelectorWrapper );
   }.protect(),
   
   determineAvailableLocales : function(){
      for( var i = 0; i < this.webUIConfiguration.getI18LocaleElements().length; i++ ) {
         var i18LocaleText = this.webUIConfiguration.getI18Locale( i );
         var locale = new Locale();
         locale.parse( i18LocaleText );
         this.availableLocales.add( locale );
      }
   }.protect(),
   
   determineInitializationArguments : function(){
      if( !this.webUIConfiguration ){
         var webUIController = Class.getInstanceOf( WebUIController );
         this.webUIConfiguration = webUIController.getWebUIConfiguration();
      }
   }.protect()
   
});