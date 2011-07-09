// XMLBundleParser.js
/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// XMLBundleParser
function XMLBundleParser() {
	//check parameter assertions

	inheritFrom(this, new SAXEventHandler());

	//private instance variables
	var cache = new ResourceCache();
	var parserLanguage, parserCountry, parserVariant;
	var targetLanguage, targetCountry, targetVariant;
	var buffer = new StringBuffer();
	var xmlResource = null;
	var xmlAsText = "";
	var key;
	var self = this;
	
	//public accessors methods
	
	//public mutators methods
	this.parse = _Parse;
	this.setXML = function (strXML) { xmlAsText = strXML; };
	this.characters = _Characters;
	this.startElement = _StartElement;
	this.endElement = _EndElement;

	//private method
	function _Parse(theCache, theFilename, theTargetLocale) {
	    cache = theCache;
	    targetLanguage = theTargetLocale.getLanguage();
	    targetCountry = theTargetLocale.getCountry();
	    targetVariant = theTargetLocale.getVariant();
	    var parser = new SAXDriver();
	    parser.setDocumentHandler(self);
	    parser.setLexicalHandler(self);
	    parser.setErrorHandler(self);
	    xmlResource = new XmlResource( theFilename, { parseOnComplete : false } );
	    parser.parse( xmlResource.getXmlAsText() );
	}

	function _InContext() {
	    if (parserLanguage == null || parserLanguage.equals(targetLanguage)) {
	        if (parserCountry == null || parserCountry.equals(targetCountry)) {
	        if (parserVariant == null || parserVariant.equals(targetVariant)) {
	            return true;
	        }
	        }
	    }
	    return false;
	}

	function _Characters(chars, offset, length) {
	    buffer.append(chars, offset, length);
	}

	function _StartElement(qName, attrs) {
	    if (qName.equals("Language")) {
	        parserLanguage = attrs.getValueByName("name");
	    }
	    if (qName.equals("Country")) {
	        parserCountry = attrs.getValueByName("name");
	    }
	    if (qName.equals("Variant")) {
	        parserVariant = attrs.getValueByName("name");
	    }
	    if (qName.equals("Resource")) {
	        key = new ResourceKey(attrs.getValueByName("key"), attrs.getValueByName("type"));
	    }
	}

	function _EndElement(qName) {
	    var content = buffer.toString().trim();
	    buffer.setLength(0);
	    if (qName.equals("Language")) {
	        parserLanguage = null;
	    }
	    if (qName.equals("Country")) {
	        parserCountry = null;
	    }
	    if (qName.equals("Variant")) {
	        parserVariant = null;
	    }
	    if (qName.equals("Resource") && _InContext()) {
	        cache.put(key, content);
	    }
	}
}