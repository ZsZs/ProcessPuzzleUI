/*
Name: 
   - DocumentSelectedMessage

Description: 
   - This message sent out when a document - either SmartDocument, local file or even RemoteDocument is selected.

Requires:
   - WebUIMessage

Provides:
   - DocumentSelectedMessage

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

var DocumentSelectedMessage = new Class({
   Extends: WebUIMessage,
   options: {
      actionType: null,
      activityType: null,
      description: "A message about the event that a SmartDocument of RemoteResource was selected.",
      documentContentURI: null,
      documentType: AbstractDocument.Types.SMART,
      documentURI: null,
      name: "DocumentSelectedMessage",
      notification: null,
      windowName: null
   },
   
   //Constructors
   initialize: function( options ){
      this.setOptions( options );
      this.options.messageClass = DocumentSelectedMessage;
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

