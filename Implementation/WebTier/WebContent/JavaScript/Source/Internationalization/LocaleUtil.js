/*
Name: 
    - LocaleUtil

Description: 
    - Helps to determine a series of localization resource URIs from a base URI and Locale.

Requires:
    - 
    
Provides:
    - LocaleUtil

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

var ProcessPuzzleLocaleUtil = new Class({
   Implements : [AssertionBehavior],

	// Constructor
	initialize: function () {
	
		//private instance variables
		this.DELIMITER = '_';
	},
	
	//public accessors methods
	getFileName : function( locale, prefix, suffix, depth ){
	  var buffer = new String( prefix );
      if (depth > 0) {
         var language = locale.getLanguage();
         if ( language != null && language != "" ) {
            buffer += this.DELIMITER;
            buffer += language;
         }
      }
      if (depth > 1) {
         var country = locale.getCountry();
         if ( country != null && country != "" ) {
            buffer += this.DELIMITER;
            buffer += country;
         }
      }
      if (depth > 2) {
         var variant = locale.getVariant();
         if ( variant != null && variant != "" ) {
            buffer += this.DELIMITER;
            buffer += variant;
         }
      }
      return buffer.toString() + suffix;
	},

	getFileNameList : function( locale, prefix, suffix ) {
		this.assertThat( suffix, not( nil() ));
		this.assertThat( suffix, containsString( "." ));
		
		var list = new ArrayList();
		for (var i = 0; i < 3; i++) {
		   var filename = this.getFileName(locale, prefix, suffix, i);
		   if (!list.contains(filename)) {
		      list.add(filename);
		   }
		}
		var array = new Array(list.size());
		for (var i = 0; i < array.length; i++) {
		   array[i] = list.get(i);
		}
		return array;
	},

	splitName : function( name ) {
	   var tokenizer = new StringTokenizer( name, {delimiters : this.DELIMITER });
	   var array = new Array();
	   i = 0;
	   while( tokenizer.hasMoreTokens() ) {
	      array[i] = tokenizer.nextToken();
	      i++;
	   }
	   return array;
	}
	
	//public mutators methods

	//private methods
});
