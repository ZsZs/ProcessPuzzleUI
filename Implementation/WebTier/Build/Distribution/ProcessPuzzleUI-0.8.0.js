/**Name: ArrayListDescription: JavaScript implementation of Java ArrayList class.Requires:Provides:	- ArrayListPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors: 	- Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.**/var ArrayList = new Class({   initialize : function() {      this.array = new Array();   },   add : function( obj ) {      this.array[this.array.length] = obj;   },      addAll : function( array ) {      if (array instanceof Array) {         for ( var i = 0; i < array.length; i++) {            this.add( array[i] );         }      } else if (array instanceof ArrayList) {         for ( var i = 0; i < array.size(); i++) {            this.add( array.get( i ) );         }      }   },      clear : function() {      this.array = new Array();   },      clone : function() {      var clonedList = new ArrayList();      this.each( function( listElement, index ){         clonedList.add( listElement );      }, this );      return clonedList;   },   contains : function( elem ) {      for ( var i = 0; i < this.array.length; i++) {         if (this.array[i] == elem )            return true;      }      return false;   },      each : function( fn, bind ){      for( var i = 0, l = this.size(); i < l; i++ ){         fn.call( bind, this.get( i ), i, this );      }   },      equals : function( anotherList ){      if( !instanceOf( anotherList, ArrayList )) return false;      if( anotherList.size() != this.size() ) return false;      for( var i = 0; i < this.size(); i++ ) {         if( this.get( i ) != anotherList.get( i )) return false;      }      return true;   },      get : function(index) {      return this.array[index];   },      isEmpty : function() {      if( this.size() > 0 ) return false;      else return true;   },      iterator : function() {      return new ArrayListIterator( this );   },      size : function() {      return this.array.length;   }   });var ArrayListIterator = new Class({      initialize : function( arrayList ) {      this.arrayList = arrayList;      this.index = 0;   },      hasNext : function() {      return this.index < this.arrayList.size();   },      next : function() {      return this.arrayList.get( this.index++ );   }});

/**
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
**/

function AssertUtil(){
}
new AssertUtil();
AssertUtil.assertInclude = function (object, jsFile) {
	if (object==null) {
		throw new AssertException( "file " + jsFile + " was not included ");
	}
};
AssertUtil.assertParamNotNull = function (value, paramName){
	if (value == null) {
		throw new IllegalArgumentException(  "Parameter must not be null: " + paramName );
	}
};
AssertUtil.assertParamIsNotEmpty = function (value, paramName){
	AssertUtil.assertParamNotNull(value, paramName);
	if (StringUtil.isEmpty(value)){
		throw new IllegalArgumentException(  "Parameter must not be empty: " + paramName );
	}
};
AssertUtil.assertIntegerParam = function (value, paramName){	AssertUtil.assertParamNotNull (value, paramName);
	var i = parseInt(value, 10);
	if ((i == null) || (isNaN(i))) {
		throw new IllegalArgumentException( "Invalid Integer Parameter: " + paramName);
	}
};
AssertUtil.assertTrue = function (expr, exprName){
	if (!expr) {
		throw new IllegalArgumentException(  "Expression: " + exprName + " evaluated to false." );
	}
};

