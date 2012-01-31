/*
Name: DesktopElementFactory

Description: Instantiates a new subclass of DesktopElement according to the given XML element.

Requires:

Provides:
    - DesktopElementFactory

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


var DesktopElementFactory = new Class({
   Implements: Options,
   
   options: {   
   },
   
   initialize: function(){
   },

   create: function( definitionXmlElement, bundle, options ){
      var newDesktopElement;
      switch( definitionXmlElement.tagName.toUpperCase() ){
      case "COMPOSITEELEMENT": 
         newDesktopElement = new CompositeDesktopElement( definitionXmlElement, bundle, options ); break;
      case "DOCUMENTBODY": 
         newDesktopElement = new DesktopBody( definitionXmlElement, bundle, options ); break;
      case "FOOTER": 
         newDesktopElement = new DesktopFooter( definitionXmlElement, bundle, options ); break;
      case "FOOTERBAR": 
         newDesktopElement = new DesktopFooterBar( definitionXmlElement, bundle, options ); break;
      case "HEADER": 
         newDesktopElement = new DesktopHeader( definitionXmlElement, bundle, options ); break;
      case "NAVIGATIONBAR": 
         newDesktopElement = new DesktopNavigationBar( definitionXmlElement, bundle, options ); break;
      case "TITLEBAR": 
         newDesktopElement = new DesktopTitleBar( definitionXmlElement, bundle, options ); break;
      case "ELEMENT":
      default:
         newDesktopElement = new DesktopElement( definitionXmlElement, bundle, options ); break;
      }
      
      return newDesktopElement;
   }
});

DesktopElementFactory.create = function(  definitionXmlElement, bundle, options ){
   var factory = new DesktopElementFactory();
   var element = factory.create( definitionXmlElement, bundle, options );
   return element;
};
