window.LocalizationResourceReferenceTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'expandedUris_whenEnabled_returnsLanguageAndCountrySpecificUris', isAsynchron : false },
         { method : 'expandedUris_whenDisabled_returnsBaseUriOnly', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_NAMESPACES : "xmlns:pp='http://www.processpuzzle.com' xmlns:in='http://www.processpuzzle.com/InternationalizationConfiguration'",
      CONFIGURATION_URI : "../Internationalization/WebUIConfiguration.xml",
      COUNTRY : "HU",
      LANGUAGE : "hu",
      RESOURCE_DEFINITION_WITH_BACKENDONLY_SELECTOR : "/pp:processPuzzleConfiguration/in:internationalization/in:resouceBundles/in:resourceBundle[@isBackendOnly='true']",
      RESOURCE_DEFINITION_WITH_LOCALEEXPANSION_SELECTOR : "/pp:processPuzzleConfiguration/in:internationalization/in:resouceBundles/in:resourceBundle[@baseNameOnlyVersionExists='true']",
      RESOURCE_DEFINITION_WITHOUT_LOCALEEXPANSION_SELECTOR : "/pp:processPuzzleConfiguration/in:internationalization/in:resouceBundles/in:resourceBundle[@localeSpecificVersionsExists='false']"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.configurationXml;
      this.locale;
      this.localizationReference;
      this.localizationReferenceWithoutLocaleExpansion;
      this.resourceDefinitionXml;
      this.resourceWithoutLocaleExpansionDefinitionXml;
   },   

   beforeEachTest : function(){
      this.locale = new ProcessPuzzleLocale({ language: this.constants.LANGUAGE, country: this.constants.COUNTRY });
      this.configurationXml = new XmlResource( this.constants.CONFIGURATION_URI, { nameSpaces : this.constants.CONFIGURATION_NAMESPACES });
      
      this.resourceDefinitionXml = this.configurationXml.selectNode( this.constants.RESOURCE_DEFINITION_WITH_LOCALEEXPANSION_SELECTOR );
      this.localizationReference = new LocalizationResourceReference( this.resourceDefinitionXml );
      
      this.resourceWithoutLocaleExpansionDefinitionXml = this.configurationXml.selectNode( this.constants.RESOURCE_DEFINITION_WITHOUT_LOCALEEXPANSION_SELECTOR );
      this.localizationReferenceWithoutLocaleExpansion = new LocalizationResourceReference( this.resourceWithoutLocaleExpansionDefinitionXml );
      
      this.resourceWithBackendOnlyDefinitionXml = this.configurationXml.selectNode( this.constants.RESOURCE_DEFINITION_WITH_BACKENDONLY_SELECTOR );
      this.localizationReferenceForBackendOnly = new LocalizationResourceReference( this.resourceWithBackendOnlyDefinitionXml );
   },
   
   afterEachTest : function (){
      this.locale = null;
      this.configurationXml.release();
   },
   
   unmarshall_determinesProperties : function(){
      this.localizationReference.unmarshall();      
      assertThat( this.localizationReference.getUri(), equalTo( XmlResource.determineNodeText( this.resourceDefinitionXml )));
      assertThat( this.localizationReference.isBaseNameOnlyVersionExists(), equalTo( parseBoolean( XmlResource.selectNodeText( "@baseNameOnlyVersionExists", this.resourceDefinitionXml ))));
      assertThat( this.localizationReferenceWithoutLocaleExpansion.isBackendOnly(), equalTo( false ));
      assertThat( this.localizationReference.isLocaleSpecificVersionExists(), equalTo( true ));
      
      this.localizationReferenceWithoutLocaleExpansion.unmarshall();
      assertThat( this.localizationReferenceWithoutLocaleExpansion.getUri(), equalTo( XmlResource.determineNodeText( this.resourceWithoutLocaleExpansionDefinitionXml )));
      assertThat( this.localizationReferenceWithoutLocaleExpansion.isBaseNameOnlyVersionExists(), equalTo( true ));
      assertThat( this.localizationReferenceWithoutLocaleExpansion.isBackendOnly(), equalTo( false ));
      assertThat( this.localizationReferenceWithoutLocaleExpansion.isLocaleSpecificVersionExists(), equalTo( parseBoolean( XmlResource.selectNodeText( "@localeSpecificVersionsExists", this.resourceWithoutLocaleExpansionDefinitionXml ))));
      
      this.localizationReferenceForBackendOnly.unmarshall();
      assertThat( this.localizationReferenceForBackendOnly.getUri(), equalTo( XmlResource.determineNodeText( this.resourceWithBackendOnlyDefinitionXml )));
      assertThat( this.localizationReferenceForBackendOnly.isBaseNameOnlyVersionExists(), equalTo( true ));
      assertThat( this.localizationReferenceForBackendOnly.isBackendOnly(), equalTo( true ));
      assertThat( this.localizationReferenceForBackendOnly.isLocaleSpecificVersionExists(), equalTo( true ));
   },
   
   expandedUris_whenEnabled_returnsLanguageAndCountrySpecificUris : function(){
      this.localizationReference.unmarshall();
      
      var countrySpecificLocale = new ProcessPuzzleLocale({ language : "en", country : "GB" });
      assertThat( this.localizationReference.expandedUris( countrySpecificLocale ), hasItem( containsString( this.localizationReference.getUri() + '.xml' )));
      assertThat( this.localizationReference.expandedUris( countrySpecificLocale ), hasItem( containsString( '_en.xml' )));
      assertThat( this.localizationReference.expandedUris( countrySpecificLocale ), hasItem( containsString( 'en_GB.xml' )));
   },
   
   expandedUris_whenDisabled_returnsBaseUriOnly : function(){
      this.localizationReferenceWithoutLocaleExpansion.unmarshall();
      
      var countrySpecificLocale = new ProcessPuzzleLocale({ language : "en", country : "GB" });
      assertThat( this.localizationReferenceWithoutLocaleExpansion.expandedUris( countrySpecificLocale ), hasItem( containsString( this.localizationReferenceWithoutLocaleExpansion.getUri() + '.xml' )));
      assertThat( this.localizationReferenceWithoutLocaleExpansion.expandedUris( countrySpecificLocale ), not( hasItem( containsString( '_en.xml' ))));
      assertThat( this.localizationReferenceWithoutLocaleExpansion.expandedUris( countrySpecificLocale ), not( hasItem( containsString( 'en_GB.xml' ))));
   }

});