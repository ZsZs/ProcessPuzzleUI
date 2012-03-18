/*
Name:
    - RootTreeNode

Description: 
    - A special composite node as it has no parent node.

Requires:
    - TreeNode
    - TreeNodeType
    - CompositeTreeNode
    - CompositeTreeNodeType

Provides:
    - RootTreeNode

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
//= require ../TreeWidget/CompositeTreeNodeType.js
//= require ../TreeWidget/TreeNode.js

var RootTreeNode = new Class({
   Extends : CompositeTreeNode,

   // Constructor
   initialize : function( nodeType, nodeResource, elementFactory, options ) {
      this.parent( null, nodeType, nodeResource, elementFactory, options );

      // private instance variables
   },

   // public accessor and mutator methods
   show : function() {
      if (widgetElement) {
         if (treeWidget) {
            if (treeWidget.getShowRootNode()) {
               return parent.show();
            }
         } else {
            exception = new UserException( "The tree widget is not defined.", "RootNode.show()", "UndefinedWidget" );
            throw exception;
         }
      } else {
         exception = new UserException( "The tree widget is not difined.", "RootNode.show()", "UndefinedWidget" );
         throw exception;
      }
   },

   // Properties
   getWidgetElement : function() {
      return widgetElement;
   },
   setTreeWidget : function(widget) {
      treeWidget = widget;
   },
   setWidgetId : function(id) {
      widgetElement = document.getElementById( id );
      if (!widgetElement) {
         exception = new UserException( "Can't find the given: " + id + " id in the document.", "RootNode.setWidgetId()", "UndefinedWidgetId" );
         throw exception;
      }
   }

} );