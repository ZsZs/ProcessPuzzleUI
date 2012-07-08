/*
Name: 
   - PartyEvent

Description: 
   - Represents and displays an event associated with a party.

Requires:
   - PartyEventWidget

Provides:
   - PartyEvent

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
//= require ../PartyEventWidget/PartyEventWidget.js

var PartyEvent = new Class({
   Implements: Options,

   options: {
      descriptionSelector: "description",
      descriptionStyle : "eventDescription",
      endDateSelector : "schedule/endDate",
      isFullDaySelector : "@isFullDay",
      linkSelector: "link",
      locationAddressSelector: "location/address",
      locationLinkSelector: "location/link",
      locationStyle : "eventLocation",
      programDescriptionSelector : "program/description",
      programLinkSelector : "program/link",
      publicationDateSelector: "pubDate",
      scheduleStyle: "eventSchedule",
      showDescription: true,
      showLocation: true,
      showSchedule: true,
      showTitle: true, 
      startDateSelector : "schedule/startDate",
      titleSelector: "title",
      titleStyle : "eventTitle",
      trancatedDescriptionEnding : "...",
      truncatedDescriptionLength : 120,
      truncateDescription : false
   },
   
   //Constructor
   initialize: function ( eventResource, elementFactory, options ) {
      // parameter assertions
      assertThat( eventResource, not( nil() ));      
      this.setOptions( options );
      
      this.containerElement;
      this.description;
      this.elementFactory = elementFactory;
      this.endDate;
      this.globalUniqueId;
      this.eventResource = eventResource;
      this.isFullDay;
      this.link;
      this.locationAddress;
      this.locationElement;
      this.locationLink;
      this.programDescription;
      this.programLink;
      this.publicationDate;
      this.scheduleElement;
      this.startDate;
      this.state = BrowserWidget.States.INITIALIZED;
      this.title;
   },
   
   //Public accessor and mutator methods
   construct: function( containerElement ){
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.containerElement = containerElement;
         this.createTitleElement();
         this.createDescriptionElement();
         this.createScheduleElement();
         this.createLocationElement();
         this.state = BrowserWidget.States.CONSTRUCTED;
      }
   },
   
   destroy: function(){
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.destroyPropertyElements();
         this.destroyScheduleElements();
         this.destroyLocationElements();
      }
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallSchedule();
      this.unmarshallLocation();
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getDescription: function() { return this.description; },
   getElementFactory: function() { return this.elementFactory; },
   getEndDate: function() { return this.endDate; },
   getGlobalUniqueId: function() { return this.globalUniqueId; },
   getLink: function() { return this.link; },
   getLocationAddress: function() { return this.locationAddress; },
   getLocationLink: function() { return this.locationLink; },
   getProgramDescription: function() { return this.programDescription; },
   getProgramLink: function() { return this.programLink; },
   getPublicationDate: function() { return this.publicationDate; },
   getStartDate: function() { return this.startDate; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   
   //Private helper methods
   createDescriptionElement : function(){
      if( this.options.showDescription ){
         var elementOptions = { 'class' : this.options.descriptionStyle };
         var descriptionText;
         if( this.options.truncateDescription ){
            descriptionText = this.description.substr( 0, this.options.truncatedDescriptionLength ) + this.options.trancatedDescriptionEnding;
         }else {
            descriptionText = this.description;
         }
         this.descriptionElement = this.elementFactory.create( 'div', descriptionText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createLocationElement : function(){
      if( this.options.showLocation ){
         var elementOptions = { 'class' : this.options.locationStyle };
         this.locationElement = this.elementFactory.create( 'div', this.locationAddress, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createScheduleElement : function(){
      if( this.options.showSchedule ){
         var elementOptions = { 'class' : this.options.scheduleStyle };
         var scheduleText = this.startDate + " - " + this.endDate;
         this.scheduleElement = this.elementFactory.create( 'div', scheduleText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createTitleElement : function(){
      var elementOptions = { 'class' : this.options.titleStyle };
      var elementText = this.link ? null : this.title;
      this.titleElement = this.elementFactory.create( 'div', elementText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      
      if( this.link ){
         this.elementFactory.createAnchor( this.title, this.link, null, this.titleElement );
      }
   }.protect(),
   
   destroyLocationElements: function(){
      this.destroyPropertyElement( this.locationElement );
   }.protect(),
   
   destroyPropertyElement: function( propertyElement ){
      if( propertyElement.removeEvents ) propertyElement.removeEvents();
      if( propertyElement.destroy ) propertyElement.destroy();
   }.protect(),
   
   destroyPropertyElements: function(){
      this.destroyPropertyElement( this.titleElement );
      this.destroyPropertyElement( this.descriptionElement );
   }.protect(),
   
   destroyScheduleElements: function(){
      this.destroyPropertyElement( this.scheduleElement );
   }.protect(),
   
   unmarshallLocation: function(){
      this.locationAddress = XmlResource.selectNodeText( this.options.locationAddressSelector, this.eventResource );
      this.locationLink = XmlResource.selectNodeText( this.options.locationLinkSelector, this.eventResource );
   }.protect(),
   
   unmarshallProperties: function(){
      this.description = XmlResource.selectNodeText( this.options.descriptionSelector, this.eventResource );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.eventResource );
      this.programDescription = XmlResource.selectNodeText( this.options.programDescriptionSelector, this.eventResource );
      this.programLink = XmlResource.selectNodeText( this.options.programLinkSelector, this.eventResource );
      this.publicationDate = XmlResource.selectNodeText( this.options.publicationDateSelector, this.eventResource );
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.eventResource );
   }.protect(),
   
   unmarshallSchedule: function(){
      this.isFullDay = XmlResource.selectNodeText( this.options.isFullDaySelector, this.eventResource );
      this.startDate = XmlResource.selectNodeText( this.options.startDateSelector, this.eventResource );
      this.endDate = XmlResource.selectNodeText( this.options.endDateSelector, this.eventResource );
   }.protect()
});
