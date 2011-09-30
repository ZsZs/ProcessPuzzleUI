//Javasctipt file

function TabActivationEvent (theTabWidget, theActiveTab, theEventType) { // for using frames, the eventType must be set!
	//check parameter assertions

	//private instance variables
	var tabWidget = theTabWidget;
	var activeTab = theActiveTab;
	var eventType = theEventType;

	//public accessors methods
	this.getTabWidget = function () {return tabWidget;}
	this.getTab = function () {return activeTab;}
	this.getEventType = function () {return eventType}

	//public mutators methods
	//private methods
}

function TabClosedEvent (theTabWidget, theTab, theEventType) { // for using frames, the eventType must be set!
	//check parameter assertions

	//private instance variables
	var tabWidget = theTabWidget;
	var tab = theTab;
	var eventType = theEventType;

	//public accessors methods
	this.getTabWidget = function () {return tabWidget;}
	this.getTab = function () {return tab;}
	this.getEventType = function () {return eventType}

	//public mutators methods
	//private methods
}