AssertUtil.assertGreaterThanZeroParam = function (value, paramName){
	AssertUtil.assertIntegerParam (value, paramName);
	var i = parseInt(value, 10);
	if (i <= 0) {
		throw new IllegalArgumentException( " assertGreaterThanZeroParam : " + paramName);
	}
};
AssertUtil.assertInstance = function (param, clazz, clazzName){
	AssertUtil.assertParamNotNull(param, "param");
	AssertUtil.assertParamFalse(typeof(clazz) == "string", "Invalid clazz parameter");
	if (!(param instanceof clazz)) {
	    throw new IllegalArgumentException( " Invalid parameter must be instance of " + clazzName);
	}
}; 
AssertUtil.assertParamInstance = function (param, clazz, clazzName){
	if (!(param instanceof clazz)) {
		throw new IllegalArgumentException( " Invalid parameter must be instance of " + clazzName);
	}
};
AssertUtil.assertResultNotNull = function (valueOfResult, message) {
	if ( valueOfResult == null ){
		throw new AssertException( "Invalid result value: " + message);
	}
};
AssertUtil.assertParamFalse = function(booleanValue , message) {
	if (booleanValue) {
	    throw new IllegalArgumentException( "AssertParamFalse Exception message: " + message);
	}
};
AssertUtil.assertMethodExists = function(object, functionName) {
	AssertUtil.assertParamNotNull( object, "object");
	if (object[functionName]==null) {
		throw new AssertException(  " Object " + object + " does not have function :" + functionName );
	}
};
AssertUtil.assertMemberState = function(member, memberName, clazz, clazzName, mandatory, valueRange) {
    if (mandatory){
		if (member == null){
			throw new AssertException( " Member " + memberName + " must not be null ");
		}
		if (!(member instanceof clazz)) {
			throw new AssertException( " Invalid state " + memberName + " must be instance of " + clazzName);
		}
	}
    else if (member != null){
		if (!(member instanceof clazz)) {
			throw new AssertException( "Invalid state " + memberName + " must be instance of " + clazzName);
		}
	}
};
AssertUtil.assertMemberStateString = function(member, memberName, mandatory, valueRange){    if (mandatory){
		if (typeof(member) != typeof(" ")) {
			throw new AssertException( new AssertException( "Invalid state " + memberName + 
                        " must be instance of string and not " + typeof(member)) );		}
		if (StringUtil.isEmpty(member)){			throw new AssertException( "AssertException "  + memberName + " must not be empty");
		}
	}else if (member != null){
		if (typeof(member) != typeof(" ")) {
			throw new AssertException( "Invalid state " + memberName + " must be instance string " );
		}
	}
};


// HashMap.js

/**
Name: HashMap

Description: JavaScript implementation of Java HashMap.

Requires:

Provides:
	- HashMap

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
   initialize : function( table, index, nextEntry ) {
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


/**
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



/**
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
**/

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
      if (!thisObject.typeMatches( obj ))
         return false;
      return thisObject.toString() === obj.toString();
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



/**
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
**/

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

/****************************** UndefinedXmlResourceException ***************************
Name: UndefinedXmlResourceException

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
**/

var UndefinedXmlResourceException = new Class({
   Extends: WebUIException,
   options: {
      description: "Given xml resource: '{resourceName}' dosn't exist or can't be accessed.",
      name: "UnconfiguredWidgetException"
   },
   
   //Constructor
   initialize : function( resourceName, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { resourceName : resourceName };
   }	
});

/**
Name: WebUIException

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

var WebUIException = new Class({
   Implements: Options,
   options: {
      cause: null,
      description: "Please overwrite this option.",
      message : "",
      name: "WebUIException",
      source: null
   },
   
   //Constructors
   initialize: function( options ){
     this.setOptions( options );
     this.parameters;
   },
   
   //Public accessor and mutator methods
   stackTrace: function() {
      var stackTrace = this.getDescription();
      if( this.options.cause && this.options.cause.stackTrace() )
         stackTrace += "\n" + this.options.cause.stackTrace();
      
      return stackTrace;
   },
   
   //Properties
   getCause: function() { return this.options.cause; },
   getDescription: function() { return this.options.description.substitute( this.parameters ); }, 
   getName: function() { return this.options.name; }
});

/********************************* XmlResource ******************************
Name: XmlResource

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
**/

