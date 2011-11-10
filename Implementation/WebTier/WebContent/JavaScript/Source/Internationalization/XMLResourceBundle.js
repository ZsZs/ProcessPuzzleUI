// XMLResourceBundle.js
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

var XMLResourceBundle = new Class( {
   Implements : Options,

   options : {
      componentName : "XMLResourceBundle",
      defaultLocale : null,
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com/'"
   },

   // Constructor
   initialize : function(webUIConfiguration, options) {

      // parameter assertions
   assertThat( webUIConfiguration, not( nil() ));
   this.setOptions( options );

   // private instance variables
   this.cache;
   this.currentLocale = null;
   this.isLoaded = false;
   this.logger = Class.getInstanceOf( WebUILogger );
   this.localeUtil = new LocaleUtil();
   this.parser = new XMLBundleParser();
   this.resourceBundleNames = new Array();
   this.webUIConfiguration = webUIConfiguration;

   this.determineDefaultLocale();
   this.determineNameSpace();
   this.determineResourceBundleNames();
},

// public accessors methods
   getDefaultLocale : function() {
      return this.options.defaultLocale;
   },

   getFile : function(key) {
      var file = this.cache.get( key, "File" );
      return new File( file );
   },
   
   getLocale : function() { return this.currentLocale; },

   getNameSpace : function() {
      return this.options.nameSpaces;
   },
   getResourceBundleNames : function() {
      return this.resourceBundleNames;
   },

   getText : function( resourceKey ) {
      if( !resourceKey ) return null;
      
      var resourceValue;
      try {
         resourceValue = this.cache.get( resourceKey, "String" );
      }catch( e ) {
         resourceValue = resourceKey;
      }
      return resourceValue;
   },

   // public mutators methods
   load : function( locale ) {
      this.logger.debug( this.options.componentName + ".load() started." );
      this.currentLocale = locale;
      this.cache = new ResourceCache();
      var fileList = this.determineFileNames( locale );
      var numOfSuccess = 0;
      for ( var i = 0; i < fileList.size(); i++) {
         if (this.parseFile( fileList.get( i ), locale )) {
            numOfSuccess++;
         }
      }
      if (numOfSuccess == 0) {
         var exception = new UndefinedXmlResourceException( fileList.get( 0 ) );
         throw exception;
      }
      this.isLoaded = true;
   },
   
   release : function(){
      this.currentLocale = null;
      this.cache.clear();
      this.cache = null;
      this.resourceBundleNames.empty();
      this.isLoaded = false;
   },

   // private methods
   determineDefaultLocale : function() {
      var defaultLocaleInConfig = this.webUIConfiguration.getI18DefaultLocale();
      if (defaultLocaleInConfig != null)
         this.options.defaultLocale = defaultLocaleInConfig;
   }.protect(),

   determineFileNames : function(locale) {
      var fileNames = new ArrayList();
      this.resourceBundleNames.each( function(resourceBundleName, index) {
         var fileList = this.localeUtil.getFileNameList( locale, resourceBundleName, ".xml" );
         fileNames.addAll( fileList );
      }, this );

      return fileNames;
   }.protect(),

   determineNameSpace : function() {
      var nameSpaceInConfig = this.webUIConfiguration.getI18ResourceBundleNameSpace();
      if (nameSpaceInConfig != null)
         this.options.nameSpaces = nameSpaceInConfig;
   }.protect(),

   determineResourceBundleNames : function() {
      var resourceBundleElements = this.webUIConfiguration.getI18ResourceBundleElements();
      for (i = 0; i < this.webUIConfiguration.getI18ResourceBundleElements().length; i++) {
         var resourceBundleName = this.webUIConfiguration.getI18ResourceBundleName( i );
         this.resourceBundleNames[i] = resourceBundleName;
      }
      ;
   }.protect(),

   parseFile : function(theFilename, theLocale) {
      try {
         var xmlDocument = new XmlResource( theFilename, {
            nameSpaces : this.options.nameSpaces
         } );
      } catch (e) {
         return false;
      }
      this.parser.parse( this.cache, theFilename, theLocale );
      return true;
   }.protect()
} );