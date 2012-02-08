//WebUIMessageBus.js
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

//= require_directory ../FundamentalTypes

var WebUIMessageBus = new Class({
   Implements: [Class.Singleton, Options],
   options: {
      message: "hello"
   },

   //Constructors
   initialize: function( options ) { return this.check() || this.setUp( options ); },
   setUp : function( options ){
      this.setOptions( options );
      this.lastMessage = null;
      this.subscribersToMessages = new HashMap();
   }.protect(),
   
   //Public accessor and mutator methods
   notifySubscribers: function( message ){
      this.lastMessage = message;
      
      var messageClass = message.getClass();
      var subscribersToMessage = this.getSubscribersToMessage( messageClass );
      if( subscribersToMessage && subscribersToMessage.size() > 0 ){
         var largestIndex;
         subscribersToMessage.each( function( callBack, index ){
            callBack( message );
            largestIndex = index;
         }, this );
         return largestIndex;
      }else return null;
   },
   
   subscribeToMessage: function( messageClass, callBack ){
      var subscribersToMessage = this.getSubscribersToMessage( messageClass );
      if( subscribersToMessage == null ) subscribersToMessage = new ArrayList();
      subscribersToMessage.add( callBack );
      this.subscribersToMessages.put( messageClass.prototype.options.name, subscribersToMessage );
   },
   
   writeOffFromMessage: function( messageClass, callBack ){
      var subscribersToMessage = this.getSubscribersToMessage( messageClass );
      if( subscribersToMessage == null ) return;
      
      subscribersToMessage.remove( subscribersToMessage.indexOf( callBack ));
   },
   
   tearDown: function() {
      this.subscribersToMessages.clear();
   },
   
   //Properties
   getLastMessage: function() { return this.lastMessage; },
   getMessageListSize: function() { return this.subscribersToMessages.size(); },
   getSubscribersToMessage: function( messageClass ) { return this.subscribersToMessages.get( messageClass.prototype.options.name ); }
   
   //Private helper methods
});