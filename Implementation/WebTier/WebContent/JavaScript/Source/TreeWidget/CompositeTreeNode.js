/*
Name:
    - CompositeTreeNode

Description: 
    - Displays a composite (has child nodes) node in the tree structure.

Requires:
    - TreeNode
    - TreeNodeType
    - CompositeTreeNodeType

Provides:
    - CompositeTreeNode

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

var CompositeTreeNode = new Class( {
   Extends : TreeNode,
   Binds : ['constructChildNodes', 'onChildNodeConstructed', 'onNodeHandlerClick'],

   options : {
      childNodesSelector : 'treeNode',
      componentName : "CompositeTreeNode",
      initialyOpened : false,
      isOpenedSelector : "@isOpened"
   },

   // Constructor
   initialize : function( parentNode, nodeType, nodeResource, elementFactory, options ) {
      this.parent( parentNode, nodeType, nodeResource, elementFactory, options );
      this.childNodes = new ArrayList();
      this.isOpened = this.options.initialyOpened;
      this.numberOfConstructedChildNodes = 0;
   },

   // public accessor and mutator methods
   close : function() {
      if( this.isOpened ){
         this.isOpened = false;
         this.destroyChildNodes();
         this.replaceNodeImage();
         this.replaceNodeHandlerImage();
      }
   },
   
   construct : function(){
      this.parent();
   },
   
   destroy : function(){
      this.destroyChildNodes();
      this.parent();
   },

   findChildNodeByName : function(name) {
      for( var i = 0; i < childs.length; i++) {
         if( this.childNodes[i].getName() == name ) return this.childNodes[i];
      }
      return null;
   },
   
   findLastVisibleChild : function(){
      if( this.isOpened ){
         var lastChild = this.childNodes.getLast();
         if( instanceOf( lastChild, CompositeTreeNode )) return lastChild.findLastVisibleChild(); 
         else return lastChild; 
      }
      else return this;
   },

   findNodeByPath : function(path) {
      if (path.indexOf( this.NODE_PATH_SEPARATOR ) > 0) {
         var nodeName = path.substring( 0, path.indexOf( this.NODE_PATH_SEPARATOR ) );
         var childNode = this.findChildNodeByName( nodeName );
         if (childNode != null)
            return this.childNode.findNodeByPath( path.substring( path.indexOf( this.NODE_PATH_SEPARATOR ) + 1 ) );
         else
            return null;
      } else
         return this.findChildNodeByName( path );
   },
   
   onChildNodeConstructed : function( childNode ){
      this.numberOfConstructedChildNodes++;
      if( this.numberOfConstructedChildNodes == this.childNodes.size() ) this.constructionChain.callChain();

   },

   onNodeHandlerClick : function() {
      if( this.isOpened ) this.close();
      else this.open();
   },

   open : function() {
      if( !this.isOpened ){
         this.isOpened = true;
         this.unmarshallChildNodes();
         this.constructChildNodes();
         this.replaceNodeImage();
         this.replaceNodeHandlerImage();
      }
   },

   unmarshall : function(){
      this.unmarshallChildNodes();
      this.parent();
   },

   // Properties
   getChildCount : function() { return this.childNodes.length; },
   getChildNodes : function() { return this.childNodes; },
   getFirstChild : function() { if (this.hasChilds()) return this.childNodes[0]; return null; },
   getLastChild : function() { if (this.hasChilds()) return this.childNodes[this.childNodes.length - 1]; return null; },
   getState : function() { return this.state; },
   hasChilds : function() { return (this.childNodes.length > 0); },

   // private methods
   appendNodeImage : function() {
      this.parent();
      this.nodeImageElement.set( "src", this.nodeType.determineNodeImage( this.options.state ) );
      this.nodeImageElement.addEvent( 'click', this.onFolderClickHandler );
   }.protect(),

   compileConstructionChain : function(){
      this.constructionChain.chain( 
         this.createNodeWrapperElement, 
         this.createNodeHandlerImage, 
         this.createNodeIcon, 
         this.createNodeCaption, 
         this.insertTrailingImages, 
         this.constructChildNodes,
         this.finalizeConstruction
      );
   }.protect(),
   
   constructChildNodes : function(){
      if( this.isOpened ){
         this.childNodes.each( function( childNode, index ){
            childNode.construct();
         }.bind( this ));
      }else this.constructionChain.callChain();
   }.protect(),
   
   createNodeHandlerImage : function() {
      this.parent();
      this.nodeHandlerElement.addEvent( 'click', this.onNodeHandlerClick );
   }.protect(),

   destroyChildNodes : function(){
      this.childNodes.each( function( childNode, index ){
         childNode.destroy();
      }.bind( this ));
      
      this.childNodes.clear();
      this.numberOfConstructedChildNodes = 0;
   }.protect(),
   
   replaceNodeHandlerImage : function(){
      this.nodeHandlerElement.set( 'src', this.nodeType.determineNodeHandlerImage( this ));
   }.protect(),
   
   replaceNodeImage : function(){
      this.nodeIconElement.set( 'src', this.nodeType.determineNodeImage( this ));
   }.protect(),
   
   unmarshallChildNodes : function(){
      this.childNodes.clear();
      var childNodeElements = XmlResource.selectNodes( this.options.childNodesSelector, this.nodeResource );
      if( childNodeElements ){
         childNodeElements.each( function( childNodeElement, index ){
            var treeNode = TreeNodeFactory.create( this, childNodeElement, this.elementFactory, { onConstructed : this.onChildNodeConstructed });
            if( index > 0 && index < childNodeElements.length ){
               this.childNodes.get( index -1 ).nextSibling = treeNode;
               treeNode.previousSibling = this.childNodes.get( index -1 );
            }
            treeNode.unmarshall();
            this.childNodes.add( treeNode );
         }.bind( this ));
      }      
   }.protect(),
   
   unmarshallProperties: function(){
      this.isOpened = parseBoolean( XmlResource.selectNodeText( this.options.isOpenedSelector, this.nodeResource, this.options.dataXmlNameSpace, this.options.initialyOpened ));
      this.parent();
   }.protect()
});

CompositeTreeNode.States = { CLOSED : 'closed', OPENED : 'opened' };
