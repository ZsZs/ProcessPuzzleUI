/*
Name: 
    - DocumentPlugin

Description: 
    - Represents an embedable active element of SmartDocument. The dynamic behaviour of ProcessPuzzleUI is provided by plugins. 

Requires:

Provides:
    - DocumentPlugin

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
//= require ../SmartDocument/DocumentElement.js

var DocumentPlugin = new Class({
   Extends: DocumentElement,
   Binds: ['destroyWidget', 'instantiateWidget', 'loadResources', 'onResourceError', 'onResourcesLoaded', 'onWidgetConstructed', 'onWidgetError', 'releaseResources'],   
   
   options: {
      componentName : "DocumentPlugin",
      nameSelector : "@name",
      optionsSelector : "sd:widget/sd:options",
      resourcesSelector : "sd:resources",
      widgetNameSelector : "sd:widget/@name"
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.parent( definitionElement, internationalization, options );

      //Protected, private variables
      this.name;
      this.resources;
      this.widget;
      this.widgetName;
      this.widgetOptions;
   },
   
   //Public mutators and accessor methods
   onResourceError: function( error ){
      this.revertConstruction( error );
   },
   
   onResourcesLoaded: function(){
      if( this.resources.isSuccess() ){
         this.fireEvent( 'resourcesLoaded', this );
         this.constructionChain.callChain();
      }else {
         this.error = new WebUIException({ description : "Loading plugin resources failed." });
         this.revertConstruction( this.error );
      }
   },
   
   onWidgetConstructed: function(){
      this.constructionChain.callChain();
   },
   
   onWidgetError: function( error ){
      this.revertConstruction( error );
   },
   
   unmarshall: function(){
      this.unmarshallResources();
      this.unmarshallWidget();
      this.parent();
   },

   //Properties
   getResources: function() { return this.resources; },
   getWidget: function() { return this.widget; },
   getWidgetName: function() { return this.widgetName; },
   getWidgetOptions: function() { return this.widgetOptions; },

   //Protected, pirvated helper methods
   compileConstructionChain : function(){
      this.constructionChain.chain( this.loadResources, this.instantiateWidget, this.authorization, this.associateEditor, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.releaseResources, this.destroyWidget, this.detachEditor, this.finalizeDestruction );
   }.protect(),
   
   destroyWidget: function(){
      if( this.widget && this.widget.destroy && typeOf( this.widget.destroy ) == 'function' ) this.widget.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   instantiateWidget: function(){
      if( this.widgetName ){
         try{
            var widgetClass = eval( this.widgetName );
            if( !this.widgetOptions['widgetContainerId'] ) this.widgetOptions['widgetContainerId'] = this.contextElement.get( 'id' );
            var mergedOptions = Object.merge( this.widgetOptions, { onConstructed : this.onWidgetConstructed, onError : this.onWidgetError } );
            this.widget = new widgetClass( mergedOptions, this.resourceBundle );
            this.widget.unmarshall();
            this.widget.construct();
         }catch( exception ){
            this.onWidgetError( new WidgetConstructionException( this.widgetName, { cause : exception }));
         }
      }else this.onWidgetConstructed();
   }.protect(),
   
   loadResources: function(){
      if( this.resources ) this.resources.load();
      else this.constructionChain.callChain();
   }.protect(),
   
   releaseResources: function(){
      if( this.resources ) this.resources.release();
      this.destructionChain.callChain();
   }.protect(),
   
   unmarshallOptions: function(){
      var optionsElement = XmlResource.selectNode( this.options.optionsSelector, this.definitionElement );
      if( optionsElement ){
         var optionsResource = new OptionsResource( optionsElement );
         optionsResource.unmarshall();
         this.widgetOptions = optionsResource.getOptions();
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionElement );
      this.parent();
   }.protect(),
   
   unmarshallResources: function() {
      var resourcesElement = XmlResource.selectNode( this.options.resourcesSelector, this.definitionElement );
      if( resourcesElement ){
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
         this.resources.unmarshall();
      }
   }.protect(),
   
   unmarshallWidget: function() {
      this.widgetName = XmlResource.selectNodeText( this.options.widgetNameSelector, this.definitionElement );
      this.unmarshallOptions();
   }
});

//DocumentPlugin.States = { INITIALIZED : 0, UNMARSHALLED : 1, LOADED : 2, CONSTRUCTED : 3 };