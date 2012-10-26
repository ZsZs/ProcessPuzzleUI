/*
Name: 
    - MediaPlayerDisplay

Description: 
    - Represents the display components of the Media Player. It is composed from different subelements.

Requires:
   - 

Provides:
    - MediaPlayerDisplay

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

var MediaPlayerDisplay = new Class({
   Implements : [AssertionBehavior, Events, Options, TimeOutBehaviour],
   Binds: [
      'addControllerEvents',
      'addMediaEvents',
      'checkTimeOut', 
      'constructController',
      'constructScreen',
      'constructThumbnailsBar',
      'constructTitleBar',
      'destroyController',
      'destroyScreen', 
      'destroyThumbnailsBar',
      'destroyTitleBar',
      'finalizeConstruction', 
      'finalizeDestruction',
      'onComponentConstructed', 
      'onComponentDestructed',
      'onMediaBackward',
      'onMediaBeginning',
      'onMediaEnd',
      'onMediaForward',
      'onMediaStart',
      'onMediaStop',
      'onUpdateDisplay'],
   
   options : {
      eventDeliveryDelay : 5,
      startPaused : false
   },

   //Constructor
   initialize: function( containerElement, media, options ){
      this.setOptions( options );
      this.assertThat( containerElement, not( nil() ), this.options.componentName + ".containerElement" );
      this.assertThat( media, not( nil() ), this.options.componentName + ".media" );
      
      this.constructionChain = new Chain();
      this.containerElement = containerElement;
      this.controller;
      this.destructionChain = new Chain();
      this.error;
      this.media = media;
      this.screen;
      this.thumbnailsBar;
      this.titleBar;
   },
   
   //Public accessor and mutator methods
   construct : function() {
      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
         
      try{ this.constructionChain.callChain(); }
      catch( exception ){ this.revertConstruction( exception ); }
   },

   destroy : function() {
      this.compileDestructionChain();
      this.destructionChain.callChain();
   },

   onComponentConstructed : function( component ){
      this.constructionChain.callChain();
   },
   
   onComponentDestroyed : function( component ){
      this.destructionChain.callChain();
   },
   
   onMediaBackward : function(){
      this.media.backward();
   },

   onMediaBeginning : function(){
      this.media.beginning();
   },

   onMediaEnd : function(){
      this.media.end();
   },

   onMediaForward : function(){
      this.media.forward();
   },

   onMediaStart : function(){
      this.media.start();
   },

   onMediaStop : function(){
      this.media.stop();
   },

   onUpdateDisplay : function( imageData ){
      this.screen.update( imageData.imageUri );
      this.titleBar.update( imageData.title, false );
   },
   
   //Properties
   getController : function(){ return this.controller; },
   getScreen : function(){ return this.screen; },
   getThumbnailsBar : function(){ return this.thumbnailsBar; },
   getTitleBar : function(){ return this.titleBar; },
   
   //Protected, private helper methods
   addControllerEvents: function(){
      this.controller.addEvent( 'mediaBackward', this.onMediaBackward );
      this.controller.addEvent( 'mediaBeginning', this.onMediaBeginning );
      this.controller.addEvent( 'mediaEnd', this.onMediaEnd );
      this.controller.addEvent( 'mediaForward', this.onMediaForward );
      this.controller.addEvent( 'mediaStart', this.onMediaStart );
      this.controller.addEvent( 'mediaStop', this.onMediaStop );
      this.constructionChain.callChain();
   }.protect(),
   
   addMediaEvents: function(){
      this.media.addEvent( 'updateDisplay', this.onUpdateDisplay );
      this.constructionChain.callChain();
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.constructScreen, 
         this.constructTitleBar, 
         this.constructThumbnailsBar, 
         this.constructController,
         this.addControllerEvents,
         this.addMediaEvents, 
         this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyScreen, this.destroyTitleBar, this.destroyThumbnailsBar, this.destroyController, this.finalizeDestruction );
   }.protect(),
   
   constructController: function(){
      var displayOptions = { startPaused : this.options.startPaused };
      var eventHandlers = { onConstructed : this.onComponentConstructed, onDestroyed : this.onComponentDestroyed };
      this.controller = new MediaPlayerController( this.containerElement, this.screen, Object.merge( displayOptions, eventHandlers ));
      this.controller.construct();
   }.protect(),
   
   constructScreen: function(){
      this.screen = new MediaPlayerScreen( this.containerElement, { onConstructed : this.onComponentConstructed, onDestroyed : this.onComponentDestroyed });
      this.screen.construct();
   }.protect(),
   
   constructThumbnailsBar: function(){
      this.thumbnailsBar = new MediaPlayerThumbnailsBar( this.containerElement, this.media.getThumbnailsUri(), { 
         onConstructed : this.onComponentConstructed, 
         onDestroyed : this.onComponentDestroyed });
      this.thumbnailsBar.construct();
   }.protect(),
   
   constructTitleBar: function(){
      this.titleBar = new MediaPlayerTitleBar( this.containerElement, { onConstructed : this.onComponentConstructed, onDestroyed : this.onComponentDestroyed });
      this.titleBar.construct();
   }.protect(),
   
   destroyController: function(){
      if( this.controller ) this.controller.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyScreen: function(){
      if( this.screen ) this.screen.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyThumbnailsBar: function(){
      if( this.thumbnailsBar ) this.thumbnailsBar.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyTitleBar: function(){
      if( this.titleBar ) this.titleBar.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   finalizeConstruction : function(){
      this.constructionChain.clearChain();
      this.stopTimeOutTimer();
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   finalizeDestruction : function(){
      this.destructionChain.clearChain();
      this.fireEvent( 'destroyed', this, this.options.eventDeliveryDelay );
   }.protect(),

   revertConstruction : function( error ){
      this.error = error;
      this.stopTimeOutTimer();
      this.constructionChain.clearChain();
      this.fireEvent( 'constructionError', this.error );
   }.protect(),

   timeOut : function( exception ){
      this.revertConstruction( exception );
   }.protect()
   
});
