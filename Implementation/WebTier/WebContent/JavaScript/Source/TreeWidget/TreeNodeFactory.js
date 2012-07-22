/*
Name: TreeNodeFactory

Description: Instantiates a new subclass of TreeNode according to the given XML element.

Requires:

Provides:
    - TreeNodeFactory

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

var TreeNodeFactory = new Class({
   Implements: Options,
   
   options: {
      nodeTypeOptions : {}
   },
   
   //Constructor
   initialize: function( options ){
      this.setOptions( options );
      
      this.treeNodeType = new TreeNodeType( this.options.nodeTypeOptions );
      this.compositeTreeNodeType = new CompositeTreeNodeType( this.options.nodeTypeOptions );
      this.rootTreeNodeType = new RootTreeNodeType( this.options.nodeTypeOptions );
   },

   //Public mutators and accessors
   create: function( parentNode, nodeResource, elementFactory, options ){
      var hasChildNodes = XmlResource.selectNodes( "tr:treeNode", nodeResource ).length > 0 ? true : false;
      var treeNode;
      
      if( hasChildNodes ) treeNode = new CompositeTreeNode( parentNode, this.compositeTreeNodeType, nodeResource, elementFactory, options );
      else treeNode = new LeafTreeNode( parentNode, this.treeNodeType, nodeResource, elementFactory, options );
      
      return treeNode;
   },
   
   //Properties
   getCompositeTreeNodeType : function() { return this.compositeTreeNodeType; },
   getRootTreeNodeType : function() { return this.rootTreeNodeType; },
   getTreeNodeType : function() { return this.treeNodeType; }
});

TreeNodeFactory.create = function( parentNode, definitionXmlElement, htmlElementFactory, options ){
   if( !TreeNodeFactory.singleInstance ) TreeNodeFactory.singleInstance = new TreeNodeFactory();
   return TreeNodeFactory.singleInstance.create( parentNode, definitionXmlElement, htmlElementFactory, options );
};

TreeNodeFactory.singleInstance;