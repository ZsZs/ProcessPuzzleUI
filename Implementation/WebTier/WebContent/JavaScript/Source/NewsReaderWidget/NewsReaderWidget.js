/*
Name: 
    - NewsReaderWidget

Description: 
    - Shows RSS feed to the user. The levevel details can be customized.

Requires:
    - 
Provides:
    - NewsReaderWidget

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
//= require ../BrowserWidget/BrowserWidget.js

var NewsReaderWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['constructChannel', 'destroyChannel'],
   
   options : {
      channelOptions : {},
      channelSelector : "/pn:rss/pn:channel",
      componentName : "NewsReaderWidget",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com' xmlns:pn='http://www.processpuzzle.com/PartyNews'",
      useLocalizedData : true,
      widgetContainerId : "NewsReaderWidget"
   },
   
   //Constructor
   initialize : function( options, resourceBundle, elementFactoryOptions ) {
      this.parent( options, resourceBundle, elementFactoryOptions );
      
      this.channel;
   },

   //Public accesors and mutators
   
   //Properties
   getChannel : function() { return this.channel; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructChannel, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain : function(){
      this.destructionChain.chain( this.destroyChannel, this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   constructChannel : function(){
      this.channel.construct( this.containerElement );
      this.constructionChain.callChain();
   }.protect(),
   
   destroyChannel : function(){
      this.channel.destroy();
   }.protect(),
   
   unmarshallComponents : function(){
      var channelElement = this.dataXml.selectNode( this.options.channelSelector );
      if( channelElement ){
         this.channel = new RssChannel( this.dataXml, this.i18Resource, this.elementFactory, this.options.channelOptions );
         this.channel.unmarshall();
      }      
   }.protect()
});
