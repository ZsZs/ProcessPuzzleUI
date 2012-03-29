/*Name: ArrayListDescription: JavaScript implementation of Java ArrayList class.Requires:Provides:	- ArrayListPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors: 	- Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
var ArrayList = new Class({   initialize : function() {      this.array = new Array();   },   add : function( obj ) {      this.array[this.array.length] = obj;   },      addAll : function( array ) {      if (array instanceof Array) {         for ( var i = 0; i < array.length; i++) {            this.add( array[i] );         }      } else if (array instanceof ArrayList) {         for ( var i = 0; i < array.size(); i++) {            this.add( array.get( i ) );         }      }   },      clear : function() {      this.array = new Array();   },      clone : function() {      var clonedList = new ArrayList();      this.each( function( listElement, index ){         clonedList.add( listElement );      }, this );      return clonedList;   },   contains : function( elem ) {      for ( var i = 0; i < this.array.length; i++) {         if (this.array[i] == elem )            return true;      }      return false;   },      each : function( fn, bind ){      for( var i = 0, l = this.size(); i < l; i++ ){         fn.call( bind, this.get( i ), i, this );      }   },      equals : function( anotherList ){      if( !instanceOf( anotherList, ArrayList )) return false;      if( anotherList.size() != this.size() ) return false;      for( var i = 0; i < this.size(); i++ ) {         if( this.get( i ) != anotherList.get( i )) return false;      }      return true;   },      get : function(index) {      return this.array[index];   },      getLast : function(){      return this.get( this.size() -1 );   },      indexOf : function( obj ){      var elementIndex = null;      this.array.some( function( element, index ){         if( element.equals( obj ) ){            elementIndex = index;            return true;         }       }, this );      return elementIndex;   },      isEmpty : function() {      if( this.size() > 0 ) return false;      else return true;   },      iterator : function() {      return new ArrayListIterator( this );   },      remove : function( index ){      var elementAtIndex = this.get( index );      if( elementAtIndex ) {         this.array[index] = null;         this.array = this.array.clean();      }   },      size : function() {      return this.array.length;   }   });var ArrayListIterator = new Class({      initialize : function( arrayList ) {      this.arrayList = arrayList;      this.index = 0;   },      hasNext : function() {      return this.index < this.arrayList.size();   },      next : function() {      return this.arrayList.get( this.index++ );   }});
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
/*
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

/*
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
      var stackTrace = "";
      if( this.options.cause && this.options.cause.stackTrace() )
         stackTrace += "\n" + this.options.cause.stackTrace();
      
      return stackTrace;
   },
   
   //Properties
   getCause: function() { return this.options.cause; },
   getDescription : function() { return this.options.description; },
   getMessage: function() { return this.options.description.substitute( this.parameters ); }, 
   getName: function() { return this.options.name; },
   getSource : function() { return this.options.source; }
});
/*
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
*/



var IllegalArgumentException = new Class({
   Extends: WebUIException,
   options: {
      description: "Argument: '{argumentName}' has inappropriate value: '{argumentValue}'.",
      name: "IllegalArgumentException"
   },
   
   //Constructor
   initialize : function( argumentName, argumentValue, options ){
      this.parent( options );
      this.parameters = { argumentName : argumentName, argumentValue : argumentValue };
   }	
});
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
/*
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
*/


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

/*Name: OptionsResourceDescription: Unmarshalls a set of options from an XML file and transforms to a JavaScript object.Requires:    - XmlResourceProvides:	- OptionsResourcePart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors: 	- Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
var OptionsResource = new Class({   Implements: [Options],      options : {      nameSelector : "@name",      optionSelector : "option",      valueSelector : "@value"   },   //Constructor   initialize : function( definitionElement, options ) {      assertThat( definitionElement, not( nil() ));      this.setOptions( options );            this.definitionElement = definitionElement;      this.optionsAsText = "";      this.optionsObject;   },      //Public accessors and mutators   unmarshall: function(){      this.unmarshallOptions();      this.evaluateOptions();   },      //Properties   getOptions: function() { return this.optionsObject; },      //Protected, private helper methods   evaluateOptions: function(){      this.optionsObject = eval( "({" + this.optionsAsText + "})" );   }.protect(),      unmarshallOptions: function(){      var optionElements = XmlResource.selectNodes( this.options.optionSelector, this.definitionElement );      optionElements.each( function( optionElement, index ){         if( index > 0 ) this.optionsAsText += ", ";         var name = XmlResource.selectNodeText( this.options.nameSelector, optionElement );         var value = XmlResource.selectNodeText( this.options.valueSelector, optionElement );//         var arrayExpression = new RegExp( "^[\[]" ); //^[\[]+.*+[]$//         if( value.match( arrayExpression )) //            this.optionsAsText += name + " : " + eval( value );         this.optionsAsText += name + " : " + value ;      }, this );   }.protect()});
/*
Name: RemoteResource

Description: Retrieves any resource. Overrides isSuccess() of Request to handle local files.

Requires:
   - Request

Provides:
   - RemoteResource

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


var RemoteResource = new Class({
   Extends: Request,
   
   options: {
      async : true,
      method : 'get',
      nameSpaces: "xmlns:pp='http://www.processpuzzle.com'"
   },
   
   // Constructor
   initialize: function ( uri, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.parent( options );
      this.options.url = uri;
   },
   
   //Public accessors and mutators
   isSuccess: function() { // Determines if an XMLHttpRequest was successful or not
      try {
          // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
          return ( location.protocol === "file:" && !this.status && this.status === 0 && ( this.response.text || this.response.xml )) ||
              // Opera returns 0 when status is 304
              ( this.status >= 200 && this.status < 300 ) ||
              ( this.status === 304 ) || 
              ( this.status === 1223 );
      } catch(e) {}

      return false;
  },
  
  retrieve: function(){
     try{
        this.send( this.options.url );
     }catch( e ){
        if( e.name == "NS_ERROR_FILE_NOT_FOUND" ) this.failure();
        else if( e.name == "Error" ) this.failure();
        else throw new e ;
     }
  },
  
  // Properties
  getUri: function() { return this.options.url; },
  isAsync: function() { return this.options.async; }
  
  //Private helper methods
});
   
/*
Name: ResourceUri

Description: Helps to analyze a localize an uri.

Requires:
   - 

Provides:
   - ResourceUri

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


var ResourceUri = new Class({
   Implements: Options,
   
   options: {
      contentType : "xml",
      documentType : null,
      documentTypeKey : 'documentType'
   },
   
   // Constructor
   initialize: function ( uri, locale, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.setOptions( options );
      
      this.locale = locale;
      this.uri = uri;
      
      this.determineDocumentType();
   },
   
   //Public accessors and mutators
   determineLocalizedUri : function(){
      return this.uri.substring( 0, this.uri.lastIndexOf( "." + this.options.contentType )) + "_" + this.locale.getLanguage() + "." + this.options.contentType;      
   },
   
   isLocal : function(){
      var givenUri = new URI( this.uri );
      var documentUri = new URI( document.location.href );
      return givenUri.get( 'host' ) == "" || givenUri.get( 'host' ) == documentUri.get( 'host' ); 
   },
  
   // Properties
   getDocumentType : function() { return this.options.documentType; },
   
   //Private helper methods
   determineDocumentType : function(){
      if( !this.options.documentType ){
         var givenUri = new URI( this.uri );
         if( givenUri.get( 'data' ) && givenUri.getData( this.options.documentTypeKey ))
         this.options.documentType = AbstractDocument.Types[givenUri.getData( this.options.documentTypeKey )];
      }
   }.protect()
   
});
   
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
/*Name:    - TimeOutBehaviourDescription:    - Throws a TimeOutException when the timer isn't stopped within the the specified time interwal.Requires:Provides:	- TimeOutBehaviourPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors: 	- Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
var TimeOutBehaviour = new Class({   Implements: [Options],   Binds: ['checkTimeOut'],   options: {      delay: 200,      maxTries: 20   },      //Constructor   initialize : function( options ) {      this.setOptions( options );      this.checkedProcessName;      this.numberOfTries;      this.timer;   },      //Public accessors and mutators   checkTimeOut: function(){      this.numberOfTries++;      if( this.numberOfTries >= this.options.maxTries ){         clearInterval( this.timer );         throw new TimeOutException( this.options.componentName, this.checkedProcessName );      }   },      startTimeOutTimer: function( processName ){      this.checkedProcessName = processName;      this.numberOfTries = 0;      this.timer = this.checkTimeOut.periodical( this.options.delay );   },      stopTimeOutTimer: function(){      clearInterval( this.timer );   }});
/*
Name: TimeOutException

Description: Thrown when the specified component's configuration or other process timed out.

Requires: WebUIException

Provides: TimeOutException

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


var TimeOutException = new Class({
   Extends: WebUIException,
   options: {
      description: "Executing the '{componentName}' element's '{processName}' timed out. See the stack trace for the root cause.",
      name: "TimeoutException"
   },
   
   //Constructor
   initialize : function( componentName, processName, options ){
      this.parent( options );
      this.parameters = { componentName : componentName, processName : processName };
      this.componentName = componentName;
      this.processName = processName;
   },
   
   //Properties
   getComponentName: function() { return this.componentName; },
   getProcessName: function() { return this.processName; },
});
/*
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
*/


var UndefinedXmlResourceException = new Class({
   Extends: WebUIException,
   options: {
      description: "Given xml resource: '{resourceName}' doesn't exist or can't be accessed.",
      name: "UndefinedXmlResourceException"
   },
   
   //Constructor
   initialize : function( resourceName, options ){
      this.parent( options );
      this.parameters = { resourceName : resourceName };
   }	
});
/*
Name: 
    - UniqueId

Description: 
    - Generates a unique identifier. 

Requires:
    - 
    
Provides:
    - UniqueId

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


var lastUniqueIdentifier = 0;

var UniqueId = new Class({
   initialize: function( prefix ){
      this.prefix = typeOf( prefix ) == 'string' ? prefix : "";
   },
   
   generate: function(){
      lastUniqueIdentifier++;
      return this.prefix + lastUniqueIdentifier.toString( 16 - this.prefix.length );
   }
});

UniqueId.generate = function( prefix ){
   var generator = new UniqueId( prefix );
   return generator.generate();
};
/*
Name: XPathSelectionException

Description: Thrown when an XPath selector did not resulted in any element.

Requires: WebUIException

Provides: XPathSelectionException

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


var XPathSelectionException = new Class({
   Extends: WebUIException,
   options: {
      description: "XPath selector: '{selector}' didn't resulted any element of XML: '{xmlResourceUri}'.",
      name: "XPathSelectionException"
   },
   
   //Constructor
   initialize : function( selector, xmlResourceUri, options ){
      this.parent( options );
      this.parameters = { selector : selector, xmlResourceUri : xmlResourceUri };
   }	
});
/*
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
*/


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
      assertThat( uri, not( nil() ));
      assertThat( Sarissa.XPATH_INITIALIZED, is( true ));
      
      this.parent( options );
      this.options.url = uri;
      this.options.method = 'get';
      this.options.async = false;
      this.xmlAsText = null;
      this.xmlDoc = null;
      
      //this.checkBrowserCompatibility();
      this.refreshResource();
      
      //console.log('XmlResource is initialized.');
   },
   
   // Public accessor and mutator methods
   createElement : function( tagName, properties ){
      var newXmlElement = this.xmlDoc.createElement( tagName );
      if( properties && properties['text'] ) newXmlElement.appendChild( this.xmlDoc.createTextNode( properties['text'] ) );
      return newXmlElement;
   },
   
   determineAttributeValue : function( xmlElement, attributeName ) {
      return XmlResource.determineAttributeValue( xmlElement, attributeName );
   },
   
   determineNodeText : function( xmlElement ) {
      return XmlResource.determineNodeText( xmlElement );
   },
   
   injectElement : function( elementToInject, contextSelector, position ){
      assertThat( elementToInject, not( nil() ));
      assertThat( contextSelector, not( nil() ));
      
      var contextElement = this.selectNode( contextSelector );
      if( !contextElement ) throw new XPathSelectionException( contextSelector, this.options.url );
      
      contextElement.appendChild( elementToInject );
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
   
   release : function(){
      this.xmlDoc = null;
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
         foundXmlNodes = subjectNode.selectNodes( selector );
         if( typeOf( foundXmlNodes ) == 'collection' ){
            foundXmlNodes =  Array.from( foundXmlNodes );
         }
      }catch(e) {
         //console.log( e );
         //console.log( "Namespaces: " + subjectNode.getProperty( "SelectionNamespaces" ));
         return null;
      }
      return foundXmlNodes;
   },
   
   selectNodeText : function( selector, subNode, defaultValue ) {
      var selectedElements = this.selectNodes( selector, subNode );
      if( selectedElements.length > 0 && selectedElements[0] ) {
         return XmlResource.determineNodeText( selectedElements[0] );
      }else if( defaultValue ) return defaultValue;
      else return null;
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
XmlResource.determineAttributeValue = function( xmlElement, attributeName, defaultValue ) {
   var attributeElement = xmlElement.selectNodes( "@" + attributeName );
   if( attributeElement && attributeElement.length == 1 ) return attributeElement[0].nodeValue;
   else if( defaultValue ) return defaultValue;
   else return null;
};

XmlResource.determineNodeText = function( xmlElement, defaultValue ) {
   var nodeText = null;
   if( xmlElement ) {
      nodeText = Sarissa.getText( xmlElement );
      if( !nodeText ) nodeText = defaultValue;
   }
   
   return nodeText;
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
		if( typeOf( selectedElements ) == 'collection' ){
		   selectedElements = Array.from( selectedElements );
		}
	}catch( e ){
		log4javascript.getDefaultLogger().debug( "Selector: '" + selector + "' caused excection: " + e.message );
		return null;
	}
	return selectedElements;
};

XmlResource.selectNodeText = function( selector, xmlElement, nameSpaces, defaultValue ) {
   var selectedElement = XmlResource.selectNode( selector, xmlElement, nameSpaces );
   if( !selectedElement && defaultValue ) return defaultValue;
   else return XmlResource.determineNodeText( selectedElement, defaultValue );
};

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

XmlResource.Positions = {
      Before : 0,
      After : 1,
      FirstChild : 2,
      LastChild : 3,
      Undefined : 4 };
/*
---

name: Class.Singleton

description: Beautiful Singleton Implementation that is per-context or per-object/element

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class]

provides: Class.Singleton

...
*/



(function(){

var storage = {

   storage: {},

   destroy: function( key, value ){
      this.storage[key] = null;
   },
   
   store: function(key, value){
      this.storage[key] = value;
   },

   retrieve: function(key){
      return this.storage[key] || null;
   }

};

Class.Singleton = function(){
   this.$className = String.uniqueID();
};

Class.Singleton.prototype.check = function(item){
   if (!item) item = storage;

   var instance = item.retrieve('single:' + this.$className);
   if (!instance) item.store('single:' + this.$className, this);

   return instance;
};

Class.Singleton.prototype.destroyInstance = function(item){
	if (!item) item = storage;

	var instance = item.retrieve( 'single:' + this.$className );
	if( instance ) item.destroy( 'single:' + this.$className, this );
};

var gIO = function(klass){

   var name = klass.prototype.$className;

   return name ? this.retrieve('single:' + name) : null;

};

if (('Element' in this) && Element.implement) Element.implement({getInstanceOf: gIO});

Class.getInstanceOf = gIO.bind(storage);

}).call(this);
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




var WebUILogger = new Class({
   Implements: [Class.Singleton, Options],
   options: {
      defaultLoggerName : "WebUI"
   },

   initialize: function( webUIConfiguration, options ) { return this.check() || this.setUp( webUIConfiguration, options ); },

   setUp : function( webUIConfiguration, options ) {
      this.appenders = new HashMap();
      this.defaultLogger = null;
      this.layouts = new HashMap();
      this.loggers = new HashMap();
      this.loggerIsConfigured = false;
      
      if( webUIConfiguration ) this.configure( webUIConfiguration );
      else this.configureDefaultLogger();
   },
   
   //Public accessors and mutators
   configure : function( webUIConfiguration ) {
      for( i = 0; i < webUIConfiguration.getLoggingLayoutElements().length; i++ ) {
         var layoutName = webUIConfiguration.getLoggingLayoutName( i );
         var layout = this.configureLayout( layoutName, webUIConfiguration );
         this.layouts.put( layoutName, layout );
      }
      
      for( i = 0; i < webUIConfiguration.getLoggingAppenderElements().length; i++ ) {
         var appenderName = webUIConfiguration.getLoggingAppenderName( i );
         var appender = this.configureAppender( appenderName, webUIConfiguration );
         this.appenders.put( appenderName, appender );
      }
      
      for( i = 0; i < webUIConfiguration.getLoggerElements().length; i++ ) {
         var loggerName = webUIConfiguration.getLoggerName( i );
         var logger = this.configureLogger( loggerName, webUIConfiguration );
         this.loggers.put( loggerName, logger );
      }
      
      this.determineDefaultLogger();
      this.loggerIsConfigured = true;
   },
   
   configureDefaultLogger: function(){
   	this.defaultLogger = log4javascript.getDefaultLogger();
   },
   
   debug : function( logMessage ) { this.log( WebUILogger.DEBUG, logMessage ); },
   error : function( logMessage ) { this.log( WebUILogger.ERROR, logMessage ); },
   fatal : function( logMessage ) { this.log( WebUILogger.FATAL, logMessage ); },
   group : function( groupName, initiallyExpanded ) { 
      this.defaultLogger.group( groupName, initiallyExpanded );
   },
   
   groupEnd : function() { 
      this.defaultLogger.groupEnd();
   },
   
   info : function( logMessage ) { this.log( WebUILogger.INFO, logMessage ); },
   
   log : function( logLevel, logMessage ){
      if( !this.logLevelIsValid( logLevel ) ) 
         throw new IllegalArgumentException( "logLevel", logLevel );
      this.defaultLogger.log( logLevel, logMessage );
   },
   
   tearDown : function() {
      var loggerIterator = this.loggers.iterator();
      while( loggerIterator.hasNext() ){
         var aLogger = loggerIterator.next().getValue();
         aLogger.removeAllAppenders();
      }
      
      this.layouts.clear();
      this.appenders.clear();
      this.loggers.clear();
      
      this.loggerIsConfigured = false;
   },
   
   trace : function( logMessage ) { this.log( WebUILogger.TRACE, logMessage ); },
   warn : function( logMessage ) { this.log( WebUILogger.WARN, logMessage ); },
   
   //Properties
   getAppender : function( appenderName ) { return this.appenders.get( appenderName ); },
   getAppenders : function() { return this.appenders; },
   getDefaultLogger : function() { return this.defaultLogger; },
   getLayout : function( layoutName ) { return this.layouts.get( layoutName ); },
   getLayouts : function() { return this.layouts; },
   getLevel : function() { return this.defaultLogger.getLevel(); },
   getLogger : function( loggerName ) { return this.loggers.get( loggerName ); },
   getLoggers : function() { return this.loggers; },
   getName : function() { return this.options.defaultLoggerName;},
   isConfigured : function() { return this.loggerIsConfigured; },
   
   //Private helper methods
   configureAppender : function( appenderName, webUIConfiguration ){
      var appender = null;
      var lazyInit = webUIConfiguration.getLoggingAppenderLazyInit( appenderName );
      var height = webUIConfiguration.getLoggingAppenderHeight( appenderName );
      var initiallyMinimized = webUIConfiguration.getLoggingAppenderInitiallyMinimized( appenderName );
      var useDocumentWrite = webUIConfiguration.getLoggingAppenderUseDocumentWrite( appenderName );
      var width = webUIConfiguration.getLoggingAppenderWidth( appenderName );
      
      switch( webUIConfiguration.getLoggingAppenderType( appenderName ).toUpperCase() ){
      case "WUI:ALERTAPPENDER": 
         appender = new log4javascript.AlertAppender(); 
         break;
      case "WUI:AJAXAPPENDER": 
         var url = webUIConfiguration.getLoggingAppenderURL( appenderName );
         appender = new log4javascript.AjaxAppender( url );
         break;
      case "WUI:BROWSERCONSOLEAPPENDER": 
         appender = new log4javascript.BrowserConsoleAppender(); 
         break;
      case "WUI:INPAGEAPPENDER": 
         var containerElementId = webUIConfiguration.getLoggingAppenderContainerElementId( appenderName );
         appender = new log4javascript.InPageAppender( containerElementId, lazyInit, initiallyMinimized, useDocumentWrite, width, height ); 
         break;
      case "WUI:POPUPAPPENDER": 
         var lazyInit = webUIConfiguration.getLoggingAppenderLazyInit( appenderName );
         var initiallyMinimized = webUIConfiguration.getLoggingAppenderInitiallyMinimized( appenderName );
         var useDocumentWrite = webUIConfiguration.getLoggingAppenderUseDocumentWrite( appenderName );
         var width = webUIConfiguration.getLoggingAppenderWidth( appenderName );
         var height = webUIConfiguration.getLoggingAppenderHeight( appenderName );
         appender = new log4javascript.PopUpAppender( lazyInit, initiallyMinimized, useDocumentWrite, width, height ); 
         break;
      default: appender = new log4javascript.PopUpAppender();
      };
      
      if( this.logLevelValueIsValid( webUIConfiguration.getLoggingAppenderThreshold( appenderName )))
         appender.setThreshold( this.parseLevel( webUIConfiguration.getLoggingAppenderThreshold( appenderName )));
      
      var layout = this.layouts.get( webUIConfiguration.getLoggingAppenderLayoutReference( appenderName ));
      appender.setLayout( layout );

      return appender;
   }.protect(),
   
   configureLayout : function( layoutName, webUIConfiguration ) {
      var layoutPattern = webUIConfiguration.getLoggingLayoutPattern( layoutName );
      var layout = new log4javascript.PatternLayout( layoutPattern );
      
      return layout;
   }.protect(),
   
   configureLogger : function( loggerName, webUIConfiguration ){
      var logger = log4javascript.getLogger( loggerName );
      logger.setLevel( this.parseLevel( webUIConfiguration.getLoggerLevel( loggerName )));
      var referencedAppender = this.appenders.get( webUIConfiguration.getLoggingLoggerAppenderReference( loggerName ));
      logger.addAppender( referencedAppender );

      if( webUIConfiguration.getLoggingLoggerIsDefault( loggerName )){
         this.options.defaultLoggerName = loggerName;
      }
      
      return logger;
   }.protect(),
   
   determineDefaultLogger : function() {
      if( this.defaultLogger == null ) this.defaultLogger = this.getLogger( this.options.defaultLoggerName );
   }.protect(),
   
   logLevelIsValid : function( logLevel ){
      switch( logLevel ){
      case log4javascript.Level.ALL: return true;
      case log4javascript.Level.TRACE: return true;
      case log4javascript.Level.DEBUG: return true;
      case log4javascript.Level.INFO: return true;
      case log4javascript.Level.WARN: return true;
      case log4javascript.Level.ERROR: return true;
      case log4javascript.Level.FATAL: return true;
      case log4javascript.Level.NONE: return true;
      default: return false;
   };
   }.protect(),
   
   logLevelValueIsValid : function( logLevelValue ){
      if( this.parseLevel( logLevelValue ) != null ) return true;
      else return false;
   }.protect(),
   
   parseLevel : function( levelString ){
      if( typeOf( levelString ) != 'string' ) return null;
      
      switch( levelString.toUpperCase() ){
         case "ALL": return log4javascript.Level.ALL;
         case "TRACE": return log4javascript.Level.TRACE;
         case "DEBUG": return log4javascript.Level.DEBUG;
         case "INFO": return log4javascript.Level.INFO;
         case "WARN": return log4javascript.Level.WARN;
         case "ERROR": return log4javascript.Level.ERROR;
         case "FATAL": return log4javascript.Level.FATAL;
         case "NONE": return log4javascript.Level.NONE;
         default: return null;
      };
   }.protect()
});

WebUILogger.ALL = log4javascript.Level.ALL;
WebUILogger.TRACE = log4javascript.Level.TRACE;
WebUILogger.DEBUG = log4javascript.Level.DEBUG;
WebUILogger.INFO = log4javascript.Level.INFO;
WebUILogger.WARN = log4javascript.Level.WARN;
WebUILogger.ERROR = log4javascript.Level.ERROR;
WebUILogger.FATAL = log4javascript.Level.FATAL;
WebUILogger.NONE = log4javascript.Level.NONE;
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




var WebUIMessageBus = new Class({
   Implements: [Class.Singleton, Options],
   options: {
      message: "hello"
   },

   //Constructors
   initialize: function( options ) { return this.check() || this.setUp( options ); },
   setUp : function( options ){
      this.setOptions( options );
      this.lastMessage = null;
      this.subscribersToMessages = new HashMap();
   }.protect(),
   
   //Public accessor and mutator methods
   notifySubscribers: function( message ){
      this.lastMessage = message;
      
      var messageClass = message.getClass();
      var subscribersToMessage = this.getSubscribersToMessage( messageClass );
      if( subscribersToMessage && subscribersToMessage.size() > 0 ){
         var largestIndex;
         subscribersToMessage.each( function( callBack, index ){
            callBack( message );
            largestIndex = index;
         }, this );
         return largestIndex;
      }else return null;
   },
   
   subscribeToMessage: function( messageClass, callBack ){
      var subscribersToMessage = this.getSubscribersToMessage( messageClass );
      if( subscribersToMessage == null ) subscribersToMessage = new ArrayList();
      subscribersToMessage.add( callBack );
      this.subscribersToMessages.put( messageClass.prototype.options.name, subscribersToMessage );
   },
   
   writeOffFromMessage: function( messageClass, callBack ){
      var subscribersToMessage = this.getSubscribersToMessage( messageClass );
      if( subscribersToMessage == null ) return;
      
      subscribersToMessage.remove( subscribersToMessage.indexOf( callBack ));
   },
   
   tearDown: function() {
      this.subscribersToMessages.clear();
   },
   
   //Properties
   getLastMessage: function() { return this.lastMessage; },
   getMessageListSize: function() { return this.subscribersToMessages.size(); },
   getSubscribersToMessage: function( messageClass ) { return this.subscribersToMessages.get( messageClass.prototype.options.name ); }
   
   //Private helper methods
});
/*
Name: 
    - AbstractDocument

Description: 
    - Represents any kind of content can be displayed in a panel content area. Defines, implements the common properties of PlainHtmlDocument, SmartDocument.

Requires:
    - 
Provides:
    - AbstractDocument

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





var AbstractDocument = new Class({
   Implements: [Events, Options],
   Binds: ['attachEditor',
           'detachEditor',
           'determineContainerElement',
           'finalizeConstruction', 
           'finalizeDestruction',
           'instantiateEditor',
           'loadResources', 
           'onConstructionError', 
           'onContainerResize',
           'onDocumentError', 
           'onDocumentReady', 
           'onEditorAttached',
           'onResourceError', 
           'onResourcesLoaded', 
           'releaseResources',
           'resetProperties',
           'subscribeToWebUIMessages', 
           'webUIMessageHandler'],
   
   options: {
      componentName : "AbstractDocument",
      contentUriSelector : "contentUri",
      descriptionSelector : "description",
      documentContainerId : "DocumentContainer",
      documentContentExtension : ".xml",
      documentContentUri : null,
      documentContentNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      documentDefinitionNameSpace: "xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      documentDefinitionUri : null,
      documentDefinitionUriSelector: "@documentDefinition",
      documentEditorClass : "DocumentEditor",
      handleMenuSelectedEventsDefault : false,
      handleMenuSelectedEventsSelector : "handleMenuSelectedEvents",
      nameSelector : "name",
      resourcesSelector : "resources",
      rootElementName : "/smartDocumentDefinition",
      versionSelector : "version"
   },
   
   //Constructor
   initialize: function( i18Resource, options ){
      this.setOptions( options );
      this.constructionChain = new Chain();
      this.containerElement;
      this.contentUri;
      this.description;
      this.destructionChain = new Chain();
      this.documentContent;
      this.documentDefinition;
      this.documentDefinitionUri;
      this.editor;
      this.error;
      this.handleMenuSelectedEvents;
      this.htmlElementFactory;
      this.i18Resource = i18Resource;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.name;
      this.resources;
      this.state = AbstractDocument.States.UNINITIALIZED;
      this.version;
      
      this.loadDocumentDefinition();
      this.loadDocumentContent();
      this.state = AbstractDocument.States.INITIALIZED;
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.compileConstructionChain();
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      this.compileDestructionChain();
      this.destructionChain.callChain();
   },
   
   onConstructionError: function( error ){
      if( error ) this.error = error;
      this.revertConstruction();
      this.fireEvent( 'documentError', this.error );
   },
   
   onContainerResize: function( newSize ){
      //Abstract method, should be overwritten by subclasses
   },
   
   onDocumentError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'documentError', error );
   },
   
   onDocumentReady: function(){
      this.constructionChain.callChain();
   },
   
   onEditorAttached: function(){
      this.constructionChain.callChain();
   },
   
   onResourceError: function( error ){
      this.error = error;
   },
   
   onResourcesLoaded: function(){
      if( this.resources.isSuccess() ) this.constructionChain.callChain();
      else this.onConstructionError();
   },
   
   showNotification: function( notificationText ){
      if( this.state == AbstractDocument.States.CONSTRUCTED ){
         var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_NOTIFICATION, notification : notificationText });
         this.messageBus.notifySubscribers( message );
      }
   }, 
   
   showWindow: function( windowName ){
      if( this.state == AbstractDocument.States.CONSTRUCTED ){
         var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_WINDOW, windowName : windowName });
         this.messageBus.notifySubscribers( message );
      }
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallResources();
      this.state = AbstractDocument.States.UNMARSHALLED;
   },

   webUIMessageHandler: function( webUIMessage ){
      if( this.state != AbstractDocument.States.CONSTRUCTED ) return;
      
      if( instanceOf( webUIMessage, MenuSelectedMessage ) && webUIMessage.getActivityType() == AbstractDocument.Activity.MODIFY_DOCUMENT ) {
         switch( webUIMessage.getActionType() ){
            case AbstractDocument.Action.ADD_IMAGE: this.editor.textAddImage(); break;
            case AbstractDocument.Action.ADD_LINK: this.editor.textAddLink(); break;
            case AbstractDocument.Action.ALIGN_CENTER: this.editor.textAlignCenter(); break;
            case AbstractDocument.Action.ALIGN_LEFT: this.editor.textAlignLeft(); break;
            case AbstractDocument.Action.ALIGN_JUSTIFY: this.editor.textAlignJustify(); break;
            case AbstractDocument.Action.ALIGN_RIGHT: this.editor.textAlignRight(); break;
            case AbstractDocument.Action.BOLD: this.editor.textBold(); break;
            case AbstractDocument.Action.INDENT: this.editor.textIndent(); break;
            case AbstractDocument.Action.ITALIC: this.editor.textItalic(); break;
            case AbstractDocument.Action.ORDERED_LIST: this.editor.textOrderedList(); break;
            case AbstractDocument.Action.OUTDENT: this.editor.textOutdent(); break;
            case AbstractDocument.Action.REDO: this.editor.textRedo(); break;
            case AbstractDocument.Action.REMOVE_LINK: this.editor.textRemoveLink(); break;
            case AbstractDocument.Action.STRIKETHROUGH: this.editor.textStrikethrough(); break;
            case AbstractDocument.Action.TOGGLE_VIEW: this.editor.textToggleView(); break;
            case AbstractDocument.Action.UNDERLINE: this.editor.textUnderline(); break;
            case AbstractDocument.Action.UNDO: this.editor.textUndo(); break;
            case AbstractDocument.Action.UNORDERED_LIST: this.editor.textUnorderedList(); break;
         }
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getContainerElement: function() { return this.containerElement; },
   getDescription: function() { return this.description; },
   getDocumentContent: function() { return this.documentContent; },
   getDocumentContentUri: function() { return this.options.documentContentUr; },
   getDocumentDefinition: function() { return this.documentDefinition; },
   getDocumentDefinitionUri: function() { return this.options.documentDefinitionUri; },
   getEditor: function() { return this.editor; },
   getError: function() { return this.error; },
   getHandleMenuSelectedEvents: function() { return this.handleMenuSelectedEvents; },
   getHtmlElementFactory: function() { return this.htmlElementFactory; },
   getLogger: function() { return this.logger; },
   getMessageBus: function() { return this.messageBus; },
   getName: function() { return this.name; },
   getResources: function() { return this.resources; },
   getState: function() { return this.state; },
   getVersion: function() { return this.version; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   attachEditor: function(){
      this.editor.attach( this.containerElement );
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.determineContainerElement, this.instantiateEditor, this.attachEditor, this.subscribeToWebUIMessages, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain(  this.releseResource, this.detachEditor, this.resetProperties, this.finalizeDestruction );
   }.protect(),
   
   detachEditor: function(){
      if( this.editor ) this.editor.detach();
      this.destructionChain.callChain();
   }.protect(),
   
   determineContainerElement: function(){
      this.containerElement = $( this.options.documentContainerId );
      this.htmlElementFactory = new WidgetElementFactory( this.containerElement, this.i18Resource );
      this.constructionChain.callChain();
   }.protect(),
   
   finalizeConstruction: function(){
      this.state = AbstractDocument.States.CONSTRUCTED;
      this.fireEvent('documentReady', this );
   }.protect(),
   
   finalizeDestruction: function(){
      this.constructionChain.clearChain();
      this.destructionChain.clearChain();
      this.state = AbstractDocument.States.INITIALIZED;
      this.fireEvent('documentDestroyed', this );
   }.protect(),
   
   instantiateEditor: function(){
      var editorClass = eval( this.options.documentEditorClass );
      this.editor = new editorClass( this.i18Resource, { onEditorAttached : this.onEditorAttached } );
      this.constructionChain.callChain();
   }.protect(),
   
   loadDocumentContent: function() {
      if( this.options.documentContentUri ){
         try{
            this.documentContent = new XmlResource( this.options.documentContentUri + "_" + this.i18Resource.getLocale().getLanguage() + this.options.documentContentExtension );
         }catch( e ){
            try{
               this.documentContent = new XmlResource( this.options.documentContentUri );
            }catch( e ){
               throw new IllegalArgumentException( 'SmartDocument.options.documentContentUri', this.options.documentContentUri );
            }
         }
      }else {
         this.options.documentContentUri = this.options.documentDefinitionUri.substring( 0, this.options.documentDefinitionUri.lastIndexOf( ".xml" ));
         try{
            this.documentContent = new XmlResource( this.options.documentContentUri + "_" + this.i18Resource.getLocale().getLanguage() + this.options.documentContentExtension );
         }catch( e ){
            this.logger.trace( "Content of " + this.name + " document couldn't be loaded." );
         }
      }
   }.protect(),
   
   loadDocumentDefinition: function() {
      if( this.options.documentDefinitionUri ) this.documentDefinition = new XmlResource( this.options.documentDefinitionUri );
      else throw new IllegalArgumentException( 'SmartDocument.options.documentDefinitionUri', this.options.documentDefinitionUri );
   }.protect(),
   
   loadResources: function(){
      if( this.resources ) this.resources.load();
      else this.constructionChain.callChain();
   }.protect(),
   
   releaseResources : function(){
      if( this.resources ) this.resources.release();
      this.destructionChain.callChain();
   }.protect(),
   
   resetProperties: function(){
      this.description = null;
      this.options.documentContentUri = null;
      this.options.documentDefinitionUri = null;
      this.editor = null;
      this.name = null;
      this.version = null;
      this.destructionChain.callChain();
   }.protect(),
   
   revertConstruction: function(){
      if( this.editor ) this.editor.destroy();
      this.resetProperties();
      this.state = AbstractDocument.States.INITIALIZED;
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      if( this.handleMenuSelectedEvents ){
         this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
         this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      }
      
      this.constructionChain.callChain();
   }.protect(),
      
   unmarshallProperties: function(){
      this.description = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.descriptionSelector );
      this.handleMenuSelectedEvents = parseBoolean( this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.handleMenuSelectedEventsSelector, null, this.options.handleMenuSelectedEventsDefault ));
      this.name = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.nameSelector );
      this.version = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.versionSelector );
   }.protect(),
      
   unmarshallResources: function(){
      var resourcesElement = this.documentDefinition.selectNode( this.options.rootElementName + "/" + this.options.resourcesSelector );
      if( resourcesElement ){
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
         this.resources.unmarshall();
      }
   }.protect()
});

AbstractDocument.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
AbstractDocument.Types = { HTML : 'StaticHtml', SMART : 'SmartDocument', REMOTE_RESOURCE : 'RemoteResource' };
AbstractDocument.Activity = { LOAD_DOCUMENT : 'loadDocument', MODIFY_DOCUMENT : 'modifyDocument' };
AbstractDocument.Action = { 
      BOLD : 'bold', 
      ITALIC : 'italic', 
      UNDERLINE : 'underline', 
      STRIKETHROUGH : 'strikethrough', 
      UNORDERED_LIST : 'unorderedList', 
      ORDERED_LIST : 'orderedList', 
      INDENT : 'indent', 
      OUTDENT : 'outdent', 
      ALIGN_LEFT : 'alignLeft', 
      ALIGN_CENTER : 'alighCenter',
      ALIGN_RIGHT : 'alignRight',
      ALIGN_JUSTIFY : 'alignJustify',
      UNDO : 'undo',
      REDO : 'redo',
      ADD_LINK : 'addLink',
      REMOVE_LINK : 'removeLink',
      ADD_IMAGE : 'addImage',
      TOGGLE_VIEW : 'toggleView' };
//WebUIMessage.js



var WebUIMessage = new Class({
   Implements: Options,
   options: {
      description: "Generic Browser Interface message. Normally this message should be overwritten by subclasses.",
      messageClass: null,
      name: "WebUIMessage",       //Please note, that subclasses should overwrite this.
      originator: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
   },
   
   //Public accessor and mutator methods
   
   //Properties
   getClass: function() { return this.options.messageClass; },
   getDescription: function() { return this.options.description; },
   getName: function() { return this.options.name; },
   getOriginator: function() { return this.options.originator; }
   
   //Private helper methods
});
/*
Name: 
   - DocumentSelectedMessage

Description: 
   - This message sent out when a document - either SmartDocument, local file or even RemoteDocument is selected.

Requires:
   - WebUIMessage

Provides:
   - DocumentSelectedMessage

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





var DocumentSelectedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      activityType: null,
      description: "A message about the event that a SmartDocument of RemoteResource was selected.",
      documentContentURI: null,
      documentType: AbstractDocument.Types.SMART,
      documentURI: null,
      name: "DocumentSelectedMessage",
      notification: null,
      windowName: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = DocumentSelectedMessage;
   },
   
   //Public accessors
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getContextItemId: function() { return this.options.contextItemId; },
   getDocumentContentURI: function() { return this.options.documentContentURI; },
   getDocumentType: function() { return this.options.documentType; },
   getDocumentURI: function() { return this.options.documentURI; },
   getNotification: function() { return this.options.notification; },
   getWindowName: function() { return this.options.windowName; }
});

// BrowserWidget.js

/**
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2011 Zsolt Zsuffa
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */




var BrowserWidget = new Class( {
   Implements : [Events, Options],
   Binds : ['broadcastConstructedMessage', 'destroyChildHtmlElements', 'finalizeConstruction', 'finalizeDestruction', 'webUIMessageHandler'],

   options : {
      componentName : "BrowserWidget",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      domDocument : this.document,
      eventDeliveryDelay : 5,
      subscribeToWebUIMessages : false,
      useLocalizedData : false,
      widgetContainerId : "widgetContainer",
      widgetDataURI : null,
      widgetDefinitionURI : null
   },

   // constructor
   initialize : function( options, resourceBundle, elementFactoryOptions ) {
      this.setOptions( options );

      // private instance variables
      this.componentStateManager;
      this.constructionChain = new Chain();
      this.containerElement;
      this.dataXml;
      this.definitionXml;
      this.description;
      this.destructionChain = new Chain();
      this.elementFactory = null;
      this.i18Resource = null;
      this.lastHandledMessage = null;
      this.locale;
      this.logger;
      this.messageBus;
      this.name;
      this.state;
      this.stateSpecification;
      this.webUIController = null;

      // initialize object
      this.deduceInitializationArguments( options, resourceBundle );
      this.containerElement = document.id( $( this.options.widgetContainerId ));
      this.configureComponentStateManager();
      this.configureLogger();
      this.configureMessageBus();
      this.loadWidgetDefinition();
      this.loadWidgetData();

      assertThat( this.i18Resource, not( nil() ) );
      if( this.containerElement == null )
         throw new IllegalArgumentException( "Parameter 'widgetContainerId' in invalid." );
      if( !this.i18Resource.isLoaded )
         throw new IllegalArgumentException( "ResourceBundle should be already loaded." );
      
      this.elementFactory = new WidgetElementFactory( this.containerElement, this.i18Resource, elementFactoryOptions );
      this.restoreComponentState();
      this.state = BrowserWidget.States.INITIALIZED;
   },

   // public accessor and mutator methods
   construct : function() {
      if( this.state < BrowserWidget.States.CONSTRUCTED ) {
         this.compileConstructionChain();
         this.constructionChain.callChain();
      }
      return this;
   },

   destroy : function() {
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.compileDestructionChain();
         this.destructionChain.callChain();
      }
   },

   getText : function( key ) {
      var text = null;
      try{
         text = this.i18Resource.getText( key );
      }catch (e){
         text = key;
      }
      return text;
   },
   
   removeChild : function( childElement, parentElement ) {
      var contextElement = parentElement == undefined ? this.containerElement : parentElement;

      if( contextElement != null && childElement != null ){
         contextElement.removeChild( childElement );
      }
   },
   
   restoreComponentState : function() {
      this.stateSpecification = this.componentStateManager.retrieveCurrentState( this.options.componentName ); 
      this.parseStateSpecification();
   },
   
   storeComponentState : function() {
      this.compileStateSpecification();
      this.componentStateManager.storeCurrentState( this.options.componentName, this.stateSpecification );
   }.protect(),
   
   unmarshall : function(){
      this.state = BrowserWidget.States.UNMARSHALLED;
      return this;
   },

   updateText : function( theContainerElement, parentElementId, newTextValue ) {
      var parentElement = theContainerElement.findElementById( theContainerElement, parentElementId );
      parentElement.set( 'text', this.getText( newTextValue ) );
   },

   webUIMessageHandler : function( webUIMessage ) {
      if( this.state != BrowserWidget.States.CONSTRUCTED ) throw new UnconfiguredWidgetException( { source : 'BrowserWidget.webUIMessageHandler()'} );
      this.lastHandledMessage = webUIMessage;
   },

   // Properties
   getContainerElement : function() { return this.containerElement; },
   getDataXml : function() { return this.dataXml; },
   getDefinitionXml : function() { return this.definitionXml; },
   getDescription: function() { return this.description; },
   getElementFactory : function() { return this.elementFactory; },
   getHtmlDOMDocument : function() { return this.options.domDocument; },
   getLastMessage : function() { return this.lastHandledMessage; },
   getLocale : function() { return this.locale; },
   getLogger : function() { return this.logger; },
   getMessageBus : function() { return this.messageBus; },
   getName: function() { return this.name; },
   getResourceBundle : function() { return this.i18Resource; },
   getState : function() { return this.state; },

   // Private helper methods
   broadcastConstructedMessage: function(){
      var constructedMessage = new WidgetConstuctedMessage({ originator : this.options.componentName });
      this.messageBus.notifySubscribers( constructedMessage );
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   compileStateSpecification: function(){
      //Abstract method, should be overwrite!
   }.protect(),
   
   configureComponentStateManager : function() {
      if( this.webUIController == null ) this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      else this.componentStateManager = this.webUIController.getStateManager();
   }.protect(),

   configureLogger : function() {
      if( this.webUIController == null ){
         this.logger = Class.getInstanceOf( WebUILogger );
         if( this.logger == null )
            this.logger = new WebUILogger();
      }else
         this.logger = this.webUIController.getLogger();
   }.protect(),

   configureMessageBus : function() {
      if( this.webUIController == null ) this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      else this.messageBus = this.webUIController.getMessageBus();

      this.subscribeToWebUIMessages();
   }.protect(),

   deduceInitializationArguments : function( options, resourceBundle ) {
      if( resourceBundle ){
         this.i18Resource = resourceBundle;
         this.locale = resourceBundle.getLocale();
      }else{
         this.webUIController = Class.getInstanceOf( WebUIController );
         this.i18Resource = this.webUIController.getResourceBundle();
         this.locale = this.webUIController.getCurrentLocale();
      }
   }.protect(),
   
   destroyChildHtmlElements : function(){
      this.containerElement = document.id( this.containerElement );
      this.containerElement.getElements( '*' ).each( function( childElement, index ) {
         if( childElement.removeEvents )
            childElement.removeEvents();
         if( childElement.destroy )
            childElement.destroy();
      });
      
      this.destructionChain.callChain();
   }.protect(),

   finalizeConstruction : function(){
      this.logger.trace( this.options.componentName + ".onConstructed() of '" + this.name + "'." );
      this.storeComponentState();
      this.state = BrowserWidget.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.broadcastConstructedMessage();
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );
   }.protect(),
   
   finalizeDestruction : function(){
      this.logger.trace( this.options.componentName + ".onDestroyed() of '" + this.name + "'." );
      this.state = BrowserWidget.States.INITIALIZED;
      this.destructionChain.clearChain();
      this.fireEvent( 'destroyed', this, this.options.eventDeliveryDelay );
   }.protect(),

   loadWebUIConfiguration : function() {
      try{
         this.webUIConfiguration = new WebUIConfiguration( this.options.configurationUri );
      }catch (e){
         alert( "Couldn't load Browser Front-End configuration: " + this.options.configurationUri );
      }
   }.protect(),

   loadWidgetData : function() {
      if( this.options.widgetDataURI ){
         try{
            var dataUri = this.options.useLocalizedData ? new ResourceUri( this.options.widgetDataURI, this.locale ).determineLocalizedUri() : this.options.widgetDataURI;
            this.dataXml = new XmlResource( dataUri, {
               nameSpaces : this.options.dataXmlNameSpace} );
         }catch (e){
            this.logger.debug( "Widget data: '" + this.options.widgetDataURI + "' not found." );
         }
      }
   }.protect(),

   loadWidgetDefinition : function() {
      if( this.options.widgetDefinitionURI ){
         try{
            this.definitionXml = new XmlResource( this.options.widgetDefinitionURI, {
               nameSpaces : this.options.definitionXmlNameSpace} );
         }catch (e){
            this.logger.debug( "Widget definition: '" + this.options.widgetDefinitionURI + "' not found." );
         }
      }
   }.protect(),
   
   parseStateSpecification: function(){
      //Abstract method, should be overwrite!
   }.protect(),

   subscribeToWebUIMessages : function() {
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.subscribeToMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }.protect(),

   unmarshallProperties: function(){
      this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
      this.name = this.definitionXml.selectNodeText( this.options.nameSelector );
   }.protect(),
   
   writeOffFromWebUIMessages : function(){
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.writeOffFromMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }
});

BrowserWidget.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
//UnconfiguredWidget.js

var UnconfiguredWidgetException = new Class({
   Extends: WebUIException,
   options: {
      description: "Browser Widget is unconfigured therefore the requested operation can't be carried out.",
      name: "UnconfiguredWidgetException"
   },
   
   //Constructor
   initialize : function( options ){
      this.setOptions( options );
      this.parent( options );
   }
});
/*
Name: 
   - WidgetConstructedMessage

Description: 
   - This message sent out when a widget is constructed.

Requires:
   - WebUIMessage

Provides:
   - WidgettedMessage

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





var WidgetConstuctedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      activityType: null,
      description: "New widget was constructed.",
      name: "WidgetConstructedMessage",
      notification: null,
      windowName: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = WidgetConstuctedMessage;
   },
   
   //Public accessors
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getContextItemId: function() { return this.options.contextItemId; },
   getNotification: function() { return this.options.notification; },
   getWindowName: function() { return this.options.windowName; }
});

/*
Name: 
    - HtmlElementFactory

Description: 
    - Instantiates a new HTML element with given properties and appends to the element hierarchy. 

Requires:
    - 
    
Provides:
    - HtmlElementFactory

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


var WidgetElementFactory = new Class( {
   Implements : Options,
   
   options : {
      appendByDefault : true,
      buttonClassName : "buttonSmall", 
      defaultPosition : 3,
      formFieldsContainerClassName : "editableContainer",
      fieldSetImageAlt : "Show/Hide",
      fieldSetImageSource : "Images/expver.png",
      fieldSetImageStyle : { 'cursor' : 'pointer' },
      fieldSetImageTitle : "Show/Hide",
      fieldSetStyle : { 'border-color' : '#336699', 'width' : '100%' },
      labelClassName : "label",
      readOnlyContainerClassName : "readOnlyContainer",
      rowClassName : "row",
      valueClassName : "formw"
   },

   // Constructor
   initialize : function( containerElement, i18Resource, options ) {
      assertThat( containerElement, not( nil() ) );
      assertThat( i18Resource, not( nil() ) );
      this.setOptions( options );

      this.containerElement = containerElement;
      this.i18Resource = i18Resource;
   },

   // Public accessors and mutator methods
   create : function( tagName, nodeText, contextElement, position, properties ) {
      var newElement = new Element( tagName, properties );
      if( nodeText )
         newElement.appendText( this.i18Resource.getText( nodeText ) );
      if( contextElement || this.options.appendByDefault )
         this.appendElement( newElement, contextElement, position );
      return newElement;
   },

   createAnchor : function( nodeText, anchorLink, clickEventHandler, contextElement, position, elementProperties ) {
      var defaultProperties;
      var anchorUri = anchorLink ? new ResourceUri( anchorLink ) : null;
      
      if( clickEventHandler ){
         defaultProperties = { href : "#", events : { click : clickEventHandler } };
      }else if( anchorUri && anchorUri.isLocal() ){
         if( anchorUri.getDocumentType() == AbstractDocument.Types.SMART ){
            defaultProperties = { href : "#", onclick : "top.webUIController.loadSmartDocument( '" + anchorLink  + "' );" };
         }else {
            defaultProperties = { href : "#", onclick : "top.webUIController.loadHtmlDocument( '" + anchorLink  + "' );" };
         }
      }else {
         defaultProperties = { href : anchorLink };
      }
      
      var properties = this.mergeProperties( defaultProperties, elementProperties );
      var newAnchor = this.create( 'A', nodeText, contextElement, position, properties );
      return newAnchor;
   },

   createButton : function( buttonCaption, clickEventHandler, contextElement, position, elementProperties ) {
      var defaultProperties = { 'class' : this.BUTTON_CLASS, type : "button", value : buttonCaption, events : { click : clickEventHandler } };
      var properties = this.mergeProperties( defaultProperties, elementProperties );
      var button = this.create( "INPUT", null, contextElement, position, properties );
      if( buttonCaption ) {
         var i18Caption = this.i18Resource.getText( buttonCaption );
         button.set( 'value', i18Caption );
      }
      return button;
   },

   createCollapsibleArea : function( contextElement, position, elementProperties ) {
      return this.create( "div", null, contextElement, position, this.mergeProperties( { 'class' : this.options.readOnlyContainerClassName }, elementProperties ));
   },

   createDivision : function( contextElement, position, elementProperties ) {
      return this.create( "div", null, contextElement, position, this.mergeProperties( { 'class' : this.options.readOnlyContainerClassName }, elementProperties ));
   },

   createFieldSet : function( imageId, contextElement, position, elementProperties ) {
      var defaultProperties = { styles : this.options.fieldSetStyle };
      var properties = this.mergeProperties( defaultProperties, elementProperties );
      var fieldSet = this.create( "FIELDSET", null, contextElement, position, properties );

      var legend = this.create( "LEGEND", null, fieldSet, WidgetElementFactory.Positions.LastChild );
      var imageProperties = { 
         id : imageId, 
         src : this.options.fieldSetImageSource, 
         "alt" : this.options.fieldSetImageAlt, 
         "title" : this.options.fieldSetImageTitle, 
         styles : this.options.fieldSetImageStyle 
      };
      this.create( "IMG", null, legend, WidgetElementFactory.Positions.LastChild, imageProperties );

      return fieldSet;
   },

   createForm : function( formName, methodType, contextElement, position, elementProperties ) {
      assertThat( formName, not( nil() ));
      assertThat( methodType.toUpperCase() == "POST" || methodType.toUpperCase() == "GET", is( true ) );
      
      var newForm = this.create( 'FORM', null, contextElement, position, this.mergeProperties( { id : formName, name : 'form', method : methodType }, elementProperties ) );
      this.create( 'DIV', null, newForm, WidgetElementFactory.Positions.LastChild, { 'class' : this.options.formFieldsContainerClassName } );
      this.create( 'DIV', null, newForm, WidgetElementFactory.Positions.LastChild, { 'class' : this.options.readOnlyContainerClassName } );
      return newForm;
   },

   createHiddenDivision : function( divId, contextElement, position, elementProperties ) {
      var defaultProperties = { id : divId, styles : { display : 'none' }, 'class' : this.options.readOnlyContainerClassName };
      var newDivision = this.create( 'DIV', null, contextElement, position, this.mergeProperties( defaultProperties, elementProperties ));
      return newDivision;
   },

   createOption : function( value, text, contextElement, position, elementProperties ) {
      var defaultProperties = { 'value' : value };
      return this.create( "OPTION", text, contextElement, position, this.mergeProperties( defaultProperties, elementProperties ) );
   },

   createRowLabel : function( labelText, contextElement, position, elementProperties ) {
      return this.create( 'span', labelText, contextElement, position, { 'class' : this.options.labelClassName } );
   },

   createRowValue : function( valueText, valueElementId, contextElement, position, elementProperties ) {
      return this.create( 'span', valueText, contextElement, position, { id : valueElementId, 'class' : this.options.valueClassName } );
   },

   createStaticRow : function( labelText, valueText, valueElementId, contextElement, position ) {
      var staticRow = this.create( 'div', null, contextElement, position, { 'class' : this.options.rowClassName } );
      this.create( 'label', labelText, staticRow, WidgetElementFactory.Positions.LastChild, { 'class' : this.options.labelClassName } );
      this.create( 'span', valueText, staticRow, WidgetElementFactory.Positions.LastChild, { id : valueElementId, 'class' : this.options.valueClassName } );
      return staticRow;
   },

   createTable : function( tableDefinition, contextElement, position ) {
      var tableElement = this.create( "TABLE", null, contextElement, position );
      var tableHeadElement = this.create( "THEAD", null, tableElement, WidgetElementFactory.Positions.LastChild );
      var tableBodyElement = this.create( "TBODY", null, tableElement, WidgetElementFactory.Positions.LastChild );
      var tableHeadRowElement = this.create( "TR", null, tableHeadElement, WidgetElementFactory.Positions.LastChild );

      for( var i = 1; i <= tableDefinition.getColumns().size(); i++) {
         var tableColumnDefinition = tableDefinition.getColumns().getColumnByIndex( i - 1 );
         this.create( "TH", tableColumnDefinition.getCaption(), tableHeadRowElement, WidgetElementFactory.Positions.LastChild );
      }

      for( var i = 0; i < tableDefinition.getRows().size(); i++) {
         var tableRow = tableDefinition.getRow( i );
         var tableBodyRowElement = this.create( "TR", null, tableBodyElement, WidgetElementFactory.Positions.LastChild );

         for( var c = 0; c < tableRow.length; c++ ) {
            this.create( "TD", tableRow[c], tableBodyRowElement, WidgetElementFactory.Positions.LastChild );
         }
      }

      return tableElement;
   },

   // Protected, private helper methods
   appendElement : function( element, contextElement, position ) {
      contextElement = $( contextElement );
      var context = contextElement == undefined ? this.containerElement : contextElement;
      switch( position ){
      case WidgetElementFactory.Positions.Before:
         context.grab( element, 'before' );
         break;
      case WidgetElementFactory.Positions.After:
         context.grab( element, 'after' );
         break;
      case WidgetElementFactory.Positions.FirstChild:
         context.grab( element, 'top' );
         break;
      case WidgetElementFactory.Positions.LastChild:
         context.grab( element, 'bottom' );
         break;
      default:
         context.appendChild( element, 'Last' );
         break;
      }
   }.protect(),
   
   mergeProperties : function( baseProperties, additionalProperties ){
      var mergedProperties = Object.merge( baseProperties, additionalProperties );
      return mergedProperties;
   }.protect()

});

var TableColumnDefinition = new Class( {
   // Constructor
   initialize : function(theCaptionKey, i18Resource) {
       // Private instance variables
       this.caption = null;
       this.i18Resource = i18Resource;
       try {
           this.caption = this.i18Resource.getText( theCaptionKey );
       } catch (e) {
           this.caption = theCaptionKey;
       }
   },

   // Properties
   getCaption : function() {
       return this.caption;
   }
});

var TableColumnList = new Class({
   //Constructor
   initialize: function(){
       this.tableColumns = new ArrayList();        
   },

   //Public accessor and mutator methods
   add : function( tableColumnDefinition ){
       this.tableColumns.add( tableColumnDefinition );
   },
   
   getColumnByIndex : function( columnIndex ){
       var searchedColumn = null;
       this.tableColumns.each( function( columnDefinition, index ){
           if( index == columnIndex ) { searchedColumn = columnDefinition; }
       }, this );
       
       return searchedColumn;
   },
   
   size : function() {
       return this.tableColumns.size();
   }
});

var TableHeaderDefinition = new Class( {
   // Constructor
   initialize : function(i18Resource) {
       this.tableColumns = new TableColumnList();
       this.i18Resource = i18Resource;
   },

   // Public accessor and mutator methods
   addColumn : function(theCaptionKey) {
       var columnDefinition = new TableColumnDefinition( theCaptionKey, this.i18Resource );
       this.tableColumns.add( columnDefinition );
       //this.tableColumns.add( columnDefinition.getCaption, columnDefinition );
   },

   getColumns : function() {
       return this.tableColumns;
   }
});

var TableDefinition = new Class( {
   // Constructor
   initialize : function(i18Resource) {
       this.tableHeaderDefinition = new TableHeaderDefinition( i18Resource );
       this.tableRows = new TableRowList();
   },

   // Public accessor and mutator methods
   addColumn : function(theCaptionKey) {
       this.tableHeaderDefinition.addColumn( theCaptionKey );
   },

   addRow : function( rowArray ) {
       this.tableRows.add( rowArray );
   },

   // Properties
   getColumns : function() {
       return this.tableHeaderDefinition.getColumns();
   },
   
   getRow : function( rowIndex ) {
       return this.tableRows.getRowByIndex( rowIndex );
   },
   
   getRows : function() {
       return this.tableRows;
   }
});

var TableRowList = new Class({
   //Constructor
   initialize: function(){
       this.tableRows = new ArrayList();       
   },

   //Public accessor and mutator methods
   add : function( tableRowDefinition ){
       this.tableRows.add( tableRowDefinition );
   },
   
   getRowByIndex : function( rowIndex ){
       var searchedRow = null;
       this.tableRows.each( function( rowDefinition, index ){
           if( index == rowIndex ) { searchedRow = rowDefinition; }
       }, this );
       
       return searchedRow;
   },
   
   size : function() {
       return this.tableRows.size();
   }
});

WidgetElementFactory.Positions = {
   Before : 0,
   After : 1,
   FirstChild : 2,
   LastChild : 3,
   Undefined : 4 };
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

//DefaultStateUriTransformer.js

var DefaultStateUriTransformer = new Class({
   initialize: function( stateManager ){
      this.stateManager = stateManager;
   },
   
   transformUriToState: function( uri ) {
      this.stateManager.parse( uri );
   },
   
   transformStateToUri: function(){
      return this.stateManager.toString();
   }
});
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

//ComponentStateManager.js




var ComponentStateManager = new Class({
   Implements: [Options, Class.Singleton],
   
   options: {
      stateUriTransformer: DefaultStateUriTransformer
   },
   
   //Constructors
   initialize: function( options ) { return this.check() || this.setUp( options ); },
   
   setUp : function( options ) {
      this.setOptions( options );
      this.stateMachine = new HashMap();
      this.stateUriTransformer = new this.options.stateUriTransformer( this );
   }.protect(),

   //Public accessor and mutator methods
   parse : function( sourceString ){
      var tokenizer = new StringTokenizer( sourceString, { delimiters : ';' } );
      while( tokenizer.hasMoreTokens() ){
         var token = tokenizer.nextToken();
         var componentName = token.substring( 0, token.indexOf( ":" ));
         var componentStateString = token.substring( token.indexOf( ":" ) +1 );
         var componentState = eval( "(" + componentStateString.trim() + ")" );
         
         this.storeCurrentState( componentName.trim(), componentState );
      };
   },
   
   reset : function() {
      this.stateMachine.clear();
   },
   
   resetStateFromUri: function( uri ){
      this.reset();
      this.stateUriTransformer.transformUriToState( uri );
   },
   
   retrieveCurrentState : function( componentName ){
      return this.stateMachine.get( componentName );
   },
   
   storeCurrentState : function( componentName, currentState ){
      if( componentName && currentState ) this.stateMachine.put( componentName, currentState );
   },
   
   toString: function(){
      var stateString = "";
      this.stateMachine.each( function( componentStateEntry, index ){
         if( stateString != "" ) stateString += ";";
         
         stateString += componentStateEntry.getKey() + ":";
         
         var valueString = "";
         var value = componentStateEntry.getValue();
         if( typeOf( value ) == "string" ) valueString = "'" + value + "'";
         else if( typeOf( value ) == "object" ){
            valueString = "{";
            for ( var property in value ) {
               if( valueString != "{" ) valueString += ",";
               valueString += property + ":'" + value[property] + "'";
            }
            valueString += "}";
         }
         else valueString = "'" + value.toString() + "'";
    
         stateString += valueString;
      }, this );
      
      return stateString;
   },
   
   transformStateToUri: function(){
      return this.stateUriTransformer.transformStateToUri();
   },
   
   //Properties
   getStateUriTransformer: function() { return this.stateUriTransformer; }
});
/*
Name: 
    - ComplexContentBehaviour

Description: 
    - Implements features of a DesktopElement which can contain header, toolbar, widget and smart document. 
Mainly used by DesktopPanel, and DesktopWidow. 

Requires:

Provides:
    - ComplexContentBehaviour

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


var ComplexContentBehaviour = new Class({
   Implements: [Events, Options],
   
   options : {
      contentUrlSelector : "contentURL",
      documentContentUriSelector : "document/documentContentUri",
      documentDefinitionUriSelector : "document/documentDefinitionUri",
      documentNameSeparator : "_",
      documentTypeDefault : AbstractDocument.Types.SMART,
      documentTypeSelector : "document/@type",
      documentWrapperId : "_documentWrapper_" + (new Date().getTime()),
      documentWrapperIdSelector : "document/@id",
      documentWrapperStyle : "documentWrapper",
      documentWrapperStyleSelector : "document/@elementStyle",
      documentWrapperTag : "div",
      documentWrapperTagSelector : "document/@tag",
      eventSourcesSelector : "eventOriginators",
      handleMenuSelectedEvents : false,
      handleMenuSelectedEventsSelector : "handleMenuSelectedEvents",
      handleTabSelectedEvents : false,
      handleTabSelectedEventsSelector : "handleTabSelectedEvents",
      headerSelector : "panelHeader",
      heightDefault : 125,
      heightSelector : "height",
      nameSelector : "name",
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com'",
      pluginSelector : "plugin",
      showHeaderSelector : "showHeader",
      storeStateSelector : "storeState",
      titleSelector : "title",
      widthDefault : 300,
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );
      this.componentRootElement;
      this.contentContainerElement;
      this.contentUrl;
      this.document;
      this.documentContentUri;
      this.documentContentType = AbstractDocument.Types.HTML;
      this.documentDefinitionUri;
      this.documentWrapper;
      this.documentWrapperId;
      this.documentWrapperStyle;
      this.documentWrapperTag;
      this.error;
      this.eventSources = null;
      this.handleMenuSelectedEvents;
      this.handleTabSelectedEvents;
      this.header;
      this.height;
      this.lastHandledMessage;
      this.name;
      this.plugin;
      this.showHeader;
      this.stateSpecification;
      this.storeState = false;
      this.title;
      this.width;
   },
   
   //Public accessor and mutator methods
   onContainerResize: function(){
      if( this.document && this.document.getState() == AbstractDocument.States.CONSTRUCTED ) {
         this.document.onContainerResize( this.contentContainerElement.getSize() );
      }
   },
   
   onDocumentError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   onDocumentReady: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "' finished." );
      this.storeComponentState();
      this.fireEvent( 'documentLoaded', this.documentDefinitionUri );
      this.constructionChain.callChain();
   },
   
   onHeaderConstructed: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s header finished." );
      this.constructionChain.callChain();
   },
   
   onHeaderConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', this.error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   onPluginConstructed: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s plugin finished." );
      this.constructionChain.callChain();
   },
   
   onPluginError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', this.error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   webUIMessageHandler: function( webUIMessage ){
      if( this.state != DesktopElement.States.CONSTRUCTED ) return;
      
      if( ( instanceOf( webUIMessage, MenuSelectedMessage ) || instanceOf( webUIMessage, TabSelectedMessage )) 
            && ( webUIMessage.getActivityType() == AbstractDocument.Activity.LOAD_DOCUMENT )
            && ( this.eventSources == null || this.eventSources.contains( webUIMessage.getOriginator() ))) {
         this.destroyDocument();
         this.destroyDocumentWrapper();
         this.cleanUpContentElement();
         this.processMessageProperties( webUIMessage );
         this.loadDocument( webUIMessage.getDocumentType() );
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getColumnReference: function() { return this.columnReference; },
   getComponentStateManager: function() { return this.componentStateManager; },
   getContentUrl: function() { return this.contentUrl; },
   getDocument: function() { return this.document; },
   getDocumentContentUri: function() { return this.documentContentUri; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   getDocumentWrapperId: function() { return this.documentWrapperId; },
   getDocumentWrapperStyle: function() { return this.documentWrapperStyle; },
   getDocumentWrapperTag: function() { return this.documentWrapperTag; },
   getEventSources: function() { return this.eventSources; },
   getHeader: function() { return this.header; },
   getHeight: function() { return this.height; },
   getLogger: function() { return this.logger; },
   getMessageBus: function() { return this.messageBus; },
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getStoreState: function() { return this.storeState; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   getWidth: function() { return this.width; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   cleanUpContentElement: function(){
      if( this.contentContainerElement ){
         var childElements = this.contentContainerElement.getElements ? this.contentContainerElement.getElements( '*' ) : Array.from( this.contentContainerElement.getElementsByTagName( '*' ));  
         childElements.each( function( childElement, index ){
            if( childElement.destroy ) childElement.destroy();
         }, this );
      }
   }.protect(),
      
   constructDocument: function(){
      if( this.document ) {
         this.createDocumentWrapper();
         this.document.construct();
      }else this.constructionChain.callChain();
   }.protect(),
   
   constructPlugin: function(){
      if( this.plugin ) this.plugin.construct();
      else this.constructionChain.callChain();
   }.protect(),
   
   constructHeader: function(){
      if( this.header ) this.header.construct( $( this.name + "_header" ));
      else this.constructionChain.callChain();
   }.protect(),
   
   createDocumentWrapper: function(){
      this.documentWrapper = new Element( this.documentWrapperTag, { id : this.documentWrapperId, 'class' : this.documentWrapperStyle } );
      this.contentContainerElement.grab( this.documentWrapper );
   }.protect(),
      
   destroyComponents: function(){
      this.destroyDocument();
      this.destroyDocumentWrapper();
      this.cleanUpContentElement();
      if( this.header ) this.header.destroy();
      if( this.plugin ) this.plugin.destroy();
      if( this.componentRootElement ) {
         if( this.componentRootElement.destroy ) this.componentRootElement.destroy();
         else this.componentRootElement.removeNode();
      }
   }.protect(),
   
   destroyDocument: function(){
      if( this.document )  this.document.destroy();
      this.document = null;
   }.protect(),
   
   destroyDocumentWrapper: function(){
      if( this.documentWrapper && this.documentWrapper.destroy ) this.documentWrapper.destroy();
      this.documentWrapper = null;
   }.protect(),
   
   determineComponentElements: function(){
      this.componentRootElement = $( this.name + this.options.componentRootElementIdPostfix );
      this.componentRootElement = $( this.componentRootElement );     //required by Internet Explorer
      this.contentContainerElement = $( this.name + this.options.componentContentIdPostfix );
      this.contentContainerElement = document.id( this.contentContainerElement ); //Applies Element's methods, required by Internet Explorer
      this.constructionChain.callChain();
   },
   
   instantiateDocument: function( documentType, documentOptions ){
      var newDocument = null;
      switch( documentType ){
      case AbstractDocument.Types.HTML: newDocument = new HtmlDocument( this.internationalization, documentOptions ); break;
      case AbstractDocument.Types.SMART: newDocument = new SmartDocument( this.internationalization, documentOptions ); break;
      }
      return newDocument;
   }.protect(),
   
   internationalizeContentUri: function(){
      this.contentUrl = this.contentUrl.substring( 0, this.contentUrl.lastIndexOf( ".html" )) + "_" + this.internationalization.getLocale().getLanguage() + ".html";
   }.protect(),
   
   loadDocument: function( documentType ){
      this.document = this.instantiateDocument( documentType, { 
         documentContainerId : this.documentWrapperId, 
         documentDefinitionUri : this.documentDefinitionUri, 
         documentContentUri : this.documentContentUri,
         onDocumentReady : this.onDocumentReady,
         onDocumentError : this.onDocumentError
      });
      this.document.unmarshall();
      this.constructDocument();
   }.protect(),
   
   parseStateSpecification: function(){
      this.documentDefinitionUri = this.stateSpecification['documentDefinitionURI'] != 'null' ? this.stateSpecification['documentDefinitionURI'] : null;
      this.documentContentUri = this.stateSpecification['documentContentURI'] != 'null' ? this.stateSpecification['documentContentURI'] : null;
      this.documentContentType = this.stateSpecification['documentType'] != 'null' ? this.stateSpecification['documentType'] : this.options.documentTypeDefault;
   }.protect(),

   processMessageProperties: function( webUIMessage ){
      this.documentDefinitionUri = webUIMessage.getDocumentURI();
      this.documentContentUri = webUIMessage.getDocumentContentURI();
      this.documentContentType = webUIMessage.getDocumentType();
   }.protect(),
      
   resetProperties: function(){
      this.contentUrl = null;
      this.documentContentUri = null;
      this.documentDefinitionUri = null;
      this.documentWrapperId = null;
      this.documentWrapperStyle = null;
      this.documentWrapperTag = null;
      this.height = null;
      this.name = null;
      this.showHeader = null;
      this.title = null;
   }.protect(),
   
   restoreComponentState : function() {
      if( this.storeState ){
         this.stateSpecification = this.componentStateManager.retrieveCurrentState( this.options.componentName ); 
         if( this.stateSpecification ) {
            this.parseStateSpecification();
            
            if( this.documentDefinitionUri ){
               this.document = this.instantiateDocument( this.documentContentType, { 
                  documentContainerId : this.documentWrapperId, 
                  documentDefinitionUri : this.documentDefinitionUri, 
                  documentContentUri : this.documentContentUri,
                  onDocumentReady : this.onDocumentReady,
                  onDocumentError : this.onDocumentError
               });
               this.document.unmarshall();
            }
         }
      }
      this.constructionChain.callChain();
   }.protect(),
   
   revertConstruction: function(){
      this.destroyComponents();
      this.resetProperties();
   }.protect(),
      
   storeComponentState : function() {
      if( this.storeState ){
         this.stateSpecification = { documentDefinitionURI : this.documentDefinitionUri, documentContentURI : this.documentContentUri, documentType : this.documentContentType };
         this.componentStateManager.storeCurrentState( this.options.componentName, this.stateSpecification );
      }
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      if( this.handleMenuSelectedEvents ){
         this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
         this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      }
      
      if( this.handleTabSelectedEvents ){
         this.logger.debug( this.options.componentName + ".subscribedToWebUIMessages() started." );
         this.messageBus.subscribeToMessage( TabSelectedMessage, this.webUIMessageHandler );
      }
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallDocument: function(){
      this.documentContentUri = XmlResource.selectNodeText( this.options.documentContentUriSelector, this.definitionElement );
      this.documentDefinitionUri = XmlResource.selectNodeText( this.options.documentDefinitionUriSelector, this.definitionElement );
      this.documentContentType = XmlResource.selectNodeText( this.options.documentTypeSelector, this.definitionElement, this.options.nameSpaces, this.options.documentTypeDefault );
      this.documentWrapperId = XmlResource.selectNodeText( this.options.documentWrapperIdSelector, this.definitionElement, this.options.nameSpaces, this.name + this.options.documentWrapperId );
      this.documentWrapperStyle = XmlResource.selectNodeText( this.options.documentWrapperStyleSelector, this.definitionElement, this.options.nameSpaces, this.options.documentWrapperStyle );
      this.documentWrapperTag = XmlResource.selectNodeText( this.options.documentWrapperTagSelector, this.definitionElement, this.options.nameSpaces, this.options.documentWrapperTag );
      if( this.documentDefinitionUri ){
         this.document = this.instantiateDocument( this.documentContentType, { 
            documentContainerId : this.documentWrapperId, 
            documentDefinitionUri : this.documentDefinitionUri, 
            documentContentUri : this.documentContentUri,
            onDocumentReady : this.onDocumentReady,
            onDocumentError : this.onDocumentError
         });
         this.document.unmarshall();
      }
   }.protect(),
   
   unmarshallHeader: function(){
      var headerConfigurationElement = XmlResource.selectNode( this.options.headerSelector, this.definitionElement );
      if( headerConfigurationElement ){
          this.header = new DesktopPanelHeader( headerConfigurationElement, this.internationalization, { onHeaderConstructed : this.onHeaderConstructed, onHeaderConstructionError : this.onHeaderConstructionError });
          this.header.unmarshall();
      }
   }.protect(),
   
   
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.internationalization, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginError } );
         this.plugin.unmarshall();
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.contentUrl = XmlResource.selectNodeText( this.options.contentUrlSelector, this.definitionElement );
      this.height = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.heightSelector, this.options.heightDefault ));
      this.eventSources = eval( XmlResource.determineAttributeValue( this.definitionElement, this.options.eventSourcesSelector, null, this.eventSources ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.showHeader = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.showHeaderSelector ));
      this.handleMenuSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleMenuSelectedEventsSelector, this.options.handleMenuSelectedEvents ));
      this.handleTabSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleTabSelectedEventsSelector, this.options.handleTabSelectedEvents ));
      this.storeState = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.storeStateSelector, false ));
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.definitionElement );
      if( this.internationalization ) this.title = this.internationalization.getText( this.title );
      this.width = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.widthSelector, this.options.widthDefault ));
      this.options.componentName = this.name;
   }.protect()
});
//UnconfiguredWidget.js



var ConfigurationTimeoutException = new Class({
   Extends: WebUIException,
   options: {
      description: "Configuring '{configurationPath}' exceeded the '{resourceLoadTimeout}'ms timeout period.",
      name: "ConfigurationTimeoutException"
   },
   
   //Constructor
   initialize : function( configurationPath, resourceLoadTimeout, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { configurationPath : configurationPath, resourceLoadTimeout : resourceLoadTimeout };
   }
});
/*
Distributed under the MIT License:

 * Copyright (c) 2010 IT Codex Llc.
 * MIT (MIT-LICENSE.txt)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

/*
name: 
   - Desktop
script: 
   - Desktop.js
description: 
   - Constructs complete desktop from predefined UI elements, like windows, columns and panels. It's wrapper of MockaUI desktop.
    
copyright: 
   - (c) 2011 IT Codex Llc., <http://itkodex.hu/>.
license: 
   - MIT-style license.

todo:
  - 

requires:
  - MochaUI/MUI.Core
  - MochaUI/MUI.Column
  - MochaUI/MUI.Panel
  - MochaUI/MUI.Windows

provides: [ProcessPuzzle.Desktop]

...
*/



var Desktop = new Class({
   Implements : [Events, Options], 
   Binds : ['constructColumns', 
            'constructContentArea', 
            'constructFooter', 
            'constructHeader', 
            'constructPanels', 
            'constructWindowDocker', 
            'constructWindows',
            'finalizeConstruction',
            'initializeMUI', 
            'loadResources',
            'onError',
            'onContentAreaConstructed',
            'onFooterConstructed',
            'onHeaderConstructed',
            'onPanelConstructed',
            'onResourceError',
            'onResourcesLoaded',
            'onWindowDockerConstructed',
            'showNotification',
            'subscribeToWebUIMessages',
            'webUIMessageHandler'],
   options : {
      callChainDelay : 2000,
      componentName : "Desktop",
      columnSelector : "/desktopConfiguration/columns/column",
      configurationXmlNameSpace : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration'",
      configurationURI : "DesktopConfiguration.xml",
      containerIdSelector : "/desktopConfiguration/containerId",
      contentAreaSelector : "/desktopConfiguration/contentArea",
      defaultContainerId : "desktop",
      descriptionSelector : "/desktopConfiguration/description",
      footerSelector : "/desktopConfiguration/footer",
      headerSelector : "/desktopConfiguration/header",
      nameSelector : "/desktopConfiguration/name",
      panelSelector : "/desktopConfiguration/panels/panel",
      pluginOnloadDelay : 1000,
      resourceLoadTimeout : 5000,
      resourcesSelector : "/desktopConfiguration/resources", 
      skin : "ProcessPuzzle",
      versionSelector : "/desktopConfiguration/version",
      windowDockerSelector : "/desktopConfiguration/windowDocker",
      windowSelector : "/desktopConfiguration/windows/window",
   },
	
	//Constructor
   initialize : function( webUIConfiguration, resourceBundle, options ) {
      this.presetOptionsBasedOnWebUIConfiguration( webUIConfiguration );
      this.setOptions( options );

	//Private instance variables
      this.columns = new LinkedHashMap();
      this.configurationXml = new XmlResource( this.options.configurationURI, { nameSpaces : this.options.configurationXmlNameSpace } );
      this.configurationChain = new Chain();
      this.containerElement;
      this.containerId;
      this.contentArea;
      this.currentLocale = null;
      this.description;
      this.dock = null;
      this.error;
      this.footer;
      this.header;
      this.lastHandledMessage;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.MUIDesktop = null;
      this.name;
      this.numberOfConstructedPanels = 0;
      this.panels = new LinkedHashMap();
      this.resourceBundle = resourceBundle;
      this.resources = null;
      this.state = DesktopElement.States.UNINITIALIZED;
      this.version;
      this.webUIConfiguration = webUIConfiguration;
      this.windowDocker;
      this.windows = new HashMap();
		
      this.determineCurrentLocale();
      this.loadI18Resources();
      this.configureLogger();
      this.state = DesktopElement.States.UNINITIALIZED;
   },
		
   //Public accessor and mutator methods
   construct : function() {
      this.configurationChain.chain( 
         this.loadResources,
         this.constructHeader,
         this.constructWindowDocker,
         this.constructContentArea,
         this.constructFooter,
         this.initializeMUI,
         this.constructColumns,
         this.constructPanels,
         this.constructWindows,
         this.subscribeToWebUIMessages,
         this.finalizeConstruction
      ).callChain();
   },
	
   destroy : function() {
      if( this.state > DesktopElement.States.UNMARSHALLED ){
         if( this.resources ) this.resources.release();
         if( this.header ) this.header.destroy();
         if( this.contentArea ) this.contentArea.destroy();
         if( this.footer ) this.footer.destroy();
         if( this.windowDocker ) this.windowDocker.destroy();
         this.destroyWindows();
         this.destroyPanels();
         this.destroyColumns();
         this.removeDesktopEvents();
         this.state = DesktopElement.States.INITIALIZED;
      }
   },
   
   onContentAreaConstructed: function(){
      this.logger.debug( this.options.componentName + ", constructing desktop content area is finished." );
      this.callNextConfigurationStep();
   },
   
   onError: function( error ){
      this.error = error;
   },
   
   onFooterConstructed: function(){
      this.logger.debug( this.options.componentName + ", loading desktop footer is finished." );
      this.callNextConfigurationStep();
   },
   
   onHeaderConstructed: function(){
      this.logger.debug( this.options.componentName + ", loading desktop header is finished." );
      this.callNextConfigurationStep();
   },
   
   onPanelConstructed: function( panel ){
      this.numberOfConstructedPanels++;
      if( this.numberOfConstructedPanels == this.panels.size() ){
         this.logger.debug( this.options.componentName + ", loading desktop panels is finished." );
         this.callNextConfigurationStep();
      } 
   },
   
   onResourceError: function( error ){
      this.error = error;
   },
   
   onResourcesLoaded: function(){
      this.logger.debug( this.options.componentName + ", loading desktop resources is finished." );
      this.callNextConfigurationStep();      
   },
   
   onWindowDockerConstructed: function(){
      this.logger.debug( this.options.componentName + ", constructing desktop window docker is finished." );
      this.callNextConfigurationStep();
   },
   
   onWindowConstructed: function( window ){
      this.logger.debug( this.options.componentName + ", constructing desktop window " + window.getName() + " is finished." );
      if( window.getOnReadyCallback() && typeOf( window.getOnReadyCallback() ) == 'function' ) window.getOnReadyCallback()();
   },
   
   showNotification: function( notificationText ){
      if( this.state == DesktopElement.States.CONSTRUCTED ){
         MUI.notification( this.resourceBundle.getText( "DesktopNotification." + notificationText ));
      }
   },
   
   showWindow: function( windowName, onReadyCallBack ){
      var desktopWindow = this.windows.get( windowName );
      if( desktopWindow ) {
         if( desktopWindow.getState() == DesktopElement.States.INITIALIZED ) desktopWindow.unmarshall();
         desktopWindow.construct( onReadyCallBack );
      }
      return desktopWindow;
   },
   
   unmarshall: function(){
      this.unmarshallDesktopProperties();
      this.unmarshallResources();
      this.unmarshallHeader();
      this.unmarshallDesktopContentArea();
      this.unmarshallFooter();
      this.unmarshallWindowDocker();
      this.unmarshallColumns();
      this.unmarshallPanels();
      this.unmarshallWindows();
      this.state = DesktopElement.States.UNMARSHALLED;
   },
	   
   webUIMessageHandler: function( webUIMessage ){
      if( this.state != DesktopElement.States.CONSTRUCTED ) return;
      
      if( instanceOf( webUIMessage, MenuSelectedMessage )) {
         switch( webUIMessage.getActivityType() ){
         case DesktopWindow.Activity.SHOW_NOTIFICATION:
            this.showNotification( webUIMessage.getNotification() ); break;
         case DesktopWindow.Activity.SHOW_WINDOW:
            this.showWindow( webUIMessage.getWindowName() ); break;
         }
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getColumns : function() { return this.columns; },
   getConfigurationXml : function() { return this.configurationXml; },
   getContainerId : function() { return this.containerId; },
   getCurrentLocale : function() { return this.currentLocale; },
   getDescription : function() { return this.description; },
   getMUIDesktop : function() { return this.MUIDesktop; },
   getFooter: function() { return this.footer; },
   getHeader: function() { return this.header; },
   getName: function() { return this.name; },
   getPanels : function() { return this.panels; },
   getResources : function() { return this.resources; },
   getState : function() { return this.state; },
   getVersion : function() { return this.version; },
   getWindowDocker : function() { return this.windowDocker; },
   getWindows : function() { return this.windows; },
   isSuccess: function() { return this.error == null; },
	
   //Private methods
   callNextConfigurationStep: function(){
      if( this.isSuccess() ) this.configurationChain.callChain();
      else{
         this.revertConstruction();
         this.fireEvent( 'error', this.error );
      }
   }.protect(),
   
   configureLogger : function() {
      if( !this.logger.isConfigured() ) this.logger.configure( this.webUIConfiguration );
   }.protect(),
	
   constructColumns : function() {
      this.logger.debug( this.options.componentName + ".constructColumns() started." );
      this.columns.each( function( columnEntry, index ){
         var column = columnEntry.getValue();
         try{
            column.construct();
         }catch( e ){
            this.onError( e );
         }
      }, this );
      this.callNextConfigurationStep();
   }.protect(),
   
   constructContentArea : function(){
      this.logger.debug( this.options.componentName + ".constructContentArea() started." );
      if( this.contentArea ) this.contentArea.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
    
   constructHeader : function(){
      this.logger.debug( this.options.componentName + ".constructHeader() started." );
      if( this.header ) this.header.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
	
   constructFooter : function(){
      this.logger.debug( this.options.componentName + ".constructFooter() started." );
      if( this.footer ) this.footer.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
    
   constructPanels : function() {
      this.logger.debug( this.options.componentName + ".constructPanels() started." );
      if( this.panels.size() > 0 ){
         this.panels.each( function( panelEntry, index ){
            var panel = panelEntry.getValue();
            try{
               panel.construct();
            }catch( e ){
               this.onError( e );
            }
         }, this );
      } else this.callNextConfigurationStep();
   }.protect(),
	
   constructWindowDocker : function(){
      this.logger.debug( this.options.componentName + ".constructWindowDocker() started." );
      if( this.windowDocker ) this.windowDocker.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
    
   constructWindows : function() {
      this.logger.debug( this.options.componentName + ".constructWindows() started." );      
      this.callNextConfigurationStep();
   }.protect(),
	
   destroyColumns: function() {
      this.logger.debug( this.options.componentName + ".destroyColumns() started." );
      this.columns.each( function( columnEntry, index ) {
         var column = columnEntry.getValue();
         column.destroy();
      }, this );
      this.columns.clear();
   }.protect(),
	
   destroyPanels: function() {
      this.logger.debug( this.options.componentName + ".destroyPanels() started." );
      this.panels.each( function( panelEntry, index ) {
         var panel = panelEntry.getValue();
         panel.destroy();
      }, this );
      this.panels.clear();
      this.numberOfConstructedPanels = 0;
   }.protect(),
	
   destroyWindows: function() {
      this.logger.debug( this.options.componentName + ".destroyWindows() started." );
      this.windows.clear();
   }.protect(),
	
   determineCurrentLocale : function() {
      if( this.resourceBundle.isLoaded ) this.currentLocale = this.resourceBundle.getLocale();
      else {
         this.currentLocale = new Locale();
         this.currentLocale.parse( this.webUIConfiguration.getI18DefaultLocale() );
      }
   }.protect(),
   
   finalizeConstruction: function(){
      this.state = DesktopElement.States.CONSTRUCTED;
      this.fireEvent('constructed', this ); 
   }.protect(),
	
   initializeMUI : function() {
      this.logger.debug( this.options.componentName + ".initializeMUI() started." );
      MUI.myChain = new Chain();
      MUI.myChain.chain(
         function(){
            MUI.Desktop.initialize({
               desktop : this.containerId,
               desktopHeader : this.header.getId(),
               desktopFooter : this.footer.getFooterId(),
               desktopFooterWrapper : this.footer.getId(),
               desktopNavBar : this.header.getNavigationBarId(),
               pageWrapper : this.contentArea.getId()
            }); 
         }.bind( this ),
         function(){ MUI.Dock.initialize(); }
      );
      
      MUI.myChain.callChain();
      this.MUIDesktop = MUI.Desktop;
      this.dock = MUI.Dock;
      this.callNextConfigurationStep();
   }.protect(),
   
   loadResources: function(){
      this.logger.debug( this.options.componentName + ".loadResources() started." );
      if( this.resources ) {
         this.resources.load();
      }else this.onResourcesLoaded();
   }.protect(),
   
   loadI18Resources : function() {
      if( !this.resourceBundle.isLoaded )
         this.resourceBundle.load( this.currentLocale );
   }.protect(),
	
   presetOptionsBasedOnWebUIConfiguration : function( webUIConfiguration ){
      if( webUIConfiguration != 'undefined' && webUIConfiguration != null ){
         this.options.skin = webUIConfiguration.getDefaultSkin();
         this.options.configurationURI = webUIConfiguration.getSkinConfiguration( this.options.skin );
      }
   }.protect(),
   
   proceedWithConfigurationChainWhenResourcesLoaded: function() {
      if( this.pendingResourcesCounter > 0 ) return false;
      else this.callNextConfigurationStep();
   }.protect(),

   removeDesktopEvents : function(){
      this.containerElement.removeEvents();
      window.removeEvents();
      document.removeEvents();
   }.protect(),
   
   revertConstruction: function(){
      if( this.resources ) this.resources.release();
      if( this.header ) this.header.destroy();
      if( this.contentArea ) this.contentArea.destroy();
      if( this.footer ) this.footer.destroy();
      if( this.windowDocker ) this.windowDocker.destroy();
      this.destroyWindows();
      this.destroyPanels();
      this.destroyColumns();
      this.removeDesktopEvents();
      this.state = DesktopElement.States.INITIALIZED;      
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
      this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      this.callNextConfigurationStep();
   }.protect(),
   
   unmarshallColumns: function(){
      var columnDefinitionElements = this.configurationXml.selectNodes( this.options.columnSelector );
      columnDefinitionElements.each( function( columnDefinition, index ){
         var desktopColumn = new DesktopColumn( columnDefinition, { componentContainerId : this.containerId } );
         desktopColumn.unmarshall();
         this.columns.put( desktopColumn.getName(), desktopColumn );
      }, this );
   }.protect(),
   
   unmarshallDesktopContentArea: function(){
      var areaDefinitionElement = this.configurationXml.selectNode( this.options.contentAreaSelector );
      if( areaDefinitionElement ){
         this.contentArea = new DesktopContentArea( areaDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onContentAreaConstructed, onConstructionError : this.onError } );
         this.contentArea.unmarshall();
      }
   }.protect(),

   unmarshallDesktopProperties: function(){
      this.name = this.configurationXml.selectNodeText( this.options.nameSelector );
      this.description = this.configurationXml.selectNodeText( this.options.descriptionSelector );
      this.version = this.configurationXml.selectNodeText( this.options.versionSelector );
      this.containerId = this.configurationXml.selectNodeText( this.options.containerIdSelector );
      if( !this.containerId ) this.containerId = this.options.defaultContainerId;
      this.containerElement = $( this.containerId );
      if( !this.containerElement ) throw new NoneExistingDesktopContainerElementException( this.containerId );
   }.protect(),
   
   unmarshallFooter: function(){
      var footerDefinitionElement = this.configurationXml.selectNode( this.options.footerSelector );
      if( footerDefinitionElement ){
         this.footer = new DesktopFooter( footerDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onFooterConstructed, onError : this.onError } );
         this.footer.unmarshall();
      }
   }.protect(),

   unmarshallHeader: function(){
      var headerDefinitionElement = this.configurationXml.selectNode( this.options.headerSelector );
      if( headerDefinitionElement ){
         this.header = new DesktopHeader( headerDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onHeaderConstructed, onError : this.onError } );
         this.header.unmarshall();
      }
   }.protect(),

   unmarshallPanels: function(){
      var panelDefinitionElements = this.configurationXml.selectNodes( this.options.panelSelector );
      panelDefinitionElements.each( function( panelDefinition, index ){
         var desktopPanel = new DesktopPanel( panelDefinition, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onPanelConstructed } );
         desktopPanel.unmarshall();
         this.panels.put( desktopPanel.getName(), desktopPanel );
      }, this );
   }.protect(),
   
   unmarshallResources: function(){
      var resourcesElement = this.configurationXml.selectNode( this.options.resourcesSelector );
      if( resourcesElement ) {
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
         this.resources.unmarshall();
      }
   }.protect(),
   
   unmarshallWindowDocker: function(){
      var windowDockerDefinitionElement = this.configurationXml.selectNode( this.options.windowDockerSelector );
      if( windowDockerDefinitionElement ){
         this.windowDocker = new WindowDocker( windowDockerDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onWindowDockerConstructed } );
         this.windowDocker.unmarshall();         
      }
   }.protect(),
   
   unmarshallWindows: function(){
      var windowDefinitionElements = this.configurationXml.selectNodes( this.options.windowSelector );
      windowDefinitionElements.each( function( windowDefinition, index ){
         var desktopWindow = new DesktopWindow( windowDefinition, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onWindowConstructed } );
         desktopWindow.unmarshall();
         this.windows.put( desktopWindow.getName(), desktopWindow );
      }, this );
   }.protect(),
});
/*
Name: DesktopElement

Description: Represents a single desktop component.

Requires:
    - 
Provides:
    - DesktopElement

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



var DesktopElement = new Class({
   Implements: [Events, Options, TimeOutBehaviour],
   Binds: ['constructed', 'finalizeConstruction', 'onConstructionError'],
   
   options: {
      componentContainerId: "desktop",
      componentName: "DesktopElement",
      defaultTag : "div",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      eventFireDelay : 5,
      idSelector : "@id",
      tagSelector : "@tag",
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.setOptions( options );
      this.componentStateManager;
      this.constructionChain = new Chain();
      this.containerElement;
      this.definitionElement = definitionElement;
      this.error;
      this.htmlElement;
      this.id;
      this.internationalization = internationalization;
      this.logger;
      this.messageBus;
      this.state = DesktopElement.States.UNINITIALIZED;
      this.tag;
      
      this.setUp();
   },
   
   //Public accessors and mutators
   construct: function(){
      if( this.state != DesktopElement.States.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      this.logger.trace( this.options.componentName + ".construct() of '" + this.id + "'started." );
      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      this.logger.trace( this.options.componentName + ".destroy() of '" + this.name + "' started." );
      if( this.state == DesktopElement.States.CONSTRUCTED ) this.destroyComponents();
      this.resetProperties();
      if( this.htmlElement ) this.htmlElement.destroy();      
      this.state = DesktopElement.States.INITIALIZED;
   },
   
   onConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'error', this.error );
   },
   
   unmarshall: function(){
      this.state = DesktopElement.States.UNMARSHALLED;
   },
   
   //Properties
   getContainerElement: function() { return this.containerElement; },
   getContainerElementId: function() { return this.options.componentContainerId; }, 
   getDefinitionElement: function() { return this.definitionElement; },
   getId: function() { return this.id; },
   getState: function() { return this.state; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.finalizeConstruction );
   }.protect(),
   
   configureLogger : function() {
      if( this.webUIController == null ){
         this.logger = Class.getInstanceOf( WebUILogger );
         if( this.logger == null )
            this.logger = new WebUILogger();
      }else
         this.logger = this.webUIController.getLogger();
   }.protect(),
   
   createHtmlElement: function(){
      if( this.tag ){
         this.htmlElement = new Element( this.tag );
         if( this.id ) this.htmlElement.set( 'id', this.id );
         this.htmlElement.inject( this.containerElement );
      }
   }.protect(),
   
   definitionElementAttribute: function( selector ){
      var attributeNode = XmlResource.selectNode( selector, this.definitionElement );
      if( attributeNode ) return attributeNode.value;
      else return null;
   }.protect(),
   
   destroyComponents: function(){
      //Abstract method, should be overwritten
   }.protect(),
   
   finalizeConstruction: function(){
      this.stopTimeOutTimer();
      this.state = DesktopElement.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.fireEvent('constructed', this, this.options.eventFireDelay ); 
   }.protect(),
   
   resetProperties: function(){
      //Abstract method, should be overwritten.
   }.protect(),
   
   revertConstruction: function(){
      this.state = DesktopElement.States.INITIALIZED;
   }.protect(),
   
   setUp: function(){
      this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      this.configureLogger();
      this.containerElement = $( this.options.componentContainerId );
      if( this.containerElement == null ) 
         throw new IllegalArgumentException( "Parameter 'componetContainerId' in invalid." );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.state = DesktopElement.States.INITIALIZED;
   }.protect(),
   
   unmarshallElementProperties: function(){
      this.id = this.definitionElementAttribute( this.options.idSelector );
      if( !this.id ) this.id = this.options.idPrefix + (new Date().getTime());
      if( this.dataElementsIndex > 0 ) this.id += "#" + this.dataElementsIndex; 
      
      this.tag = this.definitionElementAttribute( this.options.tagSelector );
      if( !this.tag ) this.tag = this.options.defaultTag;
   }.protect()
});

DesktopElement.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
/*
Name: 
    - DesktopColumn

Description: 
    - Represents vertical column of the desktop. It's wrapper of MochaUI column, which gets it's properties from an XML descriptor. 

Requires:

Provides:
    - DesktopColumn

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




var DesktopColumn = new Class({
   Extends: DesktopElement,
   options : {
      componentName : "DesktopColumn",
      maximumWidthSelector : "maximumWidth",
      minimumWidthSelector : "minimumWidth",
      nameSelector : "name",
      placementSelector : "placement",
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, options ){
      this.parent( definitionElement, null, options );
      this.maximumWidth;
      this.minimumWidth;
      this.MUIColumn;
      this.name;
      this.placement;
      this.width;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.MUIColumn = new MUI.Column({ id: this.name, placement: this.placement, width: this.width, resizeLimit: [this.minimumWidth, this.maximumWidth] });
      this.parent();
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.maximumWidth = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.maximumWidthSelector ));
      this.minimumWidth = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.minimumWidthSelector ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.placement = XmlResource.determineAttributeValue( this.definitionElement, this.options.placementSelector );
      this.width = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.widthSelector ));
      this.parent();
   },
   
   //Properties
   getMaximumWidth: function() { return this.maximumWidth; },
   getMinimumWidth: function() { return this.minimumWidth; },
   getMUIColumn: function() { return this.MUIColumn; },
   getName: function() { return this.name; },
   getPlacement: function() { return this.placement; },
   getWidth: function() { return this.width; }
   
   //Protected, private helper methods
   
});
/*
Name: DesktopContentArea

Description: Represents the content area of the desktop.

Requires:

Provides:
    - DesktopContentArea

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




var DesktopContentArea = new Class({
   Extends: DesktopElement,
   
   options: {
      componentName : "DesktopContentArea",
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.options.type = "DesktopContentArea";
      this.parent( definitionElement, bundle, options );
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.createHtmlElement();
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallElementProperties();
      this.parent();
   }

   //Properties
});
/*
Name: DesktopDocument

Description: Represents the header component of the desktop.

Requires:
    - CompositeDesktopElement
Provides:
    - DesktopDocument

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




var DesktopDocument = new Class({
   Extends: DesktopElement,
   Binds: ['constructDocument', 'instantiateDocument', 'onDocumentError', 'onDocumentReady'],
   
   options: {
      componentName : "DesktopDocument",
      documentDataNameSpace: "",
      documentDataUriSelector: "@documentData",
      documentDefinitionNameSpace: "xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      documentDefinitionUriSelector: "@documentDefinition"
   },
   
   //Constructor
   initialize: function( headerDefinitionElement, bundle, options ){
      this.parent( headerDefinitionElement, bundle, options );
      this.document;
      this.documentDataUri;
      this.documentDefinitionUri;
   },
   
   //Public mutators and accessor methods
   destroy: function(){
      if( this.document ) this.document.destroy();
      this.document = null;
      this.documentDataUri = null;
      this.documentDefinitionUri = null;
      this.parent();
   },
   
   onDocumentError: function( error ){
      this.onConstructionError( error );
   },
   
   onDocumentReady: function(){
      this.constructionChain.callChain();      
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.instantiateDocument();
      this.parent();
   },

   //Properties
   getDocument: function() { return this.document; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructDocument, this.finalizeConstruction );
   }.protect(),
   
   constructDocument: function(){
      this.document.construct();
   }.protect(),
   
   instantiateDocument: function(){
      this.document = new SmartDocument( this.internationalization, {  
         documentContainerId : this.options.componentContainerId, 
         documentDefinitionUri : this.documentDefinitionUri, 
         documentContentUri : this.documentDataUri, 
         onDocumentReady : this.onDocumentReady,
         onDocumentError : this.onDocumentError
      });
      this.document.unmarshall();
   }.protect(),
   
   revertConstruction: function(){
      if( this.document && this.document.getState() > AbstractDocument.States.INITIALIZED ) this.document.destroy();
      this.document = null;
      this.parent();
   },
   
   unmarshallProperties: function(){
      this.documentDefinitionUri = XmlResource.selectNodeText( this.options.documentDefinitionUriSelector, this.definitionElement, [this.options.definitionXmlNameSpace, this.options.documentDefinitionNameSpace] );
   }.protect()
});
/*
Name: DesktopElementFactory

Description: Instantiates a new subclass of DesktopElement according to the given XML element.

Requires:

Provides:
    - DesktopElementFactory

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



var DesktopElementFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, bundle, options ){
      var newDesktopElement;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "COMPOSITEELEMENT": 
         newDesktopElement = new CompositeDesktopElement( definitionXmlElement, bundle, options ); break;
      case "DOCUMENTBODY": 
         newDesktopElement = new DesktopBody( definitionXmlElement, bundle, options ); break;
      case "FOOTER": 
         newDesktopElement = new DesktopFooter( definitionXmlElement, bundle, options ); break;
      case "FOOTERBAR": 
         newDesktopElement = new DesktopFooterBar( definitionXmlElement, bundle, options ); break;
      case "HEADER": 
         newDesktopElement = new DesktopHeader( definitionXmlElement, bundle, options ); break;
      case "NAVIGATIONBAR": 
         newDesktopElement = new DesktopNavigationBar( definitionXmlElement, bundle, options ); break;
      case "TITLEBAR": 
         newDesktopElement = new DesktopTitleBar( definitionXmlElement, bundle, options ); break;
      case "ELEMENT":
      default:
         newDesktopElement = new DesktopElement( definitionXmlElement, bundle, options ); break;
      }
      
      return newDesktopElement;
   }
});

DesktopElementFactory.create = function(  definitionXmlElement, bundle, options ){
   var factory = new DesktopElementFactory();
   var element = factory.create( definitionXmlElement, bundle, options );
   return element;
};
/*
Name: DocumentFooter

Description: Represents the body component of a SmartDocument.

Requires:

Provides:
    - DocumentFooter

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





var DesktopFooter = new Class({
   Extends: DesktopDocument,
   
   options: {
      componentName : "DesktopFooter",
      subElementsSelector : "footerBar | compositeElement | element",
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.footerId;
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
      this.footerId = this.document.getBody().elements.first().getId();
   },

   //Properties
   getId: function() { return this.document.getBody().getId(); },
   getFooterId: function() { return this.footerId; }
});
/*
Name: DesktopHeader

Description: Represents the header part of the desktop.

Requires:
   - DesktopDocument, DesktopElement

Provides:
   - DesktopHeader

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





var DesktopHeader = new Class({
   Extends: DesktopDocument,
   
   options: {
      componentName : "DesktopHeader",
      navigationBarId : "desktopNavigationBar"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
   },

   //Properties
   getId: function() { return this.document.getBody().getId(); },
   getNavigationBarId: function() { return this.options.navigationBarId; }
});
/*
Name: 
    - DesktopPanel

Description: 
    - Represents a panel of the desktop. It's wrapper of MochaUI panel, which gets it's properties from an XML descriptor. 

Requires:

Provides:
    - DesktopPanel

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




var DesktopPanel = new Class({
   Extends: DesktopElement,
   Implements: [ComplexContentBehaviour],
   Binds: ['constructDocument', 
           'constructPlugin', 
           'constructHeader', 
           'determineComponentElements',
           'finalizeConstruction',
           'instantiateMUIPanel',
           'loadHtmlDocument',
           'loadSmartDocument',
           'onContainerResize', 
           'onDocumentError', 
           'onDocumentReady', 
           'onHeaderConstructed', 
           'onHeaderConstructionError',
           'onMUIPanelLoaded',
           'onPluginConstructed',
           'onPluginError',
           'restoreComponentState',
           'subscribeToWebUIMessages',
           'webUIMessageHandler'],   
   
   options : {
      columnReferenceSelector : "columnReference",
      componentContentIdPostfix : "",
      componentName : "DesktopPanel",
      componentRootElementIdPostfix : "_wrapper",
      panelContentElementSuffix : "_pad",
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.columnReference;
      this.MUIPanel;
      this.MUIPanelLoaded = false;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.parent();
   },
   
   destroy: function(){
      this.parent();
      this.columnReference = null;
   },
   
   onMUIPanelLoaded: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s MUIPanel finished." );
      this.MUIPanelLoaded = true;
      this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallPanelProperties();
      this.unmarshallHeader();
      this.unmarshallPlugin();
      this.unmarshallDocument();
      this.parent();
   },
   
   //Properties
   getColumnReference: function() { return this.columnReference; },
   getComponentStateManager: function() { return this.componentStateManager; },
   getContentUrl: function() { return this.contentUrl; },
   getDocument: function() { return this.document; },
   getDocumentContentUri: function() { return this.documentContentUri; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   getDocumentWrapperId: function() { return this.documentWrapperId; },
   getDocumentWrapperStyle: function() { return this.documentWrapperStyle; },
   getDocumentWrapperTag: function() { return this.documentWrapperTag; },
   getHeader: function() { return this.header; },
   getMUIPanel: function() { return this.MUIPanel; },
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain(
         this.restoreComponentState,
         this.instantiateMUIPanel,
         this.determineComponentElements,
         this.constructHeader,
         this.constructPlugin,
         this.constructDocument,
         this.subscribeToWebUIMessages,
         this.finalizeConstruction
      );
   }.protect(),
   
   determinePanelElement: function(){
      this.componentRootElement = $( this.name + this.options.panelIdPostfix );
      this.componentRootElement = $( this.componentRootElement );     //required by Internet Explorer
      this.panelContentElement = $( this.name );
      this.constructionChain.callChain();
   }.protect(),
   
   instantiateMUIPanel: function(){
      var panelTitle = this.header && this.header.getPlugin() ? "" : this.title;
      try{
         this.MUIPanel = new MUI.Panel({ 
            column : this.columnReference,
            content : "",
            onContentLoaded : this.header ? null : this.onMUIPanelLoaded,
            contentURL : this.contentUrl,
            id : this.name,
            header : this.showHeader,
            //headerToolbox : this.header.getToolBoxUrl() ? true : false,
            headerToolbox : this.header ? true : false,
            headerToolboxOnload : this.header ? this.onMUIPanelLoaded : null,
            headerToolboxURL : this.header ? this.header.getToolBoxUrl() : null,
            height : this.height,
            onResize : this.onContainerResize,
            title : panelTitle 
         });
      }catch( exception ){
         var logMessage = exception.name + ": " + exception.message;
         logMessage += exception.stack ? "\n" + exception.stack : "";
         this.logger.error( logMessage );
         this.fireEvent('constructed', this, this.options.eventFireDelay ); //Needed by Desktop, to able to count panels created.
         this.onConstructionError( exception );
      }
   }.protect(),
   
   loadHtmlDocument: function( webUIMessage ){
      this.documentContentUri = webUIMessage.getDocumentURI();
      this.documentContentType = webUIMessage.getDocumentType(); 
      var documentFullURI = this.documentContentUri + this.options.documentNameSeparator + this.resourceBundle.getLocale().getLanguage() + ".html";
      
      MUI.updateContent({
         element: $( this.name ),
         onContentLoaded : this.onDocumentReady,
         padding: { top: 0, right: 5, bottom: 0, left: 5 },
         title: this.title,
         url: documentFullURI
      });
   }.protect(),
   
   unmarshallPanelProperties: function(){
      this.columnReference = XmlResource.determineAttributeValue( this.definitionElement, this.options.columnReferenceSelector );
   }.protect(),  
});
/*
Name: DekstopPanelHeader

Description: Represents the header element of a desktop panel component of a SmartDocument.

Requires:

Provides:
    - DesktopPanelHeader

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



var DesktopPanelHeader = new Class({
   Implements: [Events, Options],
   Binds: ['construct', 'onPluginConstructed', 'onPluginConstructionError'],   
   
   options: {
      componentName : "DesktopPanelHeader",
      contentStyleSelector : "@contentStyle",
      contextRootPrefix : "",
      headerSelector : "panelHeader",
      pluginSelector : "plugin",
      toolboxContent : "JavaScript/Source/Desktop/EmptyToolboxContent.html",
      toolboxSelector : "toolBox",
      toolBoxUrlSelector : "@toolBoxUrl",
      type : "DesktopPanel"
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.setOptions( options );
      
      this.contentStyle;
      this.contextElement;
      this.definitionElement = definitionElement;
      this.error = false;
      this.internationalization = internationalization;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.plugin;
      this.state = DesktopPanelHeader.States.INITIALIZED;
      this.toolBox = null;
      this.toolBoxOnLoad = null;
      this.toolBoxUrl = this.options.toolboxContent;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.contextElement = contextElement;
      this.constructPlugin();
      this.addContentStyle();
   },
   
   destroy: function(){
      if( this.plugin ) this.plugin.destroy();
   },
   
   onPluginConstructed : function(){
      this.state = DesktopPanelHeader.States.CONSTRUCTED;      
      this.fireEvent( 'headerConstructed', this );
   },
   
   onPluginConstructionError: function(){
      this.error = true;
      this.revertConstruction();
      this.state = DesktopPanelHeader.States.INITIALIZED;
      this.fireEvent( 'headerConstructionError', this );
   },
   
   unmarshall: function(){
      this.contentStyle = XmlResource.selectNodeText( this.options.contentStyleSelector, this.definitionElement );
      this.toolBoxUrl = XmlResource.selectNodeText( this.options.toolBoxUrlSelector, this.definitionElement );
      if( !this.toolBoxUrl ) this.toolBoxUrl = this.options.contextRootPrefix + this.options.toolboxContent;
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.internationalization, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginConstructionError });
         this.plugin.unmarshall();
      }
      this.state = DesktopPanelHeader.States.UNMARSHALLED;      
   },

   //Properties
   getContentStyle: function() { return this.contentStyle; },
   getDefinitionElement: function() { return this.definitionElement; },
   getHeaderToolBox: function() { return this.plugin != null; },
   getPlugin: function() { return this.plugin; },
   getState: function() { return this.state; },
   getToolBoxUrl: function() { return this.toolBoxUrl; },
   
   //Protected, private helper methods
   addContentStyle: function(){
      if( this.contentStyle ){
         this.contextElement.getElementById( this.contextElement.get( 'id' ) + "Content" ).addClass( this.contentStyle );
      }
   }.protect(),
   
   constructPlugin: function(){
      if( this.plugin ) this.plugin.construct();
      else this.onPluginConstructed();
   }.protect(),
   
   revertConstruction: function(){
      if( this.plugin ) this.plugin.destroy();
   }
});

DesktopPanelHeader.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
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



var DesktopStructure = new Class({
	Implements : [Options], 
	options : {
		desktopColumnIdSelector : 'name',
		desktopColumnMaximumWidthSelector : 'maximumWidth',
		desktopColumnMinimumWidthSelector : 'minimumWidth',
		desktopColumnPlacementSelector : 'placement',
		desktopColumnWidthSelector : 'width',
		desktopColumnsSelector : '/pp:desktopConfiguration/columns/column',
		desktopElementId : 'desktop',
		desktopPanelColumnSelector : 'columnReference',
		desktopPanelContentUrlSelector : 'contentURL',
		desktopPanelHeightSelector : 'height',
		desktopPanelIdSelector : 'name',
		desktopPanelRequireSelector : 'require',
		desktopPanelsSelector : '/pp:desktopConfiguration/panels/panel',
		desktopPanelTitleSelector : 'title',
		dockerAutoHideId : 'dockAutoHide',
		dockerClearId : 'dockClear',
		dockerClearClass : 'clear',
		dockerControlsId : 'dock',
		dockerPlacementId : 'dockPlacement',
		dockerSelector : '/pp:desktopConfiguration/windowDocker',
		dockerSortId : 'dockSort',
		dockerWrapperId : 'dockWrapper',
		documentContainerId : 'pageWrapper',
		elementsSelector : 'elements/element',
		footerBarSelector : '/pp:desktopConfiguration/footer/footerBar',
		footerBarElementId : 'desktopFooter',
		footerElementId : 'desktopFooterWrapper',
		footerSelector : '/pp:desktopConfiguration/footer',
		headerElementId : 'desktopHeader',
		headerSelector : '/pp:desktopConfiguration/header',
		navigationBarSelector : '/pp:desktopConfiguration/header/navigationBar',
		navigationBarElementId : 'desktopNavbar',
		idAttributeSelector : '@name',
		styleSheetElementsSelector : 'pp:desktopConfiguration/resources/styleSheets/styleSheet',
		tagAttributeSelector : '@tag',
		titleBarSelector : '/pp:desktopConfiguration/header/titleBar',
		titleBarWrapperId : 'desktopTitlebarWrapper'
	},
	
	//Constructor
	initialize : function( options, configurationXml ) {
		this.setOptions( options );

	//Private instance variables
		this.configurationXml = configurationXml;
		this.desktopColumns = new ArrayList();
		this.desktopElement = $( this.options.desktopElementId );
		this.desktopPanels = new ArrayList();
		this.desktopWindows = new ArrayList();
		this.documentContainerElement = null;
		this.footerBarElement = null;
		this.footerElement = null;
		this.headerElement = null;
		this.navigationBarElement = null;
		this.titleBarElement = null;
		this.titleBarWrapperElement = null;
	},
	
	//Public accessor and mutator methods
	addDesktopColumn : function( desktopColumn ) {
		this.desktopColumns.add( desktopColumn );
	},
	
	determineDesktopElementId : function() {
		return this.desktopElement != null ? this.desktopElement.get( 'id' ) : this.options.desktopElementId;
	},
	
	determineHeaderElementId : function() {
		return this.headerElement != null ? this.headerElement.get( 'id' ) : this.options.headerElementId;
	},
	
	determineFooterElementId : function() {
		return this.footerElement != null ? this.footerElement.get( 'id' ) : this.options.footerElementId;
	},
	
	determineNavigationBarElementId : function() {
		return this.navigationBarElement != null ? this.navigationBarElement.get( 'id' ) : this.options.navigationBarElementId;
	},
	
	determineDocumentContainerElementId : function() {
		return this.documentContainerElement != null ? this.documentContainerElement.get( 'id' ) : this.options.documentContainerElementId;
	},
	
	determineFooterBarElementId : function() {
		return this.footerBarElement != null ? this.footerBarElement.get( 'id' ) : this.options.footerBarElementId;
	},
	
	//Properties
	getDesktopColumnIdSelector : function() { return this.options.desktopColumnIdSelector; },
	getDesktopColumnMaximumWidthSelector : function() { return this.options.desktopColumnMaximumWidthSelector; },
	getDesktopColumnMinimumWidthSelector : function() { return this.options.desktopColumnMinimumWidthSelector; },
	getDesktopColumnPlacementSelector : function() { return this.options.desktopColumnPlacementSelector; },
	getDesktopColumnWidthSelector : function() { return this.options.desktopColumnWidthSelector; },
	getDesktopColumns : function() { return this.desktopColumns; },
	getDesktopColumnsSelector : function() { return this.options.desktopColumnsSelector; },
	getDesktopElement : function() { return this.desktopElement; },
	getDesktopPanelContentUrlSelector : function() { return this.options.desktopPanelContentUrlSelector; },
	getDesktopPanelColumnSelector : function() { return this.options.desktopPanelColumnSelector; },
	getDesktopPanelHeightSelector : function() { return this.options.desktopPanelHeightSelector; },
	getDesktopPanelIdSelector : function() { return this.options.desktopPanelIdSelector; },
	getDesktopPanelRequireSelector : function() { return this.options.desktopPanelRequireSelector; },
	getDesktopPanels : function() { return this.desktopPanels; },
	getDesktopPanelsSelector : function() { return this.options.desktopPanelsSelector; },
	getDesktopPanelTitleSelector : function() { return this.options.desktopPanelTitleSelector; },
	getDesktopWindows : function() { return this.desktopWindows; },
	getDocumentContainerElement : function() { return this.documentContainerElement; },
	getDocumentContainerId : function() { return this.options.documentContainerId; },
	getElementsSelector : function() { return this.options.elementsSelector; },
	getFooterBarElement : function() { return this.footerBarElement; },
	getFooterBarSelector : function() { return this.options.footerBarSelector; },
	getFooterElement : function() { return this.footerElement; },
	getFooterSelector : function() { return this.options.footerSelector; },
	getHeaderElement : function() { return this.headerElement; },
	getHeaderSelector : function() { return this.options.headerSelector; },
	getIdAttributeSelector : function() { return this.options.idAttributeSelector; },
	getNavigationBarElement : function() { return this.navigationBarElement; },
	getNavigationBarSelector : function() { return this.options.navigationBarSelector; },
	getStyleSheetByIndex : function( styleSheetIndex ) {
	   var styleSheetElement = this.getStyleSheetElementByIndex( styleSheetIndex );
	   return this.configurationXml.selectNode( "text()", styleSheetElement ).nodeValue; 
	},
   getStyleSheetElementByIndex : function( styleSheetIndex ) { return this.getStyleSheetElements()[styleSheetIndex]; },
	getStyleSheetElements : function() { return this.configurationXml.selectNodes( this.options.styleSheetElementsSelector ); },
	getTagAttributeSelector : function() { return this.options.tagAttributeSelector; },
	getTitleBarElement : function() { return this.titleBarElement; },
	getTitleBarSelector : function() { return this.options.titleBarSelector; },
	getTitleBarWrapperElement : function() { return this.titleBarWrapperElement; },
	getTitleBarWrapperId : function() { return this.options.titleBarWrapperId; },
	getWindowDockerAutoHideId : function() { return this.options.dockerAutoHideId; },
	getWindowDockerClearId : function() { return this.options.dockerClearId; },
	getWindowDockerClearClass : function() { return this.options.dockerClearClass; },
	getWindowDockerControlsId : function() { return this.options.dockerControlsId; },
	getWindowDockerId : function() { return this.options.dockerWrapperId; },
	getWindowDockerPlacementId : function() { return this.options.dockerPlacementId; },
	getWindowDockerSelector : function() { return this.options.dockerSelector; },
	getWindowDockerSortId : function() { return this.options.dockerSortId; },
	
	setDesktopElement : function( desktopElement ) { this.desktopElement = desktopElement; },
	setDocumentContainerElement : function( documentContainerElement ) { this.documentContainerElement = documentContainerElement; },
	setFooterBarElement : function( footerBarElement ) { this.footerBarElement = footerBarElement; },
	setFooterElement : function( footerElement ) { this.footerElement = footerElement; },
	setHeaderElement : function( headerElement ) { this.headerElement = headerElement; },
	setNavigationBarElement : function( navigationBarElement ) { this.navigationBarElement = navigationBarElement; },
	setTitleBarElement : function( titleBarElement ) { this.titleBarElement = titleBarElement; },
	setTitleBarWrapperElement : function( titleBarWrapperElement ) { this.titleBarWrapperElement = titleBarWrapperElement; }
	
	//Private methods
});
/*
Name: 
   - DesktopWindow

Description: 
   - Represents a window within desktop. It's wrapper of MochaUI column, which gets it's properties from an XML descriptor. 

Requires:
   - DesktopElement, ComplexContentBehaviour

Provides:
   - DesktopWindow

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




var DesktopWindow = new Class({
   Extends: DesktopElement,
   Implements: [ComplexContentBehaviour],
   Binds: [
      'constructDocument',
      'constructHeader',
      'constructPlugin',
      'destroy',
      'determineComponentElements', 
      'instantiateMUIWindow', 
      'onContainerResize', 
      'onDocumentError', 
      'onDocumentReady', 
      'onHeaderConstructed', 
      'onHeaderConstructionError',
      'onMUIWindowLoaded',
      'onPluginConstructed',
      'onPluginError',
      'restoreComponentState',
      'subscribeToWebUIMessages',
      'webUIMessageHandler'],
   options : {
      componentContainerId : "desktop",
      componentContentIdPostfix : "_content",
      componentName : "DesktopWindow",
      componentRootElementIdPostfix: "",
   },

   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.parent( definitionElement, internationalization, options );
      this.MUIWindow;
      this.onReadyCallBack;
   },
   
   //Public accessor and mutator methods
   construct: function( onReadyCallback ){
      this.onReadyCallBack = onReadyCallback;
      this.parent();
   },
   
   destroy: function(){
      this.parent();
   },
   
   onMUIWindowLoaded : function(){
      this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallWindowProperties();
      this.unmarshallHeader();
      this.unmarshallPlugin();
      this.unmarshallDocument();
      this.parent();
   },
   
   //Properties
   getMUIWindow: function() { return this.MUIWindow; },
   getOnReadyCallback: function() { return this.onReadyCallBack; },
   getWindowContentElement: function() { return this.contentContainerElement; },
   getWindowElement: function() { return this.componentRootElement; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.instantiateMUIWindow, 
         this.determineComponentElements, 
         this.constructHeader,
         this.constructPlugin,
         this.constructDocument,
         this.subscribeToWebUIMessages,
         this.finalizeConstruction
      );
   }.protect(),
   
   instantiateMUIWindow: function(){
      if( this.contentUrl ) this.internationalizeContentUri();
      
      this.MUIWindow = new MUI.Window({
         container : this.containerElement,
         contentURL : this.contentUrl ? this.contentUrl : null,
         height : this.height,
         id : this.name,
         onClose : this.destroy,
         onContentLoaded : this.contentUrl ? this.onMUIWindowLoaded : null,
         onResize : this.onContainerResize,
         title : this.internationalization.getText( this.title ),
         width : this.width
      });
            
      if( !this.contentUrl ) this.constructionChain.callChain();
   }.protect(),
   
   unmarshallWindowProperties: function(){
   }.protect(),
});

DesktopWindow.Activity = { SHOW_WINDOW : 'showWindow', SHOW_NOTIFICATION : 'showNotification' };
/*
Name: NoneExistingDesktopContainerElementException

Description: Thrown when the specified desktop container element doesn't exist.

Requires: WebUIException

Provides: NoneExistingDesktopContainerElementException

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



var NoneExistingDesktopContainerElementException = new Class({
   Extends: WebUIException,
   options: {
      description: "The specifified desktop container element: '{desktopContainerId}' doesn't exist.",
      name: "NoneExistingDesktopContainerElementException"
   },
   
   //Constructor
   initialize : function( desktopContainerId, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { desktopContainerId : desktopContainerId };
   }	
});
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



var PanelInterpreter = new Class({
	Implements : [Options], 
	options : {
		headerSelector : "panelHeader",
		pluginSelector : "plugin",
		toolboxContent : "../Desktop/EmptyToolboxContent.html"
	},
	
	//Constructor
	initialize: function( panelConfiguration, options ){
		this.setOptions( options );
		this.headerToolBox = false;
		this.headerToolBoxOnLoad = null;
		this.headerToolBoxURL = this.options.toolboxContent;
		this.panelConfiguration = panelConfiguration;
		this.headerPlugin = null;
	},

	//Public accessor and mutator methods
	interpret: function(){
		this.interpretPanelHeader();
	},

	//Properties
	getHeaderPlugin : function() { return this.headerPlugin; },
	getHeaderToolBox : function() { return this.headerToolBox; },
	getHeaderToolBoxOnLoad : function() { return this.headerToolBoxOnLoad; },
	getHeaderToolBoxURL : function() { return this.headerToolBoxURL; },
	
	//Protected, private helper methods
	interpretPanelHeader: function(){
		var headerConfigurationElement = XmlResource.selectNode( this.options.headerSelector, this.panelConfiguration );
		if( headerConfigurationElement ){
			this.headerToolBox = true;
			
			this.interpretPlugin( headerConfigurationElement );
			this.headerToolBoxOnLoad = this.headerPlugin['onload'];
		}
	}.protect(),
	
	interpretPlugin: function( parentConfigurationElement ) {
		this.headerPlugin = { css: [], images: [], js: [], onload: null };
		var pluginText =	XmlResource.selectNodeText( this.options.pluginSelector, parentConfigurationElement );
		this.headerPlugin = pluginText != null ? eval( "(" + pluginText + ")" ) : this.headerPlugin;
	}
});
//UnconfiguredWidget.js



var ResourceLoadTimeoutException = new Class({
   Extends: WebUIException,
   options: {
      description: "Loading one or more resources exceeded the '{resourceLoadTimeout}' ms timeout period.",
      name: "ResourceLoadTimeoutException"
   },
   
   //Constructor
   initialize : function( resourceLoadTimeout, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { resourceLoadTimeout : resourceLoadTimeout };
   }
});
//UnconfiguredWidget.js



var ResourceNotFoundException = new Class({
   Extends: WebUIException,
   options: {
      description: "Resource '{resourceName}' not found.",
      name: "ResourceNotFoundException"
   },
   
   //Constructor
   initialize : function( resourceName, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { resourceName : resourceName };
   }
});
/*
Name: UnconfiguredDesktopElementException

Description: Thrown when a DesktopElement's method is invoked but the object isn't configure appropriately.

Requires: WebUIException

Provides: UnconfiguredDesktopElementException

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



var UnconfiguredDesktopElementException = new Class({
   Extends: WebUIException,
   options: {
      description: "When calling method: '{methodName}' of a DocumentElement it should be in: '{statusName}' .",
      name: "UnconfiguredDesktopElementException"
   },
   
   //Constructor
   initialize : function( methodName, statusName, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { methodName : methodName, statusName : statusName };
   }	
});
/*
Name: WindowDocker

Description: Represents the window docker component of a the desktop.

Requires:

Provides:
    - WindowDocker

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




var WindowDocker = new Class({
   Extends: DesktopElement,
   
   options: {
      componentName : "WindowDocker",
      dockerAutoHideId : 'dockAutoHide',
      dockerClearId : 'dockClear',
      dockerClearClass : 'clear',
      dockerControlsId : 'dock',
      dockerPlacementId : 'dockPlacement',
      dockerSelector : '/desktopConfiguration/windowDocker',
      dockerSortId : 'dockSort',
      dockerWrapperId : 'dockWrapper'
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.dockerAutoHideElement;
      this.dockerClearElement;
      this.dockerControlsElement;
      this.dockerPlacementElement;
      this.dockerSortElement;
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.dockerControlsElement = new Element( 'div', { id : this.options.dockerControlsId });
      this.dockerPlacementElement = new Element( 'div', { id : this.options.dockerPlacementId });
      this.dockerAutoHideElement = new Element( 'div', { id : this.options.dockerAutoHideId });
      this.dockerSortElement = new Element( 'div', { id : this.options.dockerSortId } );
      this.dockerClearElement = new Element( 'div', { id : this.options.dockerClearId, 'class' : this.options.dockerClearClass });

      this.createHtmlElement();
      this.htmlElement.grab( this.dockerControlsElement, 'bottom' );
      this.dockerControlsElement.grab( this.dockerPlacementElement, 'bottom' );
      this.dockerControlsElement.grab( this.dockerAutoHideElement, 'bottom' );
      this.dockerControlsElement.grab( this.dockerSortElement, 'bottom' );
      this.dockerSortElement.grab( this.dockerClearElement, 'bottom' );
      
      this.parent();
   },
   
   destroy: function(){
      this.dockerClearElement.destroy();
      this.dockerSortElement.destroy();
      this.dockerAutoHideElement.destroy();
      this.dockerPlacementElement.destroy();
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallElementProperties();
      this.parent();
   }

   //Properties
});
/*
Name: 
    - DiagramWidget

Description: 
    - Shows an editable Visio like diagram to the user.

Requires:
    - BrowserWidget, Draw2d

Provides:
    - DiagramWidget

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




var DiagramWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['destroyCanvas', 'destroyFigures', 'drawCanvas', 'drawFigures'],
   
   options : {
      authorSelector : "//pp:widgetDefinition/author",
      canvasHeightDefault : 200,
      canvasHeightSelector : "//pp:widgetDefinition/canvas/@height",
      canvasWidthDefault : 300,
      canvasWidthSelector : "//pp:widgetDefinition/canvas/@width",
      componentName : "DiagramWidget",
      descriptionSelector : "//pp:widgetDefinition/description",
      figuresSelector : "//pp:widgetDefinition/figures/annotation | //pp:widgetDefinition/figures/class | //pp:widgetDefinition/figures/inheritanceConnection",
      nameSelector : "//pp:widgetDefinition/name",
      paintAreaId : "paintarea",
      titleSelector : "//pp:widgetDefinition/title",
      widgetContainerId : "DiagramWidget",
      widgetDefinitionURI : "MenuDefinition.xml"
   },
   
   //Constructor
   initialize : function( options, resourceBundle ){
      this.parent( options, resourceBundle );
      
      this.author;
      this.canvas;
      this.canvasHeight;
      this.canvasWidth;
      this.description;
      this.figures = new ArrayList();
      this.name;
      this.title;
      this.paintArea;
   },
   
   //Public accessor and mutator methods
   construct : function( configurationOptions ) {
      this.parent();
   },
   
   destroy : function() {
      this.parent();
   },
      
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallFigures();
      return this.parent();
   },
   
   //Properties
   getAuthor : function() { return this.author; },
   getCanvas : function() { return this.canvas; },
   getCanvasHeight : function() { return this.canvasHeight; },
   getCanvasWidth : function() { return this.canvasWidth; },
   getDescription : function() { return this.i18Resource.getText( this.description ); },
   getFigures : function() { return this.figures; },
   getName : function() { return this.name; },
   getTitle : function() { return this.i18Resource.getText( this.title ); },
   getPaintArea : function() { return this.paintArea; },
   
   //Private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.drawCanvas, this.drawFigures, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyFigures, this.destroyCanvas, this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   destroyCanvas : function(){
      this.paintArea.destroy();
      
      this.destructionChain.callChain();
   }.protect(),
   
   destroyFigures : function(){
      this.figures.each( function( figure, index ){
         figure.destroy();
      }.bind( this ));
      
      this.figures.clear();
      
      this.destructionChain.callChain();
   }.protect(),
   
   drawCanvas : function(){
      this.paintArea = this.elementFactory.create( 'div', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { 
            id : this.options.paintAreaId,
            styles : { height : this.canvasHeight, width : this.canvasWidth }
         });
      this.canvas = new draw2d.Workflow( this.options.paintAreaId );
      
      this.constructionChain.callChain();
   }.protect(),
   
   drawFigures : function(){
      this.figures.each( function( figure, index ){
         figure.draw( this );
      }.bind( this ));
      
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallFigures: function(){
      var figuresElement = this.definitionXml.selectNodes( this.options.figuresSelector );
      if( figuresElement ){
         figuresElement.each( function( figureElement, index ){
            var figure = DiagramFigureFactory.create( figureElement, this.i18Resource );
            figure.unmarshall();
            this.figures.add( figure );
         }, this );
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.name = this.unmarshallWidgetProperty( null, this.options.nameSelector );
      this.description = this.unmarshallWidgetProperty( "", this.options.descriptionSelector );
      this.title = this.unmarshallWidgetProperty( "", this.options.titleSelector );
      this.author = this.unmarshallWidgetProperty( "", this.options.authorSelector );
      this.canvasHeight = parseInt( this.unmarshallWidgetProperty( this.options.canvasHeightDefault, this.options.canvasHeightSelector ));
      this.canvasWidth = parseInt( this.unmarshallWidgetProperty( this.options.canvasWidthDefault, this.options.canvasWidthSelector ));
   }.protect(),
   
   unmarshallWidgetProperty: function( defaultValue, selector ){
      var propertyValue = this.definitionXml.selectNodeText( selector );
      if( propertyValue ) return propertyValue;
      else return defaultValue;
   }.protect()
});
/*
Name: 
    - DiagramFigure

Description: 
    - Represents an abstract element of DiagramWidget's figure. 

Requires:

Provides:
    - DiagramFigure

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




var DiagramFigure = new Class({
   Implements : [Events, Options],
   Binds: ['addFigureToCanvas', 'finalizeDraw'],
   
   options : {
      componentName : "DiagramFigure",
      nameSelector : "@name",
      positionXSelector : "@positionX",
      positionYSelector : "@positionY"
   },

   //Constructor
   initialize: function( definitionXmlElement, internationalization, options ){
      this.setOptions( options );
      
      this.canvas;
      this.definitionXml = definitionXmlElement;
      this.diagram;
      this.draw2dObject;
      this.drawChain = new Chain();
      this.internationalization = internationalization;
      this.name;
      this.positionX;
      this.positionY;
      this.state = DiagramFigure.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      if( this.state == DiagramFigure.States.CONSTRUCTED ){
         this.removeFigureFromCanvas();
         this.state = DiagramFigure.States.INITIALIZED;
      }
   },
   
   draw: function( diagram ){
      assertThat( diagram, not( nil() ));
      this.diagram = diagram;
      this.canvas = diagram.getCanvas();
      this.compileDrawChain();
      this.drawChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = DiagramFigure.States.UNMARSHALLED;
   },
   
   //Properties
   getDraw2dObject : function() { return this.draw2dObject; },
   getId: function() { return this.draw2dObject.id; },
   getName: function() { return this.name; },
   getPositionX: function() { return this.positionX; },
   getPositionY: function() { return this.positionY; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),
   
   addFigureToCanvas : function(){
      this.canvas.addFigure( this.draw2dObject, this.positionX, this.positionY );
      this.drawChain.callChain();
   }.protect(),
   
   finalizeDraw : function(){
      this.drawChain.clearChain();
      this.state = DiagramFigure.States.CONSTRUCTED;
      this.fireEvent( 'drawReady', this );
   }.protect(),
   
   lookUpDiagramFigure : function( figureName ){
      var searchedFigure = null;
      this.diagram.getFigures().each( function( figure, index ){
         if( figure.getName() == figureName ) 
            searchedFigure = figure;
      }.bind( this ));
      
      return searchedFigure;
   }.protect(),
   
   removeFigureFromCanvas : function(){
      this.canvas.removeFigure( this.draw2dObject );
   }.protect(),
   
   unmarshallProperties: function(){
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
      this.positionX = XmlResource.selectNodeText( this.options.positionXSelector, this.definitionXml );
      this.positionY = XmlResource.selectNodeText( this.options.positionYSelector, this.definitionXml );
   }.protect()
});

DiagramFigure.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
/*
Name: 
    - AnnotationFigure

Description: 
    - Represents an annotation figure. 

Requires:

Provides:
    - AnnotationFigure

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





var AnnotationFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'drawAttributes', 'setDimension'],
   
   options : {
      componentName : "AnnotationFigure",
      textSelector : "text",
      heightSelector : "@height",
      widthSelector : "@width"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.height;
      this.text;
      this.width;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   getHeight : function() { return this.height; },
   getText : function() { return this.text; },
   getWidth : function() { return this.width; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.setDimension, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.Annotation( this.text );
      this.drawChain.callChain();
   }.protect(),
   
   setDimension : function(){
      this.draw2dObject.setDimension( this.width, this.height );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.text = XmlResource.selectNodeText( this.options.textSelector, this.definitionXml );
      if( this.text ) this.text = this.internationalization.getText( this.text );
      this.height = parseInt( XmlResource.selectNodeText( this.options.heightSelector, this.definitionXml ));
      this.width = parseInt( XmlResource.selectNodeText( this.options.widthSelector, this.definitionXml ));
      
      this.parent();
   }.protect()
   
});

/*
Name: 
    - AttributeFigure

Description: 
    - Represents an attribute of ClassFigure. 

Requires:

Provides:
    - AttributeFigure

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





var AttributeFigure = new Class({
   Implements : [Events, Options],
   Binds: [],
   
   options : {
      componentName : "AttributeFigure",
      defaultValueSelector : "@defaultValue",
      nameSelector : "@name",
      typeSelector : "@type"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.setOptions( options );
      
      this.defaultValue;
      this.definitionXml = definition;
      this.internationalization = internationalization;
      this.name;
      this.type;
   },
   
   //Public accessor and mutator methods
   construct: function( diagram ){
      this.parent( diagram );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
   },
   
   //Properties
   getDefaultValue : function() { return this.defaultValue; },
   getName : function() { return this.name; },
   getType : function() { return this.type; },
   
   //Protected, private helper methods
   unmarshallProperties : function(){
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
      this.type = XmlResource.selectNodeText( this.options.typeSelector, this.definitionXml );
      this.defaultValue = XmlResource.selectNodeText( this.options.defaultValueSelector, this.definitionXml );
   }.protect()
});

/*
Name: 
    - ClassFigure

Description: 
    - Represents a figure of UML class. 

Requires:

Provides:
    - ClassFigure

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





var ClassFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'drawAttributes'],
   
   options : {
      attributesSelector : "attributes/attribute",
      componentName : "ClassFigure"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.attributes = new ArrayList();
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.unmarshallAttributes();
      this.parent();
   },
   
   //Properties
   getAttributes : function() { return this.attributes; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.drawAttributes, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   drawAttributes : function(){
      this.attributes.each( function( attribute, index ){
         this.draw2dObject.addAttribute( attribute.getName(), attribute.getType(), attribute.getDefaultValue() );
      }.bind( this ));
      
      this.drawChain.callChain();
   }.protect(),
   
   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.shape.uml.Class( this.name );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallAttributes: function(){
      var attributesElement = this.definitionXml.selectNodes( this.options.attributesSelector );
      if( attributesElement ){
         if( !attributesElement.each ) attributesElement = Array.from( attributesElement );
         attributesElement.each( function( attributeElement, index ){
            var attribute = new AttributeFigure( attributeElement, this.internationalization );
            attribute.unmarshall();
            this.attributes.add( attribute );
         }, this );
      }
   }.protect()
   
});

/*
Name: 
    - ConnectionFigure

Description: 
    - Represents a connection between two figures. 

Requires:

Provides:
    - ConnectionFigure

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





var ConnectionFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'linkSourceAndTarget'],
   
   options : {
      componentName : "ConnectionFigure",
      sourceSelector : "@source",
      targetSelector : "@target"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.sourceFigureName;
      this.targetFigureName;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   getSourceFigureName : function() { return this.sourceFigureName; },
   getTargetFigureName : function() { return this.targetFigureName; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.linkSourceAndTarget, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.Connection( this.name );
      this.drawChain.callChain();
   }.protect(),
   
   linkSourceAndTarget : function(){
      var sourceFigure = this.lookUpDiagramFigure( this.sourceFigureName );
      var targetFigure = this.lookUpDiagramFigure( this.targetFigureName );
      this.draw2dObject.setSource( sourceFigure.getDraw2dObject().portTop );
      this.draw2dObject.setTarget( targetFigure.getDraw2dObject().portTop );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.sourceFigureName = XmlResource.selectNodeText( this.options.sourceSelector, this.definitionXml );
      this.targetFigureName = XmlResource.selectNodeText( this.options.targetSelector, this.definitionXml );
      this.parent();
   }.protect()
});

/*
Name: DiagramFigureFactory

Description: Instantiates a new subclass of DiagramFigure according to the given XML element.

Requires:

Provides:
    - DiagramFigureFactory

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




var DiagramFigureFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, internationalization, options ){
      var newFigure;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "ANNOTATION": 
         newFigure = new AnnotationFigure( definitionXmlElement, internationalization, options ); break;
      case "CLASS": 
         newFigure = new ClassFigure( definitionXmlElement, internationalization, options ); break;
      case "INHERITANCECONNECTION":
      default:
         newFigure = new InheritanceConnectionFigure( definitionXmlElement, internationalization, options ); break;
      }
      
      return newFigure;
   }
});

DiagramFigureFactory.create = function(  definitionXmlElement, internationalization, options ){
   var factory = new DiagramFigureFactory();
   var figure = factory.create( definitionXmlElement, internationalization, options );
   return figure;
};
/*
Name: 
    - InheritanceConnectionFigure

Description: 
    - Represents a inheritance connection between two figures. 

Requires:

Provides:
    - InheritanceConnectionFigure

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





var InheritanceConnectionFigure = new Class({
   Extends : ConnectionFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject'],
   
   options : {
      componentName : "InheritanceConnectionFigure"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   
   //Protected, private helper methods
   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.shape.uml.InheritanceConnection( this.name );
      this.drawChain.callChain();
   }.protect()
});

/*
Name: 
    - DocumentEditor

Description: 
    - Abstract class of all specialized SmartDocument editors. Standardize the interface for SmartDocuments and provides fundamental services. 

Requires:
    - 
    
Provides:
    - DocumentEditor

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



var DocumentEditor = new Class({
   Implements: [Events, Options],
   Binds: ['determineStyleSheets', 'finalizeAttach', 'instantiateTools', 'subscribeToWebUIMessages', 'webUIMessageHandler'],
   options : {
      componentName : "DocumentEditor",
      subscribeToWebUIMessages : [],
   },

   //Constructor
   initialize: function( internationalization, options ){
      this.setOptions( options );
      this.internationalization = internationalization;
      
      //Private attributes
      this.attachChain = new Chain();
      this.lastWebUIMessage;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.styleSheets = new ArrayList();
      this.subjectElement;
   },
   
   //Public accessor and mutator methods
   attach: function( subjectElement ){
      this.subjectElement = subjectElement;
      this.attachChain.chain( this.determineStyleSheets, this.instantiateTools, this.subscribeToWebUIMessages, this.finalizeAttach );
      this.attachChain.callChain();
   },
   
   detach: function(){
      this.destroyTools();
      this.writeOffFromWebUIMessages();
      this.finalizeDetach();
   },
   
   showNotification: function( notificationText ){
      var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_NOTIFICATION, notification : this.options.componentName + "." + notificationText });
      this.messageBus.notifySubscribers( message );
   }, 
   
   showWindow: function( windowName ){
      var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_WINDOW, windowName : windowName });
      this.messageBus.notifySubscribers( message );
   },
   
   webUIMessageHandler : function( webUIMessage ){
      var messageHandlerName = "this.on" + webUIMessage.getName();
      try{
         var messageHandler = eval( messageHandlerName );
         messageHandler( webUIMessage );
      }catch( e ){
         this.logger.debug( "'" + messageHandleName + "' should be implemented." );
      }
      this.lastWebUIMessage = webUIMessage;
   },
      
   //Properties
   getSubjectElement: function() { return this.subjectElement; },
   
   //Protected and private helper methods
   destroyTools: function(){
      //Abstract method, should be overwritten.
   }.protect(),
   
   determineStyleSheets: function(){
      var linkElements = this.subjectElement.getDocument().getElements("link"); 
      linkElements.each( function( linkElement, index ){
         this.styleSheets.add( linkElement.get( 'href' ));
      }, this );
      this.attachChain.callChain();
   }.protect(),
   
   finalizeAttach: function(){
      this.attachChain.clearChain();
      this.fireEvent( 'editorAttached', this );
   }.protect(),
   
   finalizeDetach: function(){
      this.fireEvent( 'editorDetached', this );
   }.protect(),
   
   instantiateTools: function(){
      //Abstract method, should be overwritten in subclasses.
      this.attachChain.callChain();
   }.protect(),
   
   subscribeToWebUIMessages : function() {
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.subscribeToMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
      this.attachChain.callChain();
   }.protect(),

   writeOffFromWebUIMessages : function(){
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.writeOffFromMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }.protect(),
});
/*Name:    - EventWidgetDescription:     - Shows list of events to the user. The level details can be customized.Requires:    - BrowserWidgetProvides:    - NewsReaderWidgetPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors:     - Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*///= require_directory ../FundamentalTypes//= require ../BrowserWidget/BrowserWidget.jsvar EventWidget = new Class({   Extends : BrowserWidget,   Binds : ['constructEvents', 'destroyEvents'],      options : {      componentName : "EventWidget",      eventOptions : {},      eventsSelector : "//pp:eventList/events/event",      useLocalizedData : true,      widgetContainerId : "EventWidget"   },      //Constructor   initialize : function( options, resourceBundle, elementFactoryOptions ) {      this.parent( options, resourceBundle, elementFactoryOptions );            this.events = new ArrayList();   },   //Public accesors and mutators   construct : function(){      this.parent();   },      destroy : function() {      this.parent();   },      unmarshall : function(){      this.unmarshallEvents();      this.parent();   },      //Properties   getEvents : function() { return this.events; },      //Protected, private helper methods   compileConstructionChain: function(){      this.constructionChain.chain( this.constructEvents, this.finalizeConstruction );   }.protect(),      compileDestructionChain : function(){      this.destructionChain.chain( this.destroyEvents, this.destroyChildHtmlElements, this.finalizeDestruction );   }.protect(),      constructEvents : function(){      this.events.each( function( event, index ){         event.construct( this.containerElement );      }.bind( this ));            this.constructionChain.callChain();   }.protect(),      destroyEvents : function(){      this.events.each( function( event, index ){         event.destroy();      }.bind( this ));            this.destructionChain.callChain();   }.protect(),      unmarshallEvents : function(){      var eventElements = this.dataXml.selectNodes( this.options.eventsSelector );      if( eventElements ){         eventElements.each( function( eventElement, index ){            var event = new Event( eventElement, this.elementFactory, this.options.eventOptions );            event.unmarshall();            this.events.add( event );         }.bind( this ));      }         }.protect()});
/*
Name: 
   - Event

Description: 
   - Represents and displays an event.

Requires:
   - EventWidget

Provides:
   - Event

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




var Event = new Class({
   Implements: Options,

   options: {
      descriptionSelector: "description",
      descriptionStyle : "eventDescription",
      endDateSelector : "schedule/endDate",
      isFullDaySelector : "@isFullDay",
      linkSelector: "link",
      locationAddressSelector: "location/address",
      locationLinkSelector: "location/link",
      locationStyle : "eventLocation",
      programDescriptionSelector : "program/description",
      programLinkSelector : "program/link",
      publicationDateSelector: "pubDate",
      scheduleStyle: "eventSchedule",
      showDescription: true,
      showLocation: true,
      showSchedule: true,
      showTitle: true, 
      startDateSelector : "schedule/startDate",
      titleSelector: "title",
      titleStyle : "eventTitle",
      trancatedDescriptionEnding : "...",
      truncatedDescriptionLength : 120,
      truncateDescription : false
   },
   
   //Constructor
   initialize: function ( eventResource, elementFactory, options ) {
      // parameter assertions
      assertThat( eventResource, not( nil() ));      
      this.setOptions( options );
      
      this.containerElement;
      this.description;
      this.elementFactory = elementFactory;
      this.endDate;
      this.globalUniqueId;
      this.eventResource = eventResource;
      this.isFullDay;
      this.link;
      this.locationAddress;
      this.locationElement;
      this.locationLink;
      this.programDescription;
      this.programLink;
      this.publicationDate;
      this.scheduleElement;
      this.startDate;
      this.state = BrowserWidget.States.INITIALIZED;
      this.title;
   },
   
   //Public accessor and mutator methods
   construct: function( containerElement ){
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.containerElement = containerElement;
         this.createTitleElement();
         this.createDescriptionElement();
         this.createScheduleElement();
         this.createLocationElement();
         this.state = BrowserWidget.States.CONSTRUCTED;
      }
   },
   
   destroy: function(){
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.destroyPropertyElements();
         this.destroyScheduleElements();
         this.destroyLocationElements();
      }
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallSchedule();
      this.unmarshallLocation();
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getDescription: function() { return this.description; },
   getElementFactory: function() { return this.elementFactory; },
   getEndDate: function() { return this.endDate; },
   getGlobalUniqueId: function() { return this.globalUniqueId; },
   getLink: function() { return this.link; },
   getLocationAddress: function() { return this.locationAddress; },
   getLocationLink: function() { return this.locationLink; },
   getProgramDescription: function() { return this.programDescription; },
   getProgramLink: function() { return this.programLink; },
   getPublicationDate: function() { return this.publicationDate; },
   getStartDate: function() { return this.startDate; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   
   //Private helper methods
   createDescriptionElement : function(){
      if( this.options.showDescription ){
         var elementOptions = { 'class' : this.options.descriptionStyle };
         var descriptionText;
         if( this.options.truncateDescription ){
            descriptionText = this.description.substr( 0, this.options.truncatedDescriptionLength ) + this.options.trancatedDescriptionEnding;
         }else {
            descriptionText = this.description;
         }
         this.descriptionElement = this.elementFactory.create( 'div', descriptionText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createLocationElement : function(){
      if( this.options.showLocation ){
         var elementOptions = { 'class' : this.options.locationStyle };
         this.locationElement = this.elementFactory.create( 'div', this.locationAddress, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createScheduleElement : function(){
      if( this.options.showSchedule ){
         var elementOptions = { 'class' : this.options.scheduleStyle };
         var scheduleText = this.startDate + " - " + this.endDate;
         this.scheduleElement = this.elementFactory.create( 'div', scheduleText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createTitleElement : function(){
      var elementOptions = { 'class' : this.options.titleStyle };
      var elementText = this.link ? null : this.title;
      this.titleElement = this.elementFactory.create( 'div', elementText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      
      if( this.link ){
         this.elementFactory.createAnchor( this.title, this.link, null, this.titleElement );
      }
   }.protect(),
   
   destroyLocationElements: function(){
      this.destroyPropertyElement( this.locationElement );
   }.protect(),
   
   destroyPropertyElement: function( propertyElement ){
      if( propertyElement.removeEvents ) propertyElement.removeEvents();
      if( propertyElement.destroy ) propertyElement.destroy();
   }.protect(),
   
   destroyPropertyElements: function(){
      this.destroyPropertyElement( this.titleElement );
      this.destroyPropertyElement( this.descriptionElement );
   }.protect(),
   
   destroyScheduleElements: function(){
      this.destroyPropertyElement( this.scheduleElement );
   }.protect(),
   
   unmarshallLocation: function(){
      this.locationAddress = XmlResource.selectNodeText( this.options.locationAddressSelector, this.eventResource );
      this.locationLink = XmlResource.selectNodeText( this.options.locationLinkSelector, this.eventResource );
   }.protect(),
   
   unmarshallProperties: function(){
      this.description = XmlResource.selectNodeText( this.options.descriptionSelector, this.eventResource );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.eventResource );
      this.programDescription = XmlResource.selectNodeText( this.options.programDescriptionSelector, this.eventResource );
      this.programLink = XmlResource.selectNodeText( this.options.programLinkSelector, this.eventResource );
      this.publicationDate = XmlResource.selectNodeText( this.options.publicationDateSelector, this.eventResource );
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.eventResource );
   }.protect(),
   
   unmarshallSchedule: function(){
      this.isFullDay = XmlResource.selectNodeText( this.options.isFullDaySelector, this.eventResource );
      this.startDate = XmlResource.selectNodeText( this.options.startDateSelector, this.eventResource );
      this.endDate = XmlResource.selectNodeText( this.options.endDateSelector, this.eventResource );
   }.protect()
});
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
along with this program.  If not, see http://www.gnu.org/licenses.
*/




var HierarchicalMenuWidget = new Class({
   Extends : BrowserWidget,
   
   options : {
      componentName : "HierarchicalMenuWidget",
      contextItemId : "MenuWidget",
      href : "#",
      listIdSelector : "@menuItemId",
      locale : null,
      menuItemArgumentsSelector : "//menuItem[@menuItemId='{menuItemId}']/messageProperties/text()",
      menuItemCaptionSelector : "@caption",
      menuItemIdSelector : "@menuItemId",
      menuItemIsDefaultSelector : "menuItem[@menuItemId='{menuItemId}']/@isDefault",
      menuItemsSelector : "menuItem",
      parentItemSelector : "//menuItem[@menuItemId='{menuItemId}']",
      showSubItems : false,
      selectedElementClassSelector : "/pp:menuWidgetDefinition/menuWidget/@selectedItemClass",
      resourceBundle : null,
      target : "_self",
      widgetContainerId : "HierarchicalMenuWidget",
      widgetDefinitionURI : "MenuDefinition.xml"
   },
   
   //Constructor
   initialize : function( options, resourceBundle ){
      this.setOptions( options );
      this.parent( options, resourceBundle );
      this.determineInitializationArguments( options, resourceBundle );
      
      this.currentItemId;
      this.selectedElementClass;
      this.ulElement;      
   },
   
   //Public accessor and mutator methods
   changeLanguage : function( locale ){
      this.locale = locale;
      this.destroy();
      this.construct();
   },
   
   construct : function( configurationOptions ) {
      this.updateOptions( configurationOptions );
      this.i18Resource.load( this.locale );
      var parentDefinitionElement = this.determineParentDefinitionElement();
      this.selectedElementClass = this.determineSelectedElementClass();
      this.createMenuElements( parentDefinitionElement, this.containerElement );
      if( !this.currentItemId ) this.currentItemId = this.defaultItemId;
      this.parent();
      this.fireCurrentSelection();
   },
   
   destroy : function() {
      this.parent();
      this.currentItemId = null;
      this.defaultItemId = null;
   },
   
   onSelection : function( anchorElement ) {
      this.currentItemId = anchorElement.getParent().get( 'id' );
      var argumentText = this.determineMenuItemArguments( this.currentItemId );
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : null;
      arguments['originator'] = this.options.componentName;
      
      this.containerElement.getElements( "LI" ).removeClass( this.selectedElementClass );
      anchorElement.getParent().addClass( this.selectedElementClass );
      
      this.storeComponentState();
      this.messageBus.notifySubscribers( new MenuSelectedMessage( arguments ));
   },
   
   webUIMessageHandler: function( webUIMessage ){
      this.parent( webUIMessage );
      if( instanceOf( webUIMessage, MenuSelectedMessage )){
         if( webUIMessage.getActionType() == 'loadMenu' ){
            this.destroy();
            this.construct( { contextItemId : webUIMessage.getContextItemId() } );
         }
      }
   },
   
   //Properties
   getSelectedElementClass : function() { return this.selectedElementClass; },
   
   //Private helper methods
   compileStateSpecification : function(){
      this.stateSpecification = { currentItemId : this.currentItemId, contextItemId : this.options.contextItemId };
   }.protect(),
   
   configureSelectedItem : function( listItemElements, defaultItemId ) {
      if( this.currentItemId && listItemElements.get( this.currentItemId ) ){
         listItemElements.get( this.currentItemId ).addClass( this.selectedElementClass );
      }else {
         listItemElements.get( defaultItemId ).addClass( this.selectedElementClass );
      }
   }.protect(),
   
   createLIElement : function(  parentDefinitionElement, elementId, parentElement ) {
      return this.elementFactory.create( "li", null, parentElement, WidgetElementFactory.Positions.LastChild, { id : elementId } );
   }.protect(),
   
   createLIElements : function( parentDefinitionElement, parentElement ) {
      var listItemElements = new HashMap();
      var defaultItemId = null;
      
      for( var i = 0; i < this.determineMenuItemDefinitions( parentDefinitionElement ).length; i++ ) {
         var menuItemDefinition = this.determineMenuItemDefinition( parentDefinitionElement, i );
         var itemId = this.determineMenuItemId( parentDefinitionElement, i );
         var listItemElement = this.createLIElement(  parentDefinitionElement, itemId, parentElement );
         var caption = this.determineMenuItemCaption( parentDefinitionElement, i );
         var menuWidget = this;
         this.elementFactory.createAnchor( caption, null, function() { menuWidget.onSelection( this ); }, listItemElement, WidgetElementFactory.Positions.LastChild, { href : this.options.href, target : this.options.target } );
         
         listItemElements.put( itemId, listItemElement );
         if( this.determineMenuItemIsDefault(  parentDefinitionElement, itemId )) { 
         	defaultItemId = itemId; 
         }
         
         if( this.options.showSubItems ){
            var subMenuItemDefinition = this.determineMenuItemDefinition( menuItemDefinition, 0 );
        	   if( subMenuItemDefinition != null ){
        	   	this.createMenuElements( menuItemDefinition, listItemElement );
        	   }
         }
      }
      
      this.configureSelectedItem( listItemElements, defaultItemId );
      this.defaultItemId = defaultItemId;
   }.protect(),
   
   createMenuElements : function( parentDefinitionElement, parentElement ){      
      var ULElement = this.createULElement( parentDefinitionElement, parentElement );
      this.createLIElements( parentDefinitionElement, ULElement );
   }.protect(),
   
   createULElement : function( parentDefinitionElement, parentElement ) {
      return this.elementFactory.create( 'ul', null, parentElement, WidgetElementFactory.Positions.LastChild, { id : this.determineListId(  parentDefinitionElement ) } );
   }.protect(),
   
   determineInitializationArguments : function( options ){
      if( !options || !options.widgetDefinitionURI ){
         var webUIController = Class.getInstanceOf( WebUIController );
         this.options.widgetDefinitionURI = webUIController.getWebUIConfiguration().getMenuDefinitionURI();
      }
   }.protect(),
   
   determineListId : function(  parentDefinitionElement ) { return this.definitionXml.selectNode( this.options.listIdSelector,  parentDefinitionElement ).nodeValue; }.protect(),
   determineMenuItemArguments : function( itemId ) { return this.determineMenuItemProperty( this.options.menuItemArgumentsSelector, itemId ); }.protect(),
   determineMenuItemDefinition : function( parentDefinitionElement, index ) { return this.definitionXml.selectNodes( this.options.menuItemsSelector, parentDefinitionElement )[index]; }.protect(),
   determineMenuItemDefinitions : function( parentDefinitionElement ) { return this.definitionXml.selectNodes( this.options.menuItemsSelector, parentDefinitionElement ); }.protect(),
   determineMenuItemCaption : function( parentDefinitionElement, menuItemIndex ){
      var menuItemDefinitions = this.determineMenuItemDefinitions( parentDefinitionElement );
      return this.definitionXml.selectNode( this.options.menuItemCaptionSelector, menuItemDefinitions[menuItemIndex] ).value;
   }.protect(),
   
   determineMenuItemId : function( parentDefinitionElement, menuItemIndex ){
      var menuItemDefinitions = this.determineMenuItemDefinitions( parentDefinitionElement );
      return this.definitionXml.selectNode( this.options.menuItemIdSelector, menuItemDefinitions[menuItemIndex] ).value;
   }.protect(),
   
   determineMenuItemIsDefault : function(  parentDefinitionElement, itemId ) {
      var isDefaultValue = this.determineMenuItemProperty( this.options.menuItemIsDefaultSelector, itemId, parentDefinitionElement );
      if( isDefaultValue ) return parseBoolean( isDefaultValue );
      return false;
   }.protect(),
   
   determineMenuItemProperty : function( selectorTemplate, itemId, parentDefinitionElement ){
      var selectorExpression = selectorTemplate.substitute({ menuItemId : itemId });
      var selectedNode = this.definitionXml.selectNode( selectorExpression, parentDefinitionElement );
      if( selectedNode ) return selectedNode.nodeValue;
      else return null;
   },
   
   determineSelectedElementClass : function() { return this.definitionXml.selectNode( this.options.selectedElementClassSelector ).nodeValue; }.protect(),
   
   determineMenuElementValue : function( selectorExp ) {
      var selectedElement = this.definitionXml.selectNode( selectorExp ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   }.protect(),
   
   determineParentDefinitionElement: function(){
      var selectorExpression = this.options.parentItemSelector.substitute({ menuItemId : this.options.contextItemId });
      return this.definitionXml.selectNode( selectorExpression );
   }.protect(),
   
   fireCurrentSelection: function(){
      var currentAnchorElement = $( this.currentItemId ).getChildren( 'a' )[0];
      this.onSelection( currentAnchorElement );
   }.protect(),
   
   parseStateSpecification: function(){
      if( this.stateSpecification ){
         this.currentItemId = this.stateSpecification['currentItemId'];
         this.options.contextItemId = this.stateSpecification['contextItemId'];
      }
   }.protect(),
   
   updateOptions: function( configurationOptions ) {
      if( configurationOptions && configurationOptions['contextItemId'] ) 
         this.options.contextItemId = configurationOptions['contextItemId'];
      else this.restoreComponentState();
   }.protect()
});
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




var MenuSelectedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      activityType: null,
      description: "A message about the event that a menu or tool bar item was selected.",
      documentContentURI: null,
      documentType: AbstractDocument.Types.SMART,
      documentURI: null,
      contextItemId : null,
      name: "MenuSelectedMessage",
      notification: null,
      windowName: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = MenuSelectedMessage;
   },
   
   //Public accessors
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getContextItemId: function() { return this.options.contextItemId; },
   getDocumentContentURI: function() { return this.options.documentContentURI; },
   getDocumentType: function() { return this.options.documentType; },
   getDocumentURI: function() { return this.options.documentURI; },
   getNotification: function() { return this.options.notification; },
   getWindowName: function() { return this.options.windowName; }
});

/*
Name: 
   - HtmlDocument

Description: A specialized subclass of AbstractDocument which presents and provides editing possibilities for plain HTML content.

Requires:
   - AbstractDocument

Provides:
   - HtmlDocument

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




var HtmlDocument = new Class({
   Extends: AbstractDocument,
   Binds: ['attachEditor', 'createTextArea', 'destroyTextArea', 'onContainerResize', 'resizeTextArea'],
   
   options: {
      componentName : "HtmlDocument",
      documentContentExtension : ".html",
      documentDefinitionNameSpace: "xmlns:sd='http://www.processpuzzle.com/HtmlDocument'",
      documentEditorClass : "TextAreaEditor",
      rootElementName : "/htmlDocumentDefinition",
   },
   
   //Constructor
   initialize: function( i18Resource, options ){
      this.parent( i18Resource, options );
      
      //Private variables
      this.textArea;
   },
   
   //Public mutators and accessor methods
   attachEditor: function(){
      this.editor.attach( this.textArea, this.documentContent.xmlAsText );
   }.protect(),
   
   construct: function(){
      this.parent();
   },
   
   destroy: function(){
      this.parent();
   },
   
   onContainerResize: function( newSize ){
      this.editor.onContainerResize( this.containerElement.getSize() );
   },
   
   resizeTextArea: function(){
      var oldScrollTop = this.textArea.getScroll().y;
      this.textArea.scrollTo( null, 1 );
      var grew = false;
      
      while( this.textArea.getScroll().y > 0 ) {
         var oldHeight = this.textArea.clientHeight;
         grew = true;
         this.textArea.rows++;
   
         if( this.textArea.clientHeight == oldHeight ) {
             if( this.textArea.getStyle( 'overflowY' )) this.textArea.setStyle( 'overflowY', '' );
             this.textArea.scrollTo( null, oldScrollTop );
             return;
         }
   
         this.textArea.scrollTop = 1; // perhaps +1 row is not enough, do it again
      }

      if( !grew ) {
         while( this.textArea.getScroll().y == 0 && this.textArea.rows > this.textArea.__originalRows ) {
             this.textArea.rows--;
             this.textArea.scrollTo( null, 1 );
         }
         if( this.textArea.getScroll().y > 0 )  this.textArea.rows++;
      }
   
      if( !this.textArea.getStyle( 'overflowY' )) this.textArea.setStyle( 'overflowY', 'hidden' );
   },
   
   unmarshall: function(){
      this.parent();
   },

   //Properties
   getTextArea: function() { return this.textArea; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.determineContainerElement, 
         this.instantiateEditor, 
         this.createTextArea, 
         this.attachEditor, 
         this.subscribeToWebUIMessages, 
         this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain(  this.releseResource, this.detachEditor, this.destroyTextArea, this.resetProperties, this.finalizeDestruction );
   }.protect(),
   
   createTextArea: function(){
      this.textArea = this.htmlElementFactory.create( 'textArea', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { 
         id : this.name, styles : { border: 0, margin: 0, padding: 0, visibility : 'hidden', overflowY : 'hidden' }});
      this.textArea.set( 'html', this.documentContent.xmlAsText );
      this.textArea.setStyle( 'width', this.containerElement.getSize().x );
      this.resizeTextArea();
      this.constructionChain.callChain();
   },
   
   destroyTextArea: function(){
      if( this.textArea.removeEvents ) this.textArea.removeEvents();
      if( this.textArea.destroy ) this.textArea.destroy();
      this.destructionChain.callChain();
   }.protect()
      
});
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



var Locale = new Class({
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

// LocaleUtil


var LocaleUtil = new Class({

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
		assertThat( suffix, not( nil() ));
		assertThat( suffix, containsString( "." ));
		
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



var ResourceKey = new Class({
   
   initialize: function( theKey, theType ) {
      //parameter assertions
      assertThat( theKey, not( nil() ));
      assertThat( theType, not( nil() ));
      
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

// XMLBundleParser


var XMLBundleParser = new Class({
	
	//Constructor
	initialize: function() {
		//private instance variables
		this.buffer = new String();
		this.cache = new ResourceCache();
		this.key;
		this.parserLanguage, this.parserCountry, this.parserVariant;
		this.targetLanguage, this.targetCountry, this.targetVariant;
		this.saxEventHandler = new SAXEventHandler(); 
		this.xmlResource = null;
		this.xmlAsText = "";
	},
	
	//Public accessors and mutator methods
	characters : function( chars, offset, length ) {
	    this.buffer += chars.substring( offset, offset + length );
	},

	endElement : function( qName ) {
	    var content = this.buffer.trim();
	    this.buffer = new String();
	    if( qName.equals("Language")) {
	        this.parserLanguage = null;
	    }
	    if( qName.equals("Country")) {
	        this.parserCountry = null;
	    }
	    if( qName.equals("Variant")) {
	        this.parserVariant = null;
	    }
	    if( qName.equals("Resource") && this.inContext()) {
	        this.cache.put( this.key, content );
	    }
	},

	parse : function( theCache, theFilename, theTargetLocale ) {
	    this.cache = theCache;
	    this.targetLanguage = theTargetLocale.getLanguage();
	    this.targetCountry = theTargetLocale.getCountry();
	    this.targetVariant = theTargetLocale.getVariant();
	    
	    var parser = new SAXDriver();
	    parser.setDocumentHandler( this );
	    parser.setLexicalHandler(this );
	    parser.setErrorHandler( this );
	    this.xmlResource = new XmlResource( theFilename, { parseOnComplete : false } );
	    parser.parse( this.xmlResource.getXmlAsText() );
	},

	startElement : function( qName, attrs ) {
	    if( qName.equals("Language")) {
	    	this.parserLanguage = attrs.getValueByName("name");
	    }
	    if( qName.equals("Country")) {
	    	this.parserCountry = attrs.getValueByName("name");
	    }
	    if( qName.equals("Variant")) {
	    	this.parserVariant = attrs.getValueByName("name");
	    }
	    if( qName.equals("Resource")) {
	    	this.key = new ResourceKey(attrs.getValueByName("key"), attrs.getValueByName("type"));
	    }
	},

	//Properties
	setXML : function( strXML ) { this.xmlAsText = strXML; },
	
	//Protected private helper methods
	inContext : function() {
	    if( this.parserLanguage == null || this.parserLanguage.equals( this.targetLanguage )) {
	        if( this.parserCountry == null || this.parserCountry.equals( this.targetCountry )) {
	        if( this.parserVariant == null || this.parserVariant.equals( this.targetVariant )) {
	            return true;
	        }
	        }
	    }
	    return false;
	}.protect()
});
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



var XMLResourceBundle = new Class( {
   Implements : Options,

   options : {
      componentName : "XMLResourceBundle",
      defaultLocale : null,
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com/'"
   },

   // Constructor
   initialize : function(webUIConfiguration, options) {

      // parameter assertions
   assertThat( webUIConfiguration, not( nil() ));
   this.setOptions( options );

   // private instance variables
   this.cache;
   this.currentLocale = null;
   this.isLoaded = false;
   this.logger = Class.getInstanceOf( WebUILogger );
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
      this.logger.debug( this.options.componentName + ".load() started." );
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
         var exception = new UndefinedXmlResourceException( fileList.get( 0 ) );
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
//LanguageChangedMessage.js
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




var LanguageChangedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      description: "A message about the event that WebUI's language was changed.",
      name: "Language Changed Message",
      newLocale : null,
      previousLocale: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = LanguageChangedMessage;
   },
   
   //Public accessors
   
   //Properties
   getNewLocale: function() { return this.options.newLocale; },
   getPreviousLocale: function() { return this.options.previousLocale; }
});

//LanguageSelectorWidget.js
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




var LanguageSelectorWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['onSelection'],
   
   options : {
      componentName : "LanguageSelectorWidget",
      componentPrefix : "LanguageSelectorWidget",
      selectElementId : "LanguageSelector",
      selectTextKey : "LanguageSelectorWidget.select",
      widgetContainerId : "LanguageSelectorWidget",
      wrapperElementStyle : "LanguageSelectorWrapper"
   },
   
   //Constructor
   initialize : function( options, resourceBundle, webUIConfiguration ){
      this.setOptions( options );
      this.parent( options, resourceBundle );
      
      this.availableLocales = new ArrayList();
      this.isConfigured = false;
      this.selectElement = null;
      this.selectElementContainer = null;
      this.webUIConfiguration = webUIConfiguration;
      
      this.determineInitializationArguments();
      this.determineAvailableLocales();
   },

   //Public accessor and mutator methods
   construct : function() {
      this.createSpanElements();
      this.createSelectElement();
      this.createSelectElementOptions();
      return this.parent();
   },
   
   destroy : function() {
      this.availableLocales.clear();
      this.parent();
   },
   
   onSelection : function() {
      var currentLocale = this.locale;
      var newLocale = new Locale();
      newLocale.parse( this.selectElement.options[this.selectElement.selectedIndex].value );
      var message = new LanguageChangedMessage({ previousLocale : currentLocale, newLocale : newLocale, originator : this.options.widgetContainerId });
      this.messageBus.notifySubscribers( message );
   },
   
   //Properties
   getAvailableLocales : function() { return this.availableLocales; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   
   //Private helper methods
   createSelectElement : function(){
      this.selectElement = this.elementFactory.create( 'select', null, this.selectElementContainer, WidgetElementFactory.Positions.LastChild, { id : this.options.selectElementId } );
      this.selectElement.addEvent( 'change', this.onSelection );
   }.protect(),
   
   createSelectElementOptions : function() {
      var selectedOption = this.elementFactory.createOption( "", this.options.selectTextKey, this.selectElement, WidgetElementFactory.Positions.LastChild );
      selectedOption.set( 'selected' );
      
      this.availableLocales.each( function( locale, index ){
         this.elementFactory.createOption( locale.getLanguage(), this.options.componentPrefix + "." + locale.getLanguage(), this.selectElement, WidgetElementFactory.Positions.LastChild );
      }, this );
   }.protect(),
   
   createSpanElements: function() {
      var languageSelectorWrapper = this.elementFactory.create( 'span', null, null, null, {'class': this.options.wrapperElementStyle });
      this.selectElementContainer = this.elementFactory.create( 'span', null, languageSelectorWrapper );
   }.protect(),
   
   determineAvailableLocales : function(){
      for( var i = 0; i < this.webUIConfiguration.getI18LocaleElements().length; i++ ) {
         var i18LocaleText = this.webUIConfiguration.getI18Locale( i );
         var locale = new Locale();
         locale.parse( i18LocaleText );
         this.availableLocales.add( locale );
      }
   }.protect(),
   
   determineInitializationArguments : function(){
      if( !this.webUIConfiguration ){
         var webUIController = Class.getInstanceOf( WebUIController );
         if( webUIController ) this.webUIConfiguration = webUIController.getWebUIConfiguration();
         else this.webUIConfiguration = Class.getInstanceOf( WebUIConfiguration );
      }
   }.protect()
   
});
/*Name:     - NewsReaderWidgetDescription:     - Shows RSS feed to the user. The levevel details can be customized.Requires:    - Provides:    - NewsReaderWidgetPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors:     - Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*///= require_directory ../FundamentalTypes//= require ../BrowserWidget/BrowserWidget.jsvar NewsReaderWidget = new Class({   Extends : BrowserWidget,   Binds : ['constructChannel', 'destroyChannel'],      options : {      channelOptions : {},      channelSelector : "//rss/channel",      componentName : "NewsReaderWidget",      useLocalizedData : true,      widgetContainerId : "NewsReaderWidget"   },      //Constructor   initialize : function( options, resourceBundle, elementFactoryOptions ) {      this.parent( options, resourceBundle, elementFactoryOptions );            this.channel;   },   //Public accesors and mutators   construct : function(){      this.parent();   },      destroy : function() {      this.parent();   },      unmarshall : function(){      this.unmarshallChannel();      this.parent();   },      //Properties   getChannel : function() { return this.channel; },      //Protected, private helper methods   compileConstructionChain: function(){      this.constructionChain.chain( this.constructChannel, this.finalizeConstruction );   }.protect(),      compileDestructionChain : function(){      this.destructionChain.chain( this.destroyChannel, this.destroyChildHtmlElements, this.finalizeDestruction );   }.protect(),      constructChannel : function(){      this.channel.construct( this.containerElement );      this.constructionChain.callChain();   }.protect(),      destroyChannel : function(){      this.channel.destroy();   }.protect(),      unmarshallChannel : function(){      var channelElement = this.dataXml.selectNode( this.options.channelSelector );      if( channelElement ){         this.channel = new RssChannel( this.dataXml, this.i18Resource, this.elementFactory, this.options.channelOptions );         this.channel.unmarshall();      }         }.protect()});
/*
Name: RssChannel

Description: Represents and RSS 2.0 channel as JavaScript object 

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



var RssChannel = new Class({
   Implements: Options,

   options: {
      buildDateSelector : "//rss/channel/lastBuildDate",
      descriptionSelector : "//rss/channel/description",
      descriptionStyle : "rssChannelDescription",
      documentsSelector : "//rss/channel/docs",
      generatorSelector : "//rss/channel/generator",
      itemOptions : {},
      itemsSelector : "//rss/channel/item",
      itemsWrapperStyle : "rssItemsWrapper",
      languageSelector : "//rss/channel/language",
      linkSelector : "//rss/channel/link",
      managingEditorSelector : "//rss/channel/managingEditor",
      publicationDateSelector : "//rss/channel/pubDate",
      showDescription: true, 
      showTitle: true, 
      titleSelector : "//rss/channel/title",
      titleStyle : "rssChannelTitle",
      webMasterSelector : "//rss/channel/webMaster",
      wrapperElementId : "rssChannelWrapper",
      wrapperElementTag : "div"
   },
   
   //Constructor
   initialize: function ( rssResource, internationalization, elementFactory, options ) {
      // parameter assertions
      assertThat( rssResource, not( nil() ));
      this.setOptions( options );
      
      this.buildDate;
      this.containerElement;
      this.description;
      this.documents;
      this.elementFactory = elementFactory;
      this.generator;
      this.internationalization;
      this.items = new ArrayList();
      this.language;
      this.link;
      this.managingEditor;
      this.publicationDate;
      this.rssResource = rssResource;
      this.state = BrowserWidget.States.INITIALIZED;
      this.title;
      this.webMaster;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct : function( containerElement ){
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.containerElement = containerElement;
         this.createWrapperElement();
         this.createTitleElement();
         this.createItemsWrapper();
         this.constructItems();
         
         this.state = BrowserWidget.States.CONSTRUCTED;
      }
   },
   
   destroy: function(){
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.destroyItems();
         this.destroyPropertyElements();
      }
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallChannelProperties();
      this.unmarshallItems();
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getBuildDate: function() { return this.buildDate; },
   getDescription: function() { return this.description; },
   getDocuments: function() { return this.documents; },
   getElementFactory : function() { return this.elementFactory; },
   getGenerator: function() { return this.generator; },
   getItems: function() { return this.items; },
   getLanguage: function() { return this.language; },
   getLink: function() { return this.link; },
   getManagingEditor: function() { return this.managingEditor; },
   getPublicationDate: function() { return this.publicationDate; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getWebMaster: function() { return this.webMaster; },
   getWrapperElement: function() { return this.wrapperElement; },
   
   //Private helper methods
   constructItems : function() {
      this.items.each( function( channelItem, index ){
         channelItem.construct( this.itemsWrapperElement );
      }.bind( this ));
   }.protect(),
   
   createItemsWrapper : function(){
      this.itemsWrapperElement = this.elementFactory.create( 
         this.options.wrapperElementTag, 
         null, 
         this.wrapperElement, 
         WidgetElementFactory.Positions.LastChild, 
         { 'class' : this.options.itemsWrapperStyle }
      );
   }.protect(),
   
   createTitleElement : function(){
      if( this.options.showTitle ){
         var elementOptions = { 'class' : this.options.titleStyle };
         var elementText = this.link ? null : this.title;
         this.titleElement = this.elementFactory.create( 'div', elementText, this.wrapperElement, WidgetElementFactory.Positions.LastChild, elementOptions );
         
         if( this.link ){
            this.elementFactory.createAnchor( this.title, this.link, null, this.titleElement );
         }
      }
   }.protect(),
   
   createWrapperElement : function(){
      this.wrapperElement = this.elementFactory.create( 
         this.options.wrapperElementTag, 
         null, 
         this.containerElement, 
         WidgetElementFactory.Positions.LastChild, 
         { id : this.options.wrapperElementId }
      );
   }.protect(),
   
   destroyItems: function(){
      this.items.each( function( channelItem, index ){
         channelItem.destroy();
      }.bind( this ));
   }.protect(),
   
   destroyPropertyElements: function(){
      if( this.wrapperElement.removeEvents ) this.wrapperElement.removeEvents();
      if( this.wrapperElement.destroy ) this.wrapperElement.destroy();
      
      if( this.titleElement && this.titleElement.removeEvents ) this.titleElement.removeEvents();
      if( this.titleElement && this.titleElement.destroy ) this.titleElement.destroy();
   }.protect(),
   
   unmarshallChannelProperties: function(){
      this.buildDate = this.rssResource.selectNodeText( this.options.buildDateSelector );
      this.description = this.rssResource.selectNodeText( this.options.descriptionSelector );
      this.documents = this.rssResource.selectNodeText( this.options.documentsSelector );
      this.generator = this.rssResource.selectNodeText( this.options.generatorSelector );
      this.language = this.rssResource.selectNodeText( this.options.languageSelector );
      this.link = this.rssResource.selectNodeText( this.options.linkSelector );
      this.managingEditor = this.rssResource.selectNodeText( this.options.managingEditorSelector );
      this.publicationDate = this.rssResource.selectNodeText( this.options.publicationDateSelector );
      this.title = this.rssResource.selectNodeText( this.options.titleSelector );
      this.webMaster = this.rssResource.selectNodeText( this.options.webMasterSelector );
   }.protect(),
   
   unmarshallItem: function( itemResource ){
      var rssItem = new RssItem( itemResource, this.elementFactory, this.options.itemOptions );
      rssItem.unmarshall();
      this.items.add( rssItem );
   }.protect(),
   
   unmarshallItems: function( ){
      var rssItemResources = this.rssResource.selectNodes( this.options.itemsSelector );
      rssItemResources.each( function( itemResource, index ){
         this.unmarshallItem( itemResource );
      }, this );
   }.protect()
});
/*
Name: RssItem

Description: Represents and RSS 2.0 channel item as JavaScript object 

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



var RssItem = new Class({
   Implements: Options,

   options: {
      descriptionSelector: "description",
      descriptionStyle : "rssItemDescription",
      globalUniqueIdSelector: "guid",
      linkSelector: "link",
      publicationDateSelector: "pubDate",
      showDescription: true, 
      showTitle: true, 
      titleSelector: "title",
      titleStyle : "rssItemTitle",
      trancatedDescriptionEnding : "...",
      truncatedDescriptionLength : 120,
      truncateDescription : false
   },
   
   //Constructor
   initialize: function ( itemResource, elementFactory, options ) {
      // parameter assertions
      assertThat( itemResource, not( nil() ));      
      this.setOptions( options );
      
      this.containerElement;
      this.description;
      this.elementFactory = elementFactory;
      this.globalUniqueId;
      this.itemResource = itemResource;
      this.link;
      this.publicationDate;
      this.state = BrowserWidget.States.INITIALIZED;
      this.title;
   },
   
   //Public accessor and mutator methods
   construct: function( containerElement ){
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.containerElement = containerElement;
         this.createTitleElement();
         this.createDescriptionElement();
         this.state = BrowserWidget.States.CONSTRUCTED;
      }
   },
   
   destroy: function(){
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.destroyPropertyElements();
      }
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.description = XmlResource.selectNodeText( this.options.descriptionSelector, this.itemResource );
      this.globalUniqueId = XmlResource.selectNodeText( this.options.globalUniqueIdSelector, this.itemResource );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.itemResource );
      this.publicationDate = XmlResource.selectNodeText( this.options.publicationDateSelector, this.itemResource );
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.itemResource );
      
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getDescription: function() { return this.description; },
   getGlobalUniqueId: function() { return this.globalUniqueId; },
   getLink: function() { return this.link; },
   getPublicationDate: function() { return this.publicationDate; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   
   //Private helper methods
   createDescriptionElement : function(){
      if( this.options.showDescription ){
         var elementOptions = { 'class' : this.options.descriptionStyle };
         var descriptionText;
         if( this.options.truncateDescription ){
            descriptionText = this.description.substr( 0, this.options.truncatedDescriptionLength ) + this.options.trancatedDescriptionEnding;
         }else {
            descriptionText = this.description;
         }
         this.descriptionElement = this.elementFactory.create( 'div', descriptionText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createTitleElement : function(){
      var elementOptions = { 'class' : this.options.titleStyle };
      var elementText = this.link ? null : this.title;
      this.titleElement = this.elementFactory.create( 'div', elementText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      
      if( this.link ){
         this.elementFactory.createAnchor( this.title, this.link, null, this.titleElement );
      }
   }.protect(),
   
   destroyPropertyElement: function( propertyElement ){
      if( propertyElement.removeEvents ) propertyElement.removeEvents();
      if( propertyElement.destroy ) propertyElement.destroy();
   }.protect(),
   
   destroyPropertyElements: function(){
      this.destroyPropertyElement( this.titleElement );
      this.destroyPropertyElement( this.descriptionElement );
   }
});
/*
Name: RssResource

Description: Represents and RSS 2.0 xml resource file as JavaScript object 

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



var RssResource = new Class({
   Extends: XmlResource,

   options: {
   },
   
   //Constructor
   initialize: function ( uri, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.parent( uri, options );

      this.channel = null;
   },
   
   //Public accessor and mutator methods
   release: function(){
      
   },
   
   unmarshall: function(){
      this.unmarshallChannel();
   },
   
   //Properties
   getChannel: function() { return this.channel; },
   getItems: function() { return this.channel.getItems(); },
   
   //Private helper methods
   unmarshallChannel: function(){
      this.channel = new RssChannel( this );
      this.channel.unmarshall();
   }.protect(),
   
});
/*
Name: 
    - PhotoGaleryImage

Description: 
    - Represents an image of a photo galery. 

Requires:

Provides:
    - PhotoGaleryImage

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



var PhotoGaleryImage = new Class({
   Implements : Options,
   
   options : {
      captionSelector : "caption",
      linkSelector : "link",
      thumbnailSelector : "thumbnailUri",
      uriSelector : "uri"
   },

   //Constructor
   initialize: function( definitionXml, internationalization, options ){
      this.setOptions( options );
      this.anchorElement;
      this.caption;
      this.data;
      this.dataAsText;
      this.definitionXml = definitionXml;
      this.internationalization = internationalization;
      this.link;
      this.thumbnailUri;
      this.uri;
      this.state = PhotoGaleryImage.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.compileDataFromProperties();
      this.state = PhotoGaleryImage.States.CONSTRUCTED;
   },
   
   destroy: function(){
      this.data = null;
      this.dataAsText = null;
      this.link = null;
      this.thumbnailUri = null;
      this.uri = null;
      this.state = PhotoGaleryImage.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = PhotoGaleryImage.States.UNMARSHALLED;
   },
   
   //Properties
   getCaption: function() { return this.caption; },
   getData: function() { return this.data; },
   getDataAsText: function() { return this.dataAsText; },
   getLink: function() { return this.link; },
   getState: function() { return this.state; },
   getThumbnailUri: function() { return this.thumbnailUri; },
   getUri: function() { return this.uri; },
   
   //Protected, private helper methods
   compileDataFromProperties: function(){
      var caption = this.caption ? "caption:'" + this.caption + "'" : null;
      var href = this.link ? "href:'" + this.link + "'" : null;
      var thumbnail = this.thumbnailUri ? "thumbnail:'" + this.thumbnailUri + "'" : null;
      
      var dataFragment = caption ? caption : "";

      if( dataFragment != "" && href ) dataFragment += ", ";
      dataFragment += href ? href : "";

      if( dataFragment != "" && thumbnail ) dataFragment += ", ";
      dataFragment += thumbnail ? thumbnail : "";
      
      this.dataAsText = "'" + this.uri + "': {" + dataFragment + "}";
      this.data = eval( "({" + this.dataAsText + "})" );
   }.protect(),
   
   unmarshallProperties: function(){
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.definitionXml );
      this.caption = this.internationalization.getText( this.caption );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.definitionXml );
      this.thumbnailUri = XmlResource.selectNodeText( this.options.thumbnailSelector, this.definitionXml );
      this.uri = XmlResource.selectNodeText( this.options.uriSelector, this.definitionXml );
   }.protect(),
});

PhotoGaleryImage.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
/*
Name: 
    - PhotoGaleryWidget

Description: 
    - Represents a collection of images with thumbnails, displays the selected one in original size and runs slide show. 

Requires:
    - PhotoGaleryImage, BrowserWidget, WidgetElementFactory
    
Provides:
    - PhotoGaleryWidget

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




var PhotoGaleryWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['compileDataObject', 'instantiateSlideShow', 'onComplete', 'onEnd', 'onShow', 'onStart'],
   options : {
      accessKeysDefault : null,
      accessKeysSelector : "pp:widgetDefinition/properties/accessKeys",
      automaticallyLinkSlideDefault : false,
      automaticallyLinkSlideSelector : "pp:widgetDefinition/properties/automaticallyLinkSlideToFullSizedImage",
      centerImagesDefault : true,
      centerImagesSelector : "pp:widgetDefinition/properties/centerImages",
      componentName : "PhotoGaleryWidget",
      descriptionSelector : "/pp:widgetDefinition/description", 
      effectDurationDefault : 750,
      effectDurationSelector : "pp:widgetDefinition/properties/effectDuration",
      eventDeliveryDelay : 50,
      firstSlideDefault: 0,
      firstSlideSelector: "pp:widgetDefinition/properties/firstSlide",
      galeryLinkDefault: null,
      galeryLinkSelector: "pp:widgetDefinition/properties/galeryLink",
      heightDefault: 300,
      heightSelector: "pp:widgetDefinition/properties/height",
      imageFolderUriDefault: "",
      imageFolderUriSelector: "pp:widgetDefinition/properties/imageFolderUri",
      imagesSelector: "/pp:widgetData/images/image",
      loopShowDefault: true,
      loopShowSelector: "pp:widgetDefinition/properties/loopShow",
      nameSelector : "/pp:widgetDefinition/name",
      overlapImagesDefault : true,
      overlapImagesSelector : "pp:widgetDefinition/properties/overlapImages",
      resizeImagesDefault : true,
      resizeImagesSelector : "pp:widgetDefinition/properties/resizeImages",
      showControllerDefault : true,
      showControllerSelector : "pp:widgetDefinition/properties/showController",
      showImageCaptionsDefault : true,
      showImageCaptionsSelector : "pp:widgetDefinition/properties/showImageCaptions",
      showSlidesRandomDefault : false,
      showSlidesRandomSelector : "pp:widgetDefinition/properties/showSlidesRandom",
      showThumbnailsDefault : true,
      showThumbnailsSelector : "pp:widgetDefinition/properties/showThumbnails",
      skipTransitionDefault : null,
      skipTransitionSelector : "pp:widgetDefinition/properties/skipTransition",
      slideChangeDelayDefault : 2000,
      slideChangeDelaySelector : "pp:widgetDefinition/properties/slideChangeDelay",
      slideTransitionDefault : "Sine",
      slideTransitionSelector : "pp:widgetDefinition/properties/slideTransition",
      startPausedDefault : true,
      startPausedSelector : "pp:widgetDefinition/properties/startPaused",
      thumbnailFileNameRuleDefault : null,
      thumbnailFileNameRuleSelector : "pp:widgetDefinition/properties/thumbnailFileNameRule",
      widthDefault : 450,
      widthSelector : "pp:widgetDefinition/properties/width"
   },

   //Constructor
   initialize: function( options, internationalization ){
      this.setOptions( options );
      this.parent( options, internationalization );
      
      //Private attributes
      this.accessKeys;
      this.automaticallyLinkSlide;
      this.centerImages;
      this.constructionChain = new Chain();
      this.data;
      this.dataAsText = "";
      this.effectDuration;
      this.firstSlide;
      this.galeryLink;
      this.height;
      this.images = new LinkedHashMap();
      this.imageFolderUri;
      this.loopShow;
      this.overlapImages;
      this.resizeImages;
      this.showController;
      this.showImageCaptions;
      this.showSlidesRandom;
      this.showThumbnails;
      this.skipTransition;
      this.slideChangeDelay;
      this.slideShow;
      this.slideTransition;
      this.startPaused;
      this.thumbnailFileNameRule;
      this.width;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.parent();
   },
   
   destroy: function(){
      this.destroyComponents();
      this.destroyChildElements( this.containerElement );
      this.resetFields();
      this.parent();
   },
   
   onComplete: function(){
      if( this.state < BrowserWidget.States.CONSTRUCTED ){
         this.logger.trace( this.options.componentName + ".onComplete() completed to load Slideshow 2." );
         this.constructionChain.callChain();
      }
   },
   
   onEnd: function(){
      this.logger.trace( this.options.componentName + ".onEnd() ended Slideshow 2." );
   },
   
   onShow: function(){
      if( this.state < BrowserWidget.States.CONSTRUCTED ){
         this.logger.trace( this.options.componentName + ".onShow() started to load Slideshow 2." );
         this.constructionChain.callChain();
      }
   },
   
   onStart: function(){
      if( this.state < BrowserWidget.States.CONSTRUCTED ){
         this.logger.trace( this.options.componentName + ".onStart() started to load Slideshow 2." );
         this.constructionChain.callChain();
      }
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallImages();
      return this.parent();
   },
   
   //Properties
   getAccessKeys: function() { return this.accessKeys; },
   getAutomaticallyLinkSlide: function() { return this.automaticallyLinkSlide; },
   getCenterImages: function() { return this.centerImages; },
   getData: function() { return this.data; },
   getEffectDuration: function() { return this.effectDuration; },
   getFirstSlide: function() { return this.firstSlide; },
   getGaleryLink: function() { return this.galeryLink; },
   getHeight: function() { return this.height; },
   getImages: function() { return this.images; },
   getImageFolderUri: function() { return this.imageFolderUri; },
   getLoopShow: function() { return this.loopShow; },
   getOverlapImages: function() { return this.overlapImages; },
   getResizeImages: function() { return this.resizeImages; },
   getShowController: function() { return this.showController; },
   getShowImageCaptions: function() { return this.showImageCaptions; },
   getShowSlidesRandom: function() { return this.showSlidesRandom; },
   getShowThumbnails: function() { return this.showThumbnails; },
   getSkipTransition: function() { return this.skipTransition; },
   getSlideChangeDelay: function() { return this.slideChangeDelay; },
   getSlideShow: function() { return this.slideShow; },
   getSlideTransition: function() { return this.slideTransition; },
   getStartPaused: function() { return this.startPaused; },
   getThumbnailFileNameRule: function() { return this.thumbnailFileNameRule; },
   getWidth: function() { return this.width; },
   
   //Protected and private helper methods
   compileDataObject: function(){
      this.images.each( function( imageEntry, index ){
         var image = imageEntry.getValue();
         image.construct();
         if( this.dataAsText ) this.dataAsText += ", ";
         this.dataAsText += image.getDataAsText();
      }, this );
      
      this.data = eval( "({" + this.dataAsText + "})" );
      this.constructionChain.callChain();
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain(
         this.compileDataObject,
         this.instantiateSlideShow,
         this.finalizeConstruction
      );
      
   }.protect(),
   
   destroyChildElements: function( parentElement ){
      var childElements = parentElement.getChildren( '*' );
      childElements.each( function( childElement, index ){
         if( childElement.getChildren( '*' ).length > 0 ) this.destroyChildElements( childElement );
         
         if( childElement.removeEvents ) childElement.removeEvents();
         if( childElement.destroy ) childElement.destroy();
      }.bind( this ));
   }.protect(),
   
   destroyComponents: function(){
      if( this.slideShow ) this.slideShow.destroy();
   }.protect(),
   
   instantiateSlideShow: function(){
      var slideShowOptions = {
         captions : this.showImageCaptions,
         center : this.centerImages,
         controller : this.showController,
         delay : this.slideChangeDelay,
         duration : this.effectDuration,
         fast : this.skipTransition,
         height : this.height,
         href : this.galeryLink,
         hu : this.imageFolderUri,
         linked : this.automaticallyLinkSlide,
         loop : this.loopShow,
         onComplete : this.onComplete,
         onEnd : this.onEnd,
         onShow : this.onShow,
         onStart : this.onStart,
         overlap : this.overlapImages,
         paused : this.startPaused,
         random : this.showSlidesRandom,
         replace : this.thumbnailFileNameRule,
         resize : this.resizeImages,
         slide : this.firstSlide,
         thumbnails : this.showThumbnails,
         transition : this.slideTransition,
         width : this.width
      };
      this.slideShow = new Slideshow( this.containerElement, this.data, slideShowOptions );
   }.protect(),
   
   resetFields: function(){
      this.accessKeys = null;
      this.automaticallyLinkSlide = null;
      this.centerImages = null;
      this.data = null;
      this.dataAsText = "";
      this.effectDuration = null;
      this.firstSlide = null;
      this.galeryLink = null;
      this.height = null;
      this.imageFolderUri = null;
      this.loopShow = null;
      this.overlapImages = null;
      this.resizeImages = null;
      this.showController = null;
      this.showImageCaptions = null;
      this.showSlidesRandom = null;
      this.showThumbnails = null;
      this.skipTransition = null;
      this.slideChangeDelay = null;
      this.slideTransition = null;
      this.startPaused = null;
      this.thumbnailFileNameRule = null;
      this.width = null;
      this.images.clear();
   }.protect(),
   
   unmarshallImages: function(){
      var imagesElement = this.dataXml.selectNodes( this.options.imagesSelector );
      if( imagesElement ){
         imagesElement.each( function( imageElement, index ){
            var image = new PhotoGaleryImage( imageElement, this.i18Resource );
            image.unmarshall();
            this.images.put( image.getUri(), image );
         }, this );
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.accessKeys = this.unmarshallProperty( this.options.accessKeysDefault, this.options.accessKeysSelector );
      this.automaticallyLinkSlide = this.unmarshallProperty( this.options.automaticallyLinkSlideDefault, this.options.automaticallyLinkSlideSelector );
      this.centerImages = parseBoolean( this.unmarshallProperty( this.options.centerImagesDefault, this.options.centerImagesSelector ));
      this.effectDuration = parseInt( this.unmarshallProperty( this.options.effectDurationDefault, this.options.effectDurationSelector ));
      this.firstSlide = parseInt( this.unmarshallProperty( this.options.firstSlideDefault, this.options.firstSlideSelector ));
      this.galeryLink = this.unmarshallProperty( this.options.galeryLinkDefault, this.options.galeryLinkSelector );
      this.height = parseInt( this.unmarshallProperty( this.options.heightDefault, this.options.heightSelector ));
      this.imageFolderUri = this.unmarshallProperty( this.options.imageFolderUriDefault, this.options.imageFolderUriSelector );
      this.loopShow = parseBoolean( this.unmarshallProperty( this.options.loopShowDefault, this.options.loopShowSelector ));
      this.overlapImages = parseBoolean( this.unmarshallProperty( this.options.overlapImagesDefault, this.options.overlapImagesSelector ));
      this.resizeImages = parseBoolean( this.unmarshallProperty( this.options.resizeImagesDefault, this.options.resizeImagesSelector ));
      this.showController = parseBoolean( this.unmarshallProperty( this.options.showControllerDefault, this.options.showControllerSelector ));
      this.showImageCaptions = parseBoolean( this.unmarshallProperty( this.options.showImageCaptionsDefault, this.options.showImageCaptionsSelector ));
      this.showSlidesRandom = parseBoolean( this.unmarshallProperty( this.options.showSlidesRandomDefault, this.options.showSlidesRandomSelector ));
      this.showThumbnails = parseBoolean( this.unmarshallProperty( this.options.showThumbnailsDefault, this.options.showThumbnailsSelector ));
      this.skipTransition = eval( "(" + this.unmarshallProperty( this.options.skipTransitionDefault, this.options.skipTransitionSelector ) + ")" );
      this.slideChangeDelay = parseInt( this.unmarshallProperty( this.options.slideChangeDefault, this.options.slideChangeDelaySelector ));
      this.slideTransition = this.unmarshallProperty( this.options.slideTransitionDefault, this.options.slideTransitionSelector );
      this.startPaused = parseBoolean( this.unmarshallProperty( this.options.startPausedDefault, this.options.startPausedSelector ));
      this.thumbnailFileNameRule = this.unmarshallProperty( this.options.thumbnailFileNameRuleDefault, this.options.thumbnailFileNameRuleSelector );
      this.width = parseInt( this.unmarshallProperty( this.options.widthDefault, this.options.widthSelector ));
   }.protect(),
   
   unmarshallProperty: function( defaultValue, selector ){
      var propertyValue = this.definitionXml.selectNodeText( selector );
      if( propertyValue ) return propertyValue;
      else return defaultValue;
   }.protect()
});
/*
Name: DocumentResource

Description: Represents an element in the <resources> part of the SmartDocumentDefinition.

Requires:

Provides:
    - DocumentResource

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



var DocumentResource = new Class({
   Implements: [Events, Options],
   Binds: ['checkResourceAvailability', 'onResourceLoaded'],   
   
   options: {
      idSelector : "@id",
      type : null
   },
   
   //Constructor
   initialize: function( resourceElement, options ){
      this.setOptions( options );
      this.availabilityCheckIsRunning;
      this.id = null;
      this.htmlElement = null;
      this.resourceElement = resourceElement;
      this.resourceAvailable = false;
      this.resourceUri = null;
      this.loadChain = new Chain();
      this.logger = Class.getInstanceOf( WebUILogger );
   },
   
   //Public mutators and accessor methods
   load: function(){
      if( !this.isResourceLoaded() ){
         this.loadChain.chain( this.checkResourceAvailability, this.loadResource ).callChain();
      }else this.onResourceLoaded();
   },
   
   onResourceError: function(){
      this.fireEvent( 'resourceError', this.resourceUri );
   },
   
   onResourceLoaded: function(){
      this.fireEvent( 'resourceLoaded', this );
   },
   
   release: function(){
      if( this.htmlElement ) this.htmlElement.destroy();
   },
   
   unmarshall: function(){
      this.id = XmlResource.selectNodeText( this.options.idSelector, this.resourceElement );
      this.resourceUri = XmlResource.determineNodeText( this.resourceElement );
      this.resourceUri = this.transformToResourceUriToAbsolute();
   },

   //Properties
   getId: function() { return this.htmlElement.get( 'id' ); },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return this.resourceUri; },
   
   //Protected, private helper methods
   checkResourceAvailability: function(){
      this.remoteResource = new RemoteResource( this.resourceUri, {
         async: false,            
         onSuccess: function( responseText, responseXML ){ 
            this.resourceAvailable = true;
            this.availabilityCheckIsRunning = false;
            this.loadChain.callChain();
         }.bind( this ),
         onException: function( headerName, value ){ 
            this.loadChain.clearChain();
            if( this.availabilityCheckIsRunning ) {
               this.availabilityCheckIsRunning = false;
               this.onResourceError(); 
            }
         }.bind( this ),
         onFailure: function( xhr ) { 
            this.loadChain.clearChain();
            if( this.availabilityCheckIsRunning ) {
               this.availabilityCheckIsRunning = false;
               this.onResourceError(); 
            }
         }.bind( this )
      });
      
      try{
         this.availabilityCheckIsRunning = true;
         this.remoteResource.retrieve();
      }catch( e ){
         throw new UndefinedDocumentResourceException( this.resourceUri, { cause: e, source : this.componentName } );
      }
   }.protect(),
   
   determineBaseUri: function(){
   }.protect(),
   
   transformToResourceUriToAbsolute: function(){
      var resourceUriFragment = this.resourceUri;
      var currentDirectory = document.location.href;
      currentDirectory = currentDirectory.lastIndexOf( "#" ) > 0 ? currentDirectory.substring( 0, currentDirectory.lastIndexOf( "#" )) : currentDirectory;
      currentDirectory = currentDirectory.lastIndexOf( "?" ) > 0  ? currentDirectory.substring( 0, currentDirectory.lastIndexOf( "?" )) : currentDirectory;
      currentDirectory = currentDirectory.substring( 0, currentDirectory.lastIndexOf( "/" ));
      
      while( resourceUriFragment.indexOf( "../" ) == 0 ){
         resourceUriFragment = resourceUriFragment.substring( resourceUriFragment.indexOf( "../" ) + 3 );
         currentDirectory = currentDirectory.substring( 0, currentDirectory.lastIndexOf( "/" ));
      }
      
      return currentDirectory + "/" + resourceUriFragment;
   }
});
/*
Name: DocumentImage

Description: Represents an element in the <resources> part of the SmartDocumentDefinition.

Requires:

Provides:
    - DocumentImage

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




var DocumentImage = new Class({
   Extends: DocumentResource,
   Binds: ['loadResource'],   
   
   options: {
      titleSelector : "@title"
   },
   
   //Constructor
   initialize: function( resourceElement, options ){
      this.options.type = "Image";
      this.parent( resourceElement, options );
      this.title = null;
   },
   
   //Public mutators and accessor methods
   release: function(){
      this.parent();
   },

   unmarshall: function(){
      this.parent();
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.resourceElement );
   },

   //Properties
   getTitle: function() { return this.title; },
   
   //Protected, private helper methods
   checkResourceAvailability: function(){
      this.resourceAvailable = true;
      this.availabilityCheckIsRunning = false;
      this.loadChain.callChain();
   }.protect(),
   
   isResourceLoaded: function(){
      return false;
   }.protect(),
   
   loadResource: function(){
      Asset.image( this.resourceUri, {
         id: this.id,
         title: this.title,
         onAbort: function(){
            this.onResourceError();
         }.bind( this ),
         
         onError: function(){
            this.onResourceError();
         }.bind( this ),
         
         onLoad: function(){
            this.onResourceLoaded();
         }.bind( this )
     });      
   }.protect()
});
/*
Name: DocumentScript

Description: Represents an element in the <resources> part of the SmartDocumentDefinition.

Requires:

Provides:
    - DocumentScript

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




var DocumentScript = new Class({
   Extends: DocumentResource,
   Binds: ['loadResource'],   
   
   //Constructor
   initialize: function( resourceElement, options ){
      this.options.type = "Script";
      this.parent( resourceElement, options );
   },
   
   //Public mutators and accessor methods
   release: function(){
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   isResourceLoaded: function(){
      var scriptElement = $$("script[src='" + this.resourceUri + "']"); 
      return scriptElement.length > 0;
   }.protect(),
   
   loadResource: function(){
      Asset.javascript( this.resourceUri, {
         id: this.id,
         onLoad: function(){
            this.htmlElement = $$("script[src='" + this.resourceUri + "']");
            this.onResourceLoaded();
         }.bind( this )
     });      
   }.protect()
});
/*
Name: DocumentResource

Description: Represents an element in the <resources> part of the SmartDocumentDefinition.

Requires:

Provides:
    - DocumentResource

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




var DocumentStyleSheet = new Class({
   Extends: DocumentResource,
   Binds: ['loadResource'],   
   
   options: {
      componentName : "DocumentStyleSheet",
      idPrefix : 'css-preload-'
   },
   
   //Constructor
   initialize: function( resourceElement, options ){
      this.options.type = "StyleSheet";
      this.parent( resourceElement, options );
      this.remoteResource;
   },
   
   //Public mutators and accessor methods
   release: function(){
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   isResourceLoaded: function(){
      var linkElement = $$("link[href='" + this.resourceUri + "']"); 
      return linkElement.length > 0;
   }.protect(),
   
   loadResource: function(){
      new RemoteStyleSheet( this.resourceUri, {
         onReady: function( path, element ) {
            this.logger.debug( "Stylesheet: '" + path + "' was added to the document." );
            this.htmlElement = element;
            this.onResourceLoaded();
         }.bind( this ),
         
         onError: function() {
            this.logger.debug( "Error: Couldn't load style sheet '" + this.resourceUri + "'." );
            this.onResourceError();
         }.bind( this ),
         
         onStart: function() {
            this.logger.debug( "Started to add: '" + this.resourceUri + "' to the document." );
         }.bind( this )
      }).start();
   }.protect()
});
/*
Name: ResourceManager

Description: Represents a collection of DocumentResorce objects and provides common handling methods like load unLoad.

Requires:

Provides:
    - ResourceManager

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



var ResourceManager = new Class({
   Implements: [Events, Options],
   Binds: ['onResourceError', 'onResourceLoaded'],   

   options: {
      documentImagesSelector: "images/image",
      documentScriptsSelector: "javaScripts/javaScript",
      documentStyleSheetsSelector: "styleSheets/styleSheet",
      eventFireDelay : 5,
      type : null
   },
   
   //Constructor
   initialize: function( resourceDefinition, options ){
      this.setOptions( options );
      
      this.error = null;
      this.numberOfResourcesLoaded = 0;
      this.resourceDefinition = resourceDefinition;
      this.resourceUri = null;
      this.resources = new ArrayList();
      this.state = ResourceManager.States.INITIALIZED;
      this.styleSheets = new ArrayList();
   },
   
   //Public mutators and accessor methods
   load: function(){
      if( this.resources.size() > 0 ){
         this.resources.each( function( documentResource, index ){
            documentResource.load();
         }, this );
      }else{
         this.state = ResourceManager.States.LOADED;
         this.fireEvent( 'resourcesLoaded', this );
      }
   },
   
   onResourceError: function( resourceUri ){
      this.error = new UndefinedDocumentResourceException( resourceUri );
      this.fireEvent( 'resourceError', this.error, this.options.eventFireDelay );
      this.onResourceLoaded( resourceUri );
   },
   
   onResourceLoaded: function( resource ){
      this.numberOfResourcesLoaded++;
      if( this.resources.size() > 0 && this.numberOfResourcesLoaded >= this.resources.size() ){
         this.state = ResourceManager.States.LOADED;
         this.fireEvent( 'resourcesLoaded', this, this.options.eventFireDelay );
      }
   },
   
   release: function(){
      this.resources.each( function( documentResource, index ){
         documentResource.release();
      }, this );
      
      this.styleSheets.clear();
      this.resources.clear();
      this.numberOfResourcesLoaded = 0;
   },
   
   unmarshall: function(){
      this.unmarshallResources();
      this.state = ResourceManager.States.UNMARSHALLED;
   },

   //Properties
   getError: function() { return this.error; },
   getResources: function() { return this.resources; },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return resourceUri; },
   getState: function() { return this.state; },
   getStyleSheets: function() { return this.styleSheets; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   unmarshallResource: function( selector, resourceClass ) {
      var resourceElements = XmlResource.selectNodes( selector, this.resourceDefinition );
      resourceElements.each( function( resourceElement, index ){
         var documentResource = new resourceClass( resourceElement, { onResourceLoaded : this.onResourceLoaded, onResourceError : this.onResourceError } );
         documentResource.unmarshall();
         this.resources.add( documentResource );
         if( instanceOf( documentResource, DocumentStyleSheet )) this.styleSheets.add( documentResource );
      }, this );
   }.protect(),
   
   unmarshallResources: function() {
      this.unmarshallResource( this.options.documentScriptsSelector, DocumentScript );
      this.unmarshallResource( this.options.documentStyleSheetsSelector, DocumentStyleSheet );
      this.unmarshallResource( this.options.documentImagesSelector, DocumentImage );
   }.protect()
});

ResourceManager.States = { INITIALIZED : 0, UNMARSHALLED : 1, LOADED : 2 };
/*
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
*/







var UndefinedDocumentResourceException = new Class({
   Extends: WebUIException,
   options: {
      description: "Given document resource: '{resourceName}' doesn't exist or can't be accessed.",
      name: "UndefinedDocumentException"
   },
   
   //Constructor
   initialize : function( resourceName, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { resourceName : resourceName };
   }	
});
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




var SkinChangedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      description: "A message about the event that WebUI's skin was changed.",
      name: "SkingChangedMessage",
      newSkin : null,
      previousSkin: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = SkinChangedMessage;
   },
   
   //Public accessors
   
   //Properties
   getNewSkin: function() { return this.options.newSkin; },
   getPreviousSkin: function() { return this.options.previousSkin; }
});

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




var SkinSelectorWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['onSelection'],
   
   options : {
      componentPrefix : "SkinSelectorWidget",
      selectElementId : "SkinSelector",
      selectTextKey : "SkinSelectorWidget.select",
      widgetContainerId : "SkinSelectorWidget",
      wrapperElementStyle : "SkinSelectorWrapper"
   },
   
   //Constructor
   initialize : function( options, resourceBundle, webUIConfiguration ){
      this.setOptions( options );
      this.parent( options, resourceBundle );
      
      this.availableSkins = new HashMap();
      this.isConfigured = false;
      this.selectElement = null;
      this.selectElementContainer = null;
      this.webUIConfiguration = webUIConfiguration;
      
      this.determineInitializationArguments();
      this.determineAvailableSkins();
   },

   //Public accessor and mutator methods
   construct : function() {
      this.createSpanElements();
      this.createSelectElement();
      this.createSelectElementOptions();
      return this.parent();
   },
   
   destroy : function() {
      this.availableSkins.clear();
      this.parent();
   },
   
   onSelection : function() {
      var currentSkin = this.skin;
      var newSkin = this.selectElement.options[this.selectElement.selectedIndex].value;
      var message = new SkinChangedMessage({ previousSkin : currentSkin, newSkin : newSkin, originator : this.options.widgetContainerId });
      this.messageBus.notifySubscribers( message );
   },
   
   //Properties
   getAvailableSkins : function() { return this.availableSkins; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   
   //Private helper methods
   createSelectElement : function(){
      this.selectElement = this.elementFactory.create( 'select', null, this.selectElementContainer, WidgetElementFactory.Positions.FirstChild, { id : this.options.selectElementId } );
      this.selectElement.addEvent( 'change', this.onSelection );
   }.protect(),
   
   createSelectElementOptions : function() {
      var selectedOption = this.elementFactory.createOption( "", this.options.selectTextKey, this.selectElement, WidgetElementFactory.Positions.LastChild );
      selectedOption.set( 'selected' );
      
      this.availableSkins.each( function( skinEntry, index ){
         this.elementFactory.createOption( skinEntry.getKey(), skinEntry.getKey(), this.selectElement, WidgetElementFactory.Positions.LastChild );
      }, this );
   }.protect(),
   
   createSpanElements: function() {
      var skinSelectorWrapper = this.elementFactory.create( 'span', null, null, null, {'class': this.options.wrapperElementStyle });
      this.selectElementContainer = this.elementFactory.create( 'span', null, skinSelectorWrapper, WidgetElementFactory.Positions.LastChild );
   }.protect(),
   
   determineAvailableSkins : function(){
      for( var i = 0; i < this.webUIConfiguration.getAvailableSkinElements().length; i++ ) {
         var skinName = this.webUIConfiguration.getSkinNameByIndex( i );
         var skinPath = this.webUIConfiguration.getSkinPathByIndex( i );
         this.availableSkins.put( skinName, skinPath );
      }
   }.protect(),
   
   determineInitializationArguments : function(){
      if( !this.webUIConfiguration ){
         var webUIController = Class.getInstanceOf( WebUIController );
         this.webUIConfiguration = webUIController.getWebUIConfiguration();
      }
   }.protect()
   
});
/*
Name: DocumentElement

Description: Represents a constituent element of a Smart Document. This is an abstract class, specialized elements can be instantiated.

Requires:

Provides:
    - DocumentElement

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



var DocumentElement = new Class({
   Implements: [Events, Options, TimeOutBehaviour],
   Binds: ['associateEditor', 'authorization', 'createHtmlElement', 'constructPlugin', 'finalizeConstruction', 'injectHtmlElement', 'onPluginConstructed', 'onPluginError'],   
   
   options: {
      componentName : "DocumentElement",
      defaultTag : "div",
      idPrefix : "Desktop-Element-",
      idSelector : "@id",
      isEditable : false,
      pluginSelector : "plugin",
      referenceSelector : "@href",
      styleSelector : "@elementStyle",
      tagSelector : "@tag"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );

      //Protected, private variables
      this.definitionElement = definitionElement;
      this.resourceUri = null;
      
      this.constructionChain = new Chain();
      this.contextElement;
      this.editable;
      this.editor;
      this.elementFactory;
      this.error = null;
      this.htmlElement;
      this.id;
      this.logger = WebUILogger ? Class.getInstanceOf( WebUILogger ) : null;
      this.plugin;
      this.reference;
      this.resourceBundle = bundle;
      this.status = DocumentElement.States.INITIALIZED;
      this.style;
      this.tag;
      this.text;
      this.where;      
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      if( this.status != DocumentElement.States.UNMARSHALLED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );
      this.logger.trace( this.options.componentName + ".construct() of '" + this.id + "'started." );
      assertThat( contextElement, not( nil() ));
      this.contextElement = contextElement;
      this.where = where;
      this.elementFactory = new WidgetElementFactory( contextElement, this.resourceBundle );
      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      if( this.status == DocumentElement.States.INITIALIZED ) throw new UnconfiguredDocumentElementException( 'destroy', 'initialized' );

      if( this.plugin ) this.plugin.destroy();
      if( this.status == DocumentElement.States.CONSTRUCTED ) this.deleteHtmlElement();
      if( this.status <= DocumentElement.States.CONSTRUCTED )this.resetProperties();
      if( this.editor ) this.editor.detach();
      this.error = null;
      this.status = DocumentElement.States.INITIALIZED;
   },
   
   onPluginConstructed: function(){
      this.constructionChain.callChain();
   },
   
   onPluginError: function( exception ){
      this.error = exception;
      this.revertConstruction();
      this.fireEvent( 'constructionError', this.error );
   },
   
   unmarshall: function(){
      this.unmarshallId();
      this.unmarshallReference();
      this.unmarshallStyle();
      this.unmarshallTag();
      this.unmarshallText();
      this.unmarshallPlugin();
      this.status = DocumentElement.States.UNMARSHALLED;
   },

   //Properties
   getDefinitionElement: function() { return this.definitionElement; },
   getBind: function() { return this.bind; },
   getEditor: function() { return this.editor; },
   getHtmlElement: function() { return this.htmlElement; },
   getId: function() { return this.id; },
   getPlugin: function() { return this.plugin; },
   getReference: function() { return this.reference; },
   getState: function() { return this.status; },
   getStyle: function() { return this.style; },
   getTag: function() { return this.tag; },
   getText: function() { return this.text; },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return resourceUri; },
   isEditable: function() { return this.editable; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   associateEditor: function(){
      if( this.isEditable() ){
         this.editor = DocumentElementEditorFactory.create( this, {} );
         this.editor.attach();
      }
      this.constructionChain.callChain();
   }.protect(),
   
   authorization: function(){
      this.editable = this.options.isEditable;
      this.constructionChain.callChain();
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.createHtmlElement, this.injectHtmlElement, this.constructPlugin, this.authorization, this.associateEditor, this.finalizeConstruction );
   }.protect(),
   
   constructPlugin: function(){
      if( this.plugin ){ this.plugin.construct();
      }else this.constructionChain.callChain();
   }.protect(),
   
   createHtmlElement: function(){
      if( this.tag ){
         this.htmlElement = new Element( this.tag );
         if( this.id ) this.htmlElement.set( 'id', this.id );
         if( this.style ) this.htmlElement.addClass( this.style );
         if( this.reference ){
            var anchorElement = new Element( 'a', { href : this.reference } );
            anchorElement.appendText( this.text );
            anchorElement.inject( this.htmlElement );
         }else {
            if( this.text ) this.htmlElement.appendText( this.text );
         }
      }
      this.constructionChain.callChain();
   }.protect(),
   
   deleteHtmlElement: function(){
      if( this.htmlElement ) {
         if( this.htmlElement.destroy ) this.htmlElement.destroy();
         this.htmlElement = null;
      }
   }.protect(),
   
   definitionElementAttribute: function( selector ){
      var attributeNode = XmlResource.selectNode( selector, this.definitionElement );
      if( attributeNode ) return attributeNode.value;
      else return null;
   }.protect(),
      
   finalizeConstruction: function(){
      this.stopTimeOutTimer();
      this.status = DocumentElement.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this );
   }.protect(),
   
   injectHtmlElement: function(){
      this.htmlElement.inject( this.contextElement, this.where );
      this.constructionChain.callChain();
   }.protect(),
   
   resetProperties: function(){
      this.id = null;
      this.htmlElement = null;
      this.reference = null;
      this.style = null;
      this.tag = null;
      this.text = null;
   }.protect(),
   
   revertConstruction: function(){
      this.constructionChain.clearChain();
      if( this.plugin ) this.plugin.destroy();
      this.deleteHtmlElement();
   }.protect(),

   unmarshallId: function(){
      this.id = this.definitionElementAttribute( this.options.idSelector );
      if( !this.id ) this.id = this.options.idPrefix + (new Date().getTime());
      if( this.dataElementsIndex > 0 ) this.id += "#" + this.dataElementsIndex; 
   }.protect(),
   
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.resourceBundle, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginError } );
         this.plugin.unmarshall();
      }
   }.protect(),
   
   unmarshallReference: function(){
      this.reference = this.definitionElementAttribute( this.options.referenceSelector );
   }.protect(),
   
   unmarshallStyle: function(){
      this.style = this.definitionElementAttribute( this.options.styleSelector );
   }.protect(),
   
   unmarshallTag: function(){
      this.tag = this.definitionElementAttribute( this.options.tagSelector );
      if( !this.tag ) this.tag = this.options.defaultTag;
   }.protect(),
   
   unmarshallText: function(){
      this.text = XmlResource.determineNodeText( this.definitionElement );
      if( this.resourceBundle && this.text ) this.text = this.resourceBundle.getText( this.text.trim() );
      
      if( !this.text ) this.text = "";
   }
});

DocumentElement.States = { INITIALIZED : 0, UNMARSHALLED : 1, CONSTRUCTED : 2 };
/*
Name: CompositeDocumentElement

Description: Represents a composite constituent element of a SmartDocument which can have nested elements.

Requires: 
    - DocumentElement

Provides:
    - CompositeDocumentElement

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




var CompositeDocumentElement = new Class({
   Extends: DocumentElement,
   Binds: ['constructNestedElements', 'onNestedElementConstructed', 'onNestedElementConstructionError'],
   
   options: {
      componentName : "CompositeDocumentElement",
      subElementsSelector : "compositeElement | element | compositeDataElement | dataElement | formElement | formField",
      tagName : "div"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, options );
      this.dataXml = dataXml;
      this.elements = new LinkedHashMap();
      this.nestedElementsContext;
      this.numberOfConstructedNestedElements = 0;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         if( nestedElement.getState() > DocumentElement.States.INITIALIZED ) nestedElement.destroy();
      }, this );
      this.numberOfConstructedNestedElements = 0;
      this.parent();
   },
   
   onNestedElementConstructed: function( documentElement ){
      this.numberOfConstructedNestedElements++;
      if( this.numberOfConstructedNestedElements == this.elements.size() ) this.constructionChain.callChain();
   },
   
   onNestedElementConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'constructionError', this.error );
   },
   
   unmarshall: function(){
      this.parent();
      if( !this.tag ) this.tag = this.options.tagName;
      this.unmarshallNestedElements();
   },

   //Properties
   getElement: function( name ) { return this.elements.get( name ); },
   getElements: function() { return this.elements; },
   
   //Protected, private helper methods
   addElement: function( documentElement ){
      this.elements.put( documentElement.getId(), documentElement );
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.createHtmlElement, this.injectHtmlElement, this.associateEditor, this.constructPlugin, this.constructNestedElements, this.authorization, this.finalizeConstruction );
   }.protect(),
   
   constructNestedElements: function( contextElement ){
      if( contextElement ) this.nestedElementsContext = contextElement;
      else this.nestedElementsContext = this.htmlElement;
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         nestedElement.construct( this.nestedElementsContext );
      }, this );      
   }.protect(),
   
   instantiateDocumentElement: function( elementDefinition ){
      return DocumentElementFactory.create( elementDefinition, this.resourceBundle, this.dataXml, { onConstructed : this.onNestedElementConstructed, onConstructionError : this.onNestedElementConstructionError } );
   }.protect(),
   
   revertConstruction: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         if( nestedElement.getState() > DocumentElement.States.INITIALIZED ) nestedElement.destroy();
      }, this );
      this.elements.clear();
      this.numberOfConstructedNestedElements = 0;
      this.parent();
   }.protect(),
   
   unmarshallNestedElement: function( subElementDefinition, options ){
      var nestedDesktopElement = this.instantiateDocumentElement( subElementDefinition );
      nestedDesktopElement.unmarshall();
      this.addElement( nestedDesktopElement );
      return nestedDesktopElement;
   }.protect(),
   
   unmarshallNestedElements: function(){
      var subElements = XmlResource.selectNodes( this.options.subElementsSelector, this.definitionElement );
      subElements.each( function( subElementDefinition, index ){
         this.unmarshallNestedElement( subElementDefinition );
      }, this );
   }.protect()
   
});
/*
Name: DataElementBehaviour

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - DataElementBehaviour

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



var DataElementBehaviour = new Class({
   options: {
      bindSelector : "@bind",
      maxOccuresSelector : "@maxOccures",
      minOccuresSelector : "@minOccures",
      sourceSelector : "@source",
      variables : { index : "'*'" }
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      
      //Private variables
      this.bind;
      this.dataXml = data;
      //this.dataElementsIndex = index ? index : 0;
      this.dataElementsNumber;
      this.maxOccures;
      this.minOccures;
      this.numberOfConstructedSiblings;
      this.siblings;
      this.source;
   },
   
   //Public mutators and accessor methods
   onSiblingConstructed: function(){
      this.numberOfConstructedSiblings++;
      if( this.numberOfConstructedSiblings == this.siblings.size() ) this.constructionChain.callChain();
   },
   
   //Properties
   getDataElementsIndex: function() { return this.dataElementsIndex; },
   getDataElementsNumber: function() { return this.dataElementsNumber; },
   getDataXml: function() { return this.dataXml; },
   getBind: function() { return this.bind; },
   getMaxOccures: function() { return this.maxOccures; },
   getMinOccures: function() { return this.minOccures; },
   getSiblings: function() { return this.siblings; },
   getSource: function() { return this.source; },
   
   //Protected, private helper methods
   checkIfBindVariableNeeded: function(){
      if( this.maxOccures ){
         if(( this.maxOccures == 'unbounded' || this.maxOccures > 0 ) && ( this.bind.search( "{.*}" ) == -1 )) 
            throw new MissingBindVariableException( this.id );
      }

   }.protect(),
   
   constructSiblings: function(){
      if( this.siblings.size() > 0 ){
         this.siblings.each( function( siblingElement, index ){
            siblingElement.construct( this.contextElement, this.where );
         }, this );      
      }else this.constructionChain.callChain();
   }.protect(),
   
   determineDataElementsNumber: function(){
      var dataSelector = this.bind.substitute( this.options.variables );
      var bindedData = this.dataXml.selectNodes( dataSelector );
      if( this.maxOccures == 'unbounded' && bindedData.length > 1 ) this.dataElementsNumber = bindedData.length;
      if( this.maxOccures > 1 && this.maxOccures < bindedData.length ) this.dataElementsNumber = this.maxOccures;
   }.protect(),
   
   destroySiblings: function(){
      this.siblings.each( function( siblingElement, index ){
         siblingElement.destroy();
      }, this );
      
   }.protect(),
   
   instantiateSiblings: function() {
      for( var i = 2; i <= this.dataElementsNumber; i++ ){
         var siblingElement = DocumentElementFactory.create( this.definitionElement, this.resourceBundle, this.dataXml, { onConstructed : this.onSiblingConstructed, variables : { index : i } });
         siblingElement.unmarshall();
         this.siblings.add( siblingElement );
      }
      
      if( this.dataElementsNumber > 1 ) {
         this.options.variables = { index : 1 };
      }
   }.protect(),
   
   loadDataSource: function(){
      if( this.source ){
         this.dataXml = new XmlResource( this.source );
      }
   }.protect(),
   
   resetProperties: function(){
      this.bind = null;
      this.maxOccures = null;
      this.minOccures = null;
      this.source = null;
   }.protect(),
   
   retrieveData: function(){
      if( this.bind && this.dataXml && instanceOf( this.dataXml, XmlResource ) ){
         var dataSelector = this.bind.substitute( this.options.variables );
         this.text = this.dataXml.selectNodeText( dataSelector );
         if( this.text ) this.text.trim();
      }      
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallDataProperties: function(){
      this.bind = this.definitionElementAttribute( this.options.bindSelector );
      this.maxOccures = this.definitionElementAttribute( this.options.maxOccuresSelector );
      this.minOccures = this.definitionElementAttribute( this.options.minOccuresSelector );
      this.source = this.definitionElementAttribute( this.options.sourceSelector );
      
      this.checkIfBindVariableNeeded();
   }
});
/*
Name: CompositeDataElement

Description: Represents a composite constituent element of a SmartDocument which retrieves and presents data from a given data source.

Requires:
    - CompositeDocumentElement, DocumentElement

Provides:
    - CompositeDataElement

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





var CompositeDataElement = new Class({
   Extends: CompositeDocumentElement,
   Implements: DataElementBehaviour,
   
   options: {
      componentName : "CompositeDataElement"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, dataXml, options );
      this.contextElement;
      this.bind;
      this.dataElementsNumber = 1;
      this.maxOccures;
      this.minOccures;
      this.siblings = new ArrayList();
      this.source;
      this.where;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.contextElement = contextElement;
      this.where = where;
      this.retrieveData();
      this.constructSiblings();
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.destroySiblings();
      this.parent();
   },
   
   instantiateDocumentElement: function( elementDefinition ){
      return DocumentElementFactory.create( elementDefinition, this.resourceBundle, this.dataXml, { 
         onConstructed : this.onNestedElementConstructed, onConstructionError : this.onNestedElementConstructionError, variables : this.options.variables });
   }.protect(),
   
   unmarshall: function( dataElementIndex ){
      this.unmarshallDataProperties();
      this.loadDataSource();
      this.determineDataElementsNumber();
      this.instantiateSiblings();
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   
});
/*
Name: DataElement

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - DataElement

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





var DataElement = new Class({
   Extends: DocumentElement,
   Binds: ['constructSiblings', 'finalizeConstruction', 'onSiblingConstructed', 'retrieveData'],
   Implements: DataElementBehaviour,
   
   options: {
      componentName : "DataElement",
      isEditable : true,
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      this.parent( definitionElement, bundle, options );
      
      //Private variables
      this.setUp( data );
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.destroySiblings();
      this.parent();
      this.numberOfConstructedSiblings = 0;
   },
   
   unmarshall: function(){
      this.unmarshallDataProperties();
      this.loadDataSource();
      this.determineDataElementsNumber();
      this.instantiateSiblings();
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.retrieveData, 
         this.constructSiblings, 
         this.createHtmlElement, 
         this.injectHtmlElement, 
         this.constructPlugin, 
         this.authorization, 
         this.associateEditor, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   injectHtmlElement: function(){
      this.htmlElement.addClass( DataElement.CLASS );
      this.parent();
   }.protect(),
   
   setUp: function( data ){
      this.dataXml = data;
      this.numberOfConstructedSiblings = 0;
      this.siblings = new ArrayList();
   }.protect(),
});

DataElement.CLASS = "dataElement";
/*
Name: DocumentElementEditor

Description: An inline editor, associciated with SmartDocument's elements (DocumentElement).

Requires:

Provides:
    - DocumentElementEditor

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



var DocumentElementEditor = new Class({
   Implements: [Events, Options],
   Binds: ['onBlur', 'onClick'],
   options: {
      dataType : 'string', //DocumentElementEditor.DataType.STRING,
      inputStyle : { background: 'transparent', border : 'none', width: '20em' },
      mininmumWidth : '400',
      restriction : null,
      styleProperties : ['color', 'display', 'font-family', 'font-size', 'font-weight', 'line-height', 'margin', 'height', 'padding', 'position', 'text-align', 'width'],
   },
   
   initialize: function( subjectHtmlElement, options ){
      this.setOptions( options );
      assertThat( subjectHtmlElement, not( nil() ));
      
      //private fields
      this.inputElement;
      this.previousValue;
      this.state = DocumentElementEditor.States.DETACHED;
      this.subjectHtmlElement = subjectHtmlElement;
      this.text;
   },
   
   //Public accessors and mutators
   attach: function(){
      if( this.state == DocumentElementEditor.States.DETACHED ){
         this.subjectHtmlElement.addEvent( 'focus', this.onClick );
         this.subjectHtmlElement.addEvent( 'click', this.onClick );
         this.state = DocumentElementEditor.States.ATTACHED;
      }
   },
   
   detach: function(){
      if( this.state == DocumentElementEditor.States.EDITING || this.state == DocumentElementEditor.States.ATTACHED ){
         if( this.inputElement ) this.removeInputElement();
         this.state = DocumentElementEditor.States.DETACHED;
      }
   },
   
   onBlur: function(){
      if( this.state == DocumentElementEditor.States.EDITING ){
         this.removeInputElement();
         this.state = DocumentElementEditor.States.ATTACHED;
         this.fireEvent( 'editEnd', this );
      }
   },
   
   onClick: function(){
      if( this.state == DocumentElementEditor.States.ATTACHED ){
         this.saveCurrentValue();
         this.injectInputElement();
         this.state = DocumentElementEditor.States.EDITING;
         this.fireEvent( 'editStart', this );
      }
   },
   
   onKeypress: function(){
      
   },
   
   //Properties
   getInputElement: function() { return this.inputElement; },
   getPreviousValue: function() { return this.previousValue; },
   getState: function() { return this.state; },
   getSubjectElement: function(){ return this.subjectHtmlElement; },
   getText: function() { return this.text; },
   isChanged: function() { return !(this.text && this.text.equals( this.previousValue )); },
   
   //Protected, private helper methods
   injectInputElement: function(){
      var subjectHtmlElementStyle = this.subjectHtmlElement.getStyles( this.options.styleProperties );
      this.subjectHtmlElement.setStyle( 'display', 'none' );
      this.inputElement = new Element( 'input', {
         events : { blur : this.onBlur },
         name : this.subjectHtmlElement.get( 'id'), 
         type: 'text', 
         value : this.text, 
         styles : this.options.inputStyle 
      });
      this.inputElement.setStyles( subjectHtmlElementStyle );
      if( this.inputElement.getStyle( 'width' ).toInt() < this.options.minimumWidth ) this.inputElement.setStyle( 'width', this.options.minimumWidth );
      this.inputElement.inject( this.subjectHtmlElement, 'after' );
   }.protect(),
   
   removeInputElement: function(){
      this.text = this.inputElement.get( 'value' );
      this.inputElement.removeEvents();
      this.inputElement.destroy();
      this.subjectHtmlElement.removeEvent( 'focus', this.onClick );
      this.subjectHtmlElement.removeEvent( 'click', this.onClick );
      this.subjectHtmlElement.set( 'text', this.text );
      this.subjectHtmlElement.setStyle( 'display', 'inline' );
   }.protect(),
   
   saveCurrentValue: function(){
      this.text = this.subjectHtmlElement.get( 'text' );
      this.previousValue = this.text;
   }
});

DocumentElementEditor.DataType = { BOOLEAN : 'boolean', INTEGER : 'integer', LONG_INTEGER : 'longInteger', STRING : 'string', TEXT : 'text', TIME_POINT : 'timePoint' };
DocumentElementEditor.DataType.TIME_POINT.Precission = { YEAR : 'year', MONTH : 'month', DAY : 'day', HOUR : 'hour', MINUTE : 'minute', SECOND : 'second', MILLI_SECOND : 'milliSecond' };
DocumentElementEditor.States = { DETACHED : 'detached', ATTACHED : 'attached', EDITING : 'editing' };
/*
Name: DataElementEditor

Description: An inline editor, associciated with SmartDocument's DataElements.

Requires:
   - DocumentElementEditor
Provides:
    - DataElementEditor

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




var DataElementEditor = new Class({
   Extends: DocumentElementEditor,
   options: {
   },
   
   //Consturctor
   initialize: function( subjectHtmlElement, options ){
      this.parent( subjectHtmlElement, options );
   }
   
   //Public accessors and mutators
   
   //Properties
   
   //Protected, private helper methods
});
/*
Name: DocumentBody

Description: Represents the body component of a SmartDocument.

Requires:

Provides:
    - DocumentBody

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




var DocumentBody = new Class({
   Extends: CompositeDocumentElement,
   
   options: {
      componentName : "DocumentBody"
   },
   
   //Constructor
   initialize: function( headerDefinitionElement, bundle, data, options ){
      this.parent( headerDefinitionElement, bundle, data, options );
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   constructed: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.parent();
   }

   //Properties
});
/*
Name: DocumentElementEditorFactory

Description: Instantiates a new instance of DocumentElementEditor or one of it's subclass depending on the type of DocumentElement.

Requires:

Provides:
    - DocumentElementEditorFactory

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



var DocumentElementEditorFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( subjectDocumentElement, options ){
      var subjectHtmlElement = subjectDocumentElement.getHtmlElement(); 
      var documentElementEditor = null;
      switch( subjectDocumentElement.options.componentName ){
      case "CompositeDataElement": 
      case "FormField": 
         documentElementEditor = new DataElementEditor( subjectDocumentElement.getValueElement(), options ); break;
      case "DataElement": 
         documentElementEditor = new DataElementEditor( subjectHtmlElement, options ); break;
      case "CompositeDocumentElement": 
      case "DocumentElement": 
         documentElementEditor = new DocumentElementEditor( subjectHtmlElement, options ); break;
      }
      
      return documentElementEditor;
   }
});

DocumentElementEditorFactory.create = function( subjectDocumentElement, options ){
   var factory = new DocumentElementEditorFactory();
   var elementEditor = factory.create( subjectDocumentElement, options );
   return elementEditor;
};
/*
Name: DocumentElementFactory

Description: Instantiates a new subclass of DocumentElement according to the given XML element.

Requires:

Provides:
    - DocumentElementFactory

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



var DocumentElementFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, bundle, data, options ){
      var newDocumentElement;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "COMPOSITEDATAELEMENT": 
         newDocumentElement = new CompositeDataElement( definitionXmlElement, bundle, data, options ); break;
      case "COMPOSITEELEMENT": 
         newDocumentElement = new CompositeDocumentElement( definitionXmlElement, bundle, data, options ); break;
      case "DATAELEMENT": 
         newDocumentElement = new DataElement( definitionXmlElement, bundle, data, options ); break;
      case "DOCUMENTBODY": 
         newDocumentElement = new DocumentBody( definitionXmlElement, bundle, data, options ); break;
      case "DOCUMENTFOOTER": 
         newDocumentElement = new DocumentFooter( definitionXmlElement, bundle, data, options ); break;
      case "DOCUMENTHEADER": 
         newDocumentElement = new DocumentHeader( definitionXmlElement, bundle, data, options ); break;
      case "FORMELEMENT": 
         newDocumentElement = new FormElement( definitionXmlElement, bundle, data, options ); break;
      case "FORMFIELD": 
         newDocumentElement = new FormField( definitionXmlElement, bundle, data, options ); break;
      case "ELEMENT":
      default:
         newDocumentElement = new DocumentElement( definitionXmlElement, bundle, options ); break;
      }
      
      return newDocumentElement;
   }
});

DocumentElementFactory.create = function(  definitionXmlElement, bundle, data, options ){
   var factory = new DocumentElementFactory();
   var element = factory.create( definitionXmlElement, bundle, data, options );
   return element;
};
/*
Name: DocumentFooter

Description: Represents the body component of a SmartDocument.

Requires:

Provides:
    - DocumentFooter

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




var DocumentFooter = new Class({
   Extends: CompositeDocumentElement,
   
   options: {
      componentName : "DocumentFooter"
   },
   
   //Constructor
   initialize: function( headerDefinitionElement, bundle, data, options ){
      this.parent( headerDefinitionElement, bundle, data, options );
   },
   
   //Public mutators and accessor methods
   unmarshall: function(){
      this.parent();
   }

   //Properties
});
/*
Name: DocumentHeader

Description: Represents the header element of a SmartDocument.

Requires:

Provides:
    - DocumentHeader

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




var DocumentHeader = new Class({
   Extends: CompositeDocumentElement,
   
   options: {
      componentName : "DocumentHeader"
   },
   
   //Constructor
   initialize: function( headerDefinitionElement, bundle, data, options ){
      this.parent( headerDefinitionElement, bundle, data, options );
   },
   
   //Public mutators and accessor methods
   unmarshall: function(){
      this.parent();
   }

   //Properties
});
/*
Name: 
    - DocumentPlugin

Description: 
    - Represents an embedable active element of SmartDocument. The dynamic behaviour of ProcessPuzzleUI is provided by plugins. 

Requires:

Provides:
    - DocumentPlugin

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



var DocumentPlugin = new Class({
   Implements: [Events, Options],
   Binds: ['finalizeConstruction', 'instantiateWidget', 'loadResources', 'onResourceError', 'onResourcesLoaded', 'onWidgetConstructed', 'onWidgetError'],   
   
   options: {
      componentName : "DocumentPlugin",
      nameSelector : "@name",
      optionsSelector : "widget/options",
      resourcesSelector : "resources",
      widgetNameSelector : "widget/@name"
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.setOptions( options );

      //Protected, private variables
      this.constructChain = new Chain();
      this.definitionElement = definitionElement;
      this.error = null;
      this.internationalization = internationalization;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.name;
      this.onLoad;
      this.resources;
      this.state = DocumentPlugin.States.INITIALIZED;
      this.widget;
      this.widgetName;
      this.widgetOptions;
      
      this.constructChain.chain( this.loadResources, this.instantiateWidget, this.finalizeConstruction );
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "' started." );
      this.constructChain.callChain();
   },
   
   destroy: function(){
      if( this.resources ) this.resources.release();
      if( this.widget && this.widget.destroy && typeOf( this.widget.destroy ) == 'function' ) this.widget.destroy();
      this.state = DocumentPlugin.States.INITIALIZED;
   },
   
   loadResources: function(){
      if( this.resources ) this.resources.load();
      else this.constructChain.callChain();
   },
   
   onResourceError: function( error ){
      this.error = error;
   },
   
   onResourcesLoaded: function(){
      if( this.resources.isSuccess() ){
         this.state = DocumentPlugin.States.LOADED;
         this.fireEvent( 'resourcesLoaded', this );
         this.constructChain.callChain();
      }else {
         this.constructChain.clearChain();
         this.resources.release();
         this.fireEvent( 'constructionError', this.error );
      }
   },
   
   onWidgetConstructed: function(){
      this.constructChain.callChain();
   },
   
   onWidgetError: function( error ){
      this.error = error;
      this.constructChain.clearChain();
      this.fireEvent( 'constructionError', this.error );
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallResources();
      this.unmarshallWidget();
      this.state = DocumentPlugin.States.UNMARSHALLED;
   },

   //Properties
   getDefinitionElement: function() { return this.definitionElement; },
   getError: function() { return this.error; },
   getOnLoad: function() { return this.onLoad; },
   getResources: function() { return this.resources; },
   getState: function() { return this.state; },
   getWidget: function() { return this.widget; },
   getWidgetName: function() { return this.widgetName; },
   getWidgetOptions: function() { return this.widgetOptions; },
   isSuccess: function() { return this.error == null; },

   //Protected, pirvated helper methods
   finalizeConstruction: function(){
      this.constructChain.clearChain();
      this.state = DocumentPlugin.States.CONSTRUCTED;
      this.fireEvent( 'constructed', this );
   }.protect(),
   
   instantiateWidget: function(){
      if( this.widgetName ){
         try{
            var widgetClass = eval( this.widgetName );
            var mergedOptions = Object.merge( this.widgetOptions, { onConstructed : this.onWidgetConstructed, onError : this.onWidgetError } );
            this.widget = new widgetClass( mergedOptions, this.internationalization );
            this.widget.unmarshall();
            this.widget.construct();
         }catch( exception ){
            this.onWidgetError( exception );
         }
      }else this.onWidgetConstructed();
   }.protect(),
   
   unmarshallOptions: function(){
      var optionsElement = XmlResource.selectNode( this.options.optionsSelector, this.definitionElement );
      if( optionsElement ){
         var optionsResource = new OptionsResource( optionsElement );
         optionsResource.unmarshall();
         this.widgetOptions = optionsResource.getOptions();
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionElement );
   }.protect(),
   
   unmarshallResources: function() {
      var resourcesElement = XmlResource.selectNode( this.options.resourcesSelector, this.definitionElement );
      if( resourcesElement ){
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
         this.resources.unmarshall();
      }
   }.protect(),
   
   unmarshallWidget: function() {
      this.widgetName = XmlResource.selectNodeText( this.options.widgetNameSelector, this.definitionElement );
      this.unmarshallOptions();
   }
});

DocumentPlugin.States = { INITIALIZED : 0, UNMARSHALLED : 1, LOADED : 2, CONSTRUCTED : 3 };
/*
Name: FormElement

Description: Represents a composite constituent element of a SmartDocument which retrieves and presents data from a given data source.

Requires:
    - CompositeDocumentElement, DocumentElement

Provides:
    - FormElement

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




var FormElement = new Class({
   Extends: CompositeDataElement,
   
   options: {
      componentName : "FormElement",
      methodSelector : "method"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, dataXml, options );
      this.controlsContainerElement;
      this.fieldsContainerElement;
      this.method;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function( dataElementIndex ){
      this.unmarshallProperties();
      this.parent();
   },

   //Properties
   getMethod: function() { return this.method; },
   
   //Protected, private helper methods
   constructNestedElements : function(){
      this.parent( this.fieldsContainerElement );
   }.protect(),
   
   createHtmlElement : function(){
      this.htmlElement = this.elementFactory.createForm( this.id, this.method, this.contextElement, WidgetElementFactory.Positions.LastChild );
      this.controlsContainerElement = this.htmlElement.getChildren()[1];
      this.fieldsContainerElement = this.htmlElement.getChildren()[0];
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.method = this.resourceBundle.getText( XmlResource.determineAttributeValue( this.definitionElement, this.options.methodSelector ));
   }   
});
/*
Name: FormField

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - FormField

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




var FormField = new Class({
   Extends: DataElement,
   
   options: {
      componentName : "FormField",
      labelSelector: "label"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      this.parent( definitionElement, bundle, data, options );
      
      //Private variables
      this.elementFactory;
      this.label;
      this.labelElement;
      this.valueElement;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.parent();
   },

   //Properties
   getElementFactory: function() { return this.elementFactory; },
   getLabel: function() { return this.label; },
   getLabelElement: function() { return this.labelElement; },
   getValueElement: function() { return this.valueElement; },
   
   //Protected, private helper methods
   associateEditor: function(){
      if( this.isEditable() ){
         this.editor = DocumentElementEditorFactory.create( this, {} );
         this.editor.attach();
      }
      this.constructionChain.callChain();
   }.protect(),
   
   createHtmlElement : function(){
      this.htmlElement = this.elementFactory.createStaticRow( this.label, this.text, this.id, this.contextElement, WidgetElementFactory.Positions.LastChild );
      this.labelElement = this.htmlElement.getChildren( 'label' )[0];
      this.valueElement = this.htmlElement.getChildren( 'span' )[0];
      this.constructionChain.callChain();
   },
   
   unmarshallProperties: function(){
      this.label = this.resourceBundle.getText( XmlResource.determineAttributeValue( this.definitionElement, this.options.labelSelector ));
   }
});
/*
Name: MissingBindVariableException

Description: Thrown when a DataElement's 'bind' attribute doesn't contain one or more variables.

Requires:
   - WebUIExceptions

Provides:
   - MissgingVariableException

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



var MissingBindVariableException = new Class({
   Extends: WebUIException,
   options: {
      description: "Data element's: '{dataElementId}' 'bind' property doesn't contains any variables.",
      name: "MissingBindVariableException"
   },
   
   //Constructor
   initialize : function( dataElementId, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { dataElementId : dataElementId };
   }	
});
/*Name: SmartDocumentDescription: Represents a document of a Panel. Reads it's own structure and content from xml files and constructs HTML based on them.Requires:Provides:    - SmartDocumentPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors:     - Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*///= require_directory ../FundamentalTypes//= require ../AbstractDocument/AbstractDocument.jsvar SmartDocument = new Class({   Extends: AbstractDocument,   Binds : ['constructBody',             'constructFooter',             'constructHeader',             'destroyHeaderBodyAndFooter',            'determineContainerElement',             'loadResources',             'onBodyConstructed',             'onConstructionError',            'onFooterConstructed',             'onHeaderConstructed',            'onResourceError',            'onResourcesLoaded'],      options : {      componentName : "SmartDocument",      bodySelector : "documentBody",      footerSelector : "documentFooter",      headerSelector : "documentHeader",      rootElementName : "/smartDocumentDefinition"   },      //Constructor   initialize : function( i18Resource, options ) {      this.parent( i18Resource, options );      this.documentBody = null;      this.documentFooter = null;      this.documentHeader = null;   },   //Public accesors and mutators   construct: function(){      this.parent();   },      destroy: function() {      this.parent();   },      onBodyConstructed: function(){      this.constructionChain.callChain();   },      onFooterConstructed: function(){      this.state = AbstractDocument.States.CONSTRUCTED;      this.constructionChain.callChain();   },      onHeaderConstructed: function(){      this.constructionChain.callChain();   },      unmarshall: function(){      this.documentHeader = this.unmarshallDocumentComponent( this.options.rootElementName + "/" + this.options.headerSelector, { onConstructed : this.onHeaderConstructed, onConstructionError : this.onConstructionError } );      this.documentBody = this.unmarshallDocumentComponent( this.options.rootElementName + "/" + this.options.bodySelector, { onConstructed : this.onBodyConstructed, onConstructionError : this.onConstructionError } );      this.documentFooter = this.unmarshallDocumentComponent( this.options.rootElementName + "/" + this.options.footerSelector, { onConstructed : this.onFooterConstructed, onConstructionError : this.onConstructionError } );      this.parent();   },      //Properties   getBody: function() { return this.documentBody; },   getFooter: function() { return this.documentFooter; },   getHeader: function() { return this.documentHeader; },      //Protected, private helper methods   compileConstructionChain: function(){      this.constructionChain.chain(         this.determineContainerElement,         this.loadResources,         this.constructHeader,         this.constructBody,         this.constructFooter,         this.finalizeConstruction      );   }.protect(),      compileDestructionChain: function(){      this.destructionChain.chain(  this.destroyHeaderBodyAndFooter, this.releseResource, this.detachEditor, this.resetProperties, this.finalizeDestruction );   }.protect(),      constructBody : function(){      if( this.documentBody ) this.documentBody.construct( this.containerElement, 'bottom' );      else this.constructionChain.callChain();   }.protect(),      constructFooter: function(){      if( this.documentFooter ) this.documentFooter.construct( this.containerElement, 'bottom' );      else this.constructionChain.callChain();   }.protect(),      constructHeader: function(){      if( this.documentHeader ) this.documentHeader.construct( this.containerElement, 'bottom' );      else this.constructionChain.callChain();   }.protect(),      destroyHeaderBodyAndFooter: function(){      if( this.documentHeader ) this.documentHeader.destroy();      if( this.documentBody ) this.documentBody.destroy();      if( this.documentFooter ) this.documentFooter.destroy();      this.destructionChain.callChain();   }.protect(),      resetProperties: function(){      this.documentHeader = null;      this.documentBody = null;      this.documentFooter = null;      this.parent();   }.protect(),      revertConstruction: function(){      if( this.resources ) this.resources.release();      if( this.documentHeader ) this.documentHeader.destroy();      if( this.documentBody ) this.documentBody.destroy();      if( this.documentFooter ) this.documentFooter.destroy();      this.parent();   }.protect(),      unmarshallDocumentComponent: function( selector, options ){      var documentComponent = null;      var componentDefinition = this.documentDefinition.selectNode( selector );      if( componentDefinition ) documentComponent = DocumentElementFactory.create( componentDefinition, this.i18Resource, this.documentContent, options );      if( documentComponent ) documentComponent.unmarshall();      return documentComponent;   }.protect()   });
/*
Name: UnconfiguredDocumentElementException

Description: Thrown when a DocuementElement's method is invoked but the object isn't configure appropriatelly.

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



var UnconfiguredDocumentElementException = new Class({
   Extends: WebUIException,
   options: {
      description: "When calling method: '{methodName}' of a DocumentElement it should be in: '{statusName}' .",
      name: "UnconfiguredDocumentElementException"
   },
   
   //Constructor
   initialize : function( methodName, statusName, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { methodName : methodName, statusName : statusName };
   }	
});
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



var DuplicatedTabException = new Class({
   Extends: WebUIException,
   options: {
      description: "Tab name violates uniquness constraint.",
      name: "DuplicatedTabException",
      tabName: null
   },
   
   //Constructor
   initialize : function( options ){
      this.setOptions( options );
      this.parent( options );
   },
   
   //Properties
   getTabName: function() { return this.options.tabName; }
});
/*
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2012 Zsolt Zsuffa
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */



var Tab = new Class( {
   Implements : [Events, Options],
   Binds : ['onSelection'],

   options : {
      caption : null,
      captionSelector : "@caption",
      componentName : "Tab",
      currentTabId : "current",
      id : null,
      idPrefix : "tab_",
      idSelector : "@tabId",
      isDefaultSelector : "@isDefault",
      messagePropertiesSelector : "messageProperties",
      tabsStyle : "Tabs"},

   // Constructor
   initialize : function( definition, internationalization, options ) {
      // check parameter assertions
      assertThat( internationalization, not( nil() ));

      this.setOptions( options );

      // private instance variables
      this.active = false;
      this.anchorElement;
      this.caption = this.options.caption ? internationalization.getText( this.options.caption ) : null;
      this.defaultTab;
      this.definitionElement = definition;
      this.id = this.options.id;
      this.internationalization = internationalization;
      this.listItemElement;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageProperties;
      this.visible = false;
   },

   // public mutators methods
   activate : function() {
      if( this.isVisible() ){
         this.active = true;
         this.setListItemId( this.options.currentTabId );
      }
   },

   changeCaption : function( controller ) {
      this.caption = controller.getText( this.id );
      if( this.anchorElement != null && this.anchorText != null ){
         this.anchorElement.removeChild( this.anchorText );
         var nb_caption = caption.replace( / /g, String.fromCharCode( 160 ) );
         this.anchorText = document.createTextNode( nb_caption );
         this.anchorElement.appendChild( this.anchorText );
      }
   },

   construct : function( parentElement ) {
      assertThat( parentElement, not( nil() ));
      this.createHtmlElements( parentElement );
      this.visible = true;
   },

   deActivate : function() {
      if( this.isVisible() ){
         this.active = false;
         this.setListItemId( "" );
      }
   },

   destroy : function() {
      if( this.isVisible() ) this.removeLIElement();
      this.visible = false;
      this.active = false;
   },

   equals : function( otherTab ) {
      if( !instanceOf( otherTab, Tab ) ) return false;
      return this.id.equals( otherTab.id );
   },

   onSelection : function() {
      this.activate();
      this.fireEvent( 'tabSelected', this );
   },

   unmarshall : function() {
      this.unmarshallProperties();
   },

   // Properties
   getCaption : function() { return this.caption; },
   getId : function() { return this.id; },
   getMessageProperties: function() { return this.messageProperties; },
   isActive : function() { return this.active; },
   isDefault : function() { return this.defaultTab; },
   isVisible : function() { return this.visible; },

   // private helper methods
   createHtmlElements : function( parentElement ) {
      var nb_caption = this.caption.replace( / /g, String.fromCharCode( 160 ) );
      this.anchorElement = new Element( 'a', { 'id' : this.id, 'href' : '#', events : { click : this.onSelection }});
      this.anchorElement.appendText( nb_caption );

      this.listItemElement = new Element( 'li' );
      this.listItemElement.appendChild( this.anchorElement );

      parentElement.grab( this.listItemElement, 'bottom' );
      this.logger.trace( this.options.componentName + ".createHtmlElements added a 'LI' element to represent tab: " + this.id );
   }.protect(),

   removeLIElement : function() {
      if( this.listItemElement != null ){
         if( this.anchorElement.destroy ){
            this.anchorElement.removeEvents();
            this.anchorElement.destroy();
         }else this.anchorElement.removeNode();
         
         this.anchorElement = null;

         if( this.listItemElement.destroy ) this.listItemElement.destroy();
         else this.listItemElement.removeNode();
         this.listItemElement = null;
      }else throw new UnconfiguredWidgetException({ message : "Can't remove tab's parent LI element.", source : "Tab.removeLIElement" });
   }.protect(),

   setListItemId : function( listItemId ) {
      if( this.listItemElement != null ){
         this.listItemElement.set( 'id',  listItemId );
      }else
         throw new UnconfiguredWidgetException( { message : "Can't set undefined LI element's id.", source : "Tab.setListItemId" });
   }.protect(),

   unmarshallProperties : function() {
      this.id = this.options.idPrefix + XmlResource.selectNodeText( this.options.idSelector, this.definitionElement );
      this.caption = this.internationalization.getText( XmlResource.selectNodeText( this.options.captionSelector, this.definitionElement ));
      this.defaultTab = parseBoolean( XmlResource.selectNodeText( this.options.isDefaultSelector, this.definitionElement, null, false ) );
      this.messageProperties = XmlResource.selectNodeText( this.options.messagePropertiesSelector, this.definitionElement );
   }.protect()} );
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




var TabSelectedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      contextItemId : null,
      description: "A message about the event that a tab was selected.",
      documentContentURI: null,
      documentType: AbstractDocument.Types.SMART,
      documentURI: null,
      name: "TabSelectedMessage",
      tabId: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = TabSelectedMessage;
   },
   
   //Public accessors
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getContextItemId: function() { return this.options.contextItemId; },
   getDocumentContentURI: function() { return this.options.documentContentURI; },
   getDocumentType: function() { return this.options.documentType; },
   getDocumentURI: function() { return this.options.documentURI; },
   getId: function() { return this.options.tabId; }
});

/*
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2011 Joe Kueser, Zsolt
 * Zsuffa
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */




var TabWidget = new Class( {
   Extends : BrowserWidget,
   Binds : ['onClose', 'onTabSelected'],

   options : {
      TAB_LIST_STYLE : "Tabs",
      TAB_WIDGET_STYLE : "TabWidgetWrapper",
      BUTTONCLASSNAME : "Buttons",
      backgroundImage : "Images/bg.gif",
      buttonPrefix : "button_",
      closeButtonCaptionKey : "TabWidget.Close",
      componentName : "TabWidget",
      idDefault : "TabWidget",
      idSelector : "/pp:tabWidgetDefinition/tabWidget/@tabWidgetId",
      printButtonCaptionKey : "TabWidget.Print",
      selectedTabClassDefault : "selectedTab",
      selectedTabClassSelector : "/pp:tabWidgetDefinition/tabWidget/@selectedTabClass",
      showCloseButtonDefault : false,
      showCloseButtonSelector : "/pp:tabWidgetDefinition/tabWidget/@showCloseButton",
      showPrintButtonDefault : false,
      showPrintButtonSelector : "/pp:tabWidgetDefinition/tabWidget/@showPrintButton",
      tabCaptionSelector : "@caption",
      tabDefinitionSelector : "/pp:tabWidgetDefinition/tabWidget/tab",
      tabIdSelector : "@tabId",
      tabIsDefaultSelector : "@isDefault",
      tabLeftImage : "Images/DocumentTab-Left.gif",
      tabRightImage : "Images/DocumentTab-Right.gif",
      tabLeftOnImage : "Images/DocumentTab-Left-Selected.gif",
      tabRightOnImage : "Images/DocumentTab-Right-Selected.gif",
      tabsSelector : "tab",
      widgetContainerId : "TabWidget",
      widgetDefinitionSelector : "/pp:tabWidgetDefinition/tabWidget",
      widgetDefinitionURI : "TabsDefinition.xml"},

   // Constructor
   initialize : function( options, resourceBundle ) {
      this.setOptions( options );
      this.parent( options, resourceBundle );

      // Private instance variables
      this.activeTab = null;
      this.buttonsListElement;
      this.id;
      this.isVisible = false;
      this.selectedTabClass;
      this.showCloseButton;
      this.showPrintButton;
      this.tabListElement;
      this.tabs = new LinkedHashMap();
      this.tabsWrapperElement;
   },

   // Public accessor and mutator methods
   activateTab : function( tabName ) {
      if( this.activeTab != null ) this.activeTab.deActivate();
      
      var tabToActivate = this.tabs.get( tabName ); 
      tabToActivate.activate();
      this.activeTab = tabToActivate;
      this.storeComponentState();
      this.notifySubscribers();
   },

   addTab : function( id, caption, doNotActivate ) {
      if( this.state <= BrowserWidget.States.INITIALIZED ) throw new UnconfiguredWidgetException();
      if( this.tabs.get( id ) != null ) throw new DuplicatedTabException({ tabName : id });

      var newTab = new Tab( null, this.i18Resource, { id : id, caption : caption, onTabSelected : this.onTabSelected });
      this.tabs.put( newTab.getId(), newTab );
      if( this.state == BrowserWidget.States.CONSTRUCTED ) newTab.construct( this.tabListElement );

      if( doNotActivate == null || (doNotActivate != null && doNotActivate == false) )
         this.activateTab( id );
   },

   changeCaptions : function( controller ) {
      tabs.moveFirst();
      var aTab;
      while( aTab = tabs.getNext() ){
         if( aTab.changeCaption != null )
            aTab.changeCaption( controller );
      }
   },

   construct : function() {
      if( this.isVisible ) return;
      this.createHtmlElements();
      this.constructTabs();
      this.constructButtons();
      this.isVisible = true;
      this.parent();
      this.activateDefaultTab();
   },

   destroy : function() {
      if( this.tabListElement ){
         this.tabs.each( function( entry, index ) {
            entry.getValue().destroy();
         }, this );
         if( this.tabListElement.destroy ){
            this.tabListElement.removeEvents();
            this.tabListElement.destroy();
         }else this.tabListElement.removeNode();
      }
      
      if( this.tabsWrapperElement && this.tabsWrapperElement.destroy ) this.tabsWrapperElement.destroy();

      if( this.buttonsListElement ){
         if( this.buttonsListElement.destroy ){
            this.buttonsListElement.removeEvents();
            this.buttonsListElement.destroy();
         }else this.buttonsListElement.removeNode();
      }

      this.parent();
   },

   moveFirstToLast : function() {
      var tabList = null;
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ )
            if( tabLists[i].className == TAB_LIST_STYLE )
               tabList = tabLists[i];
      }
      if( tabList == null )
         return;
      var firstChild = tabList.firstChild;
      if( firstChild != null )
         tabList.appendChild( firstChild );
   },

   moveLastToFirst : function() {
      var tabList = null;
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ )
            if( tabLists[i].className == TAB_LIST_STYLE )
               tabList = tabLists[i];
      }
      if( tabList == null )
         return;
      var firstChild = tabList.firstChild;
      if( firstChild != null ){
         var lastChild = tabList.lastChild;
         if( firstChild != lastChild )
            tabList.insertBefore( lastChild, firstChild );
      }
   },

   onClose : function() {
      if( this.activeTab ){
         this.removeTab( this.activeTab.getId() );
      }
   },

   onPrint : function() {
   },

   onTabSelected : function( selectedTab ) {
      if( !selectedTab.getId().equals( this.activeTab.getId() ) ){
         this.activateTab( selectedTab.getId() );
      }
   },

   removeAllTabs : function() {
      this.tabs.each( function( entry, index ) {
         var tab = entry.getValue();
         tab.destroy();
      }, this );

      this.tabs.clear();
      this.activeTab = null;
   },

   removeTab : function( tabId ) {
      if( this.state <= BrowserWidget.States.INITIALIZED ) throw new UnconfiguredWidgetException();
      
      var nextTab = this.tabs.next( this.activeTab.getId() );
      var previousTab = this.tabs.previous( this.activeTab.getId() );

      if( nextTab != null && !nextTab.getId().equals( tabId )) this.activateTab( nextTab.getId() );
      else if( previousTab != null && !previousTab.getId().equals( tabId )) this.activateTab( previousTab.getId() );

      this.tabs.get( tabId ).destroy();
      this.tabs.remove( tabId );
      if( this.tabs.size() == 0 ) this.activeTab = null;
   },

   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallTabs();
      this.parent();
   },

   // Properties
   activeTabId : function() { return(tabs.getCountOfObjects() > 0 ? activeTab.getId() : "undefined"); },
   getActiveTab : function() { return this.activeTab; },
   getCloseButtonId : function() { return this.options.buttonPrefix + this.options.closeButtonCaptionKey; },
   getId : function() { return this.id; },
   getPrintButtonId : function() { return this.options.buttonPrefix + this.options.printButtonCaptionKey; },
   getSelectedTabClass : function() { return this.selectedTabClass; },
   getShowCloseButton : function() { return this.showCloseButton; },
   getShowPrintButton : function() { return this.showPrintButton; },
   getTabById : function( tabId ) { return this.tabs.get( tabId ); },
   getTabCount : function() { return this.tabs.size(); },
   getTabExist : function( tabId ) { return tabs.exists( tabId ); },
   getTabs : function() { return this.tabs; },
   isCloseButtonVisible : function() { return this.showCloseButton; },
   isPrintButtonVisible : function() { return this.showPrintButton; },
   setCloseButtonVisibility : function( value ) { this.options.showCloseButton = value; },
   setPrintButtonVisibility : function( value ) { this.options.showPrintButton = value; },
   setBackgroundImage : function( image ) { backgroundImage = (image == null ? backgroundImage : image); },
   setTabLefImage : function( image ) { tabLeftImage = (image == null ? tabLeftImage : image); },
   setTabRightImage : function( image ) { tabRightImage = (image == null ? tabRightImage : image); },
   setTabLeftOnImage : function( image ) { tabLeftOnImage = (image == null ? tabLeftOnImage : image); },
   setTabRightOnImage : function( image ) { tabRightOnImage = (image == null ? tabRightOnImage : image); },

   // Private methods
   activateDefaultTab : function(){
      if( this.activeTab ) this.activateTab( this.activeTab.getId() );
      else this.activateTab( this.tabs.get( this.tabs.firstKey() ).getId() );
   }.protect(),

   compileStateSpecification : function(){
      this.stateSpecification = { currentTabId : this.activeTab.getId() };
   }.protect(),
   
   constructButtons : function() {
      if( this.showCloseButton || this.showPrintButton ){
         this.buttonsListElement = this.elementFactory.create( 'ul', null, null, null, { 'class' : this.options.BUTTONCLASSNAME } );
         if( this.showCloseButton ) this.createButton( this.options.closeButtonCaptionKey, this.onClose );
         if( this.showPrintButton ) this.createButton( this.options.printButtonCaptionKey, this.onPrint );
      }
   }.protect(),

   constructTabs : function() {
      this.tabs.each( function( tabEntry, index ) {
         var tab = tabEntry.getValue();
         tab.construct( this.tabListElement );
      }, this );
   }.protect(),

   createButton : function( caption, onClickHandler ) {
      var listItem = this.elementFactory.create( 'li', null, this.buttonsListElement, WidgetElementFactory.Positions.LastChild );
      var anchorProperties = { href : "#", id : this.options.buttonPrefix + caption };
      this.elementFactory.createAnchor( caption.replace( / /g, String.fromCharCode( 160 ) ), null, onClickHandler, listItem, WidgetElementFactory.Positions.LastChild, anchorProperties );
   }.protect(),

   createHtmlElements : function() {
      this.tabsWrapperElement = this.elementFactory.create( 'div', null, null, null, { 'class' : this.options.TAB_WIDGET_STYLE } );
      this.tabListElement = this.elementFactory.create( 'ul', null, this.tabsWrapperElement, null, { 'class' : this.options.TAB_LIST_STYLE } );
   }.protect(),

   hideButtons : function() {
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ ){
            if( tabLists[i].className == BUTTONCLASSNAME ){
               var tabList = tabLists[i];
               htmlDivElement.removeChild( tabList ); // removes the list to
                                                      // 'tab' division
            }
         }
      }else
         throw new UserException( "Division not defined", "TabWidget._RemoveUnorderedListTag()" );
   }.protect(),
   
   notifySubscribers : function(){
      var argumentText = this.activeTab.getMessageProperties();
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : {};
      arguments['originator'] = this.options.componentName;
      arguments['tabId'] = this.activeTab.getId();
      
      var tabSelectedMessage = new TabSelectedMessage( arguments );
      this.messageBus.notifySubscribers( tabSelectedMessage );
      
   }.protect(),

   parseStateSpecification: function(){
      if( this.stateSpecification ){
         this.currentItemId = this.stateSpecification['currentTabId'];
      }
   }.protect(),
   
   removeUnorderedListTag : function() {
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ ){
            if( tabLists[i].className == this.options.TAB_LIST_STYLE ){
               var tabList = tabLists[i];
               htmlDivElement.removeChild( tabList ); // removes the list to
                                                      // 'tab' division
            }
         }
      }else
         throw new UserException( "Division not defined", "TabWidget._RemoveUnorderedListTag()" );
   }.protect(),
   
   saveComponentState : function( delimiter ) {
      var save = "";
      if( this.activeTab != null )
         save = save + delimiter + this.activeTab.caption;
      else
         save = save + delimiter + "null";
      for( var i = 1; i <= this.tabs.getCountOfObjects(); i++ ){
         var atab = this.tabs.getItemByIndex( i - 1 );
         save = save + delimiter + atab.caption + delimiter + atab.state + delimiter + atab.id;
      }
      return save;
   }.protect(),
   
   unmarshallProperties: function(){
      this.id = this.definitionXml.selectNodeText( this.options.idSelector, null, this.options.idDefault );
      this.selectedTabClass = this.definitionXml.selectNodeText( this.options.selectedTabClassSelector, null, this.options.selectedTabClassDefault );
      this.showCloseButton = parseBoolean( this.definitionXml.selectNodeText( this.options.showCloseButtonSelector, null, this.options.showCloseButtonDefault ));
      this.showPrintButton = parseBoolean( this.definitionXml.selectNodeText( this.options.showCloseButtonSelector, null, this.options.showCloseButtonDefault ));
   }.protect(),

   unmarshallTabs : function() {
      var tabDefinitions = this.definitionXml.selectNodes( this.options.tabDefinitionSelector );
      tabDefinitions.each( function( tabDefinition, index ){
         var newTab = new Tab( tabDefinition, this.i18Resource, { onTabSelected : this.onTabSelected });
         newTab.unmarshall();
         this.tabs.put( newTab.getId(), newTab );
         if( newTab.isDefault() ) this.activeTab = newTab;
      }, this );
   }.protect(),

});
/*
Name: 
    - MooEditableDialog

Description: 
    - Mediates user interactions between MooEditable and ProcessPuzzleUI. 

Requires:
    - 
    
Provides:
    - MooEditableDialog

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



var MooEditableDialog = new Class({
   Implements: [Options],
   Binds: ['open'],
   options : {
      action : null,
      componentName : "MooEditableDialog",
      notification : null,
      windowName : null
   },

   //Constructor
   initialize: function( editor, options ){
      this.setOptions( options );
      
      //Private attributes
      this.editor = editor;
      this.name;
   },
   
   //Public accessor and mutator methods
   open: function(){
      switch( this.options.action ){
      case DesktopWindow.Activity.SHOW_NOTIFICATION:
         this.editor.showNotification( this.options.notification ); break;
      case DesktopWindow.Activity.SHOW_WINDOW:
         this.editor.showWindow( this.options.windowName ); break;
      }
   },
   
   prompt: function(){
      this.editor.showNotification( this.options.windowName );
   },
   
   //Properties
   isCollapsed: function() { return false; },
   
   //Protected and private helper methods
});
//WebUIConfiguration.js
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




var WebUIConfiguration = new Class({
   Implements: [Class.Singleton, Options], 
   options: {
	  appenderBatchSizeSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@batchSize | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@batchSize | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@batchSize | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@batchSize",
	  appenderCommandLineObjectExpansionDepthSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth",
	  appenderComplainAboutPopUpBlockingSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@complainAboutPopUpBlocking | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@complainAboutPopUpBlocking | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@complainAboutPopUpBlocking | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@complainAboutPopUpBlocking",
      appenderContainerElementIdSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@containerElementId | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@containerElementId | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@containerElementId | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@containerElementId",
	  appenderFailCallbackSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@failCallback | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@failCallback | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@failCallback | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@failCallback",
	  appenderFocusPopUpSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@focusPopUp | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@focusPopUp | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@focusPopUp | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@focusPopUp",
      appenderHeightSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@height | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@height | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@height | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@height",
      appenderInitiallyMinimizedSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@initiallyMinimized | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@initiallyMinimized | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@initiallyMinimized | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@initiallyMinimized",
      appenderLayoutSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@layoutReference | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@layoutReference | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@layoutReference | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@layoutReference",
      appenderLazyInitSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@lazyInit | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@lazyInit | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@lazyInit | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@lazyInit",
      appenderMaxMessagesSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@maxMessages | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@maxMessages | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@maxMessages | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@maxMessages",
      appenderNameSelector : "@name",
      appenderNewestMessageAtTopSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@newestMessageAtTop | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@newestMessageAtTop | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@newestMessageAtTop | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@newestMessageAtTop",
      appenderPostVariableNameSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@postVariableName | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@postVariableName | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@postVariableName | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@postVariableName",
      appenderReopenWhenClosedSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@reopenWhenClosed | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@reopenWhenClosed | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@reopenWhenClosed | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@reopenWhenClosed",
      appenderRequestSuccessCallbackSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@requestSuccessCallback | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@requestSuccessCallback | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@requestSuccessCallback | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@requestSuccessCallback",
      appenderScrollToLatestMessageSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@scrollToLatestMessage | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@scrollToLatestMessage | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@scrollToLatestMessage | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@scrollToLatestMessage",
      appenderShowCommandLineSelector : "wui:appenders/ajaxAppender[@name='{appenderName}']/@showCommandLine | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@showCommandLine | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@showCommandLine | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@showCommandLine",
      appenderSendAllOnUnloadSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@sendAllOnUnload | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@sendAllOnUnload | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@sendAllOnUnload | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@sendAllOnUnload",
      appenderTimedSendingSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@timedSending | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@timedSending | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@timedSending | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@timedSending",
      appenderTimerIntervalSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@timerInterval | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@timerInterval | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@timerInterval | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@timerInterval",
      appenderThresholdSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@threshold | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@threshold | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@threshold | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@threshold",
      appenderTypeSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}'] | wui:appenders/wui:popUpAppender[@name='{appenderName}'] | wui:appenders/wui:inPageAppender[@name='{appenderName}'] | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']",
      appenderURLSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@url | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@url | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@url | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@url",
      appenderUseDocumentWriteSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@useDocumentWrite | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@useDocumentWrite | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@useDocumentWrite | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@useDocumentWrite",
      appenderUseOldPopUpSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@useOldPopUp | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@useOldPopUp | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@useOldPopUp | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@useOldPopUp",
      appenderWaitForResponseSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@waitForResponse | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@waitForResponse | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@waitForResponse | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@waitForResponse",
      appenderWidthSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@width | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@width | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@width | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@width",
      availableSkinElementsSelector : "wui:desktop/wui:availableSkins/wui:skin",
      defaultSkinSelector : "wui:desktop/wui:defaultSkin/@name",
      desktopConfigurationURISelector : "/pp:processPuzzleConfiguration/wui:webUI/wui:desktop/@configurationURI",
      i18DefaultLocaleSelector : "in:defaultLocale/text()",
      i18ElementSelector : "/pp:processPuzzleConfiguration/in:internationalization",
      i18LocaleSelector : "text()",
      i18LocaleElementsSelector : "in:availableLocales/in:locale",
      i18ResourceBundleElementsSelector : "in:resouceBundles/in:resourceBundle",
      i18ResourceBundleNameSelector : "text()",
      i18ResourceBundleNameSpaceSelector : "in:resouceBundles/@nameSpace",
      layoutElementsSelector : "wui:logging/wui:layouts/wui:patternLayout | wui:logging/wui:layouts/wui:xmlLayout",
      layoutNameSelector : "@name",
      layoutPatternSelector : "wui:layouts/wui:patternLayout[@name='{layoutName}']/@pattern | wui:layouts/wui:xmlLayout[@name='{layoutName}']/@pattern",
      loggerAppenderLayoutSelector : "wui:appender/@layout",
      loggerAppenderLevelSelector : "wui:appender/@level",
      loggerAppenderReferenceSelector : "wui:loggers/wui:logger[@name='{loggerName}']/wui:appenderReference/@name",
      loggerAppendersSelector : "wui:logging/wui:appenders/wui:ajaxAppender | wui:logging/wui:appenders/wui:popUpAppender | wui:logging/wui:appenders/wui:inPageAppender | wui:logging/wui:appenders/wui:browserConsoleAppender",
      loggerAppenderTypeSelector : "wui:appender/@type",
      loggerElementsSelector : "wui:logging/wui:loggers/wui:logger",
      loggerLayoutPatternSelector : "wui:layout/@pattern",
      loggerLayoutTypeSelector : "wui:layout/@type",
      loggerLevelSelector : "wui:loggers/wui:logger[@name='{loggerName}']/@level",
      loggerNameSelector : "@name",
      loggerIsDefaultSelector : "wui:loggers/wui:logger[@name='{loggerName}']/@isDefault",
      loggingSelector : "/pp:processPuzzleConfiguration/wui:webUI/wui:logging",
      menuDefinitionURISelector : "/pp:processPuzzleConfiguration/wui:webUI/wui:desktop/wui:menu/@definitionURI",
      nameSpaces: "xmlns:pp='http://www.processpuzzle.com' xmlns:ac='http://www.processpuzzle.com/ApplicationConfiguration' xmlns:bc='http://www.processpuzzle.com/BeanContainerConfiguration' xmlns:bd='http://www.processpuzzle.com/BusinessDefinitionsConfiguration' xmlns:bi='http://www.processpuzzle.com/BusinessImplementationsConfiguration' xmlns:dl='http://www.processpuzzle.com/DataLoadersConfiguration' xmlns:em='http://www.processpuzzle.com/EmailConfiguration' xmlns:fc='http://www.processpuzzle.com/FrontControllerConfiguration' xmlns:in='http://www.processpuzzle.com/InternationalizationConfiguration' xmlns:pr='http://www.processpuzzle.com/PersistenceConfiguration' xmlns:rt='http://www.processpuzzle.com/RuntimeConfiguration' xmlns:wui='http://www.processpuzzle.com/WebUIConfiguration'", 
      resourceBundleNameSpaceSelector : "xmlns:pp='http://www.processpuzzle.com'",
      skinConfigurationSelector : "wui:desktop/wui:availableSkins/wui:skin[@name='{skinName}']/@configurationURI",
      skinNameAttributeSelector : "@name",
      skinPathSelector : "wui:desktop/wui:availableSkins/wui:skin[@name='{skinName}']/@relativePath",
      skinPathAttributeSelector : "@relativePath",
      webUIElementSelector : "/pp:processPuzzleConfiguration/wui:webUI"
   },
   
   //Constructor
   initialize: function( configurationURI, options ) { return this.check() || this.setUp( configurationURI, options ); },
   setUp : function( configurationURI, options ) {
      this.setOptions( options );
      
      //Private instance variables
      this.availableLocales = new ArrayList();
      this.configurationURI = configurationURI;
      this.i18Element = null;
      this.isLoaded = false;
      this.loggingElement = null;
      this.xmlResource = null;
      this.webUIElement = null;
      
      this.load();
      this.determineAvailableLocales();
   },
   
   load : function(){
      if( this.isLoaded ) this.release();

      this.xmlResource = new XmlResource( this.configurationURI, { nameSpaces : this.options.nameSpaces } );
      this.i18Element = this.xmlResource.selectNode( this.options.i18ElementSelector );
      this.loggingElement = this.xmlResource.selectNode( this.options.loggingSelector );
      this.webUIElement = this.xmlResource.selectNode( this.options.webUIElementSelector );
         
      this.isLoaded = true;
   },
   
   release : function(){
      if( this.isLoaded ){
         this.i18Element = null;
         this.loggingElement = null;
         this.xmlResource = null;
         this.webUIElement = null;
         this.isLoaded = false;
      }
   },
   
   //Public mutators and accessors
   getAvailableLocales : function() { return this.availableLocales; },
   getAvailableSkinElements : function() {return this.xmlResource.selectNodes( this.options.availableSkinElementsSelector, this.webUIElement );},
   getConfigurationElement : function() { return this.webUIElement; },
   getDefaultSkin : function() { return this.xmlResource.selectNode( this.options.defaultSkinSelector, this.webUIElement ).nodeValue; },
   getI18DefaultLocale : function() { return this.xmlResource.selectNode( this.options.i18DefaultLocaleSelector, this.i18Element ).nodeValue; },
   getI18Element : function() { return this.i18Element; },
   getI18Locale : function( localeIndex ){
      return this.xmlResource.selectNode( this.options.i18LocaleSelector, this.getI18LocaleElements()[localeIndex] ).nodeValue;
   },
   
   getI18LocaleElements : function() {return this.xmlResource.selectNodes( this.options.i18LocaleElementsSelector, this.i18Element );},
   getI18ResourceBundleElements : function() { return this.xmlResource.selectNodes( this.options.i18ResourceBundleElementsSelector, this.i18Element ); },
   
   getI18ResourceBundleName : function( resourceBundleIndex ){
      return this.xmlResource.selectNode( this.options.i18ResourceBundleNameSelector, this.getI18ResourceBundleElements()[resourceBundleIndex] ).nodeValue;
   },
   
   getI18ResourceBundleNameSpace : function() {
      return this.xmlResource.selectNode( this.options.i18ResourceBundleNameSpaceSelector, this.i18Element ).value;
   },
   
   getLoggerAppenderElement : function() {
      return this.xmlResource.selectNode( this.options.loggerAppenderSelector, this.webUIElement );
   },
   
   getLoggerAppenderType : function() { 
      return this.xmlResource.selectNode( this.options.loggerAppenderTypeSelector, this.loggingElement ).value;
   },
   
   getLoggerElements : function() {
      return this.xmlResource.selectNodes( this.options.loggerElementsSelector, this.webUIElement );
   },
   
   getLoggerLayoutElement : function() { 
      return this.xmlResource.selectNode( this.options.loggerLayoutSelector, this.loggingElement );
   },
   
   getLoggerLayoutPattern : function() { 
      return this.xmlResource.selectNode( this.options.loggerLayoutPatternSelector, this.loggingElement ).value;
   },
   
   getLoggerLayoutType : function() { 
      return this.xmlResource.selectNode( this.options.loggerLayoutTypeSelector, this.loggingElement ).value;
   },
   
   getLoggerLevel : function( loggerName ) {
      var selectorExp = this.options.loggerLevelSelector.substitute( {loggerName : loggerName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggerName : function( loggerIndex ) {
      var loggerElements = this.getLoggerElements();
      return this.xmlResource.selectNode( this.options.loggerNameSelector, loggerElements[loggerIndex] ).value;
   },

   getLoggingAppenderBatchSize : function( appenderName ) {
      var selectorExp = this.options.appenderBatchSizeSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
   
   getLoggingAppenderCommandLineObjectExpansionDepth : function( appenderName ) {
      var selectorExp = this.options.appenderCommandLineObjectExpansionDepthSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },
   
   getLoggingAppenderComplainAboutPopUpBlocking : function( appenderName ) {
      return this.determineLoggingElementValue( this.options.appenderComplainAboutPopUpBlockingSelector.substitute( {appenderName : appenderName} ) );
   },

   getLoggingAppenderContainerElementId : function( appenderName ) {
      return this.determineLoggingElementValue( this.options.appenderContainerElementIdSelector.substitute( {appenderName : appenderName} ) );
   },

   getLoggingAppenderElements : function() {
      return this.xmlResource.selectNodes( this.options.loggerAppendersSelector, this.webUIElement );
   },

   getLoggingAppenderFailCallback : function( appenderName ) {
      var selectorExp = this.options.appenderFailCallbackSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
   
   getLoggingAppenderFocusPopUp : function( appenderName ) {
      var selectorExp = this.options.appenderFocusPopUpSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderHeight : function( appenderName ) {
      return parseInt( this.determineLoggingElementValue( this.options.appenderHeightSelector.substitute( {appenderName : appenderName} )));
   },

   getLoggingAppenderInitiallyMinimized : function( appenderName ) {
      var configurationValue = this.determineLoggingElementValue( this.options.appenderInitiallyMinimizedSelector.substitute( {appenderName : appenderName} ));
      return new Boolean().parseBoolean( configurationValue );
   },

   getLoggingAppenderLazyInit : function( appenderName ) {
      var selectorExp = this.options.appenderLazyInitSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderLayoutReference : function( appenderName ) { 
      var selectorExp = this.options.appenderLayoutSelector.substitute( {appenderName : appenderName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggingAppenderMaxMessages : function( appenderName ) {
      var selectorExp = this.options.appenderMaxMessagesSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderName : function( appenderIndex ) {
      var appenderElements = this.getLoggingAppenderElements();
      return this.xmlResource.selectNode( this.options.appenderNameSelector, appenderElements[appenderIndex] ).value;
   },

   getLoggingAppenderNewestMessageAtTop : function( appenderName ) {
      var selectorExp = this.options.appenderNewestMessageAtTopSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderPostVariableName : function( appenderName ) {
      var selectorExp = this.options.appenderPostVariableNameSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},

   getLoggingAppenderReopenWhenClosed : function( appenderName ) {
      var selectorExp = this.options.appenderReopenWhenClosedSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderRequestSuccessCallback : function( appenderName ) {
      var selectorExp = this.options.appenderRequestSuccessCallbackSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
	
   getLoggingAppenderScrollToLatestMessage : function( appenderName ) {
      var selectorExp = this.options.appenderScrollToLatestMessageSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderSendAllOnUnload : function( appenderName ) {
      var selectorExp = this.options.appenderSendAllOnUnloadSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderShowCommandLine : function( appenderName ) {
      var selectorExp = this.options.appenderShowCommandLineSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderThreshold : function( appenderName ) { 
      return this.determineLoggingElementValue( this.options.appenderThresholdSelector.substitute( {appenderName : appenderName} ));
   },
   
   getLoggingAppenderTimedSending : function( appenderName ) {
      var selectorExp = this.options.appenderTimedSendingSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},

   getLoggingAppenderTimerInterval : function( appenderName ) {
      var selectorExp = this.options.appenderTimerIntervalSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},

   getLoggingAppenderType : function( appenderName ) {
      var selectorExp = this.options.appenderTypeSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.nodeName;
      else return null;
   },
   
	getLoggingAppenderURL : function( appenderName ) {
      var selectorExp = this.options.appenderURLSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderUseDocumentWrite : function( appenderName ) {
      return this.determineLoggingElementValue( this.options.appenderUseDocumentWriteSelector.substitute( {appenderName : appenderName} ) );
   },

   getLoggingAppenderUseOldPopUp : function( appenderName ) {
      var selectorExp = this.options.appenderUseOldPopUpSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderWaitForResponse : function( appenderName ) {
      var selectorExp = this.options.appenderWaitForResponseSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
   
   getLoggingAppenderWidth : function( appenderName ) {
      return parseInt( this.determineLoggingElementValue( this.options.appenderWidthSelector.substitute( {appenderName : appenderName} )));
   },

	getLoggingLayoutName : function( layoutIndex ) {
      var layoutElements = this.getLoggingLayoutElements();
      return this.xmlResource.selectNode( this.options.layoutNameSelector, layoutElements[layoutIndex] ).value;
   },
   
   getLoggingLayoutElements : function() {
      return this.xmlResource.selectNodes( this.options.layoutElementsSelector, this.webUIElement );
   },
   
   getLoggingLayoutPattern : function( layoutName ) { 
      var selectorExp = this.options.layoutPatternSelector.substitute( {layoutName : layoutName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggingLoggerAppenderReference : function( loggerName ) {
      var selectorExp = this.options.loggerAppenderReferenceSelector.substitute( {loggerName : loggerName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggingLoggerIsDefault : function( loggerName ) {
      return this.determineLoggingElementValue( this.options.loggerIsDefaultSelector.substitute( {loggerName : loggerName} ));
   },
   
   getMenuDefinitionURI : function() { return this.xmlResource.selectNode( this.options.menuDefinitionURISelector ).nodeValue; },
   
   getSkinConfiguration : function( skinName ) {
      var selectorExp = this.options.skinConfigurationSelector.substitute( {skinName : skinName} );
      return this.xmlResource.selectNode( selectorExp, this.webUIElement ).value;
   },
      
   getSkinNameByIndex : function( skinIndex ) {
      var skinElements = this.getAvailableSkinElements();
      return this.xmlResource.selectNode( this.options.skinNameAttributeSelector, skinElements[skinIndex] ).value;
   },
      
   getSkinPath : function( skinName ) {
      var selectorExp = this.options.skinPathSelector.substitute( {skinName : skinName} );
      return this.xmlResource.selectNode( selectorExp, this.webUIElement ).value;
   },
      
   getSkinPathByIndex : function( skinIndex ) {
      var skinElements = this.getAvailableSkinElements();
      return this.xmlResource.selectNode( this.options.skinPathAttributeSelector, skinElements[skinIndex] ).value;
   },
   
   isSupportedLocale: function( localeInQuestion ){
      var isSupported = false;
      this.availableLocales.each( function( locale, index ){
         if( localeInQuestion.equals( locale )) isSupported = true;
      }.bind( this ));
      return isSupported;
   },
      
   //Private helper methods
   determineAvailableLocales : function(){
      for( var i = 0; i < this.getI18LocaleElements().length; i++ ) {
         var i18LocaleText = this.getI18Locale( i );
         var locale = new Locale();
         locale.parse( i18LocaleText );
         this.availableLocales.add( locale );
      }
   }.protect(),
   
   determineLoggingElementValue : function( selectorExp ) {
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   } 
});

SYSTEM_WINDOWS = { 
   ABOUT : 'about',
   DOCUMENT_EXPLORER : 'documentExplorer'
};
/*
Name: 
    - TextAreaEditor

Description: 
    - Provides text editing features for text areas. The edited area can be a whole HTML document or just a text area component of a SmartDocument. 

Requires:
    - MooEditable, DocumentEditor
    
Provides:
    - TextAreaEditor

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





var TextAreaEditor = new Class({
   Extends: DocumentEditor,
   Binds: ['onDocumentSelectedMessage', 'onEditorClick', 'onMooEditableAttach'],
   options : {
      componentName : "TextAreaEditor",
      createLinkAlert : "selectionNeeded",
      createLinkPromt : SYSTEM_WINDOWS.DOCUMENT_EXPLORER,
      dimensions : { x : 500, y : 100 },
      numberOfColumns : 120,
      numberOfRows : 50,
      urlImagePromt : SYSTEM_WINDOWS.DOCUMENT_EXPLORER,
   },

   //Constructor
   initialize: function( internationalization, options ){
      this.parent( internationalization, options );
      
      //Private attributes
      this.initialContent;
      this.mooEditable;
   },
   
   //Public accessor and mutator methods
   attach: function( subjectElement, initialContent ){
      this.initialContent = initialContent;
      this.parent( subjectElement );
   },
   
   detach: function(){
      this.mooEditable.detach();
      this.parent();
   },
   
   onContainerResize: function( newSize ){
      this.mooEditable.onContainerResize( newSize );
   },
   
   onDocumentSelectedMessage: function( webUIMessage ){
      this.mooEditable.execute( 'createlink', null, webUIMessage.getDocumentURI() );
   },
   
   onEditorClick: function( event, editor ){
      var subjectElement = event.target;
      
      if( subjectElement.get( 'tag' ).toUpperCase() != 'A' && subjectElement.getParent().get( 'tag' ).toUpperCase() == 'A' ){
         subjectElement = subjectElement.getParent();
      }
      
      if( subjectElement.get( 'tag' ).toUpperCase() == 'A' ){
         if( subjectElement.get( 'onclick' ) ){
            eval( subjectElement.get( 'onclick' ));
         }else if( subjectElement.get( 'href' )){
            document.location.href = subjectElement.get( 'href' );
         }
      }
   },
   
   onMooEditableAttach: function(){
      this.attachChain.callChain();
   },
   
   textAddImage: function(){ this.mooEditable.action( 'urlimage', [] ); },
   textAddLink: function(){ this.mooEditable.action( 'createlink', [] ); },
   textAlignCenter: function(){ this.mooEditable.action( 'justifycenter', [] ); },
   textAlignLeft: function(){ this.mooEditable.action( 'justifyleft', [] ); },
   textAlignJustify: function(){ this.mooEditable.action( 'justifyfull', [] ); },
   textAlignRight: function(){ this.mooEditable.action( 'justifyright', [] ); },
   textBold: function(){ this.mooEditable.action( 'bold', [] ); },
   textIndent: function(){ this.mooEditable.action( 'indent', [] ); },
   textItalic: function(){ this.mooEditable.action( 'italic', [] ); },
   textOrderedList: function(){ this.mooEditable.action( 'insertorderedlist', [] ); },
   textOutdent: function(){ this.mooEditable.action( 'outdent', [] ); },
   textRedo: function(){ this.mooEditable.action( 'redo', [] ); },
   textRemoveLink: function(){ this.mooEditable.action( 'unlink', [] ); },
   textStrikethrough: function(){ this.mooEditable.action( 'strikethrough', [] ); },
   textToggleView: function(){ this.mooEditable.action( 'toggleview', [] ); },
   textUnderline: function(){ this.mooEditable.action( 'underline', [] ); },
   textUndo: function(){ this.mooEditable.action( 'undo', [] ); },
   textUnorderedList: function(){ this.mooEditable.action( 'insertunorderedlist', [] ); },
   
   //Properties
   getMooEditable: function() { return this.mooEditable; },
   
   //Protected and private helper methods   
   defineDialogWindows: function(){
      MooEditable.Actions.createlink.dialogs.alert = function( callerObject ) { 
         return new MooEditableDialog( this, { action : DesktopWindow.Activity.SHOW_NOTIFICATION, notification : this.options.createLinkAlert }); 
      }.bind( this );
      
      MooEditable.Actions.createlink.dialogs.prompt = function(  callerObject ) { 
         return new MooEditableDialog( this, { action : DesktopWindow.Activity.SHOW_WINDOW, windowName : this.options.createLinkPromt }); 
      }.bind( this );
      
      MooEditable.Actions.urlimage.dialogs.prompt = function( callerObject ) { 
         return new MooEditableDialog( this, {  action : DesktopWindow.Activity.SHOW_WINDOW, windowName : this.options.urlImagePromt }); 
      }.bind( this );
   }.protect(),
   
   instantiateTools: function(){
      this.defineDialogWindows();
      var styleSheetLinks = "";
      this.styleSheets.each( function( styleSheetUri, index ){
         styleSheetLinks += "<link rel='stylesheet' type='text/css' href='" + styleSheetUri + "'>";
      }, this );
      
      this.mooEditable = new MooEditable( this.subjectElement, { 
         externalCSS : styleSheetLinks,
         handleDialogs : false, 
         handleLabel : false, 
         handleSubmit : false,
         onAttach: this.onMooEditableAttach,
         onEditorClick : this.onEditorClick,
         toolbar : false
      });
   }.protect(),
});
/*
Name: 
    - ToolBarButton

Description: 
    - Represents a button in a toolbar. It's a component of a ToolBar. 

Requires:

Provides:
    - ToolBarButton

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



var ToolBarButton = new Class({
   Implements : [Events, Options],
   Binds: ['onSelection'],
   
   options : {
      buttonStyle : "toolBarButton",
      captionSelector : "caption",
      iconImageSelector : "iconImage",
      messagePropertiesSelector : "messageProperties",
      nameSelector : "@name",
      showCaption : false,
      toolTipStyle : "toolBarToolTip"
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.setOptions( options );
      this.anchorElement;
      this.definitionXml = definition;
      this.caption;
      this.factory = elementFactory;
      this.iconImageUri;
      this.imageElement;
      this.listItemElement;
      this.messageProperties;
      this.name = new Date().getTime();
      this.parentElement;
      this.spanElement;
      this.state = ToolBarButton.States.INITIALIZED;
      this.toolTipElement;
   },
   
   //Public accessor and mutator methods
   construct: function( parentElement ){
      assertThat( parentElement, not( nil() ));
      this.parentElement = parentElement;
      this.instantiateHtmlElements();
      this.state = ToolBarButton.States.CONSTRUCTED;
   },
   
   destroy: function(){
      if( this.toolTipElement && this.toolTipElement.destroy ) this.toolTipElement.destroy();
      if( this.imageElement && this.imageElement.destroy ) this.imageElement.destroy();
      if( this.spanElement && this.spanElement.destroy ) this.spanElement.destroy();
      if( this.anchorElement && this.anchorElement.destroy ) this.anchorElement.destroy();
      if( this.listItemElement && this.listItemElement.destroy ) this.listItemElement.destroy();
      this.state = ToolBarButton.States.INITIALIZED;
   },
   
   onSelection: function(){
      this.fireEvent( 'onSelection', this );
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = ToolBarButton.States.UNMARSHALLED;
   },
   
   //Properties
   getCaption: function() { return this.caption; },
   getIconImage: function() { return this.iconImageUri; },
   getMessageProperties: function() { return this.messageProperties; },
   getName: function() { return this.name; },
   getParentElement: function() { return this.parentElement; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   instantiateHtmlElements: function(){
      var buttonTitle = this.options.showCaption ? this.caption : "";
      this.listItemElement = this.factory.create( 'li', null, this.parentElement, WidgetElementFactory.Positions.lastChild, { id : this.name } );
      this.anchorElement = this.factory.createAnchor( buttonTitle, null, this.onSelection, this.listItemElement, WidgetElementFactory.Positions.lastChild );
      this.spanElement = this.factory.create( 'span', null, this.anchorElement, WidgetElementFactory.Positions.lastChild, { 'class' : this.options.buttonStyle });
      this.imageElement = this.factory.create( 'img', null, this.spanElement, WidgetElementFactory.Positions.lastChild, { src : this.iconImageUri, alt : buttonTitle });
      this.toolTipElement = this.factory.create( 'span', this.caption, this.anchorElement, WidgetElementFactory.Positions.lastChild, { 'class' : this.options.toolTipStyle });
   },
   
   unmarshallProperties: function(){
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.definitionXml );
      this.iconImageUri = XmlResource.selectNodeText( this.options.iconImageSelector, this.definitionXml );
      this.messageProperties = XmlResource.selectNodeText( this.options.messagePropertiesSelector, this.definitionXml );
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
   }.protect(),
});

ToolBarButton.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
/*
Name: ToolBarButtonFactory

Description: Instantiates a new subclass of ToolBarButton according to the given XML element.

Requires:

Provides:
    - ToolBarButtonFactory

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



var ToolBarButtonFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, htmlElementFactory, options ){
      var newButton;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "DIVIDER": 
         newButton = new ToolBarDivider( definitionXmlElement, htmlElementFactory, options ); break;
      case "BUTTON":
      default:
         newButton = new ToolBarButton( definitionXmlElement, htmlElementFactory, options ); break;
      }
      
      return newButton;
   }
});

ToolBarButtonFactory.create = function(  definitionXmlElement, htmlElementFactory, options ){
   var factory = new ToolBarButtonFactory();
   var button = factory.create( definitionXmlElement, htmlElementFactory, options );
   return button;
};
/*
Name: 
    - ToolBarDivider

Description: 
    - Represents a divider in a tool bar. It's a component of a ToolBar. 

Requires:

Provides:
    - ToolBarDivider

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



var ToolBarDivider = new Class({
   Implements : Options,
   
   options : {
      dividerStyle : "toolBarDivider",
      iconImageSelector : "iconImage",
      dividerIconImageUri : "Desktops/Images/ToolboxDivider.jpg",
      namePrefix : "divider_"
   },

   //Constructor
   initialize: function( definition, elementFactory, options ){
      this.setOptions( options );
      this.definitionXml = definition;
      this.factory = elementFactory;
      this.dividerIconImageUri;
      this.imageElement;
      this.listItemElement;
      this.name = UniqueId.generate( this.options.namePrefix );
      this.parentElement;
      this.state = ToolBarButton.States.INITIALIZED;
      this.toolTipElement;
   },
   
   //Public accessor and mutator methods
   construct: function( parentElement ){
      assertThat( parentElement, not( nil() ));
      this.parentElement = parentElement;
      this.instantiateHtmlElements();
      this.state = ToolBarButton.States.CONSTRUCTED;
   },
   
   destroy: function(){
      if( this.imageElement && this.imageElement.destroy ) this.imageElement.destroy();
      if( this.spanElement && this.spanElement.destroy ) this.spanElement.destroy();
      if( this.listItemElement && this.listItemElement.destroy ) this.listItemElement.destroy();
      this.state = ToolBarButton.States.INITIALIZED;
   },
   
   onSelection: function(){
      
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = ToolBarButton.States.UNMARSHALLED;
   },
   
   //Properties
   getIconImage: function() { return this.dividerIconImageUri; },
   getName: function() { return this.name; },
   getParentElement: function() { return this.parentElement; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   instantiateHtmlElements: function(){
      this.listItemElement = this.factory.create( 'li', null, this.parentElement, WidgetElementFactory.Positions.lastChild, { id : this.name } );
      this.spanElement = this.factory.create( 'span', null, this.listItemElement, WidgetElementFactory.Positions.lastChild, { 'class' : this.options.dividerStyle });
      this.imageElement = this.factory.create( 'img', null, this.spanElement, WidgetElementFactory.Positions.lastChild, { src : this.dividerIconImageUri });
   },
   
   unmarshallProperties: function(){
      this.dividerIconImageUri = XmlResource.selectNodeText( this.options.iconImageSelector, this.definitionXml, null, this.options.dividerIconImageUri );
   }.protect(),
});
/*
Name: 
    - ToolBarWidget

Description: 
    - Represents a toolbar which is a user interface for user actions. 

Requires:
    - ToolBarButton
    
Provides:
    - ToolBarWidget

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




var ToolBarWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['onButtonSelection'],
   options : {
      buttonsSelector : "/toolBarDefinition/buttons/button | /toolBarDefinition/buttons/divider",
      componentName : "ToolBarWidget",
      descriptionSelector : "/toolBarDefinition/description", 
      dividerIconImageUri : "Desktops/Images/ToolboxDivider.jpg",
      listStyleSelector : "/toolBarDefinition/buttons/@elementStyle",
      nameSelector : "/toolBarDefinition/name",
      showCaptionsSelector : "/toolBarDefinition/showCaptions"
   },

   //Constructor
   initialize: function( options, internationalization ){
      //this.setOptions( options );
      this.parent( options, internationalization );
      
      //Private attributes
      this.buttons = new LinkedHashMap();
      this.description;
      this.dividers = new ArrayList();
      this.name;
      this.listElement;
      this.listStyle;
      this.showCaptions = false;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.constructHtmlElements();
      this.constructButtons();
      return this.parent();
   },
   
   destroy: function(){
      this.destroyButtons();
      this.destroyDividers();
      if( this.listElement && this.listElement.destroy ) this.listElement.destroy();
      if( this.wrapperElement && this.wrapperElement.destroy ) this.wrapperElement.destroy();
      this.parent();
   },
   
   onButtonSelection: function( button ){
      var argumentText = button.getMessageProperties();
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : null;
      arguments['originator'] = this.name;
      
      this.messageBus.notifySubscribers( new MenuSelectedMessage( arguments ));
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallButtons();
      return this.parent();
   },
   
   //Properties
   getButtons: function() { return this.buttons; },
   getDescription: function() { return this.description; },
   getListStyle: function() { return this.listStyle; },
   getName: function() { return this.name; },
   
   //Protected and private helper methods
   constructButtons: function(){
      this.buttons.each( function( buttonEntry, index ){
         var toolBarButton = buttonEntry.getValue();
         toolBarButton.construct( this.listElement );
      }, this );
   }.protect(),
   
   constructHtmlElements: function(){
      this.wrapperElement = this.elementFactory.create( 'div', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { id : this.name });
      this.listElement = this.elementFactory.create( 'ul', null, this.wrapperElement, WidgetElementFactory.Positions.LastChild, { 'class' : this.listStyle } );
   }.protect(),
   
   destroyButtons: function(){
      this.buttons.each( function( buttonEntry, index ) {
         var button = buttonEntry.getValue();
         button.destroy();
      }, this );
      
      this.buttons.clear();
   }.protect(),
   
   destroyDividers: function(){
      this.buttons.each( function( divider, index ) {
         divider.destroy();
      }, this );
      
      this.buttons.clear();
   }.protect(),
   
   unmarshallButtons: function(){
      var buttonDefinitions = this.definitionXml.selectNodes( this.options.buttonsSelector );
      buttonDefinitions.each( function( buttonDefinition, index ){
         var toolBarButton = ToolBarButtonFactory.create( buttonDefinition, this.elementFactory, { onSelection : this.onButtonSelection, showCaption : this.showCaptions, dividerIconImageUri : this.options.dividerIconImageUri } );
         toolBarButton.unmarshall();
         this.buttons.put( toolBarButton.getName(), toolBarButton );
      }, this );
   }.protect(),
   
   unmarshallProperties: function(){
      this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
      this.listStyle = this.definitionXml.selectNodeText( this.options.listStyleSelector );
      this.name = this.definitionXml.selectNodeText( this.options.nameSelector );
      this.showCaptions = parseBoolean( this.definitionXml.selectNodeText( this.options.showCaptionsSelector, null, false ));
   }.protect()

});
/*
Name: 
    - VideoPlayerWidget

Description: 
    - Plays specified video files. 

Requires:
    - BrowserWidget, WidgetElementFactory
    
Provides:
    - VideoPlayerWidget

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




var VideoPlayerWidget = new Class({
   Extends : ToolBarWidget,
   options : {
      componentName : "VideoPlayerWidget",
      descriptionSelector : "/pp:widgetDefinition/description", 
      nameSelector : "/pp:widgetDefinition/name"
   },

   //Constructor
   initialize: function( options, internationalization ){
      this.setOptions( options );
      this.parent( options, internationalization );
      
      //Private attributes
   },
   
   //Public accessor and mutator methods
   construct: function(){
      return this.parent();
   },
   
   destroy: function(){
      this.parent();
   },
   
   unmarshall: function(){
      return this.parent();
   },
   
   //Properties
   
   //Protected and private helper methods
});
// LoadUtility.js



function getWebUIController() {
	try {
		return parent.webUIController;
	}
	catch (e) {
		return null;
	}
}


function loadDocument(documentType, name, uri) {
	getWebUIController().loadDocument(documentType, name, uri);
}

function loadInfo(documentType, name, uri) {
	getWebUIController().loadInfoPanelDocument(documentType, name, uri);
}


function setToDirty() {
	getWebUIController().getDocumentManager().getActiveDocument().setToDirty();
}

function setToClean() {
	getWebUIController().getDocumentManager().getActiveDocument().setToClean();
}

function saveDocument() {
	getWebUIController().getDocumentManager().getActiveDocument().save();
}

function cancelModification() {
	getWebUIController().getDocumentManager().getActiveDocument().cancel();
}
;
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



var UnconfiguredWebUIControllerException = new Class({
   Extends: WebUIException,
   options: {
      description: "WebUIController is unconfigured, therefore the requested operation can't be carried out.",
      name: "UnconfiguredWebUIControllerException"
   },
   
   //Constructor
   initialize : function( options ){
      this.setOptions( options );
      this.parent( options );
   }
});
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


ROOT_LOGGER_NAME = "WebUI";
FRONT_CONTROLLER = "CommandControllerServlet";

// Main control class, responsible for managing and syncronizing the widgets.
//= require_directory ../FundamentalTypes
//= require ../Singleton/Singleton.js

var WebUIController = new Class({
   Implements: [Class.Singleton, Events, Options],
   Binds : ['changeLanguage', 
            'constructDesktop',
            'configureLogger',
            'determineCurrentUserLocale',
            'finalizeConfiguration',
            'loadDocument', 
            'loadInternationalizations',
            'loadWebUIConfiguration',
            'onDesktopConstructed', 
            'onError', 
            'restoreStateFromUrl',
            'storeComponentState',
            'storeStateInUrl',
            'subscribeToWebUIMessages',
            'webUIMessageHandler'],
   
   options: {
      artifactTypesXslt : "Commons/JavaScript/WebUIController/TransformBusinessDefinitionToArtifactTypes.xsl",
      compatibleBrowserVersions : { ie : 8, firefox : 4, safari : 4, chrome : 10, opera : 10 },
      componentName : "WebUIController",
      configurationUri : "Configuration.xml",
      contextRootPrefix : "../../",
      errorPageUri : "Commons/FrontController/WebUiError.jsp",
      languageSelectorElementId : "LanguageSelectorWidget",
      loggerGroupName : "WebUIController",
      messageOriginator : "webUIController",
      reConfigurationDelay: 500,
      unsupportedBrowserMessage: "We appologize. This site utilizes more modern browsers, namely: Internet Explorer 8+, FireFox 4+, Chrome 10+, Safari 4+",
      urlRefreshPeriod : 3000,
      window : window
   },
   
   //Constructors
   initialize: function( options, usedWindow ) { return this.check() || this.setUp( options, usedWindow ); },
   setUp: function( options, usedWindow ){
      this.setOptions( options );
      if( usedWindow != null && usedWindow != 'undefined' ){
          this.options.window = usedWindow;
      } 

      //private instance variables
      this.configurationChain = new Chain();
      this.desktop;
      this.error;
      this.isConfigured = false;
      this.languageSelector;
      this.locale;
      this.logger;
      this.messageBus = new WebUIMessageBus();
      this.resourceBundle;
      this.prefferedLanguage;
      this.recentHash = this.determineCurrentHash();
      this.refreshUrlTimer;
      this.skin;
      this.stateManager = new ComponentStateManager();
      this.userName;
      this.userLocation;
      this.warningContainer;
      this.webUIConfiguration;
      this.webUIException;

      if( this.browserIsSupported() ){
         this.loadWebUIConfiguration();
         this.configureLogger();

         this.restoreStateFromUrl(),
         this.determineCurrentUserLocale();
         this.determineDefaultSkin();
         this.loadInternationalizations();

         this.logger.debug( "Browser Interface is initialized with context root prefix: "  + this.options.contextRootPrefix );
      }else{
         this.showWebUIExceptionPage( new Error( this.options.unsupportedBrowserMessage ));
      }
   }.protect(),

   //public accessor and mutator methods
   changeLanguage : function( locale ){
      this.logger.debug( this.options.componentName + ".changeLanguage()." );
      this.destroy();
      this.locale = locale;
      this.configure.delay( this.options.reConfigurationDelay, this );
   },
   
   changeSkin : function( newSkinName ){
      this.logger.debug( this.options.componentName + ".changeSkin()." );
      this.destroy();
      this.skin = newSkinName;
      this.configure.delay( this.options.reConfigurationDelay, this );
   },
   
   configure : function() {
      this.configurationChain.chain( 
         this.loadWebUIConfiguration,
         this.configureLogger,
         this.restoreStateFromUrl,
         this.determineCurrentUserLocale,
         this.loadInternationalizations,
         this.constructDesktop,
         this.subscribeToWebUIMessages,
         this.storeComponentState,
         this.finalizeConfiguration
      ).callChain();
   },
   
   destroy : function() {
      if( this.isConfigured ){
         this.locale = null;
         this.messageBus.tearDown();
         if( this.languageSelector ) this.languageSelector.destroy();
         this.desktop.destroy();
         this.webUIConfiguration.release();
         this.resourceBundle.release();
         this.options.window.location.hash = "";
         clearInterval( this.refreshUrlTimer );
         this.isConfigured = false;
      }
   },
   
   loadDocument : function( documentUri, contentUri, documentType ){
      this.logger.debug( this.options.componentName + ".loadDocument( '" + documentUri + "' )" );
      var message = new MenuSelectedMessage({ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentType : documentType, documentURI : documentUri, documentContentURI : contentUri, originator : this.options.messageOriginator });
      this.messageBus.notifySubscribers( message );
   },
   
   loadHtmlDocument : function( documentUri ){
      this.loadDocument( documentUri, null, AbstractDocument.Types.HTML );
   },
   
   loadSmartDocument : function( documentUri, contentUri ){
      this.loadDocument( documentUri, contentUri, AbstractDocument.Types.SMART );
   },
   
   onDesktopConstructed : function(){
      this.logger.debug( this.options.componentName + ", constructing desktop is finished." );
      this.configurationChain.callChain();
   },
   
   onError: function( error ){
      this.error = error;
      this.showWebUIExceptionPage( this.error );
   },
	
   restoreStateFromUrl : function(){
      this.logger.debug( this.options.componentName + ".restoreStateFromUrl() started." );
      if( this.options.window.location.hash.substring(2)) {
         var currentState = this.stateManager.toString();
         try {
            this.stateManager.resetStateFromUri( this.options.window.location.hash.substring(2) );
            this.messageBus.notifySubscribers( new WebUIStateRestoredMessage() );
         }catch( e ){
            this.stateManager.parse( currentState );
            this.logger.debug( "restoreStateFromUrl() exception: " + e );
         }
      }
      this.configurationChain.callChain();
   },
   
   storeStateInUrl : function() {
	   var stateAsString = this.stateManager.toString(); 
	   if( this.recentHash != stateAsString ){
	      this.recentHash = stateAsString;
	      this.options.window.location.hash = "!" + stateAsString;
	   }
   },
   
   webUIMessageHandler: function( webUIMessage ){
      if( !this.isConfigured ) throw new UnconfiguredWebUIControllerException({ source : 'WebUIController.webUIMessageHandler()' });
      
      if( instanceOf( webUIMessage, LanguageChangedMessage ) && webUIMessage.getNewLocale() != this.getCurrentLocale() ){
         this.changeLanguage( webUIMessage.getNewLocale() );
      }else if( instanceOf( webUIMessage, SkinChangedMessage ) && webUIMessage.getNewSkin() != this.getCurrentSkin() ){
         this.changeSkin( webUIMessage.getNewSkin() );
      }
      
      this.lastHandledMessage = webUIMessage;
   },

	//Properties
   getContextRootPrefix : function() { return this.contextRootPrefix; },
   getCurrentLocale : function () { return this.locale; },
   getCurrentSkin : function () { return this.skin; },
   getDesktop : function() { return this.desktop; },
   getIsConfigured : function() { return this.isConfigured; },
   getLanguageSelector : function() { return this.languageSelector; },
   getLocale : function() { return this.locale; },
   getLogger : function() { return this.logger; },
   getMessageBus : function() { return this.messageBus; },
   getPrefferedLanguage : function() { return this.prefferedLanguage; },
   getResourceBundle : function() { return this.resourceBundle; },
   getStateManager : function() { return this.stateManager; },
   getText : function( key, defaultValue ) { return this.getTextInternal( key, defaultValue  ); },
   getUserLocation : function() { return this.userLocation; },
   getUserName : function() { return this.userName; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   getWebUIException : function() { return this.webUiException; },
   setUserLocation : function( newLocation ) { this.userLocation = newLocation;},
   setUserName : function( newUserName ) { this.userName = newUserName;},
   setLanguage : function ( newLanguage ) { this.setLanguageInternal( newLanguage ); },
	
   //private methods
   browserIsSupported : function(){
      if( Browser.version >= this.options.compatibleBrowserVersions[Browser.name] ) return true;
      else return false;
   }.protect(),
   
   configureLogger : function() {		
      this.logger =  new WebUILogger( this.webUIConfiguration );
      this.logger.debug( this.options.componentName + ".configureLogger() started." );
      this.configurationChain.callChain();
   }.protect(),
	
   constructDesktop : function() {
      this.logger.debug( this.options.componentName + ".constructDesktop() started." );
      var desktopConfigurationUri = this.webUIConfiguration.getSkinConfiguration( this.skin );
      this.desktop = new Desktop( this.webUIConfiguration, this.resourceBundle, { configurationURI : desktopConfigurationUri, onConstructed : this.onDesktopConstructed, onError : this.onError } );
      this.desktop.unmarshall();
      try{
         this.desktop.construct();
      }catch( e ){
         this.onError( e );
      }
   }.protect(),
	
   determineCurrentHash: function() {
      if( this.options.window.location.hash.indexOf( "#" ) != -1 )
         return this.options.window.location.hash.substring(1);
      else return "";
   }.protect(),
	
   determineCurrentUserLocale : function() {
      this.logger.debug( this.options.componentName + ".determineCurrentUserLocale() started." );
      var browserLanguage = new Locale();
      browserLanguage.parse( navigator.language || navigator.userLanguage );
      browserLanguage.options.country = null;
      browserLanguage.options.variant = null;
      if( this.locale == null ){
         var storedState = this.stateManager.retrieveCurrentState( this.options.componentName ); 
         if( storedState ) {
            var localeString = storedState['locale'];
            this.locale = new Locale();
            this.locale.parse( localeString );
         }else if( this.webUIConfiguration.isSupportedLocale( browserLanguage )){
            this.locale = browserLanguage;
         }else {
            this.locale = new Locale();
            this.locale.parse( this.webUIConfiguration.getI18DefaultLocale() );
         }
      }
      this.configurationChain.callChain();
   }.protect(),
	
   determineDefaultSkin : function(){
      this.skin = this.webUIConfiguration.getDefaultSkin();
   }.protect(),
   
   finalizeConfiguration: function(){
      this.refreshUrlTimer = this.storeStateInUrl.periodical( this.options.urlRefreshPeriod, this );
      this.isConfigured = true;
      this.fireEvent( 'configured', this );
   }.protect(),

   getTextInternal : function ( key, defaultValue ) {
      if( this.resourceBundle == null)
         if( defaultValue != null ) return defaultValue;
         else return key;
      var returnValue;
      try {
         returnValue = this.resourceBundle.getText(key);
      } catch (e) {
         if( e instanceof IllegalArgumentException ) {
            if(defaultValue != null) return defaultValue;
            return key;
         } else {
            var exception = new UserException( "Unknown problem occured.", "WebUIController getText()" );
            throw exception;
         }
      }
      return returnValue;	
   }.protect(),
	
   loadInternationalizations : function () {
      this.logger.debug( this.options.componentName + ".loadInternationalizations() started." );
      try{
         this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
         this.resourceBundle.load( this.locale );
         this.logger.debug( "Resource bundles: " + this.options.contextRootPrefix + this.resourceBundle.getResourceBundleNames() + " was loaded." );
      }catch( e ) {
         this.onError( e );
      }
      this.configurationChain.callChain();
   }.protect(),
   
   loadWebUIConfiguration : function() {
      try{
         this.webUIConfiguration = new WebUIConfiguration( this.options.configurationUri );
         if( !this.webUIConfiguration.isLoaded ) this.webUIConfiguration.load();
      }catch( e ){
         this.onError( e );
      }
      this.configurationChain.callChain();
   }.protect(),

   setLanguage : function( newLanguage ) {
      this.logger.debug( this.options.componentName + ".setLanguage() started." );
      prefferedLanguage = newLanguage;
      if(newLanguage != null) {
         var locale = new Locale(newLanguage);
         if( applicationConfiguration != null) {
            applicationConfiguration.setLocale(locale);
            this.loadInternationalizations(applicationConfiguration.getBundlePath(),locale);
         }
      }
   }.protect(),
	
   showWebUIExceptionPage : function( exception ) {
      var bodyElement = $$( 'body' );
      this.warningContainer = new Element( 'div', { id: 'warning'} );
      bodyElement.grab( this.warningContainer, 'top' );
      
      var warningHeader = new Element( 'h1' );
      warningHeader.appendText( "Error Occured" );
      this.warningContainer.grab( warningHeader );
      
      var warningNameElement = new Element( 'h3' );
      warningNameElement.appendText( exception.name );
      this.warningContainer.grab( warningNameElement );
      
      var messageElement = new Element( 'p' );
      messageElement.appendText( exception.message );
      this.warningContainer.grab( messageElement );
      
      var stackElement = new Element( 'p' );
      if( exception.stack ) {
         stackElement.appendText( exception.stack );
         this.warningContainer.grab( stackElement );
      }
   }.protect(),
	
   storeComponentState : function() {
      this.logger.debug( this.options.componentName + ".storeComponentState() started." );
      this.stateManager.storeCurrentState( this.options.componentName, {locale : this.locale.toString()} );
      this.configurationChain.callChain();
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
      this.messageBus.subscribeToMessage( LanguageChangedMessage, this.webUIMessageHandler );
      this.messageBus.subscribeToMessage( SkinChangedMessage, this.webUIMessageHandler );
      //this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      this.configurationChain.callChain();
   }.protect()
});
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




var WebUIStateRestoredMessage = new Class({
   Extends: WebUIMessage,
   options: {
      description: "State of Web User Interface restored from URL.",
      name: "WebUIStateRestoredMessage"
   },
      
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = WebUIStateRestoredMessage;
   }
});

//TestMessageOne.js



var TestMessageOne = new Class({
   Extends: WebUIMessage,
   options: {
      description: "Test Message One description",
      name: "Test Message One"
   },
      
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = TestMessageOne;
   }
});

//TestMessageTwo.js



var TestMessageTwo = new Class({
   Extends: WebUIMessage,
   options: {
      description: "Test Message Two description",
      name: "Test Message Two"
   },
      
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = TestMessageTwo;
   }
});




























