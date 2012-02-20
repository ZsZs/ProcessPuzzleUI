window.ClassFigureTest = new Class({
   Extends : DiagramFigureTest,
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesAttributes', isAsynchron : false },
         { method : 'draw_instantiatesDraw2dObject', isAsynchron : false },
         { method : 'draw_drawsAttributes', isAsynchron : false }]
   },

   constants : {
      ATTRIBUTE_SELECTOR : "/attributes/attribute",
      FIGURE_SELECTOR : "//pp:widgetDefinition/figures/class[@name='ClassFigure']"
   },
   
   initialize : function( options ) {
      this.parent( options );
      
      this.constants.ATTRIBUTE_SELECTOR = this.constants.FIGURE_SELECTOR + this.constants.ATTRIBUTE_SELECTOR;
   },   

   beforeEachTest : function(){
      this.parent();
   },
   
   afterEachTest : function (){
      this.parent();
   },
   
   unmarshall_determinesAttributes : function(){
      this.figure.unmarshall();

      assertThat( this.figure.getAttributes().size(), equalTo( this.diagramDefinition.selectNodes( this.constants.ATTRIBUTE_SELECTOR ).length ));
      this.figure.getAttributes().each( function( attribute, index ){
         var selectorIndex = index +1;
         assertThat( attribute.getName(), equalTo( this.diagramDefinition.selectNodeText( this.constants.ATTRIBUTE_SELECTOR + "[" + selectorIndex + "]/@name" )));
         assertThat( attribute.getType(), equalTo( this.diagramDefinition.selectNodeText( this.constants.ATTRIBUTE_SELECTOR + "[" + selectorIndex + "]/@type" )));
         assertThat( attribute.getDefaultValue(), equalTo( this.diagramDefinition.selectNodeText( this.constants.ATTRIBUTE_SELECTOR + "[" + selectorIndex + "]/@defaultValue" )));
      }.bind( this ));
   },
   
   draw_instantiatesDraw2dObject : function(){
      this.figure.unmarshall();
      this.figure.draw( this.diagram );
      
      assertThat( this.figure.getState(), equalTo( DiagramFigure.States.CONSTRUCTED ));
   },
      
   draw_drawsAttributes : function(){
      this.figure.drawAttributes = spy( this.figure.drawAttributes );
         
      this.figure.unmarshall();
      this.figure.draw( this.diagram );
      
      verify( this.figure.drawAttributes );
   },
      
   //Event handling methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methods
   instantiateFigure : function(){
      this.figure = new ClassFigure( this.figureDefinition, this.diagramInternationalization );
   }.protect()
   
});