/*
Name: 
   - WidgetConstructedMessage

Description: 
   - This message sent out when a widget is constructed.

Requires:
   - WebUIMessage

Provides:
   - WidgettedMessage

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
//= require ../AbstractDocument/AbstractDocument.js
//= require ../WebUIMessageBus/WebUIMessage.js

var WidgetConstuctedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      activityType: null,
      description: "New widget was constructed.",
      name: "WidgetConstructedMessage",
      notification: null,
      windowName: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = WidgetConstuctedMessage;
   },
   
   //Public accessors
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getContextItemId: function() { return this.options.contextItemId; },
   getNotification: function() { return this.options.notification; },
   getWindowName: function() { return this.options.windowName; }
});

