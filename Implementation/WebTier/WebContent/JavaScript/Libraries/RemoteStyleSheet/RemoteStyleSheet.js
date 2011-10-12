//Author: Year of Moo

var RemoteStyleSheet = new Class( {

   Implements : [Options, Events],

   options : {
      delay : 100,
      maxAttempts : 1000,
      idPrefix : 'css-preload-'},

   initialize : function( path, options ) {
      this.setOptions( options );
      this.path = path;
      this.id = this.options.idPrefix + (new Date().getTime());
   },

   getPath : function() {
      return this.path;
   },

   getID : function() {
      return this.id;
   },

   getElement : function() {
      return this.link;
   },

   _onready : function() {
      var args = [this.getPath(), this.getElement()];
      this.fireEvent( 'ready', args );
   },

   _onerror : function() {
      this.link.destroy();
      this.link = null;
      var args = [this.getPath()];
      this.fireEvent( 'error', args );
   },

   _onstart : function() {
      var args = [this.getPath(), this.getElement()];
      this.fireEvent( 'start', args );
   },

   createLinkElement : function() {
      this.link = document.createElement( 'link' );
      this.link.type = 'text/css';
      this.link.rel = 'stylesheet';
      this.link.id = this.getID();
      this.link.href = this.getPath();
      return this.link;
   },

   _checker : function() {
      if( !this.counter ){
         this.counter = 0;
      }

      var target = $( this.getID() );
      if( target.sheet ){
         var stylesheets = document.styleSheets;
         for( var i = 0; i < stylesheets.length; i++ ){
            var file = stylesheets[i];
            var owner = file.ownerNode ? file.ownerNode : file.owningElement;
            if( owner && owner.id == this.getID() ){
               this._onready();
               return;
            }

            if( this.counter++ > this.options.maxAttempts ){
               this._onerror();
               return;
            }
         }
      }

      this._checker.delay( this.options.delay, this );
   },

   start : function() {

      var fn;
      this.link = this.createLinkElement();
      if( Browser.ie || Browser.opera ){
         this.link.onload = this._onready.bind( this );
         this.link.onerror = this._onerror.bind( this );
      }else{
         fn = this._checker.bind( this );
      }

      document.getElement( 'head' ).appendChild( this.link );
      this._onstart();

      if( fn ){
         fn();
      }
   }

} );