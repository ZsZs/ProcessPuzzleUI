/*
Name: DataElementBehaviour

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - DataElementBehaviour

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

var DataElementBehaviour = new Class({
   options: {
      bindSelector : "@bind",
      hrefSelector : "/@href",
      eventFireDelay : 2,
      indexVariable : "index",
      indexVariableSelector : "@indexVariable",
      maxOccuresSelector : "@maxOccures",
      minOccuresSelector : "@minOccures",
      overwriteElementReference : true,
      sourceSelector : "@source",
      variables : { index : "'*'" }
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      
      //Private variables
      this.bind;
      this.bindedData;
      this.dataXml = data;
      this.dataElementsNumber;
      this.href;
      this.maxOccures;
      this.minOccures;
      this.numberOfConstructedSiblings = 0;
      this.siblings;
      this.source;
   },
   
   //Public mutators and accessor methods
   onSiblingConstructed: function(){
      this.numberOfConstructedSiblings++;
      if( this.numberOfConstructedSiblings == this.siblings.size() ) this.constructionChain.callChain();
   },
   
   onSiblingConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'constructionError', this.error, this.options.eventFireDelay );
   },
   
   unmarshallDataBehaviour: function(){
      this.unmarshallDataProperties();
      this.loadDataSource();
      this.determineDataElementsNumber();
      this.instantiateSiblings();
   },

   //Properties
   getBind: function() { return this.bind; },
   getBindedData: function() { return this.bindedData; },
   getDataElementsIndex: function() { return this.dataElementsIndex; },
   getDataElementsNumber: function() { return this.dataElementsNumber; },
   getDataXml: function() { return this.dataXml; },
   getIndexVariable: function() { return this.options.indexVariable; },
   getMaxOccures: function() { return this.maxOccures; },
   getMinOccures: function() { return this.minOccures; },
   getSiblings: function() { return this.siblings; },
   getSource: function() { return this.source; },
   
   //Protected, private helper methods
   checkIfBindVariableNeeded: function(){
      if( this.maxOccures ){
         if(( this.maxOccures == 'unbounded' || this.maxOccures > 0 ) && ( this.bind.search( "{.*}" ) == -1 )) 
            throw new MissingBindVariableException( this.id );
      }

   }.protect(),
   
   constructSiblings: function(){
      if( this.siblings.size() > 0 ){
         this.numberOfConstructedSiblings = 0;
         this.siblings.each( function( siblingElement, index ){
            siblingElement.construct( this.contextElement, this.where );
         }, this );      
      }else this.constructionChain.callChain();
   }.protect(),
   
   determineDataElementsNumber: function(){
      var dataSelector = this.bind.substitute( this.options.variables );
      this.bindedData = this.dataXml.selectNodes( dataSelector );
      if( this.maxOccures == 'unbounded' && this.bindedData.length > 1 ) this.dataElementsNumber = this.bindedData.length;
      if( this.maxOccures > 1 && this.maxOccures < this.bindedData.length ) this.dataElementsNumber = this.maxOccures;
   }.protect(),
   
   destroySiblings: function(){
      this.siblings.each( function( siblingElement, index ){
         siblingElement.destroy();
      }, this );
      
      this.numberOfConstructedSiblings = 0;
   }.protect(),
   
   initializeBindVariables : function(){
      if( !this.options.variables[this.options.indexVariable] )
         this.options.variables[this.options.indexVariable] = "'*'";
   }.protect(),
   
   instantiateSiblings: function() {
      for( var i = 2; i <= this.dataElementsNumber; i++ ){
         var variables = this.options.variables;
         variables[this.options.indexVariable] = i;
         var siblingElement = DocumentElementFactory.create( this.definitionElement, this.resourceBundle, this.dataXml, { 
            onConstructed : this.onSiblingConstructed, 
            onConstructionError : this.onSiblingConstructionError, 
            variables : variables });
         siblingElement.unmarshall();
         this.siblings.add( siblingElement );
      }
      
      if( this.dataElementsNumber > 1 ) {
         this.options.variables[this.options.indexVariable] = 1;
      }
   }.protect(),
   
   loadDataSource: function(){
      if( this.source ){
         this.dataXml = new XmlResource( this.source );
      }
   }.protect(),
   
   resetProperties: function(){
      this.bind = null;
      this.maxOccures = null;
      this.minOccures = null;
      this.source = null;
   }.protect(),
   
   retrieveData: function(){
      if( this.bind && this.dataXml ){
         var dataSelector = this.bind.substitute( this.options.variables );
         var href = null;
         if( instanceOf( this.dataXml, XmlResource ) ){
            this.text = this.dataXml.selectNodeText( dataSelector );
            href = this.dataXml.selectNodeText( dataSelector + this.options.hrefSelector );
         }else if( typeOf( this.dataXml ) == "element" ){
            if( dataSelector.indexOf( "/" ) < 0 ){
               this.text = XmlResource.determineNodeText( this.dataXml );
            }else{
               this.text = XmlResource.selectNodeText( dataSelector, this.dataXml );
            }
            href = XmlResource.selectNodeText( dataSelector + this.options.hrefSelector, this.dataXml );
         }
      
         if( this.text ) this.text.trim();
         if( href && this.options.overwriteElementReference ) this.reference = href;
      }      
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallDataProperties: function(){
      this.bind = this.definitionElementAttribute( this.options.bindSelector );
      this.options.indexVariable = this.definitionElementAttribute( this.options.indexVariableSelector, this.options.indexVariable );
      this.maxOccures = this.definitionElementAttribute( this.options.maxOccuresSelector );
      this.minOccures = this.definitionElementAttribute( this.options.minOccuresSelector );
      this.source = this.definitionElementAttribute( this.options.sourceSelector );
      
      this.checkIfBindVariableNeeded();
      this.initializeBindVariables();
   }
});
