window.ClassFigureTest = new Class({
   Extends : DiagramFigureTest,
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesAttributes', isAsynchron : false },
         { method : 'unmarshall_determinesOperations', isAsynchron : false },
         { method : 'draw_instantiatesDraw2dObject', isAsynchron : false },
         { method : 'draw_drawsAttributes', isAsynchron : false },
         { method : 'draw_drawsOperations', isAsynchron : false }]
   },

   constants : {
      ATTRIBUTE_SELECTOR : "/uml:attributes/uml:attribute",
      FIGURE_SELECTOR : "/dd:diagramDefinition/dd:figures/uml:class[@name='ClassFigure']",
      OPERATION_SELECTOR : "/uml:operations/uml:operation",
   },
   
   initialize : function( options ) {
      this.parent( options );
      
      this.constants.ATTRIBUTE_SELECTOR = this.constants.FIGURE_SELECTOR + this.constants.ATTRIBUTE_SELECTOR;
      this.constants.OPERATION_SELECTOR = this.constants.FIGURE_SELECTOR + this.constants.OPERATION_SELECTOR;
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
   
   unmarshall_determinesOperations : function(){
      this.figure.unmarshall();

      assertThat( this.figure.getOperations().size(), equalTo( this.diagramDefinition.selectNodes( this.constants.OPERATION_SELECTOR ).length ));
      this.figure.getOperations().each( function( operation, index ){
         var selectorIndex = index +1;
         assertThat( operation.getName(), equalTo( this.diagramDefinition.selectNodeText( this.constants.OPERATION_SELECTOR + "[" + selectorIndex + "]/@name" )));
         assertThat( operation.getType(), equalTo( this.diagramDefinition.selectNodeText( this.constants.OPERATION_SELECTOR + "[" + selectorIndex + "]/@type" )));
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
      
   draw_drawsOperations : function(){
      this.figure.drawOperations = spy( this.figure.drawOperations );
         
      this.figure.unmarshall();
      this.figure.draw( this.diagram );
      
      verify( this.figure.drawOperations );
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