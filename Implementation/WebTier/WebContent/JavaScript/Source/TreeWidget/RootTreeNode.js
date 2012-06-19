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
   options : {
      componentName : "RootTreeNode",
      initialyOpened : true,
      isVisible : false
   },

   // Constructor
   initialize : function( nodeType, nodeResource, elementFactory, options ) {
      this.parent( null, nodeType, nodeResource, elementFactory, options );

      // private instance variables
      this.containerElement;
      this.isVisible = false;
   },

   // public accessor and mutator methods
   construct : function( containerElement ){
      this.containerElement = containerElement;
      this.parent();
   },

   // Properties
   getNodeWrapperElement : function() { return this.isVisible ? this.nodeWrapperElement : this.containerElement; },
   getWidgetElement : function() { return widgetElement; },
   
   //Protected, private helper methods
   compileConstructionChain : function(){
      if( this.options.isVisible ){
         this.constructionChain.chain( this.createNodeWrapperElement, this.createNodeHandlerImage, this.createNodeIcon, this.createNodeCaption, this.insertTrailingImages, this.constructChildNodes, this.finalizeConstruction );
      }else{
         this.constructionChain.chain( this.constructChildNodes, this.finalizeConstruction );
      }
   }.protect(),
   
   determineWrapperContextElement : function(){
      return this.containerElement;
   }.protect(),
   
   determinWrapperContenxtPosition : function(){
      return WidgetElementFactory.Positions.LastChild;
   }.protect(),
   
   finalizeConstruction : function(){
      if( this.options.isVisible ) this.parent()
      else {
         this.state = BrowserWidget.States.UNMARSHALLED;
         this.constructionChain.clearChain();
         this.fireEvent( 'constructed', this );
      }
   }.protect() 
   
});