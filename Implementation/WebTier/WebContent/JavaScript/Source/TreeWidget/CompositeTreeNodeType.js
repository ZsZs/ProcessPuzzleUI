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
      nodeHandlerSourceWhenFirstAndClosed : 'plus_last_no_root.gif',
      nodeHandlerSourceWhenFirstAndOpened : 'minus_last_no_root.gif',
      nodeHandlerSourceWhenFirstAndHasNextAndClosed : 'plus_no_root.gif',
      nodeHandlerSourceWhenFirstAndHasNextAndOpened : 'minus_no_root.gif',
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
	   if( treeNode.isOpened ){
	      if( treeNode.previousSibling && treeNode.nextSibling ) return this.getNodeHandlerSourceWhenHasNextAndOpened();
	      else if( treeNode.previousSibling && !treeNode.nextSibling ) return this.getNodeHandlerSourceWhenLastAndOpened();
         else if( !treeNode.previousSibling && treeNode.nextSibling )return this.getNodeHandlerSourceWhenFirstAndHasNextAndOpened();
	   }else{
         if( treeNode.previousSibling && treeNode.nextSibling ) return this.getNodeHandlerSourceWhenHasNextAndClosed();
         else if( treeNode.previousSibling && !treeNode.nextSibling ) return this.getNodeHandlerSourceWhenLastAndClosed();
         else if( !treeNode.previousSibling && treeNode.nextSibling )return this.getNodeHandlerSourceWhenFirstAndHasNextAndClosed();
	   }
	},
	
	determineNodeImage : function( treeNode ) {
	   var imageUri;
	   
      if( treeNode.isOpened ) imageUri = this.options.nodeIconImages.openedFolder;
      else imageUri = this.options.nodeIconImages.closedFolder;

		return this.getImagesFolder() + imageUri;
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
	
   getNodeHandlerSourceWhenFirstAndClosed : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenFirstAndClosed; },
   getNodeHandlerSourceWhenFirstAndOpened : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenFirstAndOpened; },
   getNodeHandlerSourceWhenFirstAndHasNextAndClosed : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenFirstAndHasNextAndClosed; },
   getNodeHandlerSourceWhenFirstAndHasNextAndOpened : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenFirstAndHasNextAndOpened; },
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

