// JavaScript Document
var tab_off = "#6699ff";
var tab_on = "White";

function InvertedTabWidget (theDivElement) {
	//check parameter assertions
	if(theDivElement == null) throw new InvalidParameterException();		//theDivElement can't be "" or null
	//if(!document.getElementById(theDivId)) throw new InvalidParameterException();		//theDivId should identify a valid <div> tag

	// inherit from TabWidget to make this object an TabWidget
  	inheritFrom(this, new TabWidget(theDivElement));

//private instance variables

//public accessors methods

//public mutators methods

//private methods

}