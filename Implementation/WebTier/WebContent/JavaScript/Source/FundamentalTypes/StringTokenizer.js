/*
Name: StringTokenizer

Description: Breaks a string into tokens.  

Requires:

Provides:

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

var StringTokenizer = new Class( {
   Implements : [Options], 
   options : {
      delimiters: " \t\n\r\f",
      returnTokens: false
   },
   
   //Constructors
   initialize: function( string, options ) {
      assertThat( string, not( nil() ));
      this.setOptions( options );
      this.s = string;
      this.current = 0;

      // Handle leading delimiters if returnTokens is false
      if( !this.returnTokens ) {
         while(( this.current < this.s.length ) && ( this.options.delimiters.indexOf( this.s.charAt( this.current ) ) >= 0)) {
            this.current++;
         }
      }

      // Check to see if there are any tokens
      if( this.current >= this.s.length )
         this.moreTokens = false;
      else
         this.moreTokens = true;
   },
   
   //Public accessors and mutators
   countTokens: function() {
      var tokenCount = 0;
      while( this.hasMoreTokens() ){
         tokenCount++;
         this.nextToken();
      }; 
      return tokenCount;
   },
   
   hasMoreTokens: function(){
      return this.moreTokens;
   },
   
   nextToken: function( delimeters ){
      var start, token, tokenlength;

      if (arguments.length >= 1) {
         this.delimiters = delimiters;
      }

      // Remember the starting position
      start = this.current;

      // Find the next delimiter
      while(( this.current < this.s.length ) && ( this.options.delimiters.indexOf( this.s.charAt( this.current ) ) < 0)) {
         this.current++;
      }

      if( this.current == start )
         this.current++;
      tokenlength = this.current - start;

      // Extract the token
      //
      token = this.s.substr( start, tokenlength );

      // Handle trailing delimiters if returnTokens is false
      if( !this.returnTokens ) {
         while(( this.current < this.s.length ) && ( this.options.delimiters.indexOf( this.s.charAt( this.current ) ) >= 0)) {
            this.current++;
         }
      }

      // Check to see if there are more tokens
      if (this.current >= this.s.length)
         this.moreTokens = false;

      return token;
   }
   
});