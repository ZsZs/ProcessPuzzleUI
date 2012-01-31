/*
Name: DocumentResource

Description: Represents an element in the <resources> part of the SmartDocumentDefinition.

Requires:

Provides:
    - DocumentResource

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


var DocumentResource = new Class({
   Implements: [Events, Options],
   Binds: ['checkResourceAvailability', 'onResourceLoaded'],   
   
   options: {
      idSelector : "@id",
      type : null
   },
   
   //Constructor
   initialize: function( resourceElement, options ){
      this.setOptions( options );
      this.availabilityCheckIsRunning;
      this.id = null;
      this.htmlElement = null;
      this.resourceElement = resourceElement;
      this.resourceAvailable = false;
      this.resourceUri = null;
      this.loadChain = new Chain();
      this.logger = Class.getInstanceOf( WebUILogger );
   },
   
   //Public mutators and accessor methods
   load: function(){
      if( !this.isResourceLoaded() ){
         this.loadChain.chain( this.checkResourceAvailability, this.loadResource ).callChain();
      }else this.onResourceLoaded();
   },
   
   onResourceError: function(){
      this.fireEvent( 'resourceError', this.resourceUri );
   },
   
   onResourceLoaded: function(){
      this.fireEvent( 'resourceLoaded', this );
   },
   
   release: function(){
      if( this.htmlElement ) this.htmlElement.destroy();
   },
   
   unmarshall: function(){
      this.id = XmlResource.selectNodeText( this.options.idSelector, this.resourceElement );
      this.resourceUri = XmlResource.determineNodeText( this.resourceElement );
   },

   //Properties
   getId: function() { return this.htmlElement.get( 'id' ); },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return this.resourceUri; },
   
   //Protected, private helper methods
   checkResourceAvailability: function(){
      this.remoteResource = new RemoteResource( this.resourceUri, {
         async: false,            
         onSuccess: function( responseText, responseXML ){ 
            this.resourceAvailable = true;
            this.availabilityCheckIsRunning = false;
            this.loadChain.callChain();
         }.bind( this ),
         onException: function( headerName, value ){ 
            this.loadChain.clearChain();
            if( this.availabilityCheckIsRunning ) {
               this.availabilityCheckIsRunning = false;
               this.onResourceError(); 
            }
         }.bind( this ),
         onFailure: function( xhr ) { 
            this.loadChain.clearChain();
            if( this.availabilityCheckIsRunning ) {
               this.availabilityCheckIsRunning = false;
               this.onResourceError(); 
            }
         }.bind( this )
      });
      
      try{
         this.availabilityCheckIsRunning = true;
         this.remoteResource.retrieve();
      }catch( e ){
         throw new UndefinedDocumentResourceException( this.resourceUri, { cause: e, source : this.componentName } );
      }
   }.protect()
});
