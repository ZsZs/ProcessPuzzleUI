/*
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

var ProcessPuzzleLocale = new Class({
   Implements: Options,
   options: {
      delimiter : ",-",
      language : "en",
      country : null,
      variant : null
   },
	
	//Constructor
	initialize: function ( options ) {
	   this.setOptions ( options );
	},
	
   //Public accessor and mutator methods
   equals : function( objectToCheck ){
      return this.options.language == objectToCheck.options.language &&
      this.options.country == objectToCheck.options.country &&
      this.options.variant == objectToCheck.options.variant;
   },
	
   parse : function( localeString ) {
      var tokenizer = new StringTokenizer( localeString, {delimiters : this.options.delimiter});
      i = 0;
      while( tokenizer.hasMoreTokens() ) {
         var nextLocaleConstituent = tokenizer.nextToken().trim();
         if( i == 0 ) this.options.language = nextLocaleConstituent;
         else if( i == 1 ) this.options.country = nextLocaleConstituent;
         else if( i == 2 ) this.options.variant = nextLocaleConstituent;
         i++;
      }
   },
	
   toString: function() {
	   var localeString = this.options.language;
	   if( this.options.country != null && this.options.country != "" ) localeString += this.options.delimiter + this.options.country;
      if( this.options.variant != null && this.options.variant != "" ) localeString += this.options.delimiter + this.options.variant;
      
      return localeString;
	},

	//Properties
	getLanguage : function () {return this.options.language;},
	getCountry : function () {return this.options.country;},
	getVariant : function () {return this.options.variant;}
	
});