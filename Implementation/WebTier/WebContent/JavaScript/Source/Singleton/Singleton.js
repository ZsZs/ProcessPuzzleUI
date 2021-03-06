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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

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

Class.Singleton.prototype.replaceInstance = function( newInstance ){
   var instance = storage.retrieve( 'single:' + this.$className );
   if( instance ) storage.store( 'single:' + this.$className, newInstance );
};

var gIO = function(klass){

   var name = klass.prototype.$className;

   return name ? this.retrieve('single:' + name) : null;

};

if (('Element' in this) && Element.implement) Element.implement({getInstanceOf: gIO});

Class.getInstanceOf = gIO.bind(storage);

}).call(this);