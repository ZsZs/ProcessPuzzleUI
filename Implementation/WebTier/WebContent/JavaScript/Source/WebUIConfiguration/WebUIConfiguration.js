//WebUIConfiguration.js
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

var WebUIConfiguration = new Class({
   Implements: [Class.Singleton, Options], 
   options: {
	  appenderBatchSizeSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@batchSize | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@batchSize | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@batchSize | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@batchSize",
	  appenderCommandLineObjectExpansionDepthSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@commandLineObjectExpansionDepth",
	  appenderComplainAboutPopUpBlockingSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@complainAboutPopUpBlocking | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@complainAboutPopUpBlocking | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@complainAboutPopUpBlocking | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@complainAboutPopUpBlocking",
      appenderContainerElementIdSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@containerElementId | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@containerElementId | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@containerElementId | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@containerElementId",
	  appenderFailCallbackSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@failCallback | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@failCallback | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@failCallback | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@failCallback",
	  appenderFocusPopUpSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@focusPopUp | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@focusPopUp | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@focusPopUp | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@focusPopUp",
      appenderHeightSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@height | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@height | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@height | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@height",
      appenderInitiallyMinimizedSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@initiallyMinimized | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@initiallyMinimized | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@initiallyMinimized | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@initiallyMinimized",
      appenderLayoutSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@layoutReference | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@layoutReference | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@layoutReference | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@layoutReference",
      appenderLazyInitSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@lazyInit | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@lazyInit | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@lazyInit | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@lazyInit",
      appenderMaxMessagesSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@maxMessages | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@maxMessages | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@maxMessages | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@maxMessages",
      appenderNameSelector : "@name",
      appenderNewestMessageAtTopSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@newestMessageAtTop | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@newestMessageAtTop | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@newestMessageAtTop | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@newestMessageAtTop",
      appenderPostVariableNameSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@postVariableName | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@postVariableName | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@postVariableName | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@postVariableName",
      appenderReopenWhenClosedSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@reopenWhenClosed | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@reopenWhenClosed | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@reopenWhenClosed | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@reopenWhenClosed",
      appenderRequestSuccessCallbackSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@requestSuccessCallback | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@requestSuccessCallback | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@requestSuccessCallback | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@requestSuccessCallback",
      appenderScrollToLatestMessageSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@scrollToLatestMessage | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@scrollToLatestMessage | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@scrollToLatestMessage | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@scrollToLatestMessage",
      appenderShowCommandLineSelector : "wui:appenders/ajaxAppender[@name='{appenderName}']/@showCommandLine | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@showCommandLine | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@showCommandLine | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@showCommandLine",
      appenderSendAllOnUnloadSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@sendAllOnUnload | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@sendAllOnUnload | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@sendAllOnUnload | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@sendAllOnUnload",
      appenderTimedSendingSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@timedSending | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@timedSending | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@timedSending | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@timedSending",
      appenderTimerIntervalSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@timerInterval | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@timerInterval | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@timerInterval | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@timerInterval",
      appenderThresholdSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@threshold | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@threshold | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@threshold | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@threshold",
      appenderTypeSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}'] | wui:appenders/wui:popUpAppender[@name='{appenderName}'] | wui:appenders/wui:inPageAppender[@name='{appenderName}'] | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']",
      appenderURLSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@url | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@url | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@url | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@url",
      appenderUseDocumentWriteSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@useDocumentWrite | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@useDocumentWrite | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@useDocumentWrite | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@useDocumentWrite",
      appenderUseOldPopUpSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@useOldPopUp | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@useOldPopUp | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@useOldPopUp | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@useOldPopUp",
      appenderWaitForResponseSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@waitForResponse | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@waitForResponse | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@waitForResponse | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@waitForResponse",
      appenderWidthSelector : "wui:appenders/wui:ajaxAppender[@name='{appenderName}']/@width | wui:appenders/wui:popUpAppender[@name='{appenderName}']/@width | wui:appenders/wui:inPageAppender[@name='{appenderName}']/@width | wui:appenders/wui:browserConsoleAppender[@name='{appenderName}']/@width",
      availableSkinElementsSelector : "wui:desktop/wui:availableSkins/wui:skin",
      defaultSkinSelector : "wui:desktop/wui:defaultSkin/@name",
      desktopConfigurationURISelector : "/pp:processPuzzleConfiguration/wui:webUI/wui:desktop/@configurationURI",
      i18DefaultLocaleSelector : "in:defaultLocale/text()",
      i18ElementSelector : "/pp:processPuzzleConfiguration/in:internationalization",
      i18LocaleSelector : "text()",
      i18LocaleElementsSelector : "in:availableLocales/in:locale",
      i18ResourceBundleElementsSelector : "in:resouceBundles/in:resourceBundle",
      i18ResourceBundleNameSelector : "text()",
      i18ResourceBundleNameSpaceSelector : "in:resouceBundles/@nameSpace",
      layoutElementsSelector : "wui:logging/wui:layouts/wui:patternLayout | wui:logging/wui:layouts/wui:xmlLayout",
      layoutNameSelector : "@name",
      layoutPatternSelector : "wui:layouts/wui:patternLayout[@name='{layoutName}']/@pattern | wui:layouts/wui:xmlLayout[@name='{layoutName}']/@pattern",
      loggerAppenderLayoutSelector : "wui:appender/@layout",
      loggerAppenderLevelSelector : "wui:appender/@level",
      loggerAppenderReferenceSelector : "wui:loggers/wui:logger[@name='{loggerName}']/wui:appenderReference/@name",
      loggerAppendersSelector : "wui:logging/wui:appenders/wui:ajaxAppender | wui:logging/wui:appenders/wui:popUpAppender | wui:logging/wui:appenders/wui:inPageAppender | wui:logging/wui:appenders/wui:browserConsoleAppender",
      loggerAppenderTypeSelector : "wui:appender/@type",
      loggerElementsSelector : "wui:logging/wui:loggers/wui:logger",
      loggerLayoutPatternSelector : "wui:layout/@pattern",
      loggerLayoutTypeSelector : "wui:layout/@type",
      loggerLevelSelector : "wui:loggers/wui:logger[@name='{loggerName}']/@level",
      loggerNameSelector : "@name",
      loggerIsDefaultSelector : "wui:loggers/wui:logger[@name='{loggerName}']/@isDefault",
      loggingSelector : "/pp:processPuzzleConfiguration/wui:webUI/wui:logging",
      menuDefinitionURISelector : "/pp:processPuzzleConfiguration/wui:webUI/wui:desktop/wui:menu/@definitionURI",
      nameSpaces: "xmlns:pp='http://www.processpuzzle.com' xmlns:ac='http://www.processpuzzle.com/ApplicationConfiguration' xmlns:bc='http://www.processpuzzle.com/BeanContainerConfiguration' xmlns:bd='http://www.processpuzzle.com/BusinessDefinitionsConfiguration' xmlns:bi='http://www.processpuzzle.com/BusinessImplementationsConfiguration' xmlns:dl='http://www.processpuzzle.com/DataLoadersConfiguration' xmlns:em='http://www.processpuzzle.com/EmailConfiguration' xmlns:fc='http://www.processpuzzle.com/FrontControllerConfiguration' xmlns:in='http://www.processpuzzle.com/InternationalizationConfiguration' xmlns:pr='http://www.processpuzzle.com/PersistenceConfiguration' xmlns:rt='http://www.processpuzzle.com/RuntimeConfiguration' xmlns:wui='http://www.processpuzzle.com/WebUIConfiguration'", 
      resourceBundleNameSpaceSelector : "xmlns:pp='http://www.processpuzzle.com'",
      skinConfigurationSelector : "wui:desktop/wui:availableSkins/wui:skin[@name='{skinName}']/@configurationURI",
      skinNameAttributeSelector : "@name",
      skinPathSelector : "wui:desktop/wui:availableSkins/wui:skin[@name='{skinName}']/@relativePath",
      skinPathAttributeSelector : "@relativePath",
      webUIElementSelector : "/pp:processPuzzleConfiguration/wui:webUI"
   },
   
   //Constructor
   initialize: function( configurationURI, options ) { return this.check() || this.setUp( configurationURI, options ); },
   setUp : function( configurationURI, options ) {
      this.setOptions( options );
      
      //Private instance variables
      this.configurationURI = configurationURI;
      this.i18Element = null;
      this.isLoaded = false;
      this.loggingElement = null;
      this.xmlResource = null;
      this.webUIElement = null;
      
      this.load();
   },
   
   load : function(){
      if( this.isLoaded ) this.release();

      this.xmlResource = new XmlResource( this.configurationURI, { nameSpaces : this.options.nameSpaces } );
      this.i18Element = this.xmlResource.selectNode( this.options.i18ElementSelector );
      this.loggingElement = this.xmlResource.selectNode( this.options.loggingSelector );
      this.webUIElement = this.xmlResource.selectNode( this.options.webUIElementSelector );
         
      this.isLoaded = true;
   },
   
   release : function(){
      if( this.isLoaded ){
         this.i18Element = null;
         this.loggingElement = null;
         this.xmlResource = null;
         this.webUIElement = null;
         this.isLoaded = false;
      }
   },
   
   //Public mutators and accessors
   getAvailableSkinElements : function() {return this.xmlResource.selectNodes( this.options.availableSkinElementsSelector, this.webUIElement );},
   getConfigurationElement : function() { return this.webUIElement; },
   getDefaultSkin : function() { return this.xmlResource.selectNode( this.options.defaultSkinSelector, this.webUIElement ).nodeValue; },
   getI18DefaultLocale : function() { return this.xmlResource.selectNode( this.options.i18DefaultLocaleSelector, this.i18Element ).nodeValue; },
   getI18Element : function() { return this.i18Element; },
   getI18Locale : function( localeIndex ){
      return this.xmlResource.selectNode( this.options.i18LocaleSelector, this.getI18LocaleElements()[localeIndex] ).nodeValue;
   },
   
   getI18LocaleElements : function() {return this.xmlResource.selectNodes( this.options.i18LocaleElementsSelector, this.i18Element );},
   getI18ResourceBundleElements : function() { return this.xmlResource.selectNodes( this.options.i18ResourceBundleElementsSelector, this.i18Element ); },
   
   getI18ResourceBundleName : function( resourceBundleIndex ){
      return this.xmlResource.selectNode( this.options.i18ResourceBundleNameSelector, this.getI18ResourceBundleElements()[resourceBundleIndex] ).nodeValue;
   },
   
   getI18ResourceBundleNameSpace : function() {
      return this.xmlResource.selectNode( this.options.i18ResourceBundleNameSpaceSelector, this.i18Element ).value;
   },
   
   getLoggerAppenderElement : function() {
      return this.xmlResource.selectNode( this.options.loggerAppenderSelector, this.webUIElement );
   },
   
   getLoggerAppenderType : function() { 
      return this.xmlResource.selectNode( this.options.loggerAppenderTypeSelector, this.loggingElement ).value;
   },
   
   getLoggerElements : function() {
      return this.xmlResource.selectNodes( this.options.loggerElementsSelector, this.webUIElement );
   },
   
   getLoggerLayoutElement : function() { 
      return this.xmlResource.selectNode( this.options.loggerLayoutSelector, this.loggingElement );
   },
   
   getLoggerLayoutPattern : function() { 
      return this.xmlResource.selectNode( this.options.loggerLayoutPatternSelector, this.loggingElement ).value;
   },
   
   getLoggerLayoutType : function() { 
      return this.xmlResource.selectNode( this.options.loggerLayoutTypeSelector, this.loggingElement ).value;
   },
   
   getLoggerLevel : function( loggerName ) {
      var selectorExp = this.options.loggerLevelSelector.substitute( {loggerName : loggerName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggerName : function( loggerIndex ) {
      var loggerElements = this.getLoggerElements();
      return this.xmlResource.selectNode( this.options.loggerNameSelector, loggerElements[loggerIndex] ).value;
   },

   getLoggingAppenderBatchSize : function( appenderName ) {
      var selectorExp = this.options.appenderBatchSizeSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
   
   getLoggingAppenderCommandLineObjectExpansionDepth : function( appenderName ) {
      var selectorExp = this.options.appenderCommandLineObjectExpansionDepthSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },
   
   getLoggingAppenderComplainAboutPopUpBlocking : function( appenderName ) {
      return this.determineLoggingElementValue( this.options.appenderComplainAboutPopUpBlockingSelector.substitute( {appenderName : appenderName} ) );
   },

   getLoggingAppenderContainerElementId : function( appenderName ) {
      return this.determineLoggingElementValue( this.options.appenderContainerElementIdSelector.substitute( {appenderName : appenderName} ) );
   },

   getLoggingAppenderElements : function() {
      return this.xmlResource.selectNodes( this.options.loggerAppendersSelector, this.webUIElement );
   },

   getLoggingAppenderFailCallback : function( appenderName ) {
      var selectorExp = this.options.appenderFailCallbackSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
   
   getLoggingAppenderFocusPopUp : function( appenderName ) {
      var selectorExp = this.options.appenderFocusPopUpSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderHeight : function( appenderName ) {
      return parseInt( this.determineLoggingElementValue( this.options.appenderHeightSelector.substitute( {appenderName : appenderName} )));
   },

   getLoggingAppenderInitiallyMinimized : function( appenderName ) {
      var configurationValue = this.determineLoggingElementValue( this.options.appenderInitiallyMinimizedSelector.substitute( {appenderName : appenderName} ));
      return new Boolean().parseBoolean( configurationValue );
   },

   getLoggingAppenderLazyInit : function( appenderName ) {
      var selectorExp = this.options.appenderLazyInitSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderLayoutReference : function( appenderName ) { 
      var selectorExp = this.options.appenderLayoutSelector.substitute( {appenderName : appenderName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggingAppenderMaxMessages : function( appenderName ) {
      var selectorExp = this.options.appenderMaxMessagesSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderName : function( appenderIndex ) {
      var appenderElements = this.getLoggingAppenderElements();
      return this.xmlResource.selectNode( this.options.appenderNameSelector, appenderElements[appenderIndex] ).value;
   },

   getLoggingAppenderNewestMessageAtTop : function( appenderName ) {
      var selectorExp = this.options.appenderNewestMessageAtTopSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderPostVariableName : function( appenderName ) {
      var selectorExp = this.options.appenderPostVariableNameSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},

   getLoggingAppenderReopenWhenClosed : function( appenderName ) {
      var selectorExp = this.options.appenderReopenWhenClosedSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderRequestSuccessCallback : function( appenderName ) {
      var selectorExp = this.options.appenderRequestSuccessCallbackSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
	
   getLoggingAppenderScrollToLatestMessage : function( appenderName ) {
      var selectorExp = this.options.appenderScrollToLatestMessageSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderSendAllOnUnload : function( appenderName ) {
      var selectorExp = this.options.appenderSendAllOnUnloadSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderShowCommandLine : function( appenderName ) {
      var selectorExp = this.options.appenderShowCommandLineSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderThreshold : function( appenderName ) { 
      return this.determineLoggingElementValue( this.options.appenderThresholdSelector.substitute( {appenderName : appenderName} ));
   },
   
   getLoggingAppenderTimedSending : function( appenderName ) {
      var selectorExp = this.options.appenderTimedSendingSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},

   getLoggingAppenderTimerInterval : function( appenderName ) {
      var selectorExp = this.options.appenderTimerIntervalSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},

   getLoggingAppenderType : function( appenderName ) {
      var selectorExp = this.options.appenderTypeSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.nodeName;
      else return null;
   },
   
	getLoggingAppenderURL : function( appenderName ) {
      var selectorExp = this.options.appenderURLSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderUseDocumentWrite : function( appenderName ) {
      return this.determineLoggingElementValue( this.options.appenderUseDocumentWriteSelector.substitute( {appenderName : appenderName} ) );
   },

   getLoggingAppenderUseOldPopUp : function( appenderName ) {
      var selectorExp = this.options.appenderUseOldPopUpSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   },

   getLoggingAppenderWaitForResponse : function( appenderName ) {
      var selectorExp = this.options.appenderWaitForResponseSelector.substitute( {appenderName : appenderName} );
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
	},
   
   getLoggingAppenderWidth : function( appenderName ) {
      return parseInt( this.determineLoggingElementValue( this.options.appenderWidthSelector.substitute( {appenderName : appenderName} )));
   },

	getLoggingLayoutName : function( layoutIndex ) {
      var layoutElements = this.getLoggingLayoutElements();
      return this.xmlResource.selectNode( this.options.layoutNameSelector, layoutElements[layoutIndex] ).value;
   },
   
   getLoggingLayoutElements : function() {
      return this.xmlResource.selectNodes( this.options.layoutElementsSelector, this.webUIElement );
   },
   
   getLoggingLayoutPattern : function( layoutName ) { 
      var selectorExp = this.options.layoutPatternSelector.substitute( {layoutName : layoutName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggingLoggerAppenderReference : function( loggerName ) {
      var selectorExp = this.options.loggerAppenderReferenceSelector.substitute( {loggerName : loggerName} );
      return this.xmlResource.selectNode( selectorExp, this.loggingElement ).value;
   },
   
   getLoggingLoggerIsDefault : function( loggerName ) {
      return this.determineLoggingElementValue( this.options.loggerIsDefaultSelector.substitute( {loggerName : loggerName} ));
   },
   
   getMenuDefinitionURI : function() { return this.xmlResource.selectNode( this.options.menuDefinitionURISelector ).nodeValue; },
   
   getSkinConfiguration : function( skinName ) {
      var selectorExp = this.options.skinConfigurationSelector.substitute( {skinName : skinName} );
      return this.xmlResource.selectNode( selectorExp, this.webUIElement ).value;
   },
      
   getSkinNameByIndex : function( skinIndex ) {
      var skinElements = this.getAvailableSkinElements();
      return this.xmlResource.selectNode( this.options.skinNameAttributeSelector, skinElements[skinIndex] ).value;
   },
      
   getSkinPath : function( skinName ) {
      var selectorExp = this.options.skinPathSelector.substitute( {skinName : skinName} );
      return this.xmlResource.selectNode( selectorExp, this.webUIElement ).value;
   },
      
   getSkinPathByIndex : function( skinIndex ) {
      var skinElements = this.getAvailableSkinElements();
      return this.xmlResource.selectNode( this.options.skinPathAttributeSelector, skinElements[skinIndex] ).value;
   },
      
   //Private helper methods
   determineLoggingElementValue : function( selectorExp ) {
      var selectedElement = this.xmlResource.selectNode( selectorExp, this.loggingElement ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   } 
});