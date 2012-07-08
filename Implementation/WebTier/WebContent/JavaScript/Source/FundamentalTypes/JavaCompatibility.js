/*
Name: 

Description: 

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

//= require_directory ../MochaUI

Object.extend({
   hashCode : function( thisObject ) {
      var h = 0;
      var s = thisObject.toString();
      for ( var i = 0; i < s.length; i++) {
         h = 31 * h + s.charCodeAt( i );
      }
      return h;
   },
   
   isA : function( instance, clss ) {
      var type = typeOf(clss);
     
      if (type == 'string') {
          var clss_names = clss.split('.'),
              clss_name = clss_names.shift();

          clss = window[clss_name];

          if (!clss) return false;

          while( clss_name = clss_names.shift()) {
              if (!clss_name in clss) return false;
              clss = clss[clss_name];
          }
          type = typeOf(clss);
      }

      if (['function', 'class'].contains(type)) {
          return (instance instanceof clss);
      }

      return false;
   },
   
   typeMatches : function( thisObject, obj ) {
      return thisObject.getClass() === obj.getClass();
   },
   
   equals : function( thisObject, obj) {
      if( !thisObject.typeMatches( obj )) return false;
      if( typeOf( thisObject ) == 'object' ){
         for( var objectProperty in thisObject ){
            if( thisObject[objectProperty] != obj[objectProperty] ) return false;
         }
         return true;
      }
      else return thisObject.toString() === obj.toString();
   }
});

Class.implement({
   equals : function( otherClass ){
      return this.hashCode() == otherClass.hashCode();
   },
   
   hashCode : function() {
      var hashCode = Object.hashCode( this.prototype.initialize.$origin );
      return hashCode;
   }
});

var JavaObject = new Class({
   /*
   getClass : function() {
      //Unfortunatelly there is no chanche to implement this in JavaScript.
   },*/
   
   hashCode : function() {
      return Object.hashCode( this );
   },
   
   typeMatches : function( obj ) {
      return Object.typeMaches( this, obj );
   },
   
   equals : function( obj ) {
      return Object.equals( this, obj );
   }
});

Array.implement({
   equals : function( otherArray ){
      var isEqual = true;
      this.each( function( currentItem, index ){
         var currentItemEquality = currentItem.equals( otherArray[index] );
         if( !currentItemEquality ) 
            isEqual = false;
      });
      return isEqual;
   }
});

//Boolean
Boolean.implement({
   parseBoolean : function( booleanString ) {
      return eval( booleanString );
   }
});

function parseBoolean( booleanString ){
   return new Boolean().parseBoolean( booleanString );
} 

// String
String.implement({
   compareTo : function(str) {
      if (!this.typeMatches( str ))
         throw "Type Mismacth!";
      var s1 = this.toString();
      var s2 = str.toString();
      if (s1 === s2)
         return 0;
      else if (s1 > s2)
         return 1;
      else
         return -1;
   },
   
   compareToIgnoreCase : function(str) {
      if( !this.typeMatches( str ))
         throw "Type Mismacth!";
      var s1 = this.toUpperCase();
      var s2 = str.toUpperCase();
      if (s1 === s2)
         return 0;
      else if (s1 > s2)
         return 1;
      else
         return -1;
   },
   
   concat : function(str) {
      return new String( this.toString() + str );
   },
   
   endsWith : function(suffix) {
      return this.substring( this.length - suffix.length ) == suffix;
   },
   
   equals : function( obj ) {
      return Object.equals( this, obj );
   },
   
   equalsIgnoreCase : function( str ) {
      if( typeOf( str ) != "string" ) return false;
      return this.toUpperCase() === str.toUpperCase();
   },

   hashCode : function() {
      return Object.hashCode( this );
   },
   
   startsWith : function(prefix) {
      return this.substring( 0, prefix.length ) == prefix;
   },
   
   toCharArray : function() {
      var charArr = new Array();
      for ( var i = 0; i < this.length; i++)
         charArr[i] = this.charAt( i );
      return charArr;
   },
   
   trim : function() {
      return this.replace( /(^\s*)|(\s*$)/g, "" );
   },
   
   typeMatches : function( obj ) {
      return typeOf( this ) === typeOf( obj );
   }
   
});

// Number
Number.implement({
   compareTo : function(obj) {
      if (!this.typeMatches( obj ))
         return false;
      return this - obj;
   },
   
   equals : function(obj) {
      if (!this.typeMatches( obj ))
         return false;
      return this.toString() == obj.toString();
   },
   
   hashCode : function() {
      // just for int,not for double
      return (this);
   },
   
   toBinaryString : function(i) {
      return i.toString( 2 );
   },
   
   toHexString : function(i) {
      return i.toString( 16 );
   }
});

// Date
Date.implement({
   compareTo : function(obj) {
      if (!this.typeMatches( obj ))
         return false;
      var thisInMillis = this.getTime();
      var objInMillis = obj.getTime();
      var difference = thisInMillis - objInMillis;
      var returnValue = difference & 0xffffffff;
      return returnValue;
   },

   equals : function(obj) {
      if (!this.typeMatches( obj ))
         return false;
      return this.getTime() == obj.getTime();
   },

   hashCode : function() {
      var l = this.getTime();
      var s = Number.toHexString( l );
   
      var high = 0;
      if (s.length > 8)
         high = parseInt( s.substring( 0, s.length - 8 ), 16 );
   
      var low = l & 0xffffffff;
      return low ^ high;
   },
   
   typeMatches : function( obj ) {
      return typeOf( this ) === typeOf( obj );
   }
});

//Function
Function.implement({
   equals : function( otherFunction ){
      if (!this.typeMatches( otherFunction )) return false; 
      return this === otherFunction;
   },

   typeMatches : function( otherFunction ) {
      return typeOf( this ) === typeOf( otherFunction );
   }
});