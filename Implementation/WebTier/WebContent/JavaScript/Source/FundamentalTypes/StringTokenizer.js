/*
 ** Breaks a string into tokens
 **
 ** Version 1.0  28 December 1999
 ** Author: David Bernstein
 **
 ** Copyright David Bernstein
 **
 */

/*
 ** Construct a new StringTokenizer
 **
 ** string       The string to be tokenized
 ** delimiters   The characters used as delimiters (optional)
 ** returnTokens Whether the delimeters should be returned as tokens  (optional)
 */
var StringTokenizer = new Class( {
   Implements : [Options], 
   options : {
      delimiters: " \t\n\r\f",
      returnTokens: false
   },
   
   //Constructors
   initialize: function( string, options ) {
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