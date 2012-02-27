window.ResourceUriTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
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
      XML_RESOURCE_URI : "../FundamentalTypes/TestXmlResource.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.htmlResourceUri;
      this.xmlResourceUri;
   },

   beforeEachTest : function(){
      this.htmlResourceUri = new ResourceUri( this.constants.HTML_RESOURCE_URI, this.locale, { contentType : 'html' });
      this.xmlResourceUri = new ResourceUri( this.constants.XML_RESOURCE_URI, this.locale );
   },
   
   afterEachTest : function (){
      this.htmlResourceUri = null;
      this.xmlResourceUri = null;
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