/*
Name: 
    - LocalizationResourceReference

Description: 
    - Determines localization resource URI or URIs from xml definition segment.

Requires:
    - 
    
Provides:
    - LocalizationResourceReference

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

var LocalizationResourceReference = new Class({
   Implements : [AssertionBehavior, Options],
   options : {
      baseNameOnlyVersionExists : true,
      baseNameOnlyVersionExistsSelector : "@baseNameOnlyVersionExists",
      eventFireDelay : 2,
      isBackendOnly : false,
      isBackendOnlySelector : "@isBackendOnly",
      localeSpecificVersionExists : true,
      localeSpecificVersionExistsSelector : "@localeSpecificVersionsExists",
      nameSpase : "xmlns:pp='http://www.processpuzzle.com'"
   },

   // Constructor
   initialize : function( resourceDefinitionXml, options ) {
      this.assertThat( resourceDefinitionXml, not( nil() ), "LocalizationResourceReference.resourceDefinitionXml" );
      this.setOptions( options );

      this.localeUtil = new ProcessPuzzleLocaleUtil();
      this.resourceDefinitionXml = resourceDefinitionXml;
      this.uri;
   },

   // Public accessors and mutator methods
   expandedUris : function( locale ){
      var expandedUris;
      if( this.options.localeSpecificVersionExists ){
         expandedUris = this.localeUtil.getFileNameList( locale, this.getUri(), ".xml" );
         if( !this.options.baseNameOnlyVersionExists ){
            expandedUris.erase( this.getUri() + ".xml" );
         }
      }else{
         expandedUris = Array.from( this.getUri() + ".xml" );
      }

      return expandedUris;
   },
   
   unmarshall : function() {
      this.assertThat( this.resourceDefinitionXml, not( nil() ) );

      this.uri = XmlResource.determineNodeText( this.resourceDefinitionXml );
      this.options.baseNameOnlyVersionExists = parseBoolean( XmlResource.selectNodeText( this.options.baseNameOnlyVersionExistsSelector, this.resourceDefinitionXml, this.options.nameSpace, this.options.baseNameOnlyVersionExists ));
      this.options.isBackendOnly = parseBoolean( XmlResource.selectNodeText( this.options.isBackendOnlySelector, this.resourceDefinitionXml, this.options.nameSpace, this.options.isBackendOnly ));
      this.options.localeSpecificVersionExists = parseBoolean( XmlResource.selectNodeText( this.options.localeSpecificVersionExistsSelector, this.resourceDefinitionXml, this.options.nameSpace, this.options.localeSpecificVersionExists ));
   },

   // Properties
   getUri : function() { return this.uri; },
   isBaseNameOnlyVersionExists : function(){ return this.options.baseNameOnlyVersionExists; },
   isBackendOnly : function(){ return this.options.isBackendOnly; },
   isLocaleSpecificVersionExists : function() { return this.options.localeSpecificVersionExists; }

// private methods
});
