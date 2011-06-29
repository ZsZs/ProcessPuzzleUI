// HashMap.js

/**
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
/**
 * used like java.lang.HashMap
 */
var HashMap = new Class( {
   // Constructor
   initialize : function() {
      // instance variables
      this.table = new Array();
      this.len = 8;
      this.length = 0;
   },

   // Public accessors and mutators
   clear : function() {
      for ( var i = 0; i < this.table.length; i++)
         this.table[i] = null;
      this.length = 0;
   },

   containsKey : function( key ) {
      var hash = this.hash( key );
      var i = this.indexFor( hash );
      var e = this.table[i];

      while( e != null ) {
         if( e.hash == hash && key.equals( e.key ))
            return true;
         e = e.next;
      }
      return false;
   },

   containsValue : function( value ) {
      if( value == null ) return false;
      
      var tab = this.table;
      for( var i = 0; i < tab.length; i++ )
         for ( var e = tab[i]; e != null; e = e.next )
            if( value.equals( e.value ))
               return true;
      return false;
   },

   
   each : function( fn, bind ){
      var iterator = this.iterator();
      var index = 0;
      while( iterator.hasNext() ){
         var mapEntry = iterator.next();
         fn.call( bind, mapEntry, index, this );
         index++;
      }
   },
   
   equals : function( map ) {
      if( map.size() != this.size() )
         return false;

      for ( var it = this.iterator(); it.hasNext();) {
         var e = it.next();
         var key = e.getKey();
         var value = e.getValue();
         if (!value.equals( map.get( key ) ))
            return false;
      }
      return true;
   },

   get : function( key ) {
   	if( !key ) return null;
   	
      var entry = this.getEntry( key );
      if( entry ) return entry.value;
      else return null;
   },
   
   hashCode : function() {
      var h = 0;
      for ( var it = this.iterator(); it.hasNext();) {
         h += it.next().hashCode();
      }
      return h;
   },

   isEmpty : function() {
      return this.length == 0;
   },

   iterator : function() {
      var i = this.table.length;
      var next = null;
      while (i > 0 && next == null) {
         next = this.table[--i];
      }
      return new HashIterator( this.table, i, next );
   },

   put : function( key, value ) {
      var hash = this.hash( key );
      var bucketIndex = this.indexFor( hash );
      for( var entry = this.table[bucketIndex]; entry != null; entry = entry.next ) {
         if( entry.hash == hash && key.equals( entry.key )) {
            var oldValue = entry.value;
            entry.value = value;
            return oldValue;
         }
      }

      this.addEntry( hash, key, value, bucketIndex );
      var r = Math.ceil( this.length * 1.5 );

      if (r > this.len) {
         this.len = this.len << 1;
         this.rehash();
      }
      return null;
   },

   putAll : function(map) {
      var mod = false;
      for ( var it = map.iterator(); it.hasNext();) {
         var e = it.next();
         if (this.put( e.getKey(), e.getValue() ))
            mod = true;
      }
   },

   remove : function(key) {
      var e = this.removeEntryForKey( key );
      return (e == null ? null : e.value);
   },

   removeEntryForKey : function( key ) {
      var hash = this.hash( key );
      var bucketIndex = this.indexFor( hash );
      var prev = this.table[bucketIndex];
      var e = prev;

      while( e != null ) {
         var next = e.next;
         if( e.hash == hash && key.equals( e.key )) {
            this.length--;
            if( prev.equals( e ))
               this.table[bucketIndex] = next;
            else
               prev.next = next;
            return e;
         }
         prev = e;
         e = next;
      }
      return e;
   },

   size : function() {
      return this.length;
   },

   toString : function() {
      return this.getKey() + "=" + this.getValue();
   },

   // Private helper methods
   addEntry : function( hash, key, value, bucketIndex ) {
      this.table[bucketIndex] = new Entry( hash, key, value, this.table[bucketIndex] );
      this.length++;
   }.protect(),

   getEntry : function( key ) {
      var hash = this.hash( key );
      var i = this.indexFor( hash );
      var e = this.table[i];

      while( true ) {
         if( e == null ) return null;
         
         if( e.hash == hash && key.equals( e.key )) return e;
         
         e = e.next;
      }
   },
   
   hash : function( x ) {
      var h = x.hashCode();
      return h;
   }.protect(),

   indexFor : function( hash ) {
      var index = hash & ( this.len - 1 );
      return index;
   }.protect(),

   rehash : function() {
      var oldTable = this.table;
      this.table = new Array();
      // transfer
      for ( var i = 0; i < oldTable.length; i++) {
         var e = oldTable[i];
         if (e != null) {
            oldTable[i] = null;
            do {
               var next = e.next;
               var j = this.indexFor( e.hash );
               e.next = this.table[j];
               this.table[j] = e;
               e = next;
            } while (e != null);
         }
      }
   }.protect()
});

var Entry = new Class( {
   initialize : function( hash, key, value, next ) {
      this.value = value;
      this.next = next;
      this.key = key;
      this.hash = hash;
   },

   getKey : function() { return this.key; },
   getValue : function() { return this.value; },

   setValue : function( newValue ) {
      var oldValue = this.value;
      this.value = newValue;
      return oldValue;
   },

   equals : function( o ) {
      var e = o;
      var k1 = this.getKey();
      var k2 = e.getKey();
      var v1 = this.getValue();
      var v2 = e.getValue();
      return (k1.equals( k2 ) && v1.equals( v2 ));
   }
});

var HashIterator = new Class({
   initialize : function(table, index, nextEntry) {
      this.table = table;
      this.nextEntry = nextEntry;
      this.index = index;
      this.current = null;
   },

   hasNext : function() {
      return this.nextEntry != null;
   },

   next : function() {
      var e = this.nextEntry;
      if (e == null)
         throw "No such Element";
      var n = e.next;
      var t = this.table;
      var i = this.index;
      while (n == null && i > 0)
         n = t[--i];
      this.index = i;
      this.nextEntry = n;
      this.current = e;

      return this.current;
   }
});
