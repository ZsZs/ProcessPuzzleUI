/********************************* XmlResource ******************************
Name: XmlResource

Description: 

Requires:

Provides:

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
**/

var XmlResource = new Class({
   Extends: Request,

   options: {
      nameSpaces: "xmlns:pp='http://www.processpuzzle.com'",
      
      onComplete: function( responseAsText ) { 
         if( responseAsText ) {
            this.xmlAsText = responseAsText;
            
            if( this.options.parseOnComplete ) {
               this.xmlDoc = Sarissa.getDomDocument();
               var domParser = new DOMParser(); 
               this.xmlDoc = domParser.parseFromString( responseAsText, "text/xml" );
            }
         }
      },
      
      onException : function( headerName, value ) {
         //console.log( "Request header failed: '" + value + "'" );
      },
      
      onFailure : function( xhr ) {
         //console.log( "Request failed. status: '" + xhr.status + "'" );
      },
      
      parseOnComplete : true
   },
   
   // Constructor
   initialize: function ( uri, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      assertThat( Sarissa.XPATH_INITIALIZED, is( true ));
      
      this.parent( options );
      this.options.url = uri;
      this.options.method = 'get';
      this.options.async = false;
      this.xmlAsText = null;
      this.xmlDoc = null;
      
      //this.checkBrowserCompatibility();
      //this.refreshResource();
      
      //console.log('XmlResource is initialized.');
   },
   
   // Public accessor and mutator methods
   createElement : function( tagName, properties ){
      var newXmlElement = this.xmlDoc.createElement( tagName );
      if( properties && properties['text'] ) newXmlElement.appendChild( this.xmlDoc.createTextNode( properties['text'] ) );
      return newXmlElement;
   },
   
   determineAttributeValue : function( xmlElement, attributeName ) {
      return XmlResource.determineAttributeValue( xmlElement, attributeName );
   },
   
   determineNodeText : function( xmlElement ) {
      return XmlResource.determineNodeText( xmlElement );
   },
   
   injectElement : function( elementToInject, contextSelector, position ){
      assertThat( elementToInject, not( nil() ));
      assertThat( contextSelector, not( nil() ));
      
      var contextElement = this.selectNode( contextSelector );
      if( !contextElement ) throw new XPathSelectionException( contextSelector, this.options.url );
      
      contextElement.appendChild( elementToInject );
   },
   
   isSuccess: function() { // Determines if an XMLHttpRequest was successful or not
       try {
           // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
           return !this.status && location.protocol === "file:" ||
               // Opera returns 0 when status is 304
               ( this.status >= 200 && this.status < 300 ) ||
               this.status === 304 || this.status === 1223 || this.status === 0;
       } catch(e) {}

       return false;
   },
   
   release : function(){
      this.xmlDoc = null;
   },
   
   selectNode : function( selector, subNode ) {
      var selectedNodes = this.selectNodes( selector, subNode );
      if( selectedNodes )  return selectedNodes[0];
      else return null;
   }, 
   
   selectNodes : function( selector, subNode ) {
      var subjectNode = subNode != null ? subNode : this.xmlDoc;
      
      var foundXmlNodes = null;
      try {
         var foundXmlNodes = subjectNode.selectNodes( selector );
         if( typeOf( foundXmlNodes ) == 'collection' ){
            foundXmlNodes =  Array.from( foundXmlNodes );
         }
      }catch(e) {
         //console.log( e );
         //console.log( "Namespaces: " + subjectNode.getProperty( "SelectionNamespaces" ));
         return null;
      }
      return foundXmlNodes;
   },
   
   selectNodeText : function( selector, subNode, defaultValue ) {
      var selectedElements = this.selectNodes( selector, subNode );
      if( selectedElements.length > 0 && selectedElements[0] ) {
         return XmlResource.determineNodeText( selectedElements[0] );
      }else if( defaultValue ) return defaultValue;
      else return null;
   }, 
   
   refreshResource: function(){
      try {
         this.send( this.options.url );
      }catch( e ){
         throw new UndefinedXmlResourceException( this.options.url );
      }
      
      if( this.options.parseOnComplete && this.xmlDoc == null )
         throw new UndefinedXmlResourceException( this.options.url );
      
      if( this.xmlDoc ) {
         this.xmlDoc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'  " + this.options.nameSpaces ); 
         this.xmlDoc.setProperty("SelectionLanguage", "XPath");
      }
   },
   
   transform: function( xslt ){},
   
   // Properties
   getDocument: function() { return this.xmlDoc; },
   getUri: function() { return this.options.url; },
   getXmlAsText: function() { return this.xmlAsText; },
   isAsync: function() { return this.options.async; },
   
   //Private helper methods
   checkBrowserCompatibility: function(){
      if( window.XMLDocument && (!XMLDocument.prototype.setProperty )){
         XMLDocument.prototype.setProperty  = function(x,y){};
         SarissaNodeList = function (i){ this.length = i; };
        SarissaNodeList.prototype = [];
        SarissaNodeList.prototype.constructor = Array;
        SarissaNodeList.prototype.item = function(i) {
            return (i < 0 || i >= this.length)?null:this[i];
        };
        SarissaNodeList.prototype.expr = "";
        if(window.XMLDocument && (!XMLDocument.prototype.setProperty)){
            XMLDocument.prototype.setProperty  = function(x,y){};
        }
        Sarissa.setXpathNamespaces = function(oDoc, sNsSet) {
            //oDoc._sarissa_setXpathNamespaces(sNsSet);
            oDoc._sarissa_useCustomResolver = true;
            var namespaces = sNsSet.indexOf(" ")>-1?sNsSet.split(" "):[sNsSet];
            oDoc._sarissa_xpathNamespaces = [];
            for(var i=0;i < namespaces.length;i++){
                var ns = namespaces[i];
                var colonPos = ns.indexOf(":");
                var assignPos = ns.indexOf("=");
                if(colonPos > 0 && assignPos > colonPos+1){
                    var prefix = ns.substring(colonPos+1, assignPos);
                    var uri = ns.substring(assignPos+2, ns.length-1);
                    oDoc._sarissa_xpathNamespaces[prefix] = uri;
                }else{
                    throw "Bad format on namespace declaration(s) given";
                }
            }
        };
        XMLDocument.prototype._sarissa_useCustomResolver = false;
        XMLDocument.prototype._sarissa_xpathNamespaces = [];
        XMLDocument.prototype.selectNodes = function(sExpr, contextNode, returnSingle){
            var nsDoc = this;
            var nsresolver;
            if(this._sarissa_useCustomResolver){
                nsresolver = function(prefix){
                    var s = nsDoc._sarissa_xpathNamespaces[prefix];
                    if(s){ return s; }
                    else { throw "No namespace URI found for prefix: '" + prefix+"'"; }
                };
            }
            else{ nsresolver = this.createNSResolver(this.documentElement); }
            var result = null;
            if(!returnSingle){
                var oResult = this.evaluate( sExpr, (contextNode?contextNode:this), nsresolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                var nodeList = new SarissaNodeList(oResult.snapshotLength);
                nodeList.expr = sExpr;
                for(var i=0;i<nodeList.length;i++){
                    nodeList[i] = oResult.snapshotItem(i);
                }
                result = nodeList;
            }
            else {
                result = this.evaluate(sExpr, (contextNode?contextNode:this), nsresolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }
            return result;      
        };
        
        Element.prototype.selectNodes = function(sExpr){
            var doc = this.ownerDocument;
            if(doc.selectNodes){
                return doc.selectNodes(sExpr, this);
            }
            else{
                throw "Method selectNodes is only supported by XML Elements";
            }
        };
        XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode){
            var ctx = contextNode?contextNode:null;
            return this.selectNodes(sExpr, ctx, true);
        };
        Element.prototype.selectSingleNode = function(sExpr){
            var doc = this.ownerDocument;
            if(doc.selectSingleNode){
                return doc.selectSingleNode(sExpr, this);
            }
            else{
                throw "Method selectNodes is only supported by XML Elements";
            }
        };
        Sarissa.IS_ENABLED_SELECT_NODES = true;
      }
   }.protect()
});

//Static methods
XmlResource.determineAttributeValue = function( xmlElement, attributeName, defaultValue ) {
   var attributeElement = xmlElement.selectNodes( "@" + attributeName );
   if( attributeElement && attributeElement.length == 1 ) return attributeElement[0].nodeValue;
   else if( defaultValue ) return defaultValue;
   else return null;
};

XmlResource.determineNodeText = function( xmlElement, defaultValue ) {
   var nodeText = null;
   if( xmlElement ) {
      nodeText = Sarissa.getText( xmlElement );
      if( !nodeText ) nodeText = defaultValue;
   }
   
   return nodeText;
};

XmlResource.selectNode = function( selector, xmlElement ){
   var selectedNodes = XmlResource.selectNodes( selector, xmlElement );
   if( selectedNodes )  return selectedNodes[0];
   else return null;
};

XmlResource.selectNodes = function( selector, xmlElement ){
	var selectedElements = null;
	try{
		selectedElements = xmlElement.selectNodes( selector );
		if( typeOf( selectedElements ) == 'collection' ){
		   selectedElements = Array.from( selectedElements );
		}
	}catch( e ){
		log4javascript.getDefaultLogger().debug( "Selector: '" + selector + "' caused excection: " + e.message );
		return null;
	}
	return selectedElements;
};

XmlResource.selectNodeText = function( selector, xmlElement, nameSpaces, defaultValue ) {
   var selectedElement = XmlResource.selectNode( selector, xmlElement, nameSpaces );
   if( !selectedElement && defaultValue ) return defaultValue;
   else return XmlResource.determineNodeText( selectedElement, defaultValue );
};

Browser.Request = function(){
   return $try( function(){
      if( Browser.Engine.trident && window.location.protocol == "file:" )
         return new ActiveXObject('Microsoft.XMLHTTP');
      else 
         return new XMLHttpRequest();
   }, function(){
         return new ActiveXObject('MSXML2.XMLHTTP');
   }, function(){
      return new ActiveXObject('Microsoft.XMLHTTP');
   });
};

function XMLDocument () {
   var xmlDoc = null;

   if(document.implementation && document.implementation.createDocument)
   {  xmlDoc = document.implementation.createDocument("", "", null);

   }
   else if( window.ActiveXObject )
   {  xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
   }
   else
   {  alert('Your browser can\'t handle this script');
      return;
   }
   
   return xmlDoc;
}

function TransformXML( xmlFileName, xslFileName ) {
   var xml = new XmlResource( xmlFileName );
   var xsl = new XmlResource( xslFileName );
   var resultXml = XMLDocument();
   xml.transformNodeToObject(xsl,resultXml);
   return resultXml;
}

function XMLTransformator( xmlFileName, xslFileName ) {
   var sourceXML = new XML();
   sourceXML.load(  xmlFileName );
   
   var xslt = new XSLT( xslFileName );
   
   var resultXML = new XML();
   
   this.getSourceXML = function() { return sourceXML; };
   this.getResultXML = function() { return resultXML; };
   this.transform = _Transform;
   
   function _Transform() {
      resultXML = new XML( xslt.transform( sourceXML ));
      return resultXML.getDOM();
   }
}

function RemoveWhitespaceNodesFromXML( xml ) {
   var notWhitespace = /\S/;
   for( var i=0; i < xml.childNodes.length; i++ ) {
      if(xml.childNodes[i].nodeType == 3 && !notWhitespace.test(xml.childNodes[i].nodeValue)) {
         xml.removeChild(xml.childNodes[i]);
         i--;
      } else RemoveWhitespaceNodesFromXML(xml.childNodes[i]);
   }
}

XmlResource.Positions = {
      Before : 0,
      After : 1,
      FirstChild : 2,
      LastChild : 3,
      Undefined : 4 };