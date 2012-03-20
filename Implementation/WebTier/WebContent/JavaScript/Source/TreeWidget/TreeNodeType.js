/*
Name:
    - TreeNodeType
    
Description: 
    - Clamps shared properties of tree node instances.
    
Requires:
    - BrowserWidget
    
Provides:
    - TreeNodeType

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

var TreeNodeType = new Class({

	//node images
	dMinusPicture: "minus.gif",
	dPlusPicture: "plus.gif",
	dMinus_lastPicture: "minus_last.gif",
	dPlus_lastPicture: "plus_last.gif",

	//line images
	dMinus_nolinesPicture: "minus_nolines.gif",
	dMinus_no_rootPicture: "minus_no_root.gif",
	dMinus_last_no_rootPicture: "minus_last_no_root.gif",
	dPlus_nolinesPicture: "plus_nolines.gif",
	dPlus_no_rootPicture: "plus_no_root.gif",
	dPlus_last_no_rootPicture: "plus_last_no_root.gif",
	dT_no_rootPicture: "t_no_root.gif",

	Implements: [Options],
	options: {
		captionClass : 'nodeCaption',
		captionClassWhenSelectable : 'selectedHover', 
		captionLinkClass : 'nodeCaptionLink',
		componentName : 'TreeNodeType',
		imagesFolder : 'Images/',
		nodeClassWhenHidden : 'hiddenNode', 
		nodeClassWhenVisible : 'nodeWrapper',
		nodeHandlerClass : 'nodeHandler',
      nodeHandlerSourceWhenHasNext : 't.gif',
      nodeHandlerSourceWhenLast : 'lastnode.gif',
		nodeIconClass : 'nodeIcon',
		nodeImageClass : 'nodeImage',
		nodeIconImages : { closedFolder: "folder_closed.gif", openedFolder: "folder_open.gif", help: "help_16x16.gif", page: "page16x16.gif", user: "user_16x16.gif" },
      trailingImageClass : 'trailingImage',
		trailingImageWhenParentHasNext : 'line.gif',
		trailingImageWhenParentIsLast : 'white.gif'
	},

	//Constructor
	initialize: function( options ) {
		this.setOptions( options );
	},
	
	//public accessor and mutator methods
   determineNodeHandlerImage : function( treeNode ){
      return treeNode.nextSibling ? this.getNodeHandlerSourceWhenHasNext() : this.getNodeHandlerSourceWhenLast();
   },
   
	determineNodeImage : function( nodeImage ) {
		return this.options.imagesFolder + nodeImage;
	},
	
	//Properties
	getCaptionClass : function() { return this.options.captionClass; },
	getCaptionClassWhenSelectable : function() { return this.options.captionClassWhenSelectable; },
	getCaptionLinkClass : function() { return this.options.captionLinkClass; },
	getImagesFolder : function() { return this.options.imagesFolder; },
	getLineImageWhenLast : function() { return this.getImagesFolder() + this.options.lineImageWhenLast; },
	getLineImageWhenHasNext : function() { return this.getImagesFolder() + this.options.lineImageWhenHasNext; },
	getNodeHandlerClass : function() { return this.options.nodeHandlerClass; },
   getNodeHandlerSourceWhenLast : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenLast; },
   getNodeHandlerSourceWhenHasNext : function() { return this.getImagesFolder() + this.options.nodeHandlerSourceWhenHasNext; },
	getNodeIconClass : function() { return this.options.nodeIconClass; },
	getNodeIconSource : function() { return this.getImagesFolder() + this.options.nodeIconImages.page; },
	getNodeImageClass : function() { return this.options.nodeImageClass; },
   getNodeWrapperClass : function() { return this.options.nodeClassWhenVisible; },
	getTrailingImageClass : function() { return this.options.trailingImageClass; },
	getTrailingImageWhenParentHasNext : function() { return this.getImagesFolder() + this.options.trailingImageWhenParentHasNext; },
   getTrailingImageWhenParentIsLast : function() { return this.getImagesFolder() + this.options.trailingImageWhenParentIsLast; }
});