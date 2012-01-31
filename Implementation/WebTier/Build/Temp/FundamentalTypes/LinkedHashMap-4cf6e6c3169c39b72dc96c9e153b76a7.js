/**
Name: LinkedHashMap

Description: Hash table and linked list implementation of the Map interface, with predictable iteration order. 

Requires:

Provides:
	- LinkedHashMap

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
**/


var LinkedHashMap = new Class({
	Extends: HashMap,
	
   // Constructor
   initialize : function() {
      this.parent();
      this.firstEntry = null;
      this.lastEntry = null;
   },
   
   //Public accessors and mutators
   clear: function(){
      this.firstEntry = null;
      this.lastEntry = null;
      this.parent();
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
   
   first : function() {
      return this.firstEntry.getValue();
   },
   
   firstKey : function() {
      if( this.length > 0 ) return this.firstEntry.getKey();
      else return null;
   },
   
   iterator : function() {
      return new LinkedHashIterator( this.firstEntry );
   },

   last : function() {
      return this.lastEntry.getValue();
   },
   
   lastKey : function() {
   	if( this.length > 0 ) return this.lastEntry.getKey();
   	else return null;
   },
   
   next : function( referenceKey ){
      if( !referenceKey ) return null;
      
      var referenceEntry = this.getEntry( referenceKey );
      var nextEntry = referenceEntry.getNextEntry(); 
      if( nextEntry ) return nextEntry.getValue();
      else return null;
   },
   
   nextKey : function( referenceKey ) {
      if( !referenceKey ) return null;
   	
      var referenceEntry = this.getEntry( referenceKey );
      var nextEntry = referenceEntry.getNextEntry(); 
      if( nextEntry ) return nextEntry.getKey();
      else return null;
   },
   
   previous : function( referenceKey ){
   	return this.get( this.previousKey( referenceKey ));
   },
   
   previousKey : function( referenceKey ) {
   	if( !referenceKey ) return null;
   		
   	var referencedEntry = this.getEntry( referenceKey );
   	return this.findKeyBySerialIndex( referencedEntry.getSerialIndex() -1 );
   },
   
   // Private helper methods
   addEntry : function( hash, key, value, bucketIndex ) {
      var newEntry = new LinkedEntry( hash, key, value, this.table[bucketIndex], this.length, this.lastEntry );
      this.table[bucketIndex] = newEntry;
      if( this.firstEntry == null ) this.firstEntry = newEntry;
      if( this.lastEntry ) this.lastEntry.setNextEntry( newEntry );
      this.lastEntry = newEntry;
      this.length++;
   }.protect(),
   
   findKeyBySerialIndex : function( serialIndex ){
   	var searchedKey = null;
   	this.each( function( entry, index ){
   		if( entry.getSerialIndex() == serialIndex ) 
   			searchedKey = entry.getKey();
   	}, this );

   	return searchedKey;
   }.protect()

});

var LinkedEntry = new Class( {
   Extends : Entry,
	
   initialize : function( hash, key, value, next, serialIndex, previousEntry ) {
      this.parent( hash, key, value, next );
      this.nextEntry = null;
      this.previousEntry = previousEntry;
      this.serialIndex = serialIndex;
   },

   getNextEntry: function() { return this.nextEntry; },
   getSerialIndex : function() { return this.serialIndex; },
   setNextEntry: function( nextEntry ) { this.nextEntry = nextEntry; }
});

var LinkedHashIterator = new Class({
   initialize : function( firstEntry ) {
      this.currentEntry = firstEntry;
   },

   hasNext : function() {
      return this.currentEntry != null;
   },

   next : function() {
      var nextEntry = this.currentEntry;
      this.currentEntry = nextEntry.getNextEntry();
      return nextEntry;
   }
});