var XmlResource = new Class({
   Extends: Request,

   options: {
      nameSpaces: "xmlns:pp='http://www.processpuzzle.com'",
      
      onComplete: function( responseAsText ) { 
         if( responseAsText ) {
            this.xmlAsText = responseAsText;
            
            if( this.options.parseOnComplete ) {
               this.xmlDoc = Sarissa.getDomDocument();
               var domParser = new DOMParser(); 
               this.xmlDoc = domParser.parseFromString( responseAsText, "text/xml" );
            }
         }
      },
      
      onException : function( headerName, value ) {
         //console.log( "Request header failed: '" + value + "'" );
      },
      
      onFailure : function( xhr ) {
         //console.log( "Request failed. status: '" + xhr.status + "'" );
      },
      
      parseOnComplete : true
   },
   
   // Constructor
   initialize: function ( uri, options ) {
      // parameter assertions
      AssertUtil.assertParamNotNull( uri, "uri");
      
      this.parent( options );
      this.options.url = uri;
      this.options.method = 'get';
      this.options.async = false;
      this.xmlAsText = null;
      this.xmlDoc = null;

      this.refreshResource();
      
      //console.log('XmlResource is initialized.');
   },
   
   // Public accessor and mutator methods
   determineAttributeValue : function( xmlElement, attributeName ) {
      return XmlResource.determineAttributeValue( xmlElement, attributeName );
   },
   
   determineNodeText : function( xmlElement ) {
      return XmlResource.determineNodeText( xmlElement );
   },
   
   isSuccess: function() { // Determines if an XMLHttpRequest was successful or not
       try {
           // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
           return !this.status && location.protocol === "file:" ||
               // Opera returns 0 when status is 304
               ( this.status >= 200 && this.status < 300 ) ||
               this.status === 304 || this.status === 1223 || this.status === 0;
       } catch(e) {}

       return false;
   },
   
   selectNode : function( selector, subNode ) {
      var selectedNodes = this.selectNodes( selector, subNode );
      if( selectedNodes )  return selectedNodes[0];
      else return null;
   }, 
   
   selectNodes : function( selector, subNode ) {
      var subjectNode = subNode != null ? subNode : this.xmlDoc;
      
      var foundXmlNodes = null;
      try {
         var foundXmlNodes = subjectNode.selectNodes( selector );
      }catch(e) {
         //console.log( e );
         //console.log( "Namespaces: " + subjectNode.getProperty( "SelectionNamespaces" ));
         return null;
      }
      return foundXmlNodes;
   },
   
   selectNodeText : function( selector, subNode ) {
      var selectedElements = this.selectNodes( selector, subNode );
      if( selectedElements.length > 0 && selectedElements[0] ) {
         return selectedElements[0].data;
      }else return null;
   }, 
   
   refreshResource: function(){
      try {
         this.send( this.options.url );
      }catch( e ){
         throw new UndefinedXmlResourceException( this.options.url );
      }
      
      if( this.options.parseOnComplete && this.xmlDoc == null )
         throw new UndefinedXmlResourceException( this.options.url );
      
      if( this.xmlDoc ) {
         this.xmlDoc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'  " + this.options.nameSpaces ); 
         this.xmlDoc.setProperty("SelectionLanguage", "XPath");
      }
   },
   
   transform: function( xslt ){},
   
   // Properties
   getDocument: function() { return this.xmlDoc; },
   getUri: function() { return this.options.url; },
   getXmlAsText: function() { return this.xmlAsText; },
   isAsync: function() { return this.options.async; }
   
   //Private helper methods
});

//Static methods
XmlResource.determineAttributeValue = function( xmlElement, attributeName ) {
   var attributeElement = xmlElement.selectNodes( "@" + attributeName );
   if( attributeElement && attributeElement.length == 1 ) return attributeElement[0].nodeValue;
   else return null;
};

XmlResource.determineNodeText = function( xmlElement ) {
   if( xmlElement ) return Sarissa.getText( xmlElement );
   else return null;
};

XmlResource.selectNode = function( selector, xmlElement ){
   var selectedNodes = XmlResource.selectNodes( selector, xmlElement );
   if( selectedNodes )  return selectedNodes[0];
   else return null;
};

XmlResource.selectNodes = function( selector, xmlElement ){
	var selectedElements = null;
	try{
		selectedElements = xmlElement.selectNodes( selector );
	}catch( e ){
		log4javascript.getDefaultLogger().debug( "Selector: '" + selector + "' caused excection: " + e.message );
		return null;
	}
	return selectedElements;
};

XmlResource.selectNodeText = function( selector, xmlElement, nameSpaces ) {
   var selectedElement = XmlResource.selectNode( selector, xmlElement, nameSpaces );
   return XmlResource.determineNodeText( selectedElement );
};

