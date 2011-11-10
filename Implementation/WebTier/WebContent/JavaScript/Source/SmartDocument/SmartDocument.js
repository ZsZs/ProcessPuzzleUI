/*Name: SmartDocumentDescription: Represents a document of a Panel. Reads it's own structure and content from xml files and constructs HTML based on them.Requires:Provides:    - SmartDocumentPart of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. http://www.processpuzzle.comAuthors:     - Zsolt ZsuffaCopyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty ofMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.*/var SmartDocument = new Class({   Implements : [Events, Options],   Binds : ['constructBody', 'constructFooter', 'constructHeader', 'determineContainerElement', 'loadResources', 'onResourcesLoaded'],      options : {      componentName : "SmartDocument",      descriptionSelector : "smartDocumentDefinition/description",      documentContentUri : "DocumentContent.xml",      documentDefinitionUri : "DocumentDefinition.xml",      bodySelector : "smartDocumentDefinition/documentBody",      footerSelector : "smartDocumentDefinition/documentFooter",      headerSelector : "smartDocumentDefinition/documentHeader",      nameSelector : "smartDocumentDefinition/name",      resourcesSelector : "smartDocumentDefinition/documentResources",      versionSelector : "smartDocumentDefinition/version",      widgetContainerId : "SmartDocument"   },      //Constructor   initialize : function( i18Resource, options ) {      this.setOptions( options );      this.constructionChain = new Chain();      this.documentBody = null;      this.documentFooter = null;      this.documentHeader = null;      this.containerElement;      this.description = null;      this.documentData;      this.documentDefinition;      this.i18Resource = i18Resource;      this.name = null;      this.resources = null;      this.version = null;            this.loadDocumentDefinition();      this.loadDocumentData();   },   //Public accesors and mutators   construct: function(){      this.constructionChain.chain(         this.determineContainerElement,         this.loadResources,         this.constructHeader,         this.constructBody,         this.constructFooter      ).callChain();   },      destroy: function() {      if( this.resources ) this.resources.release();      if( this.documentHeader ) this.documentHeader.destroy();      if( this.documentBody ) this.documentBody.destroy();      if( this.documentFooter ) this.documentFooter.destroy();      this.constructionChain.clearChain();   },      onResourcesLoaded: function(){      this.constructionChain.callChain();   },      unmarshall: function(){      this.unmarshallDocumentDefinition();      this.unmarshallResources();      this.documentHeader = this.unmarshallDocumentComponent( this.options.headerSelector );      this.documentBody = this.unmarshallDocumentComponent( this.options.bodySelector );      this.documentFooter = this.unmarshallDocumentComponent( this.options.footerSelector );   },      //Properties   getBody: function() { return this.documentBody; },   getContainerElement: function() { return this.containerElement; },   getDescription: function() { return this.description; },   getDocumentData: function() { return this.documentData; },   getDocumentDefinition: function() { return this.documentDefinition; },   getFooter: function() { return this.documentFooter; },   getHeader: function() { return this.documentHeader; },   getName: function() { return this.name; },   getResources: function() { return this.resources; },   getVersion: function() { return this.version; },      //Protected, private helper methods   constructBody : function(){      if( this.documentBody ) this.documentBody.construct( this.containerElement, 'bottom' );      this.constructionChain.callChain();   }.protect(),      constructFooter: function(){      if( this.documentFooter ) this.documentFooter.construct( this.containerElement, 'bottom' );      this.constructionChain.callChain();      this.fireEvent('documentReady', this );   }.protect(),      constructHeader: function(){      if( this.documentHeader ) this.documentHeader.construct( this.containerElement, 'bottom' );      this.constructionChain.callChain();   }.protect(),      determineContainerElement: function(){      this.containerElement = $( this.options.widgetContainerId );      this.constructionChain.callChain();   }.protect(),      loadDocumentData: function() {      this.documentData = new XmlResource( this.options.documentContentUri );   }.protect(),      loadDocumentDefinition: function() {      this.documentDefinition = new XmlResource( this.options.documentDefinitionUri );   }.protect(),      loadResources: function(){      if( this.resources ) this.resources.load();      else this.constructionChain.callChain();   }.protect(),      unmarshallDocumentComponent: function( selector ){      var documentComponent = null;      var componentDefinition = this.documentDefinition.selectNode( selector );      if( componentDefinition )         documentComponent = DocumentElementFactory.create( componentDefinition, this.i18Resource, this.documentData );            if( documentComponent ) documentComponent.unmarshall();      return documentComponent;   }.protect(),      unmarshallDocumentDefinition: function(){      this.description = this.documentDefinition.selectNodeText( this.options.descriptionSelector );      this.name = this.documentDefinition.selectNodeText( this.options.nameSelector );      this.version = this.documentDefinition.selectNodeText( this.options.versionSelector );   }.protect(),      unmarshallResources: function(){      var resourcesElement = this.documentDefinition.selectNode( this.options.resourcesSelector );      if( resourcesElement ){         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded } );         this.resources.unmarshall();      }   }.protect()});