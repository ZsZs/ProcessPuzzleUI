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
