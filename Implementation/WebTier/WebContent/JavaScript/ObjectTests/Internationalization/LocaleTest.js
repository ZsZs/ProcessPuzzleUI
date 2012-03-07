window.LocaleTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
          { method : 'instantiate_whenLanguageAndCountryIsGiven_storesThem', isAsynchron : false },
          { method : 'instantiate_whenNoArgumentIsGiven_usesDefaults', isAsynchron : false },
          { method : 'equals_whenAllOptionsIsGiven_comparesAllOfThem', isAsynchron : false },
          { method : 'equals_whenOnlyLanguageIsGiven_comparesOnlyLanguage', isAsynchron : false },
          { method : 'parse_determinesLanguageCountryAndVariant', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      COUNTRY : "HU",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.locale;
   },   

   beforeEachTest : function(){
      this.locale = new Locale({ language: this.constants.LANGUAGE, country: this.constants.COUNTRY });
   },
   
   afterEachTest : function (){
      this.locale = null;
   },
   
   instantiate_whenLanguageAndCountryIsGiven_storesThem : function() {
      assertEquals( this.constants.LANGUAGE, this.locale.getLanguage() );
      assertEquals( this.constants.COUNTRY, this.locale.getCountry() );
   },

   instantiate_whenNoArgumentIsGiven_usesDefaults : function() {
      locale = new Locale();
      assertEquals( "Language default is:", "en", locale.getLanguage() );
      assertNull( "Country default is null.",locale.getCountry() );
      assertNull( "Variant default is null", locale.getVariant() );
   },

   equals_whenAllOptionsIsGiven_comparesAllOfThem : function(){
      var sameLocale = new Locale({ language: this.constants.LANGUAGE, country: this.constants.COUNTRY });
      var differentInLanguageAndCountry = new Locale({ language: "en", country: "EN" });
      
      assertThat( sameLocale.equals( this.locale ), is( true ));
      assertThat( differentInLanguageAndCountry.equals( this.locale ), is( false ));
   },
   
   equals_whenOnlyLanguageIsGiven_comparesOnlyLanguage : function(){
      var subjectLocale = new Locale({ language: "hu" });
      var sameLocale = new Locale({ language: "hu" });
      var differentInLanguage = new Locale({ language: "en" });
      
      assertThat( sameLocale.equals( subjectLocale ), is( true ));
      assertThat( sameLocale.equals( this.locale ), is( false ));
      assertThat( differentInLanguage.equals( subjectLocale ), is( false ));
   },
   
   parse_determinesLanguageCountryAndVariant : function() {
      var locale = new Locale();
      locale.parse( "en, GB, EURO" );
      assertEquals( "en", locale.getLanguage() );
      assertEquals( "GB",locale.getCountry() );
      assertEquals( "EURO", locale.getVariant() );
   }

});