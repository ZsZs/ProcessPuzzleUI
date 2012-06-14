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
   initialize: function ( uri, locale, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.setOptions( options );
      
      this.locale = locale;
      this.uri = uri;
      
      this.determineDocumentType();
      if( this.options.applyCacheBuster ) this.uri = this.appendCacheBusterParameterToUri( this.uri );
   },
   
   //Public accessors and mutators
   appendCacheBusterParameterToUri : function( uri ) {
      if( uri.indexOf( "?" ) == -1 ) uri += "?";
      else uri += "&";
      uri += "cacheBuster=";
      uri += new Date().getTime();
      return uri;
   },
   
   determineLocalizedUri : function(){
      var localizedUri = this.uri.indexOf( "." + this.options.contentType ) >= 0 ? this.uri.substring( 0, this.uri.lastIndexOf( "." + this.options.contentType )) : this.uri; 
      localizedUri += "_" + this.locale.getLanguage() + "." + this.options.contentType;
      return localizedUri;
   },
   
   isLocal : function(){
      var givenUri = new URI( this.uri );
      var documentUri = new URI( document.location.href );
      return givenUri.get( 'host' ) == "" || givenUri.get( 'host' ) == documentUri.get( 'host' ); 
   },
  
   // Properties
   getDocumentType : function() { return this.options.documentType; },
   getUri : function() { return this.uri; },
   
   //Private helper methods
   determineDocumentType : function(){
      if( !this.options.documentType ){
         var givenUri = new URI( this.uri );
         if( givenUri.get( 'data' ) && givenUri.getData( this.options.documentTypeKey ))
         this.options.documentType = AbstractDocument.Types[givenUri.getData( this.options.documentTypeKey )];
      }
   }.protect()
   
});
   
