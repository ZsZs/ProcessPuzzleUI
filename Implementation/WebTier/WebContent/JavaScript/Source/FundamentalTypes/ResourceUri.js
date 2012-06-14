/*
Name: ResourceUri

Description: Helps to analyze a localize an uri.

Requires:
   - 

Provides:
   - ResourceUri

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

var ResourceUri = new Class({
   Implements: Options,
   
   options: {
      applyCacheBuster : false,
      componentName : "ResourceUri",
      contentType : "xml",
      documentType : null,
      documentTypeKey : 'documentType'
   },
   
   // Constructor
   initialize: function ( fullUri, locale, options ) {
      // parameter assertions
      assertThat( fullUri, not( nil() ));
      
      this.setOptions( options );
      
      this.documentContentUri;
      this.documentVariables;
      this.locale = locale;
      this.fullUri = fullUri;
      this.uri;
      
      this.determineStrippedUri();
      this.determineDocumentContentUri();
      this.determineDocumentType();
      this.determineDocumentVariables();
      if( this.options.applyCacheBuster ) this.fullUri = this.appendCacheBusterParameterToUri( this.fullUri );
   },
   
   //Public accessors and mutators
   appendCacheBusterParameterToUri : function( fullUri ) {
      if( fullUri.indexOf( "?" ) == -1 ) fullUri += "?";
      else fullUri += "&";
      fullUri += "cacheBuster=";
      fullUri += new Date().getTime();
      return fullUri;
   },
   
   determineLocalizedUri : function(){
      var localizedUri = this.fullUri.indexOf( "." + this.options.contentType ) >= 0 ? this.fullUri.substring( 0, this.fullUri.lastIndexOf( "." + this.options.contentType )) : this.fullUri; 
      localizedUri += "_" + this.locale.getLanguage() + "." + this.options.contentType;
      return localizedUri;
   },
   
   isLocal : function(){
      var givenUri = new URI( this.fullUri );
      var documentUri = new URI( document.location.href );
      return givenUri.get( 'host' ) == "" || givenUri.get( 'host' ) == documentUri.get( 'host' ); 
   },
  
   // Properties
   getDocumentContentUri : function() { return this.documentContentUri; },
   getDocumentType : function() { return this.options.documentType; },
   getDocumentVariables : function() { return this.documentVariables; },
   getUri : function() { return this.uri; },
   
   //Private helper methods
   determineDocumentContentUri : function(){
      var givenUri = new URI( this.fullUri );
      if( givenUri.get( 'data' ) && givenUri.getData( 'contentUri' )){
         this.documentContentUri = eval( givenUri.getData( 'contentUri' ));
      }else this.documentContentUri = null;
   }.protect(),
   
   determineDocumentType : function(){
      if( !this.options.documentType ){
         var givenUri = new URI( this.fullUri );
         if( givenUri.get( 'data' ) && givenUri.getData( this.options.documentTypeKey ))
            this.options.documentType = AbstractDocument.Types[givenUri.getData( this.options.documentTypeKey )];
      }
   }.protect(),
   
   determineDocumentVariables : function(){
      var givenUri = new URI( this.fullUri );
      if( givenUri.get( 'data' ) && givenUri.getData( 'documentVariables' )){
         this.documentVariables = eval( "(" + givenUri.getData( 'documentVariables' ) + ")" );
      }else this.documentVariables = null;
   }.protect(),
   
   determineStrippedUri : function(){
      if( this.fullUri.indexOf( '?' ) > 0 )
         this.uri = this.fullUri.substring( 0, this.fullUri.indexOf( '?' ))
      else this.uri = this.fullUri;
   }
});
   
