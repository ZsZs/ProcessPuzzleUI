/*
 * Name: HasSet
 * 
 * Description: JavaScript implementation of Java HashSet
 * 
 * Requires:
 * 
 * Provides:
 * 
 * Part of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly
 * configurable, browser font-end, based on MochaUI and MooTools.
 * http://www.processpuzzle.com
 * 
 * Authors: - Zsolt Zsuffa
 * 
 * Copyright: (C) 2011 This program is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

var HashSet = new Class( {
	// Constructor
	initialize : function() {
		this.map = new HashMap();
		this.ZERO = 0;
	},

	// Public accessors and mutators
	add : function( object ) {
		this.map.put( object, this.ZERO ) == null;
	},

	addAll : function(set) {
		var mod = false;
		for ( var it = set.iterator(); it.hasNext();) {
			if (this.add( it.next() ))
				mod = true;
		}
		return mod;
	},

	clear : function() {
		this.map.clear();
	},

	contains : function(o) {
		return this.map.containsKey( o );
	},

   each : function( fn, bind ){
      var iterator = this.iterator();
      var index = 0;
      while( iterator.hasNext() ){
         var setElement = iterator.next();
         fn.call( bind, setElement, index, this );
         index++;
      }
   },
   
	equals : function(o) {
		if (o.size() != this.size())
			return false;
		for ( var it = this.iterator(); it.hasNext();) {
			if (!o.contains( it.next() ))
				return false;
		}
		return true;
	},

	hashCode : function() {
		var h = 0;
		for ( var it = this.iterator(); it.hasNext();) {
			h += it.next().hashCode();
		}
		return h;
	},

	isEmpty : function() {
		return this.map.isEmpty();
	},

	iterator : function() {
      return new SetIterator( this.map );
	},

	remove : function(o) {
		return this.map.remove( o ).equals( this.ZERO );
	},

	size : function() {
		return this.map.size();
	},

	toArray : function() {
		var arr = new Array();
		var i = 0;
		for ( var it = this.iterator(); it.hasNext();) {
			arr[i++] = it.next();
		}
		return arr;
	},

	// Protected, private helper methods
	hashIterator : function(it) {
		this.it = it;
	}.protect()

});

var SetIterator = new Class({
   initialize : function( map ) {
      this.mapIterator = map.iterator();
   },

   hasNext : function() {
      return this.mapIterator.hasNext();
   },

   next : function() {
      return this.mapIterator.next().getKey();
   }
});

