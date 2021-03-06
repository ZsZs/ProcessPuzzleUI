/*
Name:
    - PartyEventWidget
Description: 
    - Shows list of events to the user. The level details can be customized.
Requires:
    - BrowserWidget
Provides:
    - PartyEventWidget

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

var PartyEventWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['constructEvents', 'destroyEvents'],
   
   options : {
      componentName : "PartyEventWidget",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com' xmlns:pe='http://www.processpuzzle.com/PartyEvent'",
      eventOptions : {},
      eventsSelector : "/pe:eventList/pe:events/pe:event",
      useLocalizedData : true,
      widgetContainerId : "EventWidget"
   },
   
   //Constructor
   initialize : function( options, resourceBundle, elementFactoryOptions ) {
      this.parent( options, resourceBundle, elementFactoryOptions );
      
      this.events = new ArrayList();
   },

   //Public accesors and mutators
   
   //Properties
   getEvents : function() { return this.events; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructEvents, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain : function(){
      this.destructionChain.chain( this.destroyEvents, this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   constructEvents : function(){
      this.events.each( function( event, index ){
         event.construct( this.containerElement );
      }.bind( this ));
      
      this.constructionChain.callChain();
   }.protect(),
   
   destroyEvents : function(){
      this.events.each( function( event, index ){
         event.destroy();
      }.bind( this ));
      
      this.destructionChain.callChain();
   }.protect(),
   
   unmarshallComponents : function(){
      var eventElements = this.dataXml.selectNodes( this.options.eventsSelector );
      if( eventElements ){
         eventElements.each( function( eventElement, index ){
            var event = new PartyEvent( eventElement, this.elementFactory, this.options.eventOptions );
            event.unmarshall();
            this.events.add( event );
         }.bind( this ));
      }      
   }.protect()
});
