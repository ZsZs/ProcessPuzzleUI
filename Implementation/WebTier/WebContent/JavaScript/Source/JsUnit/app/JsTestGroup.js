var JsTestGroup = new Class( {
   initialize : function() {
      this._testPages = [];
      this._index = 0;
   },

   addTestPage : function( testPageUrl, testFrame ) {
      var testPage = new JsTestPage( testPageUrl, testFrame );
      JsUnit.Util.push( this._testPages, testPage );
      return testPage;
   },

   hasMorePages : function() {
      return this._index < this._testPages.length;
   },

   nextPage : function() {
      return this._testPages[this._index++];
   }} );
