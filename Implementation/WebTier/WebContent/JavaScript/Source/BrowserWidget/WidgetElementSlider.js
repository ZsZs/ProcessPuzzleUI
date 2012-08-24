/*
Name: 
    - WidgetElementSlider

Description: 
    - Slides an element within it's parent. 

Requires:

Provides:
    - WidgetElementSlider

Part of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. 
http://www.processpuzzle.com

Authors: 
    - Zsolt Zsuffa

Copyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation, either version 3 of the License, 
or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var WidgetElementSlider = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: [],
   
   options : {
      axes : ['x', 'y'],
      linkedElementAlignment : 'left',
      linkedElements : null,
      linkedElementsSelector : null,
      slidingOptions : { duration: 500, link: 'cancel', offset: {'x': 0, 'y': 0}, transition: Fx.Transitions.Quad.easeInOut }
   },

   //Constructor
   initialize: function( subjectElement, options ){
      this.assertThat( subjectElement, not( nil() ), "WidgetElementSlider.subjectElement" );
      this.setOptions( options );
      
      this.fxScroll = new Fx.Scroll( subjectElement, this.options.slidingOptions );
      this.linkedElementIndex = 0;
      this.subjectElement = subjectElement;
   },
   
   //Public accessor and mutator methods
   next : function(){
      if( this.options.linkedElements ){
         this.toElement( this.options.linkedElements.get( this.linkedElementIndex ));
         this.linkedElementIndex++;
         if( this.linkedElementIndex == this.options.linkedElements.size() ) this.linkedElementIndex = 0;
      }
   },
   
   toElement : function( linkedElement ){
      switch( this.options.linkedElementAlignment ){
      case 'center': this.fxScroll.toElementCenter( linkedElement, this.options.axes ); break;
      case 'right': this.fxScroll.toElementEdge( linkedElement, this.options.axes ); break;
      case 'left': this.fxScroll.toElement( linkedElement, this.options.axes ); break;
      }
   }
   
   //Properties
   
   //Protected, private helper methods
});
