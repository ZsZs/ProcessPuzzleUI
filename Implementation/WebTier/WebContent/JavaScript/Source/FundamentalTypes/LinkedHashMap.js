/*
 * LinkedHashMap.js
 * Hash table and linked list implementation of the Map interface, with predictable iteration order.
 */
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

var LinkedHashMap = new Class({
	Extends: HashMap,
	
   // Constructor
   initialize : function() {
   	this.parent();
   },

   first : function() {
   	return this.get( this.firstKey() );
   },
   
   firstKey : function() {
   	if( this.length > 0 ) return this.findKeyBySerialIndex( 0 );
   	else return null;
   },
   
   last : function() {
   	return this.get( this.lastKey() );
   },
   
   lastKey : function() {
   	if( this.length > 0 ) return this.findKeyBySerialIndex( this.length -1 );
   	else return null;
   },
   
   next : function( referenceKey ){
   	return this.get( this.nextKey( referenceKey ));
   },
   
   nextKey : function( referenceKey ) {
   	if( !referenceKey ) return null;
   	
   	var referencedEntry = this.getEntry( referenceKey );
   	return this.findKeyBySerialIndex( referencedEntry.getSerialIndex() +1 );
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
      this.table[bucketIndex] = new LinkedEntry( hash, key, value, this.table[bucketIndex], this.length );
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
	
   initialize : function( hash, key, value, next, serialIndex ) {
   	this.parent( hash, key, value, next );
      this.serialIndex = serialIndex;
   },

   getSerialIndex : function() { return this.serialIndex; }
});

