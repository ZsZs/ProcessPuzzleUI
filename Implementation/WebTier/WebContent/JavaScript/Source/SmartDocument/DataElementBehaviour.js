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
      maxOccuresSelector : "@maxOccures",
      minOccuresSelector : "@minOccures",
      sourceSelector : "@source",
      variables : { index : "'*'" }
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      
      //Private variables
      this.bind;
      this.dataXml = data;
      //this.dataElementsIndex = index ? index : 0;
      this.dataElementsNumber;
      this.maxOccures;
      this.minOccures;
      this.numberOfConstructedSiblings;
      this.siblings;
      this.source;
   },
   
   //Public mutators and accessor methods
   onSiblingConstructed: function(){
      this.numberOfConstructedSiblings++;
      if( this.numberOfConstructedSiblings == this.siblings.size() ) this.constructionChain.callChain();
   },
   
   //Properties
   getDataElementsIndex: function() { return this.dataElementsIndex; },
   getDataElementsNumber: function() { return this.dataElementsNumber; },
   getDataXml: function() { return this.dataXml; },
   getBind: function() { return this.bind; },
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
         this.siblings.each( function( siblingElement, index ){
            siblingElement.construct( this.contextElement, this.where );
         }, this );      
      }else this.constructionChain.callChain();
   }.protect(),
   
   determineDataElementsNumber: function(){
      var dataSelector = this.bind.substitute( this.options.variables );
      var bindedData = this.dataXml.selectNodes( dataSelector );
      if( this.maxOccures == 'unbounded' && bindedData.length > 1 ) this.dataElementsNumber = bindedData.length;
      if( this.maxOccures > 1 && this.maxOccures < bindedData.length ) this.dataElementsNumber = this.maxOccures;
   }.protect(),
   
   destroySiblings: function(){
      this.siblings.each( function( siblingElement, index ){
         siblingElement.destroy();
      }, this );
      
   }.protect(),
   
   instantiateSiblings: function() {
      for( var i = 2; i <= this.dataElementsNumber; i++ ){
         var siblingElement = DocumentElementFactory.create( this.definitionElement, this.resourceBundle, this.dataXml, { onConstructed : this.onSiblingConstructed, variables : { index : i } });
         siblingElement.unmarshall();
         this.siblings.add( siblingElement );
      }
      
      if( this.dataElementsNumber > 1 ) {
         this.options.variables = { index : 1 };
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
      if( this.bind && this.dataXml && instanceOf( this.dataXml, XmlResource ) ){
         var dataSelector = this.bind.substitute( this.options.variables );
         this.text = this.dataXml.selectNodeText( dataSelector );
         if( this.text ) this.text.trim();
      }      
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallDataProperties: function(){
      this.bind = this.definitionElementAttribute( this.options.bindSelector );
      this.maxOccures = this.definitionElementAttribute( this.options.maxOccuresSelector );
      this.minOccures = this.definitionElementAttribute( this.options.minOccuresSelector );
      this.source = this.definitionElementAttribute( this.options.sourceSelector );
      
      this.checkIfBindVariableNeeded();
   }
});
