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
      contentType : "xml"
   },
   
   // Constructor
   initialize: function ( uri, locale, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.setOptions( options );
      
      this.locale = locale;
      this.uri = uri;
   },
   
   //Public accessors and mutators
   determineLocalizedUri : function(){
      return this.uri.substring( 0, this.uri.lastIndexOf( "." + this.options.contentType )) + "_" + this.locale.getLanguage() + "." + this.options.contentType;      
   },
   
   isLocal : function(){
      var givenUri = new URI( this.uri );
      var documentUri = new URI( document.location.href );
      return givenUri.get( 'host' ) == "" || givenUri.get( 'host' ) == documentUri.get( 'host' ); 
   }
  
  // Properties
  
  //Private helper methods
});
   
