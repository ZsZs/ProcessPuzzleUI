/*
Name: 
    - LocalizationResourceParser

Description: 
    - Parses an xml resource and builds up a map of key <-> translation pairs filtered by a specified language.

Requires:
    - ProcessPuzzleLocale
    - ResourceCache
    - ResouceKey
    
Provides:
    - LocalizationResourceParser

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
var LocalizationResourceParser = new Class({
   Implements : [ Events, Options ],
   Binds : [],

   options : {
      componentName : "LocalizationResourceParser"
   },

   // Constructor
   initialize : function( options ) {
      this.setOptions( options );
      
      // private instance variables
      this.buffer = new String();
      this.cache = new ResourceCache();
      this.key;
      this.parserLanguage, this.parserCountry, this.parserVariant;
      this.resourceUri;
      this.targetLanguage, this.targetCountry, this.targetVariant;
      this.saxEventHandler = new SAXEventHandler();
      this.xmlResource = null;
      this.xmlAsText = "";
   },

   // Public accessors and mutator methods
   characters : function( chars, offset, length ) {
      this.buffer += chars.substring( offset, offset + length );
   },

   endDocument : function(){
      this.fireEvent( 'success', this.resourceUri );
   },

   endElement : function( qName ) {
      var content = this.buffer.trim();
      this.buffer = new String();
      if( qName.equals( "Language" )) {
         this.parserLanguage = null;
      }
      if( qName.equals( "Country" )) {
         this.parserCountry = null;
      }
      if( qName.equals( "Variant" )) {
         this.parserVariant = null;
      }
      if( qName.equals( "Resource" ) && this.inContext() ) {
         this.cache.put( this.key, content );
      }
   },

   parse : function( resourceCache, resourceUri, theTargetLocale ) {
      this.cache = resourceCache;
      this.resourceUri = resourceUri;
      this.targetLanguage = theTargetLocale.getLanguage();
      this.targetCountry = theTargetLocale.getCountry();
      this.targetVariant = theTargetLocale.getVariant();

      var parser = new SAXDriver();
      parser.setDocumentHandler( this );
      parser.setLexicalHandler( this );
      parser.setErrorHandler( this );
      this.xmlResource = new XmlResource( resourceUri, { parseOnComplete : false });
      parser.parse( this.xmlResource.getXmlAsText() );
   },
   
   startDocument : function(){
   },

   startElement : function( qName, attrs ) {
      if( qName.equals( "Language" )) {
         this.parserLanguage = attrs.getValueByName( "name" );
      }
      if( qName.equals( "Country" )) {
         this.parserCountry = attrs.getValueByName( "name" );
      }
      if( qName.equals( "Variant" )) {
         this.parserVariant = attrs.getValueByName( "name" );
      }
      if( qName.equals( "Resource" )) {
         this.key = new ResourceKey( attrs.getValueByName( "key" ), attrs.getValueByName( "type" ) );
      }
   },

   // Properties
   getEventHandler : function() { return this.saxEventHandler; },
   getLocalizationResource : function() { return this.xmlResource; },
   setXML : function( strXML ) { this.xmlAsText = strXML; },

   // Protected private helper methods
   inContext : function() {
      if( this.parserLanguage == null || this.parserLanguage.equals( this.targetLanguage )) {
         if( this.parserCountry == null || this.parserCountry.equals( this.targetCountry )) {
            if( this.parserVariant == null || this.parserVariant.equals( this.targetVariant )) {
               return true;
            }
         }
      }
      return false;
   }.protect()
});