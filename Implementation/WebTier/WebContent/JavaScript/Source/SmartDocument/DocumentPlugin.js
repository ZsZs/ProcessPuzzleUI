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

//= require_directory ../FundamentalTypes

var DocumentPlugin = new Class({
   Implements: [Events, Options],
   Binds: ['finalizeConstruction', 'instantiateWidget', 'loadResources', 'onResourceError', 'onResourcesLoaded', 'onWidgetConstructed'],   
   
   options: {
      componentName : "DocumentPlugin",
      nameSelector : "@name",
      optionsSelector : "widget/options",
      resourcesSelector : "resources",
      widgetNameSelector : "widget/@name"
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.setOptions( options );

      //Protected, private variables
      this.constructChain = new Chain();
      this.definitionElement = definitionElement;
      this.error = null;
      this.internationalization = internationalization;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.name;
      this.onLoad;
      this.resources;
      this.state = DocumentPlugin.States.INITIALIZED;
      this.widget;
      this.widgetName;
      this.widgetOptions;
      
      this.constructChain.chain( this.loadResources, this.instantiateWidget, this.finalizeConstruction );
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "' started." );
      this.constructChain.callChain();
   },
   
   destroy: function(){
      if( this.resources ) this.resources.release();
      if( this.widget && this.widget.destroy && typeOf( this.widget.destroy ) == 'function' ) this.widget.destroy();
      this.state = DocumentPlugin.States.INITIALIZED;
   },
   
   loadResources: function(){
      if( this.resources ) this.resources.load();
      else this.constructChain.callChain();
   },
   
   onResourceError: function( error ){
      this.error = error;
   },
   
   onResourcesLoaded: function(){
      if( this.resources.isSuccess() ){
         this.state = DocumentPlugin.States.LOADED;
         this.fireEvent( 'resourcesLoaded', this );
         this.constructChain.callChain();
      }else {
         this.constructChain.clearChain();
         this.resources.release();
         this.fireEvent( 'constructionError', this.error );
      }
   },
   
   onWidgetConstructed: function(){
      this.constructChain.callChain();
   },
   
   onWidgetError: function( error ){
      this.error = error;
      this.constructChain.clearChain();
      this.fireEvent( 'constructionError', this.error );
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallResources();
      this.unmarshallWidget();
      this.state = DocumentPlugin.States.UNMARSHALLED;
   },

   //Properties
   getDefinitionElement: function() { return this.definitionElement; },
   getError: function() { return this.error; },
   getOnLoad: function() { return this.onLoad; },
   getResources: function() { return this.resources; },
   getState: function() { return this.state; },
   getWidget: function() { return this.widget; },
   getWidgetName: function() { return this.widgetName; },
   getWidgetOptions: function() { return this.widgetOptions; },
   isSuccess: function() { return this.error == null; },

   //Protected, pirvated helper methods
   finalizeConstruction: function(){
      this.constructChain.clearChain();
      this.state = DocumentPlugin.States.CONSTRUCTED;
      this.fireEvent( 'constructed', this );
   }.protect(),
   
   instantiateWidget: function(){
      if( this.widgetName ){
         try{
            var widgetClass = eval( this.widgetName );
            var mergedOptions = Object.merge( this.widgetOptions, { onConstructed : this.onWidgetConstructed } );
            this.widget = new widgetClass( mergedOptions, this.internationalization );
            this.widget.unmarshall();
            this.widget.construct();
         }catch( exception ){
            this.onWidgetError( exception );
         }
      }else this.onWidgetConstructed();
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

DocumentPlugin.States = { INITIALIZED : 0, UNMARSHALLED : 1, LOADED : 2, CONSTRUCTED : 3 };