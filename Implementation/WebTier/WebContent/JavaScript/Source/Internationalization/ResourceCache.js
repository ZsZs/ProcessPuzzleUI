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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

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

	//Public accessor and mutator methods
	get : function( name, type ) {
	    var resourceKey = new ResourceKey( name, type );
	    if( !this.resources.containsKey( resourceKey ) ) {
	        throw new IllegalArgumentException( "no such key: " + resourceKey );
	    }
	    return this.resources.get( resourceKey );
	},
	
	put : function( resourceKey, resourceValue ){
		this.resources.put( resourceKey, resourceValue );
	},
	
	//Properties
	getResources : function() { return this.resources; }

	//private methods
});
