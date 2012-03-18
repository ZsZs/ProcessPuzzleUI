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

   options : {
      childNodesSelector : 'treeNode',
      initialState : 'closed'
   },

   // Constructor
   initialize : function( parentNode, nodeType, nodeResource, elementFactory, options ) {
      this.parent( parentNode, nodeType, nodeResource, elementFactory, options );
      this.childNodes = new ArrayList();
      this.state = this.options.initialState;
   },

   // public accessor and mutator methods
   collapse : function() {
      this.childNodes.each( function(childNode, serialNumber) {
         childNode.destroy();
      });
      this.options.state = this.nodeType.getStateNameWhenClosed();
   },
   
   construct : function( containerElement ){
      this.parent( containerElement );
      this.constructChildNodes();
   },
   
   destroy : function(){
      this.destroyChildNodes();
      this.parent();
   },

   expand : function() {
      if (this.parentNode && !this.parentNode.isVisible())
         throw new IllegalMethodCallException( "Node '" + this.nodeID + "' can't be expanded if parent is invisible." );

      this.childNodes.each( function(childNode, serialNumber) {
         childNode.show();
      } );
      this.options.state = this.nodeType.getStateNameWhenOpened();
   },

   findChildNodeByName : function(name) {
      for( var i = 0; i < childs.length; i++) {
         if( this.childNodes[i].getName() == name ) return this.childNodes[i];
      }
      return null;
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

   onFolderClickHandler : function(theEvent) {
      switch (this.options.state) {
      case CLOSED_STATE:
         state = OPENED_STATE;
         _expand();
         break;
      case OPENED_STATE:
         state = CLOSED_STATE;
         _Collapse();
         break;
      }
   },

   removeChild : function(childNode) {
      var found = false;
      for ( var i = 0; i < this.childNodes.length; i++) {
         if (found) {
            this.childNodes[i] = this.childNodes[i + 1];
         }
         if (this.childNodes[i] == childNode) {
            if (i == (this.childNodes.length - 1))
               this.childNodes[i] = null;
            else
               this.childNodes[i] = this.childNodes[i + 1];
            found = true;
         }
      }
      if (found)
         this.childNodes.length = this.childNodes.length - 1;
      return found;
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

   constructChildNodes : function(){
      this.childNodes.each( function( childNode, index ){
         childNode.construct( this.containerElement );
      }.bind( this ));
   }.protect(),
   
   destroyChildNodes : function(){
      this.childNodes.each( function( childNode, index ){
         childNode.destroy();
      }.bind( this ));
      
      this.childNodes.clear();
   }.protect(),
   
   determineLineIntersectionImage : function() {
      if (this.hasNext())
         return this.nodeType.getLineImageWhenHasNext( this.getState() );
      else
         return this.nodeType.getLineImageWhenLast( this.getState() );
   }.protect(),

   unmarshallChildNodes : function(){
      var childNodeElements = XmlResource.selectNodes( this.options.childNodesSelector, this.nodeResource );
      if( childNodeElements ){
         childNodeElements.each( function( childNodeElement, index ){
            var treeNode = TreeNodeFactory.create( this, childNodeElement, this.elementFactory, this.options );
            treeNode.unmarshall();
            this.childNodes.add( treeNode );
         }.bind( this ));
      }      
   }.protect()
});

CompositeTreeNode.States = { CLOSED : 'closed', OPENED : 'opened' };