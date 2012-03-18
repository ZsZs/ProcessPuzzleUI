/*
Name:
    - TreeWidget
Description: 
    - Displays a tree structure - given by an xml - as a tree.
Requires:
    - BrowserWidget
Provides:
    - TreeWidget

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

var TreeWidget = new Class( {
   Extends : BrowserWidget,
   Binds : ['constructTreeNodes', 'destroyTreeNodes'],
   constants : {
   },
   
   options : {
      componentName : "TreeWidget",
      imagesFolder : "",
      nodeOptions : {},
      nodeTypeOptions : {},
      pathSeparator : ".",
      rootNodeSelector : "//pp:treeDefinition/rootNode",
      showRootNode : false,
      widgetContainerId : "TreeWidget"
   },

   // constructor
   initialize : function( options, resourceBundle, elementFactoryOptions ) {
      this.parent( options, resourceBundle, elementFactoryOptions );

      this.compositeTreeNodeType;
      this.rootNode;
      this.treeNodeType;
      
      this.instantiateNodeFactory();
      this.instantiateNodeTypes();
   },

   // public accessor and mutator methods
   changeCaptions : function() {
      if( this.rootNode != null ) this.rootNode.changeCaption( this.controller );
   },

   construct : function() {
      this.parent();
   },

   destroy : function() {
      this.parent();
   },

   getSelectedNode : function() {
      if (this.getSelectedNameListSize() == 0) return null;
      return this.rootNode.findNodeByPath( this.getSelectedNodeFullCaption() );
   },

   unmarshall : function() {
      this.unmarshallRootNode();
   },

   // Properties
   getCompositeTreeNodeType : function() { return this.compositeTreeNodeType; },
   getRootNode : function() { return this.rootNode; },
   getSelectedNameList : function() { return this.selectedNameList; },
   getSelectedNameListSize : function() { return this.selectedNameListSize; },
   getTreeNodeType : function() { return this.treeNodeType; },

   // Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructTreeNodes, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain : function(){
      this.destructionChain.chain( this.destroyTreeNodes, this.finalizeDestruction );
   }.protect(),
   
   constructTreeNodes : function(){
      this.rootNode.construct( this.containerElement );
      this.constructionChain.callChain();
   }.protect(),
   
   destroyTreeNodes : function(){
      this.rootNode.destroy();
      this.rootNode = null;
      this.destructionChain.callChain();
   }.protect(),
   
   instantiateNodeFactory : function(){
      TreeNodeFactory.singleInstance = new  TreeNodeFactory({ nodeTypeOptions : this.options.nodeTypeOptions });
   }.protect(),

   instantiateNodeTypes : function(){
      this.treeNodeType = TreeNodeFactory.singleInstance.getTreeNodeType();
      this.compositeTreeNodeType = TreeNodeFactory.singleInstance.getCompositeTreeNodeType();
   }.protect(),
   
   unmarshallRootNode : function(){
      var rootNodeElement = this.dataXml.selectNode( this.options.rootNodeSelector );
      if( rootNodeElement ){
         this.rootNode = new RootTreeNode( this.compositeTreeNodeType, rootNodeElement, this.elementFactory, this.options.nodeOptions );
         this.rootNode.unmarshall();
      }      
   }.protect()   
});