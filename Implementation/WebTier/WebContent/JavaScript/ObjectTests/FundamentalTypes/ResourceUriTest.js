window.ResourceUriTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'determineContentUri_whenSpecifiedInQueryString_parsesValue', isAsynchron : false },
         { method : 'determineDocumentType_whenSpecifiedByInstantiation_preservesSetting', isAsynchron : false },
         { method : 'determineDocumentType_whenNotSpecified_checksQueryString', isAsynchron : false },
         { method : 'determineDocumentVariables_whenGiven_instantiatesObject', isAsynchron : false },
         { method : 'determineUri_stripsFromQuery', isAsynchron : false },
         { method : 'determineLocalizedUri_injectsLanguageCodeIntoUri', isAsynchron : false },
         { method : 'isLocal_whenUriNotContainsHostname_thanReturnsTrue', isAsynchron : false },
         { method : 'isLocal_whenUriContainsDifferentHostname_thanReturnsFalse', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      LOCALIZED_HTML_RESOURCE_URI : "../FundamentalTypes/TestHtmlResource_hu.html",
      LOCALIZED_XML_RESOURCE_URI : "../FundamentalTypes/TestXmlResource_hu.xml",
      HTML_RESOURCE_URI : "../FundamentalTypes/TestHtmlResource.html",
      REMOTE_RESOURCE_URI : "http://processpuzzle.com",
      SMART_DOCUMENT_URI : "../FundamentalTypes/TestXmlResource.xml?contentUri='sampleContent'&documentType=SMART&documentVariables={variable_1:'variable_1',variable_2:'variable_2'}",
      XML_RESOURCE_URI : "../FundamentalTypes/TestXmlResource.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.htmlResourceUri;
      this.smartDocumentUri;
      this.xmlResourceUri;
   },

   beforeEachTest : function(){
      this.htmlResourceUri = new ResourceUri( this.constants.HTML_RESOURCE_URI, this.locale, { contentType : 'html', documentType : AbstractDocument.Types.HTML });
      this.smartDocumentUri = new ResourceUri( this.constants.SMART_DOCUMENT_URI );
      this.xmlResourceUri = new ResourceUri( this.constants.XML_RESOURCE_URI, this.locale );
   },
   
   afterEachTest : function (){
      this.htmlResourceUri = null;
      this.xmlResourceUri = null;
   },
   
   determineContentUri_whenSpecifiedInQueryString_parsesValue : function(){
      assertThat( this.htmlResourceUri.getDocumentContentUri(), is( nil() ));
      assertThat( this.smartDocumentUri.getDocumentContentUri(), equalTo( 'sampleContent' ));
   },
   
   determineDocumentType_whenSpecifiedByInstantiation_preservesSetting : function(){
      assertThat( this.htmlResourceUri.getDocumentType(), equalTo( AbstractDocument.Types.HTML ));
   },
   
   determineDocumentType_whenNotSpecified_checksQueryString : function(){
      assertThat( this.smartDocumentUri.getDocumentType(), equalTo( AbstractDocument.Types.SMART ));
   },
   
   determineDocumentVariables_whenGiven_instantiatesObject : function(){
      assertThat( this.htmlResourceUri.getDocumentVariables(), is( nil() ));
      assertThat( this.smartDocumentUri.getDocumentVariables(), JsHamcrest.Matchers.typeOf( 'object' ));
      assertThat( this.smartDocumentUri.getDocumentVariables()['variable_1'], equalTo( 'variable_1' ));
      assertThat( this.smartDocumentUri.getDocumentVariables()['variable_2'], equalTo( 'variable_2' ));
   },
   
   determineUri_stripsFromQuery : function(){
      assertThat( this.htmlResourceUri.getUri(), equalTo( this.constants.HTML_RESOURCE_URI ));
      assertThat( this.smartDocumentUri.getUri(), equalTo( this.constants.SMART_DOCUMENT_URI.substring( 0, this.constants.SMART_DOCUMENT_URI.indexOf( '?' ))));
   },
   
   determineLocalizedUri_injectsLanguageCodeIntoUri : function(){
      assertThat( this.htmlResourceUri.determineLocalizedUri(), equalTo( this.constants.LOCALIZED_HTML_RESOURCE_URI ));
      assertThat( this.xmlResourceUri.determineLocalizedUri(), equalTo( this.constants.LOCALIZED_XML_RESOURCE_URI ));
   },
   
   isLocal_whenUriNotContainsHostname_thanReturnsTrue : function(){
      assertThat( this.htmlResourceUri.isLocal(), is( true ));
      assertThat( this.xmlResourceUri.isLocal(), is( true ));
   },
   
   isLocal_whenUriContainsDifferentHostname_thanReturnsFalse : function(){
      var remoteResourceUri = new ResourceUri( this.constants.REMOTE_RESOURCE_URI, this.locale );
      assertThat( remoteResourceUri.isLocal(), is( false ));
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   },

   onSuccess : function(){
      this.testCaseChain.callChain();
   }
   
});