Browser.Request = function(){
   return $try( function(){
      if( Browser.Engine.trident && window.location.protocol == "file:" )
         return new ActiveXObject('Microsoft.XMLHTTP');
      else 
         return new XMLHttpRequest();
   }, function(){
         return new ActiveXObject('MSXML2.XMLHTTP');
   }, function(){
      return new ActiveXObject('Microsoft.XMLHTTP');
   });
};

function XMLDocument () {
   var xmlDoc = null;

   if(document.implementation && document.implementation.createDocument)
   {  xmlDoc = document.implementation.createDocument("", "", null);

   }
   else if( window.ActiveXObject )
   {  xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
   }
   else
   {  alert('Your browser can\'t handle this script');
      return;
   }
   
   return xmlDoc;
}

function TransformXML( xmlFileName, xslFileName ) {
   var xml = new XmlResource( xmlFileName );
   var xsl = new XmlResource( xslFileName );
   var resultXml = XMLDocument();
   xml.transformNodeToObject(xsl,resultXml);
   return resultXml;
}

function XMLTransformator( xmlFileName, xslFileName ) {
   var sourceXML = new XML();
   sourceXML.load(  xmlFileName );
   
   var xslt = new XSLT( xslFileName );
   
   var resultXML = new XML();
   
   this.getSourceXML = function() { return sourceXML; };
   this.getResultXML = function() { return resultXML; };
   this.transform = _Transform;
   
   function _Transform() {
      resultXML = new XML( xslt.transform( sourceXML ));
      return resultXML.getDOM();
   }
}

function RemoveWhitespaceNodesFromXML( xml ) {
   var notWhitespace = /\S/;
   for( var i=0; i < xml.childNodes.length; i++ ) {
      if(xml.childNodes[i].nodeType == 3 && !notWhitespace.test(xml.childNodes[i].nodeValue)) {
         xml.removeChild(xml.childNodes[i]);
         i--;
      } else RemoveWhitespaceNodesFromXML(xml.childNodes[i]);
   }
}

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

