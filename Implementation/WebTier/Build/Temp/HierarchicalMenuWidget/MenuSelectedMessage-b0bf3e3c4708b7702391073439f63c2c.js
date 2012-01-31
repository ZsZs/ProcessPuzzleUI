//MenuSelectedMessage.js
/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


var MenuSelectedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      activityType: null,
      description: "A message about the event that a menu or tool bar item was selected.",
      documentContentURI: null,
      documentType: AbstractDocument.Types.SMART,
      documentURI: null,
      contextItemId : null,
      name: "MenuSelectedMessage",
      notification: null,
      windowName: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = MenuSelectedMessage;
   },
   
   //Public accessors
   
   //Properties
   getActionType: function() { return this.options.actionType; },
   getActivityType: function() { return this.options.activityType; },
   getContextItemId: function() { return this.options.contextItemId; },
   getDocumentContentURI: function() { return this.options.documentContentURI; },
   getDocumentType: function() { return this.options.documentType; },
   getDocumentURI: function() { return this.options.documentURI; },
   getNotification: function() { return this.options.notification; },
   getWindowName: function() { return this.options.windowName; }
});

