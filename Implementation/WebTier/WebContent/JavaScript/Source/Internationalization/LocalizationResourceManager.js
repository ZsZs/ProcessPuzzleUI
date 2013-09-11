/*
Name: 
    - LocalizationResourceManager

Description: 
    - Facilitates internationalization by maintaining a Locale dependent map of key : text pair. Translations i.e. key / text pairs are loaded from xml resources.

Requires:
    - LocalizationResourceParser
    - ProcessPuzzleLocale
    - ResourceCache
    - ResouceKey
    
Provides:
    - LocalizationResourceManager

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

var LocalizationResourceManager = new Class({
   Implements : [AssertionBehavior, Events, Options, TimeOutBehaviour],
   Binds : ['checkTimeOut', 'finalizeLoad', 'loadResources', 'onParseFailure', 'onParseSuccess'],

   options : {
      componentName : "LocalizationResourceManager",
      defaultLocale : null,
      eventFireDelay : 2,
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com/'"
   },

   // Constructor
   initialize : function( webUIConfiguration, options ) {
      // parameter assertions
      this.assertThat( webUIConfiguration, not( nil() ), "LocalizationResourceManager.webUIConfiguration" );
      this.setOptions( options );

      // private instance variables
      this.cache = new ResourceCache();
      this.currentLocale = null;
      this.isLoaded = false;
      this.loadChain = new Chain();
      this.localizationResourceReferences = new ArrayList();
      this.localizationResources = new HashMap();
      this.logger = Class.getInstanceOf( WebUILogger );
      this.parser = new LocalizationResourceParser({ onFailure: this.onParseFailure, onSuccess : this.onParseSuccess });
      this.resourceChain = new Chain();
      this.webUIConfiguration = webUIConfiguration;

      this.determineDefaultLocale();
      this.determineNameSpace();
      this.determineLocalizationResourceReferences();
   },

   //Public accessor and mutator methods
   getText : function( resourceKey ) {
      if( !resourceKey ) return null;

      var resourceValue;
      try{ resourceValue = this.cache.get( resourceKey, "String" ); } 
      catch( e ) { resourceValue = resourceKey; }
      return resourceValue;
   },

   load : function( locale ) {
      this.logger.debug( this.options.componentName + ".load() started." );
      this.currentLocale = locale;
      this.startTimeOutTimer( 'load' );
      this.compileLoadChain();
      this.loadChain.callChain();
   },
   
   onParseFailure : function( error ){
      this.handleLoadError( error );
   },
   
   onParseSuccess : function( resourceUri ){
      this.localizationResources.put( resourceUri, this.parser.getLocalizationResource() );
      this.resourceChain.callChain();
   },

   release : function() {
      this.currentLocale = null;
      if( this.cache ) this.cache.clear();
      this.cache = null;
      this.localizationResourceReferences.clear();
      this.releaseLocalizationResources();
      this.isLoaded = false;
   },
   
   //Properties
   getDefaultLocale : function() { return this.options.defaultLocale; },
   getError : function() { return this.error; },
   getFile : function( key ) { var file = this.cache.get( key, "File" ); return new File( file ); },
   getLocale : function() { return this.currentLocale; },
   getNameSpace : function() { return this.options.nameSpaces; },
   getLocalizationReferences : function() { return this.localizationResourceReferences; },
   getLocalizationResources : function() { return this.localizationResources; },

   //Protected, private methods
   compileLoadChain : function(){
      this.loadChain.chain( this.loadResources, this.finalizeLoad );
   }.protect(),
   
   determineDefaultLocale : function() {
      var defaultLocaleInConfig = this.webUIConfiguration.getI18DefaultLocale();
      if( defaultLocaleInConfig != null ) this.options.defaultLocale = defaultLocaleInConfig;
   }.protect(),

   determineNameSpace : function() {
      var nameSpaceInConfig = this.webUIConfiguration.getI18ResourceBundleNameSpace();
      if (nameSpaceInConfig != null)
         this.options.nameSpaces = nameSpaceInConfig;
   }.protect(),

   determineLocalizationResourceReferences : function() {
      this.webUIConfiguration.getI18ResourceBundleElements().each( function( localizationResourceDefinition, index ){
         var localizationResourceReference = new LocalizationResourceReference( localizationResourceDefinition );
         localizationResourceReference.unmarshall();
         if( !localizationResourceReference.isBackendOnly() ) this.localizationResourceReferences.add( localizationResourceReference );
      }.bind( this ));
   }.protect(),
   
   finalizeLoad : function(){
      this.stopTimeOutTimer();
      this.loadChain.clearChain();
      this.isLoaded = true;
      this.fireEvent( 'success', this, this.options.eventFireDelay );
   }.protect(),
   
   handleLoadError : function( error ){
      this.error = error;
      this.stopTimeOutTimer();
      this.loadChain.clearChain();
      this.localizationResourceReferences.clear();
      this.localizationResources.clear();
      this.fireEvent( 'failure', error, this.options.eventFireDelay );
   }.protect(),
   
   loadResources : function(){
      if( this.localizationResourceReferences.size() > 0 ){
         this.localizationResourceReferences.each( function( localizationReference, index ){ 
            localizationReference.expandedUris( this.currentLocale ).each( function( resourceUri, index ){
               if( !this.localizationResources.containsKey( resourceUri )){
                  this.resourceChain.chain( function(){ this.parseResource( resourceUri, this.currentLocale ); }.bind( this ));
               }
            }.bind( this ));
         }.bind( this ));
         
         this.resourceChain.chain(
            function(){
               this.resourceChain.clearChain();
               this.loadChain.callChain();
            }.bind( this )
         );
         this.resourceChain.callChain();
      }else this.loadChain.callChain();
   }.protect(),

   parseResource : function( resourceUri, locale ) {
      try{
         this.parser.parse( this.cache, resourceUri, locale );
      }catch( error ) {
         this.handleLoadError( error );
      }
   }.protect(),
   
   releaseLocalizationResources : function(){
      this.localizationResources.each( function( resourceEntry, index ){
         var localizationResource = resourceEntry.getValue();
         if( localizationResource ) localizationResource.release();
      }.bind( this ));
      this.localizationResources.clear();
   }.protect(),
   
   timeOut : function( error ){
      this.handleLoadError( error );
   }.protect()
   
});