var Locale = new Class({
	Implements: Options,
	options: {
      delimiter : ",",
		language : "en",
		country : null,
		variant : null
	},
	
	//Constructor
	initialize: function ( options ) {
		this.setOptions ( options );
	},
	
	//Public accessor and mutator methods
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

// LocaleUtil.js
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

// LocaleUtil
var LocaleUtil = new Class({

	// Constructor
	initialize: function () {
	
		//private instance variables
		this.DELIMITER = '_';
	},
	
	//public accessors methods
	getFileName : function( locale, prefix, suffix, depth ){
      var buffer = new StringBuffer(prefix);
      if (depth > 0) {
         var language = locale.getLanguage();
         if ( language != null && language != "" ) {
            buffer.append( this.DELIMITER );
            buffer.append(language);
         }
      }
      if (depth > 1) {
         var country = locale.getCountry();
         if ( country != null && country != "" ) {
            buffer.append( this.DELIMITER );
            buffer.append( country );
         }
      }
      if (depth > 2) {
         var variant = locale.getVariant();
         if ( variant != null && variant != "" ) {
            buffer.append( this.DELIMITER );
            buffer.append( variant );
         }
      }
      return buffer.toString() + suffix;
	},

	getFileNameList : function( locale, prefix, suffix ) {
		AssertUtil.assertParamIsNotEmpty (suffix, "suffix");
		AssertUtil.assertTrue( StringUtil.contains(suffix, "."), "'suffix' contains '.'" );
		
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


/*
name: ResourceCache
script: ResourceCache.js
description: Mantains a HashMap for internationalization resource items.
copyright: (c) 2010 IT Codex Llc., <http://itkodex.hu/>.
license: MIT-style license.

todo:
  - 

requires:
  - MooTools/mootools-core.1.3
  - ProcessPuzzle/JavaCompatibility
  - ProcessPuzzle/JavaCollection

provides: [ProcessPuzzle.ResourceCache]
*/

var ResourceCache = new Class({

	initialize : function(){
	//parameter assertions

	//private instance variables
  	this.resources = new HashMap();
	this.self = this;
	},
	
	clear : function(){
	  this.resources.clear(); 
	},

	//public accessors methods
	get : function( name, type ) {
	    var resourceKey = new ResourceKey( name, type );
	    if( !this.resources.containsKey( resourceKey ) ) {
	        throw new IllegalArgumentException( "no such key: " + resourceKey );
	    }
	    return this.resources.get( resourceKey );
	},
	
	//public mutators methods
	put : function( resourceKey, resourceValue ){
		this.resources.put( resourceKey, resourceValue );
	}

	//private methods
});


// ResourceKey.js
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

var ResourceKey = new Class({
   
   initialize: function( theKey, theType ) {
      //parameter assertions
      AssertUtil.assertParamNotNull(theKey, "theKey");
      AssertUtil.assertParamNotNull(theType, "theType");
      
      //private instance variables
      this.key = theKey;
      this.type = theType;
   },

   //public accessors methods
   toString : function() { 
      return this.key + '/' + this.type;
   },
   
   hashCode : function() { 
      var keyHashCode = this.key.hashCode();
      var hashCode = this.toString().hashCode();
      return keyHashCode;
   },
   
   equals : function( obj ) { 
      return this.compareTo(obj); 
   },

   compareTo : function( otherKey ) {
       if (otherKey instanceof ResourceKey) {
           response = (this.key == otherKey.key);
           if (response) {
            response = (this.type == otherKey.type);
           }
           return response;
       }
       return false;
   }

   //public mutators methods

   //private methods
});


// XMLBundleParser.js
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

// XMLBundleParser
function XMLBundleParser() {
	//check parameter assertions

	inheritFrom(this, new SAXEventHandler());

	//private instance variables
	var cache = new ResourceCache();
	var parserLanguage, parserCountry, parserVariant;
	var targetLanguage, targetCountry, targetVariant;
	var buffer = new StringBuffer();
	var xmlResource = null;
	var xmlAsText = "";
	var key;
	var self = this;
	
	//public accessors methods
	
	//public mutators methods
	this.parse = _Parse;
	this.setXML = function (strXML) { xmlAsText = strXML; };
	this.characters = _Characters;
	this.startElement = _StartElement;
	this.endElement = _EndElement;

	//private method
	function _Parse(theCache, theFilename, theTargetLocale) {
	    cache = theCache;
	    targetLanguage = theTargetLocale.getLanguage();
	    targetCountry = theTargetLocale.getCountry();
	    targetVariant = theTargetLocale.getVariant();
	    var parser = new SAXDriver();
	    parser.setDocumentHandler(self);
	    parser.setLexicalHandler(self);
	    parser.setErrorHandler(self);
	    xmlResource = new XmlResource( theFilename, { parseOnComplete : false } );
	    parser.parse( xmlResource.getXmlAsText() );
	}

	function _InContext() {
	    if (parserLanguage == null || parserLanguage.equals(targetLanguage)) {
	        if (parserCountry == null || parserCountry.equals(targetCountry)) {
	        if (parserVariant == null || parserVariant.equals(targetVariant)) {
	            return true;
	        }
	        }
	    }
	    return false;
	}

	function _Characters(chars, offset, length) {
	    buffer.append(chars, offset, length);
	}

	function _StartElement(qName, attrs) {
	    if (qName.equals("Language")) {
	        parserLanguage = attrs.getValueByName("name");
	    }
	    if (qName.equals("Country")) {
	        parserCountry = attrs.getValueByName("name");
	    }
	    if (qName.equals("Variant")) {
	        parserVariant = attrs.getValueByName("name");
	    }
	    if (qName.equals("Resource")) {
	        key = new ResourceKey(attrs.getValueByName("key"), attrs.getValueByName("type"));
	    }
	}

	function _EndElement(qName) {
	    var content = buffer.toString().trim();
	    buffer.setLength(0);
	    if (qName.equals("Language")) {
	        parserLanguage = null;
	    }
	    if (qName.equals("Country")) {
	        parserCountry = null;
	    }
	    if (qName.equals("Variant")) {
	        parserVariant = null;
	    }
	    if (qName.equals("Resource") && _InContext()) {
	        cache.put(key, content);
	    }
	}
}

// XMLResourceBundle.js
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

var XMLResourceBundle = new Class( {
   Implements : Options,

   options : {
      defaultLocale : null,
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com/'"
   },

   // Constructor
   initialize : function(webUIConfiguration, options) {

      // parameter assertions
   AssertUtil.assertParamNotNull( webUIConfiguration, "webUIConfiguration" );
   this.setOptions( options );

   // private instance variables
   this.cache;
   this.currentLocale = null;
   this.isLoaded = false;
   this.logger = null;
   this.localeUtil = new LocaleUtil();
   this.parser = new XMLBundleParser();
   this.resourceBundleNames = new Array();
   this.webUIConfiguration = webUIConfiguration;

   this.determineDefaultLocale();
   this.determineNameSpace();
   this.determineResourceBundleNames();
},

// public accessors methods
   getDefaultLocale : function() {
      return this.options.defaultLocale;
   },

   getFile : function(key) {
      var file = this.cache.get( key, "File" );
      return new File( file );
   },
   
   getLocale : function() { return this.currentLocale; },

   getNameSpace : function() {
      return this.options.nameSpaces;
   },
   getResourceBundleNames : function() {
      return this.resourceBundleNames;
   },

   getText : function( resourceKey ) {
      if( !resourceKey ) return null;
      
      var resourceValue;
      try {
         resourceValue = this.cache.get( resourceKey, "String" );
      }catch( e ) {
         resourceValue = resourceKey;
      }
      return resourceValue;
   },

   // public mutators methods
   load : function( locale ) {
      this.currentLocale = locale;
      this.cache = new ResourceCache();
      var fileList = this.determineFileNames( locale );
      var numOfSuccess = 0;
      for ( var i = 0; i < fileList.size(); i++) {
         if (this.parseFile( fileList.get( i ), locale )) {
            numOfSuccess++;
         }
      }
      if (numOfSuccess == 0) {
         var exception = new FileNotFoundException( "File: " + fileList.get( 0 ) + " not foud.", "XMLResourceBundle.loadFile()" );
         throw exception;
      }
      this.isLoaded = true;
   },
   
   release : function(){
      this.currentLocale = null;
      this.cache.clear();
      this.cache = null;
      this.resourceBundleNames.empty();
      this.isLoaded = false;
   },

   // private methods
   determineDefaultLocale : function() {
      var defaultLocaleInConfig = this.webUIConfiguration.getI18DefaultLocale();
      if (defaultLocaleInConfig != null)
         this.options.defaultLocale = defaultLocaleInConfig;
   }.protect(),

   determineFileNames : function(locale) {
      var fileNames = new ArrayList();
      this.resourceBundleNames.each( function(resourceBundleName, index) {
         var fileList = this.localeUtil.getFileNameList( locale, resourceBundleName, ".xml" );
         fileNames.addAll( fileList );
      }, this );

      return fileNames;
   }.protect(),

   determineNameSpace : function() {
      var nameSpaceInConfig = this.webUIConfiguration.getI18ResourceBundleNameSpace();
      if (nameSpaceInConfig != null)
         this.options.nameSpaces = nameSpaceInConfig;
   }.protect(),

   determineResourceBundleNames : function() {
      var resourceBundleElements = this.webUIConfiguration.getI18ResourceBundleElements();
      for (i = 0; i < this.webUIConfiguration.getI18ResourceBundleElements().length; i++) {
         var resourceBundleName = this.webUIConfiguration.getI18ResourceBundleName( i );
         this.resourceBundleNames[i] = resourceBundleName;
      }
      ;
   }.protect(),

   parseFile : function(theFilename, theLocale) {
      try {
         var xmlDocument = new XmlResource( theFilename, {
            nameSpaces : this.options.nameSpaces
         } );
      } catch (e) {
         return false;
      }
      this.parser.parse( this.cache, theFilename, theLocale );
      return true;
   }.protect()
} );

