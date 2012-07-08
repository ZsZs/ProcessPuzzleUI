/*
Name:
    - RootTreeNodeType
    
Description: 
    - Clamps shared properties of root tree node instances.
    
Requires:
    - CompositeNodeType
    
Provides:
    - RottTreeNodeType

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
//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js
//= require ../TreeWidget/TreeNodeType.js
//= require ../TreeWidget/CompositeTreeNodeType.js

var RootTreeNodeType = new Class ({
	Extends : CompositeTreeNodeType,
	
	options: {
      componentName : 'RootTreeNodeType',
      nodeHandlerSourceWhenHasNextAndClosed : 'plus_no_root.gif',
	   nodeHandlerSourceWhenHasNextAndOpened : 'minus_no_root.gif',
	},
	
	//Constructor
	initialize: function( options ) {
		this.parent( options );
	},
	
	//public accessor and mutator methods
	
	//Properties
});


