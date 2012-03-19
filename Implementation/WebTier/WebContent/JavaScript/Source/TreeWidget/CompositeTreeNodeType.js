/*
Name:
    - CompositeTreeNodeType
    
Description: 
    - Clamps shared properties of composite tree node instances.
    
Requires:
    - TreeNodeType
    
Provides:
    - CompositeTreeNodeType

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

//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js
//= require ../TreeWidget/TreeNodeType.js

var CompositeTreeNodeType = new Class ({
	Extends : TreeNodeType,
	
	options: {
      componentName : 'CompositeTreeNodeType',
      nodeHandlerSourceWhenHasNextAndClosed : 'plus.gif',
	   nodeHandlerSourceWhenHasNextAndOpened : 'minus.gif',
      nodeHandlerSourceWhenLastAndClosed : 'plus_last.gif',
	   nodeHandlerSourceWhenLastAndOpened : 'minus_last.gif'
	},
	
	//Constructor
	initialize: function( options ) {
		this.parent( options );
	},
	
	//public accessor and mutator methods
	determineNodeHandlerImage : function( treeNode ){
	   if( treeNode.isOpened )
	      return treeNode.nextSibling ? this.getNodeHandlerSourceWhenHasNextAndOpened() : this.getNodeHandlerSourceWhenLastAndOpened();
	   else
         return treeNode.nextSibling ? this.getNodeHandlerSourceWhenHasNextAndClosed() : this.getNodeHandlerSourceWhenLastAndClosed();
	},
	
	determineNodeImage : function( currentState ) {
		var stateDependentImage = currentState == this.OPENED_STATE ? this.imageOpen : this.nodeImage;
		return this.options.imagesFolder + stateDependentImage;
	},
	
	//Properties
	getLineImageWhenLast : function( nodeState ) { 
		if( nodeState == this.getStateNameWhenClosed() )
			return this.getImagesFolder() + this.options.lineImageWhenLastAndCloseed; 
		else
			return this.getImagesFolder() + this.options.lineImageWhenLastAndOpened; 
	},
	
	getLineImageWhenHasNext : function( nodeState ) { 
		if( nodeState == this.getStateNameWhenClosed() )
			return this.getImagesFolder() + this.options.lineImageWhenHasNextAndClosed; 
		else
			return this.getImagesFolder() + this.options.lineImageWhenHasNextAndOpened; 
	},
	
   getNodeHandlerSourceWhenHasNextAndClosed : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenHasNextAndClosed; },
   getNodeHandlerSourceWhenHasNextAndOpened : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenHasNextAndOpened; },
   getNodeHandlerSourceWhenLastAndClosed : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenLastAndClosed; },
   getNodeHandlerSourceWhenLastAndOpened : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenLastAndOpened; },
	getStateNameWhenClosed : function() { return this.CLOSED_STATE; },
	getStateNameWhenOpened : function() { return this.OPENED_STATE; }
});

/*** TreeNodeType instances ***/
folderNodeType = new CompositeTreeNodeType( "folder", "folder_closed.gif", "folder_open.gif" );
userNodeType = new TreeNodeType( "user", "user_16x16.gif" );
pageNodeType = new TreeNodeType( "page", "page16x16.gif" );
helpNodeType = new TreeNodeType( "help", "help_16x16.gif" );

CompositeTreeNode.States = { CLOSED : 'closed', OPENED : 'opened' };

