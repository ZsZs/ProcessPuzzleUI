/*
Name: DataElement

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - DataElement

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

var DataElement = new Class({
   Extends: DocumentElement,
   Implements: DataElementBehaviour,
   
   options: {
      componentName : "DataElement",
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      this.parent( definitionElement, bundle, options );
      
      //Private variables
      this.contextElement;
      this.bind;
      this.dataXml = data;
      this.dataElementsNumber = 1;
      this.maxOccures;
      this.minOccures;
      this.siblings = new ArrayList();
      this.source;
      this.where;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.contextElement = contextElement;
      this.where = where;
      this.retrieveData();
      this.constructSiblings();
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.destroySiblings();
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallDataProperties();
      this.loadDataSource();
      this.determineDataElementsNumber();
      this.instantiateSiblings();
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
});
