/*
Name:
    - TreeNode

Description: 
    - Displays a single node in the tree structure.

Requires:
    - BrowserWidget

Provides:
    - TreeNode

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

var TreeNode = new Class({
   Implements : [Events, Options],
   Binds : ['createNodeCaption', 'createNodeHandlerImage', 'createNodeIcon', 'createNodeWrapperElement', 'finalizeConstruction', 'insertTrailingImages', 'onCaptionClick'],
   options : {
      captionSelector : '@caption',
      componentName : "TreeNode",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      imageUriSelector : '@image',
      messageSelector : '//messageProperties',
      nodeIDSelector : '@nodeId',
      orderNumberSelector : '@orderNumber',
      selectable : false,
      target : '_blank',
      url : null
   },

   // constructor
   initialize : function( parentNode, nodeType, nodeResource, elementFactory, options ) {
      // parameter assertions
      assertThat( nodeType, not( nil() ) );
      assertThat( nodeResource, not( nil() ) );
      assertThat( elementFactory, not( nil() ) );
      this.setOptions( options );

      // private instance variables
      this.caption;
      this.constructionChain = new Chain();
      this.containerElement;
      this.elementFactory = elementFactory;
      this.imageUri;
      this.message;
      this.nodeCaptionElement;
      this.nodeHandlerElement;
      this.nodeIconElement;
      this.nodeResource = nodeResource;
      this.nodeWrapperElement;
      this.nextSibling;
      this.nodeID;
      this.nodeType = nodeType;
      this.orderNumber;
      this.parentNode = parentNode;
      this.previousSibling;
      this.selectPicElement;
      this.state;
      this.trailingImages = new ArrayList();
      
      this.state = BrowserWidget.States.INITIALIZED;
   },

   // public accessor and mutator methods
   bubbleUpNames : function() {
      return this.parentNode ? this.parentNode.bubbleUpNames() + "/" + this.caption : this.caption;
   },

   changeCaption : function() {
      this.caption = this.webUiController.getText( this.name );

      if (this.nodeCaptionElement != null && this.captionTextNode != null) {
         this.nodeCaptionElement.removeChild( this.captionTextNode );
         this.captionTextNode = document.createTextNode( this.caption );
         this.nodeCaptionElement.appendChild( this.captionTextNode );
      }

      for ( var i = 0; i < this.childs.length; i++) {
         this.childs[i].changeCaption( this.webUiController );
      }
   },
   
   construct : function() {
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.compileConstructionChain();
         this.constructionChain.callChain();
      }
   },
   
   destroy : function(){
      this.destroyNodeElement( this.nodeHandlerElement );
      this.destroyNodeElement( this.nodeIconElement );
      this.destroyNodeElement( this.nodeCaptionElement );
      this.destroyNodeElement( this.nodeWrapperElement );
      this.destroyTrailingImages();
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   findNodeByPath : function( path ) {
      if( path == this.caption ) return this;
      else null;
   },
   

   onCaptionClick : function() {
      this.fireEvent( 'nodeSelected', this );
   },

   unmarshall : function(){
      this.unmarshallProperties();
      this.unmarshallMessage();
      this.state = BrowserWidget.States.UNMARSHALLED;
   },

   // Properties
   getCaption : function() { return this.caption; },
   getCaptionElement : function() { return this.nodeCaptionElement; },
   getContainerElement : function() { return this.containerElement; },
   getId : function() { return this.nodeID; },
   getImageUri : function() { return this.imageUri; },
   getMessage : function() { return this.message; },
   getNodeImageElement : function() { return this.nodeIconElement; },
   getNextSibling : function() { return this.nextSibling; },
   getNodeType : function() { return this.nodeType; },
   getNodeWrapperElement : function() { return this.nodeWrapperElement; },
   getOrderNumber : function() { return this.orderNumber; },
   getParentNode : function() { return this.parentNode; },
   getPreviousSibling : function() { return this.previousSibling; },
   hasNext : function() { return !(this.nextSibling == null); },
   isVisible : function() { return this.visible; },

   // private methods
   compileConstructionChain : function(){
      this.constructionChain.chain( 
         this.createNodeWrapperElement, 
         this.createNodeHandlerImage, 
         this.createNodeIcon, 
         this.createNodeCaption, 
         this.insertTrailingImages, 
         this.finalizeConstruction
      );
   }.protect(),
   
   createNodeCaption : function(nobrElement) {
      var elementOptions = { 'class' : this.nodeType.getCaptionClass(), 'id' : this.nodeID };
      this.nodeCaptionElement = this.elementFactory.create( 'span', this.caption, this.nodeWrapperElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      this.constructionChain.callChain();
   }.protect(),

   createNodeHandlerImage : function() {
      var elementOptions = { 'class' : this.nodeType.getNodeHandlerClass() + " " + this.nodeType.getNodeImageClass(), 'src' : this.nodeType.determineNodeHandlerImage( this ) };
      this.nodeHandlerElement = this.elementFactory.create( 'img', null, this.nodeWrapperElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      this.constructionChain.callChain();
   }.protect(),

   createNodeIcon : function() {
      var elementOptions = { 'class' : this.nodeType.getNodeIconClass() + " " + this.nodeType.getNodeImageClass(), 'src' : this.imageUri };
      this.nodeIconElement = this.elementFactory.create( 'img', null, this.nodeWrapperElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      this.constructionChain.callChain();
   }.protect(),

   createNodeWrapperElement : function() {
      var contextElement = this.determineWrapperContextElement();
      var contextPosition = this.determinWrapperContextPosition();
      var elementOptions = { 'class' : this.nodeType.getNodeWrapperClass() };
      this.nodeWrapperElement = this.elementFactory.create( 'div', null, contextElement, contextPosition, elementOptions );
      this.constructionChain.callChain();
   }.protect(),

   destroyNodeElement: function( nodeElement ){
      if( nodeElement && nodeElement.removeEvents ) nodeElement.removeEvents();
      if( nodeElement && nodeElement.destroy ) nodeElement.destroy();
   }.protect(),
   
   destroyTrailingImages : function(){
      this.trailingImages.each( function( imageElement, index ){
         this.destroyNodeElement( imageElement );
      }.bind( this ));
      
      this.trailingImages.clear();
   }.protect(),
   
   determineWrapperContextElement : function(){
      if( this.previousSibling ) {
         if( instanceOf( this.previousSibling, CompositeTreeNode )) 
            return this.previousSibling.findLastVisibleChild().getNodeWrapperElement();
         else return this.previousSibling.getNodeWrapperElement();
      }else return this.parentNode.getNodeWrapperElement();
   }.protect(),
   
   determinWrapperContextPosition : function(){
      if( this.previousSibling || ( this.parentNode && !instanceOf( this.parentNode, RootTreeNode ))) 
         return WidgetElementFactory.Positions.After;
      else return WidgetElementFactory.Positions.LastChild;
   }.protect(),
   
   finalizeConstruction : function(){
      this.state = BrowserWidget.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this );
   }.protect(),
   
   implementCompositeIfChildNodesExists : function(){
      var childNodeElements = XmlResource.selectNodes( this.options.childNodesSelector, this.nodeResource );
      if( childNodeElements ){
         this.implement({ alert: function(text){ alert(text); }});
         this.unmarshallChildNodes();
      }
   }.protect(),

   insertTrailingImages : function(nobrElement, thePrefix) {
      var currentNode = this.getParentNode();
      while( currentNode ){
         var imageSource = currentNode.hasNext() ? this.nodeType.getTrailingImageWhenParentHasNext() : this.nodeType.getTrailingImageWhenParentIsLast();
         var elementOptions = { 'class' : this.nodeType.getTrailingImageClass() + " " + this.nodeType.getNodeImageClass(), 'src' : imageSource };
         this.trailingImages.add( this.elementFactory.create( 'img', null, this.nodeWrapperElement, WidgetElementFactory.Positions.FirstChild, elementOptions ));

         currentNode = currentNode.getParentNode();
      }
      this.constructionChain.callChain();
   }.protect(),

   unmarshallMessage: function(){
      var messageResource = XmlResource.selectNode( this.options.messageSelector, this.nodeResource );
      if( messageResource ){
         this.message = new WebUIMessage({ messageResource : messageResource });
         this.message.unmarshall();
      } 
   }.protect(),
   
   unmarshallProperties: function(){
      this.nodeID = XmlResource.selectNodeText( this.options.nodeIDSelector, this.nodeResource );
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.nodeResource );
      this.imageUri = XmlResource.selectNodeText( this.options.imageUriSelector, this.nodeResource, this.options.dataXmlNameSpace, this.nodeType.determineNodeImage( this ));
      this.orderNumber = XmlResource.selectNodeText( this.options.orderNumberSelector, this.nodeResource );
   }.protect()
});