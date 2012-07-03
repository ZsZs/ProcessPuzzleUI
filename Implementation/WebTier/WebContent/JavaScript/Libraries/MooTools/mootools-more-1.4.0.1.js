// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more 
// Or build this file again with packager using: packager build More/More More/Events.Pseudos More/Class.Refactor More/Class.Binds More/Class.Occlude More/Chain.Wait More/Array.Extras More/Date More/Date.Extras More/Number.Format More/Object.Extras More/String.Extras More/String.QueryString More/URI More/URI.Relative More/Hash More/Hash.Extras More/Element.Forms More/Elements.From More/Element.Event.Pseudos More/Element.Event.Pseudos.Keys More/Element.Measure More/Element.Pin More/Element.Position More/Element.Shortcuts More/Form.Request More/Form.Request.Append More/Form.Validator More/Form.Validator.Inline More/Form.Validator.Extras More/OverText More/Fx.Elements More/Fx.Accordion More/Fx.Move More/Fx.Reveal More/Fx.Scroll More/Fx.Slide More/Fx.SmoothScroll More/Fx.Sort More/Drag More/Drag.Move More/Slider More/Sortables More/Request.JSONP More/Request.Queue More/Request.Periodical More/Assets More/Color More/Group More/Hash.Cookie More/IframeShim More/Table More/HtmlTable More/HtmlTable.Zebra More/HtmlTable.Sort More/HtmlTable.Select More/Keyboard More/Keyboard.Extras More/Mask More/Scroller More/Tips More/Spinner More/Locale More/Locale.Set.From More/Locale.en-US.Date More/Locale.en-US.Form.Validator More/Locale.en-US.Number More/Locale.ar.Date More/Locale.ar.Form.Validator More/Locale.ca-CA.Date More/Locale.ca-CA.Form.Validator More/Locale.cs-CZ.Date More/Locale.cs-CZ.Form.Validator More/Locale.da-DK.Date More/Locale.da-DK.Form.Validator More/Locale.de-CH.Date More/Locale.de-CH.Form.Validator More/Locale.de-DE.Date More/Locale.de-DE.Form.Validator More/Locale.de-DE.Number More/Locale.en-GB.Date More/Locale.es-AR.Date More/Locale.es-AR.Form.Validator More/Locale.es-ES.Date More/Locale.es-ES.Form.Validator More/Locale.et-EE.Date More/Locale.et-EE.Form.Validator More/Locale.EU.Number More/Locale.fa.Date More/Locale.fa.Form.Validator More/Locale.fi-FI.Date More/Locale.fi-FI.Form.Validator More/Locale.fi-FI.Number More/Locale.fr-FR.Date More/Locale.fr-FR.Form.Validator More/Locale.fr-FR.Number More/Locale.he-IL.Date More/Locale.he-IL.Form.Validator More/Locale.he-IL.Number More/Locale.hu-HU.Date More/Locale.hu-HU.Form.Validator More/Locale.it-IT.Date More/Locale.it-IT.Form.Validator More/Locale.ja-JP.Date More/Locale.ja-JP.Form.Validator More/Locale.ja-JP.Number More/Locale.nl-NL.Date More/Locale.nl-NL.Form.Validator More/Locale.nl-NL.Number More/Locale.no-NO.Date More/Locale.no-NO.Form.Validator More/Locale.pl-PL.Date More/Locale.pl-PL.Form.Validator More/Locale.pt-BR.Date More/Locale.pt-BR.Form.Validator More/Locale.pt-PT.Date More/Locale.pt-PT.Form.Validator More/Locale.ru-RU-unicode.Date More/Locale.ru-RU-unicode.Form.Validator More/Locale.si-SI.Date More/Locale.si-SI.Form.Validator More/Locale.sv-SE.Date More/Locale.sv-SE.Form.Validator More/Locale.uk-UA.Date More/Locale.uk-UA.Form.Validator More/Locale.zh-CH.Date More/Locale.zh-CH.Form.Validator
/*
---

script: More.js

name: More

description: MooTools More

license: MIT-style license

authors:
  - Guillermo Rauch
  - Thomas Aylott
  - Scott Kyle
  - Arian Stolwijk
  - Tim Wienk
  - Christoph Pojer
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
	'version': '1.4.0.1',
	'build': 'a4244edf2aa97ac8a196fc96082dd35af1abab87'
};


/*
---

name: Events.Pseudos

description: Adds the functionality to add pseudo events

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Class.Extras, Core/Slick.Parser, More/MooTools.More]

provides: [Events.Pseudos]

...
*/

(function(){

Events.Pseudos = function(pseudos, addEvent, removeEvent){

	var storeKey = '_monitorEvents:';

	var storageOf = function(object){
		return {
			store: object.store ? function(key, value){
				object.store(storeKey + key, value);
			} : function(key, value){
				(object._monitorEvents || (object._monitorEvents = {}))[key] = value;
			},
			retrieve: object.retrieve ? function(key, dflt){
				return object.retrieve(storeKey + key, dflt);
			} : function(key, dflt){
				if (!object._monitorEvents) return dflt;
				return object._monitorEvents[key] || dflt;
			}
		};
	};

	var splitType = function(type){
		if (type.indexOf(':') == -1 || !pseudos) return null;

		var parsed = Slick.parse(type).expressions[0][0],
			parsedPseudos = parsed.pseudos,
			l = parsedPseudos.length,
			splits = [];

		while (l--){
			var pseudo = parsedPseudos[l].key,
				listener = pseudos[pseudo];
			if (listener != null) splits.push({
				event: parsed.tag,
				value: parsedPseudos[l].value,
				pseudo: pseudo,
				original: type,
				listener: listener
			});
		}
		return splits.length ? splits : null;
	};

	return {

		addEvent: function(type, fn, internal){
			var split = splitType(type);
			if (!split) return addEvent.call(this, type, fn, internal);

			var storage = storageOf(this),
				events = storage.retrieve(type, []),
				eventType = split[0].event,
				args = Array.slice(arguments, 2),
				stack = fn,
				self = this;

			split.each(function(item){
				var listener = item.listener,
					stackFn = stack;
				if (listener == false) eventType += ':' + item.pseudo + '(' + item.value + ')';
				else stack = function(){
					listener.call(self, item, stackFn, arguments, stack);
				};
			});

			events.include({type: eventType, event: fn, monitor: stack});
			storage.store(type, events);

			if (type != eventType) addEvent.apply(this, [type, fn].concat(args));
			return addEvent.apply(this, [eventType, stack].concat(args));
		},

		removeEvent: function(type, fn){
			var split = splitType(type);
			if (!split) return removeEvent.call(this, type, fn);

			var storage = storageOf(this),
				events = storage.retrieve(type);
			if (!events) return this;

			var args = Array.slice(arguments, 2);

			removeEvent.apply(this, [type, fn].concat(args));
			events.each(function(monitor, i){
				if (!fn || monitor.event == fn) removeEvent.apply(this, [monitor.type, monitor.monitor].concat(args));
				delete events[i];
			}, this);

			storage.store(type, events);
			return this;
		}

	};

};

var pseudos = {

	once: function(split, fn, args, monitor){
		fn.apply(this, args);
		this.removeEvent(split.event, monitor)
			.removeEvent(split.original, fn);
	},

	throttle: function(split, fn, args){
		if (!fn._throttled){
			fn.apply(this, args);
			fn._throttled = setTimeout(function(){
				fn._throttled = false;
			}, split.value || 250);
		}
	},

	pause: function(split, fn, args){
		clearTimeout(fn._pause);
		fn._pause = fn.delay(split.value || 250, this, args);
	}

};

Events.definePseudo = function(key, listener){
	pseudos[key] = listener;
	return this;
};

Events.lookupPseudo = function(key){
	return pseudos[key];
};

var proto = Events.prototype;
Events.implement(Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

['Request', 'Fx'].each(function(klass){
	if (this[klass]) this[klass].implement(Events.prototype);
});

})();


/*
---

script: Class.Refactor.js

name: Class.Refactor

description: Extends a class onto itself with new property, preserving any items attached to the class's namespace.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - /MooTools.More

# Some modules declare themselves dependent on Class.Refactor
provides: [Class.refactor, Class.Refactor]

...
*/

Class.refactor = function(original, refactors){

	Object.each(refactors, function(item, name){
		var origin = original.prototype[name];
		origin = (origin && origin.$origin) || origin || function(){};
		original.implement(name, (typeof item == 'function') ? function(){
			var old = this.previous;
			this.previous = origin;
			var value = item.apply(this, arguments);
			this.previous = old;
			return value;
		} : item);
	});

	return original;

};


/*
---

script: Class.Binds.js

name: Class.Binds

description: Automagically binds specified methods in a class to the instance of the class.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - /MooTools.More

provides: [Class.Binds]

...
*/

Class.Mutators.Binds = function(binds){
	if (!this.prototype.initialize) this.implement('initialize', function(){});
	return Array.from(binds).concat(this.prototype.Binds || []);
};

Class.Mutators.initialize = function(initialize){
	return function(){
		Array.from(this.Binds).each(function(name){
			var original = this[name];
			if (original) this[name] = original.bind(this);
		}, this);
		return initialize.apply(this, arguments);
	};
};


/*
---

script: Class.Occlude.js

name: Class.Occlude

description: Prevents a class from being applied to a DOM element twice.

license: MIT-style license.

authors:
  - Aaron Newton

requires:
  - Core/Class
  - Core/Element
  - /MooTools.More

provides: [Class.Occlude]

...
*/

Class.Occlude = new Class({

	occlude: function(property, element){
		element = document.id(element || this.element);
		var instance = element.retrieve(property || this.property);
		if (instance && !this.occluded)
			return (this.occluded = instance);

		this.occluded = false;
		element.store(property || this.property, this);
		return this.occluded;
	}

});


/*
---

script: Chain.Wait.js

name: Chain.Wait

description: value, Adds a method to inject pauses between chained events.

license: MIT-style license.

authors:
  - Aaron Newton

requires:
  - Core/Chain
  - Core/Element
  - Core/Fx
  - /MooTools.More

provides: [Chain.Wait]

...
*/

(function(){

	var wait = {
		wait: function(duration){
			return this.chain(function(){
				this.callChain.delay(duration == null ? 500 : duration, this);
				return this;
			}.bind(this));
		}
	};

	Chain.implement(wait);

	if (this.Fx) Fx.implement(wait);

	if (this.Element && Element.implement && this.Fx){
		Element.implement({

			chains: function(effects){
				Array.from(effects || ['tween', 'morph', 'reveal']).each(function(effect){
					effect = this.get(effect);
					if (!effect) return;
					effect.setOptions({
						link:'chain'
					});
				}, this);
				return this;
			},

			pauseFx: function(duration, effect){
				this.chains(effect).get(effect || 'tween').wait(duration);
				return this;
			}

		});
	}

})();


/*
---

script: Array.Extras.js

name: Array.Extras

description: Extends the Array native object to include useful methods to work with arrays.

license: MIT-style license

authors:
  - Christoph Pojer
  - Sebastian MarkbĂĄge

requires:
  - Core/Array
  - MooTools.More

provides: [Array.Extras]

...
*/

(function(nil){

Array.implement({

	min: function(){
		return Math.min.apply(null, this);
	},

	max: function(){
		return Math.max.apply(null, this);
	},

	average: function(){
		return this.length ? this.sum() / this.length : 0;
	},

	sum: function(){
		var result = 0, l = this.length;
		if (l){
			while (l--) result += this[l];
		}
		return result;
	},

	unique: function(){
		return [].combine(this);
	},

	shuffle: function(){
		for (var i = this.length; i && --i;){
			var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
			this[i] = this[r];
			this[r] = temp;
		}
		return this;
	},

	reduce: function(fn, value){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) value = value === nil ? this[i] : fn.call(null, value, this[i], i, this);
		}
		return value;
	},

	reduceRight: function(fn, value){
		var i = this.length;
		while (i--){
			if (i in this) value = value === nil ? this[i] : fn.call(null, value, this[i], i, this);
		}
		return value;
	}

});

})();


/*
---

script: Object.Extras.js

name: Object.Extras

description: Extra Object generics, like getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Object
  - /MooTools.More

provides: [Object.Extras]

...
*/

(function(){

var defined = function(value){
	return value != null;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

	getFromPath: function(source, parts){
		if (typeof parts == 'string') parts = parts.split('.');
		for (var i = 0, l = parts.length; i < l; i++){
			if (hasOwnProperty.call(source, parts[i])) source = source[parts[i]];
			else return null;
		}
		return source;
	},

	cleanValues: function(object, method){
		method = method || defined;
		for (var key in object) if (!method(object[key])){
			delete object[key];
		}
		return object;
	},

	erase: function(object, key){
		if (hasOwnProperty.call(object, key)) delete object[key];
		return object;
	},

	run: function(object){
		var args = Array.slice(arguments, 1);
		for (var key in object) if (object[key].apply){
			object[key].apply(object, args);
		}
		return object;
	}

});

})();


/*
---

script: Locale.js

name: Locale

description: Provides methods for localization.

license: MIT-style license

authors:
  - Aaron Newton
  - Arian Stolwijk

requires:
  - Core/Events
  - /Object.Extras
  - /MooTools.More

provides: [Locale, Lang]

...
*/

(function(){

var current = null,
	locales = {},
	inherits = {};

var getSet = function(set){
	if (instanceOf(set, Locale.Set)) return set;
	else return locales[set];
};

var Locale = this.Locale = {

	define: function(locale, set, key, value){
		var name;
		if (instanceOf(locale, Locale.Set)){
			name = locale.name;
			if (name) locales[name] = locale;
		} else {
			name = locale;
			if (!locales[name]) locales[name] = new Locale.Set(name);
			locale = locales[name];
		}

		if (set) locale.define(set, key, value);

		

		if (!current) current = locale;

		return locale;
	},

	use: function(locale){
		locale = getSet(locale);

		if (locale){
			current = locale;

			this.fireEvent('change', locale);

			
		}

		return this;
	},

	getCurrent: function(){
		return current;
	},

	get: function(key, args){
		return (current) ? current.get(key, args) : '';
	},

	inherit: function(locale, inherits, set){
		locale = getSet(locale);

		if (locale) locale.inherit(inherits, set);
		return this;
	},

	list: function(){
		return Object.keys(locales);
	}

};

Object.append(Locale, new Events);

Locale.Set = new Class({

	sets: {},

	inherits: {
		locales: [],
		sets: {}
	},

	initialize: function(name){
		this.name = name || '';
	},

	define: function(set, key, value){
		var defineData = this.sets[set];
		if (!defineData) defineData = {};

		if (key){
			if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
			else defineData[key] = value;
		}
		this.sets[set] = defineData;

		return this;
	},

	get: function(key, args, _base){
		var value = Object.getFromPath(this.sets, key);
		if (value != null){
			var type = typeOf(value);
			if (type == 'function') value = value.apply(null, Array.from(args));
			else if (type == 'object') value = Object.clone(value);
			return value;
		}

		// get value of inherited locales
		var index = key.indexOf('.'),
			set = index < 0 ? key : key.substr(0, index),
			names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
		if (!_base) _base = [];

		for (var i = 0, l = names.length; i < l; i++){
			if (_base.contains(names[i])) continue;
			_base.include(names[i]);

			var locale = locales[names[i]];
			if (!locale) continue;

			value = locale.get(key, args, _base);
			if (value != null) return value;
		}

		return '';
	},

	inherit: function(names, set){
		names = Array.from(names);

		if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

		var l = names.length;
		while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

		return this;
	}

});



})();


/*
---

name: Locale.en-US.Date

description: Date messages for US English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale

provides: [Locale.en-US.Date]

...
*/

Locale.define('en-US', 'Date', {

	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: function(dayOfMonth){
		// 1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	weekAgo: '1 week ago',
	weeksAgo: '{delta} weeks ago',
	monthAgo: '1 month ago',
	monthsAgo: '{delta} months ago',
	yearAgo: '1 year ago',
	yearsAgo: '{delta} years ago',

	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now',
	weekUntil: '1 week from now',
	weeksUntil: '{delta} weeks from now',
	monthUntil: '1 month from now',
	monthsUntil: '{delta} months from now',
	yearUntil: '1 year from now',
	yearsUntil: '{delta} years from now'

});


/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - MooTools.More
  - Locale
  - Locale.en-US.Date

provides: [Date]

...
*/

(function(){

var Date = this.Date;

var DateMethods = Date.Methods = {
	ms: 'Milliseconds',
	year: 'FullYear',
	min: 'Minutes',
	mo: 'Month',
	sec: 'Seconds',
	hr: 'Hours'
};

['Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
	'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
	'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'].each(function(method){
	Date.Methods[method.toLowerCase()] = method;
});

var pad = function(n, digits, string){
	if (digits == 1) return n;
	return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
};

Date.implement({

	set: function(prop, value){
		prop = prop.toLowerCase();
		var method = DateMethods[prop] && 'set' + DateMethods[prop];
		if (method && this[method]) this[method](value);
		return this;
	}.overloadSetter(),

	get: function(prop){
		prop = prop.toLowerCase();
		var method = DateMethods[prop] && 'get' + DateMethods[prop];
		if (method && this[method]) return this[method]();
		return null;
	}.overloadGetter(),

	clone: function(){
		return new Date(this.get('time'));
	},

	increment: function(interval, times){
		interval = interval || 'day';
		times = times != null ? times : 1;

		switch (interval){
			case 'year':
				return this.increment('month', times * 12);
			case 'month':
				var d = this.get('date');
				this.set('date', 1).set('mo', this.get('mo') + times);
				return this.set('date', d.min(this.get('lastdayofmonth')));
			case 'week':
				return this.increment('day', times * 7);
			case 'day':
				return this.set('date', this.get('date') + times);
		}

		if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

		return this.set('time', this.get('time') + times * Date.units[interval]());
	},

	decrement: function(interval, times){
		return this.increment(interval, -1 * (times != null ? times : 1));
	},

	isLeapYear: function(){
		return Date.isLeapYear(this.get('year'));
	},

	clearTime: function(){
		return this.set({hr: 0, min: 0, sec: 0, ms: 0});
	},

	diff: function(date, resolution){
		if (typeOf(date) == 'string') date = Date.parse(date);

		return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
	},

	getLastDayOfMonth: function(){
		return Date.daysInMonth(this.get('mo'), this.get('year'));
	},

	getDayOfYear: function(){
		return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
			- Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
	},

	setDay: function(day, firstDayOfWeek){
		if (firstDayOfWeek == null){
			firstDayOfWeek = Date.getMsg('firstDayOfWeek');
			if (firstDayOfWeek === '') firstDayOfWeek = 1;
		}

		day = (7 + Date.parseDay(day, true) - firstDayOfWeek) % 7;
		var currentDay = (7 + this.get('day') - firstDayOfWeek) % 7;

		return this.increment('day', day - currentDay);
	},

	getWeek: function(firstDayOfWeek){
		if (firstDayOfWeek == null){
			firstDayOfWeek = Date.getMsg('firstDayOfWeek');
			if (firstDayOfWeek === '') firstDayOfWeek = 1;
		}

		var date = this,
			dayOfWeek = (7 + date.get('day') - firstDayOfWeek) % 7,
			dividend = 0,
			firstDayOfYear;

		if (firstDayOfWeek == 1){
			// ISO-8601, week belongs to year that has the most days of the week (i.e. has the thursday of the week)
			var month = date.get('month'),
				startOfWeek = date.get('date') - dayOfWeek;

			if (month == 11 && startOfWeek > 28) return 1; // Week 1 of next year

			if (month == 0 && startOfWeek < -2){
				// Use a date from last year to determine the week
				date = new Date(date).decrement('day', dayOfWeek);
				dayOfWeek = 0;
			}

			firstDayOfYear = new Date(date.get('year'), 0, 1).get('day') || 7;
			if (firstDayOfYear > 4) dividend = -7; // First week of the year is not week 1
		} else {
			// In other cultures the first week of the year is always week 1 and the last week always 53 or 54.
			// Days in the same week can have a different weeknumber if the week spreads across two years.
			firstDayOfYear = new Date(date.get('year'), 0, 1).get('day');
		}

		dividend += date.get('dayofyear');
		dividend += 6 - dayOfWeek; // Add days so we calculate the current date's week as a full week
		dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7; // Make up for first week of the year not being a full week

		return (dividend / 7);
	},

	getOrdinal: function(day){
		return Date.getMsg('ordinal', day || this.get('date'));
	},

	getTimezone: function(){
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},

	getGMTOffset: function(){
		var off = this.get('timezoneOffset');
		return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
	},

	setAMPM: function(ampm){
		ampm = ampm.toUpperCase();
		var hr = this.get('hr');
		if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
		else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
		return this;
	},

	getAMPM: function(){
		return (this.get('hr') < 12) ? 'AM' : 'PM';
	},

	parse: function(str){
		this.set('time', Date.parse(str));
		return this;
	},

	isValid: function(date){
		if (!date) date = this;
		return typeOf(date) == 'date' && !isNaN(date.valueOf());
	},

	format: function(format){
		if (!this.isValid()) return 'invalid date';

		if (!format) format = '%x %X';
		if (typeof format == 'string') format = formats[format.toLowerCase()] || format;
		if (typeof format == 'function') return format(this);

		var d = this;
		return format.replace(/%([a-z%])/gi,
			function($0, $1){
				switch ($1){
					case 'a': return Date.getMsg('days_abbr')[d.get('day')];
					case 'A': return Date.getMsg('days')[d.get('day')];
					case 'b': return Date.getMsg('months_abbr')[d.get('month')];
					case 'B': return Date.getMsg('months')[d.get('month')];
					case 'c': return d.format('%a %b %d %H:%M:%S %Y');
					case 'd': return pad(d.get('date'), 2);
					case 'e': return pad(d.get('date'), 2, ' ');
					case 'H': return pad(d.get('hr'), 2);
					case 'I': return pad((d.get('hr') % 12) || 12, 2);
					case 'j': return pad(d.get('dayofyear'), 3);
					case 'k': return pad(d.get('hr'), 2, ' ');
					case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
					case 'L': return pad(d.get('ms'), 3);
					case 'm': return pad((d.get('mo') + 1), 2);
					case 'M': return pad(d.get('min'), 2);
					case 'o': return d.get('ordinal');
					case 'p': return Date.getMsg(d.get('ampm'));
					case 's': return Math.round(d / 1000);
					case 'S': return pad(d.get('seconds'), 2);
					case 'T': return d.format('%H:%M:%S');
					case 'U': return pad(d.get('week'), 2);
					case 'w': return d.get('day');
					case 'x': return d.format(Date.getMsg('shortDate'));
					case 'X': return d.format(Date.getMsg('shortTime'));
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');
					case 'z': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
				}
				return $1;
			}
		);
	},

	toISOString: function(){
		return this.format('iso8601');
	}

}).alias({
	toJSON: 'toISOString',
	compare: 'diff',
	strftime: 'format'
});

// The day and month abbreviations are standardized, so we cannot use simply %a and %b because they will get localized
var rfcDayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	rfcMonthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var formats = {
	db: '%Y-%m-%d %H:%M:%S',
	compact: '%Y%m%dT%H%M%S',
	'short': '%d %b %H:%M',
	'long': '%B %d, %Y %H:%M',
	rfc822: function(date){
		return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %Z');
	},
	rfc2822: function(date){
		return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %z');
	},
	iso8601: function(date){
		return (
			date.getUTCFullYear() + '-' +
			pad(date.getUTCMonth() + 1, 2) + '-' +
			pad(date.getUTCDate(), 2) + 'T' +
			pad(date.getUTCHours(), 2) + ':' +
			pad(date.getUTCMinutes(), 2) + ':' +
			pad(date.getUTCSeconds(), 2) + '.' +
			pad(date.getUTCMilliseconds(), 3) + 'Z'
		);
	}
};

var parsePatterns = [],
	nativeParse = Date.parse;

var parseWord = function(type, word, num){
	var ret = -1,
		translated = Date.getMsg(type + 's');
	switch (typeOf(word)){
		case 'object':
			ret = translated[word.get(type)];
			break;
		case 'number':
			ret = translated[word];
			if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
			break;
		case 'string':
			var match = translated.filter(function(name){
				return this.test(name);
			}, new RegExp('^' + word, 'i'));
			if (!match.length) throw new Error('Invalid ' + type + ' string');
			if (match.length > 1) throw new Error('Ambiguous ' + type);
			ret = match[0];
	}

	return (num) ? translated.indexOf(ret) : ret;
};

var startCentury = 1900,
	startYear = 70;

Date.extend({

	getMsg: function(key, args){
		return Locale.get('Date.' + key, args);
	},

	units: {
		ms: Function.from(1),
		second: Function.from(1000),
		minute: Function.from(60000),
		hour: Function.from(3600000),
		day: Function.from(86400000),
		week: Function.from(608400000),
		month: function(month, year){
			var d = new Date;
			return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
		},
		year: function(year){
			year = year || new Date().get('year');
			return Date.isLeapYear(year) ? 31622400000 : 31536000000;
		}
	},

	daysInMonth: function(month, year){
		return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	},

	isLeapYear: function(year){
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	},

	parse: function(from){
		var t = typeOf(from);
		if (t == 'number') return new Date(from);
		if (t != 'string') return from;
		from = from.clean();
		if (!from.length) return null;

		var parsed;
		parsePatterns.some(function(pattern){
			var bits = pattern.re.exec(from);
			return (bits) ? (parsed = pattern.handler(bits)) : false;
		});

		if (!(parsed && parsed.isValid())){
			parsed = new Date(nativeParse(from));
			if (!(parsed && parsed.isValid())) parsed = new Date(from.toInt());
		}
		return parsed;
	},

	parseDay: function(day, num){
		return parseWord('day', day, num);
	},

	parseMonth: function(month, num){
		return parseWord('month', month, num);
	},

	parseUTC: function(value){
		var localDate = new Date(value);
		var utcSeconds = Date.UTC(
			localDate.get('year'),
			localDate.get('mo'),
			localDate.get('date'),
			localDate.get('hr'),
			localDate.get('min'),
			localDate.get('sec'),
			localDate.get('ms')
		);
		return new Date(utcSeconds);
	},

	orderIndex: function(unit){
		return Date.getMsg('dateOrder').indexOf(unit) + 1;
	},

	defineFormat: function(name, format){
		formats[name] = format;
		return this;
	},

	

	defineParser: function(pattern){
		parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
		return this;
	},

	defineParsers: function(){
		Array.flatten(arguments).each(Date.defineParser);
		return this;
	},

	define2DigitYearStart: function(year){
		startYear = year % 100;
		startCentury = year - startYear;
		return this;
	}

}).extend({
	defineFormats: Date.defineFormat.overloadSetter()
});

var regexOf = function(type){
	return new RegExp('(?:' + Date.getMsg(type).map(function(name){
		return name.substr(0, 3);
	}).join('|') + ')[a-z]*');
};

var replacers = function(key){
	switch (key){
		case 'T':
			return '%H:%M:%S';
		case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
			return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
		case 'X':
			return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?';
	}
	return null;
};

var keys = {
	d: /[0-2]?[0-9]|3[01]/,
	H: /[01]?[0-9]|2[0-3]/,
	I: /0?[1-9]|1[0-2]/,
	M: /[0-5]?\d/,
	s: /\d+/,
	o: /[a-z]*/,
	p: /[ap]\.?m\.?/,
	y: /\d{2}|\d{4}/,
	Y: /\d{4}/,
	z: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = function(language){
	currentLanguage = language;

	keys.a = keys.A = regexOf('days');
	keys.b = keys.B = regexOf('months');

	parsePatterns.each(function(pattern, i){
		if (pattern.format) parsePatterns[i] = build(pattern.format);
	});
};

var build = function(format){
	if (!currentLanguage) return {format: format};

	var parsed = [];
	var re = (format.source || format) // allow format to be regex
	 .replace(/%([a-z])/gi,
		function($0, $1){
			return replacers($1) || $0;
		}
	).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
	 .replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
	 .replace(/%([a-z%])/gi,
		function($0, $1){
			var p = keys[$1];
			if (!p) return $1;
			parsed.push($1);
			return '(' + p.source + ')';
		}
	).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

	return {
		format: format,
		re: new RegExp('^' + re + '$', 'i'),
		handler: function(bits){
			bits = bits.slice(1).associate(parsed);
			var date = new Date().clearTime(),
				year = bits.y || bits.Y;

			if (year != null) handle.call(date, 'y', year); // need to start in the right year
			if ('d' in bits) handle.call(date, 'd', 1);
			if ('m' in bits || bits.b || bits.B) handle.call(date, 'm', 1);

			for (var key in bits) handle.call(date, key, bits[key]);
			return date;
		}
	};
};

var handle = function(key, value){
	if (!value) return this;

	switch (key){
		case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
		case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
		case 'd': return this.set('date', value);
		case 'H': case 'I': return this.set('hr', value);
		case 'm': return this.set('mo', value - 1);
		case 'M': return this.set('min', value);
		case 'p': return this.set('ampm', value.replace(/\./g, ''));
		case 'S': return this.set('sec', value);
		case 's': return this.set('ms', ('0.' + value) * 1000);
		case 'w': return this.set('day', value);
		case 'Y': return this.set('year', value);
		case 'y':
			value = +value;
			if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
			return this.set('year', value);
		case 'z':
			if (value == 'Z') value = '+00';
			var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
			offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
			return this.set('time', this - offset * 60000);
	}

	return this;
};

Date.defineParsers(
	'%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
	'%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
	'%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
	'%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
	'%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
	'%Y %b( %d%o( %X)?)?', // Same as above with year coming first
	'%o %b %d %X %z %Y', // "Thu Oct 22 08:11:23 +0000 2009"
	'%T', // %H:%M:%S
	'%H:%M( ?%p)?' // "11:05pm", "11:05 am" and "11:05"
);

Locale.addEvent('change', function(language){
	if (Locale.get('Date')) recompile(language);
}).fireEvent('change', Locale.getCurrent());

})();


/*
---

script: Date.Extras.js

name: Date.Extras

description: Extends the Date native object to include extra methods (on top of those in Date.js).

license: MIT-style license

authors:
  - Aaron Newton
  - Scott Kyle

requires:
  - /Date

provides: [Date.Extras]

...
*/

Date.implement({

	timeDiffInWords: function(to){
		return Date.distanceOfTimeInWords(this, to || new Date);
	},

	timeDiff: function(to, separator){
		if (to == null) to = new Date;
		var delta = ((to - this) / 1000).floor().abs();

		var vals = [],
			durations = [60, 60, 24, 365, 0],
			names = ['s', 'm', 'h', 'd', 'y'],
			value, duration;

		for (var item = 0; item < durations.length; item++){
			if (item && !delta) break;
			value = delta;
			if ((duration = durations[item])){
				value = (delta % duration);
				delta = (delta / duration).floor();
			}
			vals.unshift(value + (names[item] || ''));
		}

		return vals.join(separator || ':');
	}

}).extend({

	distanceOfTimeInWords: function(from, to){
		return Date.getTimePhrase(((to - from) / 1000).toInt());
	},

	getTimePhrase: function(delta){
		var suffix = (delta < 0) ? 'Until' : 'Ago';
		if (delta < 0) delta *= -1;

		var units = {
			minute: 60,
			hour: 60,
			day: 24,
			week: 7,
			month: 52 / 12,
			year: 12,
			eon: Infinity
		};

		var msg = 'lessThanMinute';

		for (var unit in units){
			var interval = units[unit];
			if (delta < 1.5 * interval){
				if (delta > 0.75 * interval) msg = unit;
				break;
			}
			delta /= interval;
			msg = unit + 's';
		}

		delta = delta.round();
		return Date.getMsg(msg + suffix, delta).substitute({delta: delta});
	}

}).defineParsers(

	{
		// "today", "tomorrow", "yesterday"
		re: /^(?:tod|tom|yes)/i,
		handler: function(bits){
			var d = new Date().clearTime();
			switch (bits[0]){
				case 'tom': return d.increment();
				case 'yes': return d.decrement();
				default: return d;
			}
		}
	},

	{
		// "next Wednesday", "last Thursday"
		re: /^(next|last) ([a-z]+)$/i,
		handler: function(bits){
			var d = new Date().clearTime();
			var day = d.getDay();
			var newDay = Date.parseDay(bits[2], true);
			var addDays = newDay - day;
			if (newDay <= day) addDays += 7;
			if (bits[1] == 'last') addDays -= 7;
			return d.set('date', d.getDate() + addDays);
		}
	}

).alias('timeAgoInWords', 'timeDiffInWords');


/*
---

name: Locale.en-US.Number

description: Number messages for US English.

license: MIT-style license

authors:
  - Arian Stolwijk

requires:
  - /Locale

provides: [Locale.en-US.Number]

...
*/

Locale.define('en-US', 'Number', {

	decimal: '.',
	group: ',',

/* 	Commented properties are the defaults for Number.format
	decimals: 0,
	precision: 0,
	scientific: null,

	prefix: null,
	suffic: null,

	// Negative/Currency/percentage will mixin Number
	negative: {
		prefix: '-'
	},*/

	currency: {
//		decimals: 2,
		prefix: '$ '
	}/*,

	percentage: {
		decimals: 2,
		suffix: '%'
	}*/

});




/*
---
name: Number.Format
description: Extends the Number Type object to include a number formatting method.
license: MIT-style license
authors: [Arian Stolwijk]
requires: [Core/Number, Locale.en-US.Number]
# Number.Extras is for compatibility
provides: [Number.Format, Number.Extras]
...
*/


Number.implement({

	format: function(options){
		// Thanks dojo and YUI for some inspiration
		var value = this;
		options = options ? Object.clone(options) : {};
		var getOption = function(key){
			if (options[key] != null) return options[key];
			return Locale.get('Number.' + key);
		};

		var negative = value < 0,
			decimal = getOption('decimal'),
			precision = getOption('precision'),
			group = getOption('group'),
			decimals = getOption('decimals');

		if (negative){
			var negativeLocale = getOption('negative') || {};
			if (negativeLocale.prefix == null && negativeLocale.suffix == null) negativeLocale.prefix = '-';
			['prefix', 'suffix'].each(function(key){
				if (negativeLocale[key]) options[key] = getOption(key) + negativeLocale[key];
			});

			value = -value;
		}

		var prefix = getOption('prefix'),
			suffix = getOption('suffix');

		if (decimals !== '' && decimals >= 0 && decimals <= 20) value = value.toFixed(decimals);
		if (precision >= 1 && precision <= 21) value = (+value).toPrecision(precision);

		value += '';
		var index;
		if (getOption('scientific') === false && value.indexOf('e') > -1){
			var match = value.split('e'),
				zeros = +match[1];
			value = match[0].replace('.', '');

			if (zeros < 0){
				zeros = -zeros - 1;
				index = match[0].indexOf('.');
				if (index > -1) zeros -= index - 1;
				while (zeros--) value = '0' + value;
				value = '0.' + value;
			} else {
				index = match[0].lastIndexOf('.');
				if (index > -1) zeros -= match[0].length - index - 1;
				while (zeros--) value += '0';
			}
		}

		if (decimal != '.') value = value.replace('.', decimal);

		if (group){
			index = value.lastIndexOf(decimal);
			index = (index > -1) ? index : value.length;
			var newOutput = value.substring(index),
				i = index;

			while (i--){
				if ((index - i - 1) % 3 == 0 && i != (index - 1)) newOutput = group + newOutput;
				newOutput = value.charAt(i) + newOutput;
			}

			value = newOutput;
		}

		if (prefix) value = prefix + value;
		if (suffix) value += suffix;

		return value;
	},

	formatCurrency: function(decimals){
		var locale = Locale.get('Number.currency') || {};
		if (locale.scientific == null) locale.scientific = false;
		locale.decimals = decimals != null ? decimals
			: (locale.decimals == null ? 2 : locale.decimals);

		return this.format(locale);
	},

	formatPercentage: function(decimals){
		var locale = Locale.get('Number.percentage') || {};
		if (locale.suffix == null) locale.suffix = '%';
		locale.decimals = decimals != null ? decimals
			: (locale.decimals == null ? 2 : locale.decimals);

		return this.format(locale);
	}

});


/*
---

script: String.Extras.js

name: String.Extras

description: Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Christopher Pitt

requires:
  - Core/String
  - Core/Array
  - MooTools.More

provides: [String.Extras]

...
*/

(function(){

var special = {
	'a': /[Ă ĂˇĂ˘ĂŁĂ¤ĂĄÄ�Ä…]/g,
	'A': /[Ă€Ă�Ă‚Ă�Ă„Ă…Ä‚Ä„]/g,
	'c': /[Ä‡ÄŤĂ§]/g,
	'C': /[Ä†ÄŚĂ‡]/g,
	'd': /[ÄŹÄ‘]/g,
	'D': /[ÄŽĂ�]/g,
	'e': /[Ă¨Ă©ĂŞĂ«Ä›Ä™]/g,
	'E': /[Ă�Ă‰ĂŠĂ‹ÄšÄ�]/g,
	'g': /[Äź]/g,
	'G': /[Äž]/g,
	'i': /[Ă¬Ă­Ă®ĂŻ]/g,
	'I': /[ĂŚĂŤĂŽĂŹ]/g,
	'l': /[ÄşÄľĹ‚]/g,
	'L': /[ÄąÄ˝Ĺ�]/g,
	'n': /[Ă±Ĺ�Ĺ„]/g,
	'N': /[Ă‘Ĺ‡Ĺ�]/g,
	'o': /[Ă˛ĂłĂ´ĂµĂ¶Ă¸Ĺ‘]/g,
	'O': /[Ă’Ă“Ă”Ă•Ă–Ă�]/g,
	'r': /[Ĺ™Ĺ•]/g,
	'R': /[Ĺ�Ĺ”]/g,
	's': /[ĹˇĹˇĹź]/g,
	'S': /[Ĺ ĹžĹš]/g,
	't': /[ĹĄĹŁ]/g,
	'T': /[Ĺ¤Ĺ˘]/g,
	'ue': /[ĂĽ]/g,
	'UE': /[Ăś]/g,
	'u': /[ĂąĂşĂ»ĹŻÂµ]/g,
	'U': /[Ă™ĂšĂ›Ĺ®]/g,
	'y': /[ĂżĂ˝]/g,
	'Y': /[Ĺ¸Ăť]/g,
	'z': /[ĹľĹşĹĽ]/g,
	'Z': /[Ĺ˝ĹąĹ»]/g,
	'th': /[Ăľ]/g,
	'TH': /[Ăž]/g,
	'dh': /[Ă°]/g,
	'DH': /[Ă�]/g,
	'ss': /[Ăź]/g,
	'oe': /[Ĺ“]/g,
	'OE': /[Ĺ’]/g,
	'ae': /[Ă¦]/g,
	'AE': /[Ă†]/g
},

tidy = {
	' ': /[\xa0\u2002\u2003\u2009]/g,
	'*': /[\xb7]/g,
	'\'': /[\u2018\u2019]/g,
	'"': /[\u201c\u201d]/g,
	'...': /[\u2026]/g,
	'-': /[\u2013]/g,
//	'--': /[\u2014]/g,
	'&raquo;': /[\uFFFD]/g
};

var walk = function(string, replacements){
	var result = string, key;
	for (key in replacements) result = result.replace(replacements[key], key);
	return result;
};

var getRegexForTag = function(tag, contents){
	tag = tag || '';
	var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>",
		reg = new RegExp(regstr, "gi");
	return reg;
};

String.implement({

	standardize: function(){
		return walk(this, special);
	},

	repeat: function(times){
		return new Array(times + 1).join(this);
	},

	pad: function(length, str, direction){
		if (this.length >= length) return this;

		var pad = (str == null ? ' ' : '' + str)
			.repeat(length - this.length)
			.substr(0, length - this.length);

		if (!direction || direction == 'right') return this + pad;
		if (direction == 'left') return pad + this;

		return pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
	},

	getTags: function(tag, contents){
		return this.match(getRegexForTag(tag, contents)) || [];
	},

	stripTags: function(tag, contents){
		return this.replace(getRegexForTag(tag, contents), '');
	},

	tidy: function(){
		return walk(this, tidy);
	},

	truncate: function(max, trail, atChar){
		var string = this;
		if (trail == null && arguments.length == 1) trail = 'â€¦';
		if (string.length > max){
			string = string.substring(0, max);
			if (atChar){
				var index = string.lastIndexOf(atChar);
				if (index != -1) string = string.substr(0, index);
			}
			if (trail) string += trail;
		}
		return string;
	}

});

})();


/*
---

script: String.QueryString.js

name: String.QueryString

description: Methods for dealing with URI query strings.

license: MIT-style license

authors:
  - Sebastian MarkbĂĄge
  - Aaron Newton
  - Lennart Pilon
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - /MooTools.More

provides: [String.QueryString]

...
*/

String.implement({

	parseQueryString: function(decodeKeys, decodeValues){
		if (decodeKeys == null) decodeKeys = true;
		if (decodeValues == null) decodeValues = true;

		var vars = this.split(/[&;]/),
			object = {};
		if (!vars.length) return object;

		vars.each(function(val){
			var index = val.indexOf('=') + 1,
				value = index ? val.substr(index) : '',
				keys = index ? val.substr(0, index - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [val],
				obj = object;
			if (!keys) return;
			if (decodeValues) value = decodeURIComponent(value);
			keys.each(function(key, i){
				if (decodeKeys) key = decodeURIComponent(key);
				var current = obj[key];

				if (i < keys.length - 1) obj = obj[key] = current || {};
				else if (typeOf(current) == 'array') current.push(value);
				else obj[key] = current != null ? [current, value] : value;
			});
		});

		return object;
	},

	cleanQueryString: function(method){
		return this.split('&').filter(function(val){
			var index = val.indexOf('='),
				key = index < 0 ? '' : val.substr(0, index),
				value = val.substr(index + 1);

			return method ? method.call(null, key, value) : (value || value === 0);
		}).join('&');
	}

});


/*
---

script: URI.js

name: URI

description: Provides methods useful in managing the window location and uris.

license: MIT-style license

authors:
  - Sebastian MarkbĂĄge
  - Aaron Newton

requires:
  - Core/Object
  - Core/Class
  - Core/Class.Extras
  - Core/Element
  - /String.QueryString

provides: [URI]

...
*/

(function(){

var toString = function(){
	return this.get('value');
};

var URI = this.URI = new Class({

	Implements: Options,

	options: {
		/*base: false*/
	},

	regex: /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
	parts: ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'],
	schemes: {http: 80, https: 443, ftp: 21, rtsp: 554, mms: 1755, file: 0},

	initialize: function(uri, options){
		this.setOptions(options);
		var base = this.options.base || URI.base;
		if (!uri) uri = base;

		if (uri && uri.parsed) this.parsed = Object.clone(uri.parsed);
		else this.set('value', uri.href || uri.toString(), base ? new URI(base) : false);
	},

	parse: function(value, base){
		var bits = value.match(this.regex);
		if (!bits) return false;
		bits.shift();
		return this.merge(bits.associate(this.parts), base);
	},

	merge: function(bits, base){
		if ((!bits || !bits.scheme) && (!base || !base.scheme)) return false;
		if (base){
			this.parts.every(function(part){
				if (bits[part]) return false;
				bits[part] = base[part] || '';
				return true;
			});
		}
		bits.port = bits.port || this.schemes[bits.scheme.toLowerCase()];
		bits.directory = bits.directory ? this.parseDirectory(bits.directory, base ? base.directory : '') : '/';
		return bits;
	},

	parseDirectory: function(directory, baseDirectory){
		directory = (directory.substr(0, 1) == '/' ? '' : (baseDirectory || '/')) + directory;
		if (!directory.test(URI.regs.directoryDot)) return directory;
		var result = [];
		directory.replace(URI.regs.endSlash, '').split('/').each(function(dir){
			if (dir == '..' && result.length > 0) result.pop();
			else if (dir != '.') result.push(dir);
		});
		return result.join('/') + '/';
	},

	combine: function(bits){
		return bits.value || bits.scheme + '://' +
			(bits.user ? bits.user + (bits.password ? ':' + bits.password : '') + '@' : '') +
			(bits.host || '') + (bits.port && bits.port != this.schemes[bits.scheme] ? ':' + bits.port : '') +
			(bits.directory || '/') + (bits.file || '') +
			(bits.query ? '?' + bits.query : '') +
			(bits.fragment ? '#' + bits.fragment : '');
	},

	set: function(part, value, base){
		if (part == 'value'){
			var scheme = value.match(URI.regs.scheme);
			if (scheme) scheme = scheme[1];
			if (scheme && this.schemes[scheme.toLowerCase()] == null) this.parsed = { scheme: scheme, value: value };
			else this.parsed = this.parse(value, (base || this).parsed) || (scheme ? { scheme: scheme, value: value } : { value: value });
		} else if (part == 'data'){
			this.setData(value);
		} else {
			this.parsed[part] = value;
		}
		return this;
	},

	get: function(part, base){
		switch (part){
			case 'value': return this.combine(this.parsed, base ? base.parsed : false);
			case 'data' : return this.getData();
		}
		return this.parsed[part] || '';
	},

	go: function(){
		document.location.href = this.toString();
	},

	toURI: function(){
		return this;
	},

	getData: function(key, part){
		var qs = this.get(part || 'query');
		if (!(qs || qs === 0)) return key ? null : {};
		var obj = qs.parseQueryString();
		return key ? obj[key] : obj;
	},

	setData: function(values, merge, part){
		if (typeof values == 'string'){
			var data = this.getData();
			data[arguments[0]] = arguments[1];
			values = data;
		} else if (merge){
			values = Object.merge(this.getData(), values);
		}
		return this.set(part || 'query', Object.toQueryString(values));
	},

	clearData: function(part){
		return this.set(part || 'query', '');
	},

	toString: toString,
	valueOf: toString

});

URI.regs = {
	endSlash: /\/$/,
	scheme: /^(\w+):/,
	directoryDot: /\.\/|\.$/
};

URI.base = new URI(Array.from(document.getElements('base[href]', true)).getLast(), {base: document.location});

String.implement({

	toURI: function(options){
		return new URI(this, options);
	}

});

})();


/*
---

script: URI.Relative.js

name: URI.Relative

description: Extends the URI class to add methods for computing relative and absolute urls.

license: MIT-style license

authors:
  - Sebastian MarkbĂĄge


requires:
  - /Class.refactor
  - /URI

provides: [URI.Relative]

...
*/

URI = Class.refactor(URI, {

	combine: function(bits, base){
		if (!base || bits.scheme != base.scheme || bits.host != base.host || bits.port != base.port)
			return this.previous.apply(this, arguments);
		var end = bits.file + (bits.query ? '?' + bits.query : '') + (bits.fragment ? '#' + bits.fragment : '');

		if (!base.directory) return (bits.directory || (bits.file ? '' : './')) + end;

		var baseDir = base.directory.split('/'),
			relDir = bits.directory.split('/'),
			path = '',
			offset;

		var i = 0;
		for (offset = 0; offset < baseDir.length && offset < relDir.length && baseDir[offset] == relDir[offset]; offset++);
		for (i = 0; i < baseDir.length - offset - 1; i++) path += '../';
		for (i = offset; i < relDir.length - 1; i++) path += relDir[i] + '/';

		return (path || (bits.file ? '' : './')) + end;
	},

	toAbsolute: function(base){
		base = new URI(base);
		if (base) base.set('directory', '').set('file', '');
		return this.toRelative(base);
	},

	toRelative: function(base){
		return this.get('value', new URI(base));
	}

});


/*
---

name: Hash

description: Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.

license: MIT-style license.

requires:
  - Core/Object
  - /MooTools.More

provides: [Hash]

...
*/

(function(){

if (this.Hash) return;

var Hash = this.Hash = new Type('Hash', function(object){
	if (typeOf(object) == 'hash') object = Object.clone(object.getClean());
	for (var key in object) this[key] = object[key];
	return this;
});

this.$H = function(object){
	return new Hash(object);
};

Hash.implement({

	forEach: function(fn, bind){
		Object.forEach(this, fn, bind);
	},

	getClean: function(){
		var clean = {};
		for (var key in this){
			if (this.hasOwnProperty(key)) clean[key] = this[key];
		}
		return clean;
	},

	getLength: function(){
		var length = 0;
		for (var key in this){
			if (this.hasOwnProperty(key)) length++;
		}
		return length;
	}

});

Hash.alias('each', 'forEach');

Hash.implement({

	has: Object.prototype.hasOwnProperty,

	keyOf: function(value){
		return Object.keyOf(this, value);
	},

	hasValue: function(value){
		return Object.contains(this, value);
	},

	extend: function(properties){
		Hash.each(properties || {}, function(value, key){
			Hash.set(this, key, value);
		}, this);
		return this;
	},

	combine: function(properties){
		Hash.each(properties || {}, function(value, key){
			Hash.include(this, key, value);
		}, this);
		return this;
	},

	erase: function(key){
		if (this.hasOwnProperty(key)) delete this[key];
		return this;
	},

	get: function(key){
		return (this.hasOwnProperty(key)) ? this[key] : null;
	},

	set: function(key, value){
		if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
		return this;
	},

	empty: function(){
		Hash.each(this, function(value, key){
			delete this[key];
		}, this);
		return this;
	},

	include: function(key, value){
		if (this[key] == undefined) this[key] = value;
		return this;
	},

	map: function(fn, bind){
		return new Hash(Object.map(this, fn, bind));
	},

	filter: function(fn, bind){
		return new Hash(Object.filter(this, fn, bind));
	},

	every: function(fn, bind){
		return Object.every(this, fn, bind);
	},

	some: function(fn, bind){
		return Object.some(this, fn, bind);
	},

	getKeys: function(){
		return Object.keys(this);
	},

	getValues: function(){
		return Object.values(this);
	},

	toQueryString: function(base){
		return Object.toQueryString(this, base);
	}

});

Hash.alias({indexOf: 'keyOf', contains: 'hasValue'});


})();



/*
---

script: Hash.Extras.js

name: Hash.Extras

description: Extends the Hash Type to include getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Hash
  - /Object.Extras

provides: [Hash.Extras]

...
*/

Hash.implement({

	getFromPath: function(notation){
		return Object.getFromPath(this, notation);
	},

	cleanValues: function(method){
		return new Hash(Object.cleanValues(this, method));
	},

	run: function(){
		Object.run(arguments);
	}

});


/*
---

script: Element.Forms.js

name: Element.Forms

description: Extends the Element native object to include methods useful in managing inputs.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element
  - /String.Extras
  - /MooTools.More

provides: [Element.Forms]

...
*/

Element.implement({

	tidy: function(){
		this.set('value', this.get('value').tidy());
	},

	getTextInRange: function(start, end){
		return this.get('value').substring(start, end);
	},

	getSelectedText: function(){
		if (this.setSelectionRange) return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
		return document.selection.createRange().text;
	},

	getSelectedRange: function(){
		if (this.selectionStart != null){
			return {
				start: this.selectionStart,
				end: this.selectionEnd
			};
		}

		var pos = {
			start: 0,
			end: 0
		};
		var range = this.getDocument().selection.createRange();
		if (!range || range.parentElement() != this) return pos;
		var duplicate = range.duplicate();

		if (this.type == 'text'){
			pos.start = 0 - duplicate.moveStart('character', -100000);
			pos.end = pos.start + range.text.length;
		} else {
			var value = this.get('value');
			var offset = value.length;
			duplicate.moveToElementText(this);
			duplicate.setEndPoint('StartToEnd', range);
			if (duplicate.text.length) offset -= value.match(/[\n\r]*$/)[0].length;
			pos.end = offset - duplicate.text.length;
			duplicate.setEndPoint('StartToStart', range);
			pos.start = offset - duplicate.text.length;
		}
		return pos;
	},

	getSelectionStart: function(){
		return this.getSelectedRange().start;
	},

	getSelectionEnd: function(){
		return this.getSelectedRange().end;
	},

	setCaretPosition: function(pos){
		if (pos == 'end') pos = this.get('value').length;
		this.selectRange(pos, pos);
		return this;
	},

	getCaretPosition: function(){
		return this.getSelectedRange().start;
	},

	selectRange: function(start, end){
		if (this.setSelectionRange){
			this.focus();
			this.setSelectionRange(start, end);
		} else {
			var value = this.get('value');
			var diff = value.substr(start, end - start).replace(/\r/g, '').length;
			start = value.substr(0, start).replace(/\r/g, '').length;
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', start + diff);
			range.moveStart('character', start);
			range.select();
		}
		return this;
	},

	insertAtCursor: function(value, select){
		var pos = this.getSelectedRange();
		var text = this.get('value');
		this.set('value', text.substring(0, pos.start) + value + text.substring(pos.end, text.length));
		if (select !== false) this.selectRange(pos.start, pos.start + value.length);
		else this.setCaretPosition(pos.start + value.length);
		return this;
	},

	insertAroundCursor: function(options, select){
		options = Object.append({
			before: '',
			defaultMiddle: '',
			after: ''
		}, options);

		var value = this.getSelectedText() || options.defaultMiddle;
		var pos = this.getSelectedRange();
		var text = this.get('value');

		if (pos.start == pos.end){
			this.set('value', text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length));
			this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length);
		} else {
			var current = text.substring(pos.start, pos.end);
			this.set('value', text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
			var selStart = pos.start + options.before.length;
			if (select !== false) this.selectRange(selStart, selStart + current.length);
			else this.setCaretPosition(selStart + text.length);
		}
		return this;
	}

});


/*
---

script: Elements.From.js

name: Elements.From

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/String
  - Core/Element
  - /MooTools.More

provides: [Elements.from, Elements.From]

...
*/

Elements.from = function(text, excludeScripts){
	if (excludeScripts || excludeScripts == null) text = text.stripScripts();

	var container, match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);

	if (match){
		container = new Element('table');
		var tag = match[1].toLowerCase();
		if (['td', 'th', 'tr'].contains(tag)){
			container = new Element('tbody').inject(container);
			if (tag != 'tr') container = new Element('tr').inject(container);
		}
	}

	return (container || new Element('div')).set('html', text).getChildren();
};


/*
---

name: Element.Event.Pseudos

description: Adds the functionality to add pseudo events for Elements

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Element.Event, Core/Element.Delegation, Events.Pseudos]

provides: [Element.Event.Pseudos, Element.Delegation]

...
*/

(function(){

var pseudos = {relay: false},
	copyFromEvents = ['once', 'throttle', 'pause'],
	count = copyFromEvents.length;

while (count--) pseudos[copyFromEvents[count]] = Events.lookupPseudo(copyFromEvents[count]);

DOMEvent.definePseudo = function(key, listener){
	pseudos[key] = listener;
	return this;
};

var proto = Element.prototype;
[Element, Window, Document].invoke('implement', Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

})();


/*
---

name: Element.Event.Pseudos.Keys

description: Adds functionality fire events if certain keycombinations are pressed

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Element.Event.Pseudos]

provides: [Element.Event.Pseudos.Keys]

...
*/

(function(){

var keysStoreKey = '$moo:keys-pressed',
	keysKeyupStoreKey = '$moo:keys-keyup';


DOMEvent.definePseudo('keys', function(split, fn, args){

	var event = args[0],
		keys = [],
		pressed = this.retrieve(keysStoreKey, []);

	keys.append(split.value.replace('++', function(){
		keys.push('+'); // shift++ and shift+++a
		return '';
	}).split('+'));

	pressed.include(event.key);

	if (keys.every(function(key){
		return pressed.contains(key);
	})) fn.apply(this, args);

	this.store(keysStoreKey, pressed);

	if (!this.retrieve(keysKeyupStoreKey)){
		var keyup = function(event){
			(function(){
				pressed = this.retrieve(keysStoreKey, []).erase(event.key);
				this.store(keysStoreKey, pressed);
			}).delay(0, this); // Fix for IE
		};
		this.store(keysKeyupStoreKey, keyup).addEvent('keyup', keyup);
	}

});

DOMEvent.defineKeys({
	'16': 'shift',
	'17': 'control',
	'18': 'alt',
	'20': 'capslock',
	'33': 'pageup',
	'34': 'pagedown',
	'35': 'end',
	'36': 'home',
	'144': 'numlock',
	'145': 'scrolllock',
	'186': ';',
	'187': '=',
	'188': ',',
	'190': '.',
	'191': '/',
	'192': '`',
	'219': '[',
	'220': '\\',
	'221': ']',
	'222': "'",
	'107': '+'
}).defineKey(Browser.firefox ? 109 : 189, '-');

})();


/*
---

script: Element.Measure.js

name: Element.Measure

description: Extends the Element native object to include methods useful in measuring dimensions.

credits: "Element.measure / .expose methods by Daniel Steigerwald License: MIT-style license. Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz"

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Element.Measure]

...
*/

(function(){

var getStylesList = function(styles, planes){
	var list = [];
	Object.each(planes, function(directions){
		Object.each(directions, function(edge){
			styles.each(function(style){
				list.push(style + '-' + edge + (style == 'border' ? '-width' : ''));
			});
		});
	});
	return list;
};

var calculateEdgeSize = function(edge, styles){
	var total = 0;
	Object.each(styles, function(value, style){
		if (style.test(edge)) total = total + value.toInt();
	});
	return total;
};

var isVisible = function(el){
	return !!(!el || el.offsetHeight || el.offsetWidth);
};


Element.implement({

	measure: function(fn){
		if (isVisible(this)) return fn.call(this);
		var parent = this.getParent(),
			toMeasure = [];
		while (!isVisible(parent) && parent != document.body){
			toMeasure.push(parent.expose());
			parent = parent.getParent();
		}
		var restore = this.expose(),
			result = fn.call(this);
		restore();
		toMeasure.each(function(restore){
			restore();
		});
		return result;
	},

	expose: function(){
		if (this.getStyle('display') != 'none') return function(){};
		var before = this.style.cssText;
		this.setStyles({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		});
		return function(){
			this.style.cssText = before;
		}.bind(this);
	},

	getDimensions: function(options){
		options = Object.merge({computeSize: false}, options);
		var dim = {x: 0, y: 0};

		var getSize = function(el, options){
			return (options.computeSize) ? el.getComputedSize(options) : el.getSize();
		};

		var parent = this.getParent('body');

		if (parent && this.getStyle('display') == 'none'){
			dim = this.measure(function(){
				return getSize(this, options);
			});
		} else if (parent){
			try { //safari sometimes crashes here, so catch it
				dim = getSize(this, options);
			}catch(e){}
		}

		return Object.append(dim, (dim.x || dim.x === 0) ? {
				width: dim.x,
				height: dim.y
			} : {
				x: dim.width,
				y: dim.height
			}
		);
	},

	getComputedSize: function(options){
		

		options = Object.merge({
			styles: ['padding','border'],
			planes: {
				height: ['top','bottom'],
				width: ['left','right']
			},
			mode: 'both'
		}, options);

		var styles = {},
			size = {width: 0, height: 0},
			dimensions;

		if (options.mode == 'vertical'){
			delete size.width;
			delete options.planes.width;
		} else if (options.mode == 'horizontal'){
			delete size.height;
			delete options.planes.height;
		}

		getStylesList(options.styles, options.planes).each(function(style){
			styles[style] = this.getStyle(style).toInt();
		}, this);

		Object.each(options.planes, function(edges, plane){

			var capitalized = plane.capitalize(),
				style = this.getStyle(plane);

			if (style == 'auto' && !dimensions) dimensions = this.getDimensions();

			style = styles[plane] = (style == 'auto') ? dimensions[plane] : style.toInt();
			size['total' + capitalized] = style;

			edges.each(function(edge){
				var edgesize = calculateEdgeSize(edge, styles);
				size['computed' + edge.capitalize()] = edgesize;
				size['total' + capitalized] += edgesize;
			});

		}, this);

		return Object.append(size, styles);
	}

});

})();


/*
---

script: Element.Pin.js

name: Element.Pin

description: Extends the Element native object to include the pin method useful for fixed positioning for elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Event
  - Core/Element.Dimensions
  - Core/Element.Style
  - /MooTools.More

provides: [Element.Pin]

...
*/

(function(){
	var supportsPositionFixed = false,
		supportTested = false;

	var testPositionFixed = function(){
		var test = new Element('div').setStyles({
			position: 'fixed',
			top: 0,
			right: 0
		}).inject(document.body);
		supportsPositionFixed = (test.offsetTop === 0);
		test.dispose();
		supportTested = true;
	};

	Element.implement({

		pin: function(enable, forceScroll){
			if (!supportTested) testPositionFixed();
			if (this.getStyle('display') == 'none') return this;

			var pinnedPosition,
				scroll = window.getScroll(),
				parent,
				scrollFixer;

			if (enable !== false){
				pinnedPosition = this.getPosition(supportsPositionFixed ? document.body : this.getOffsetParent());
				if (!this.retrieve('pin:_pinned')){
					var currentPosition = {
						top: pinnedPosition.y - scroll.y,
						left: pinnedPosition.x - scroll.x
					};

					if (supportsPositionFixed && !forceScroll){
						this.setStyle('position', 'fixed').setStyles(currentPosition);
					} else {

						parent = this.getOffsetParent();
						var position = this.getPosition(parent),
							styles = this.getStyles('left', 'top');

						if (parent && styles.left == 'auto' || styles.top == 'auto') this.setPosition(position);
						if (this.getStyle('position') == 'static') this.setStyle('position', 'absolute');

						position = {
							x: styles.left.toInt() - scroll.x,
							y: styles.top.toInt() - scroll.y
						};

						scrollFixer = function(){
							if (!this.retrieve('pin:_pinned')) return;
							var scroll = window.getScroll();
							this.setStyles({
								left: position.x + scroll.x,
								top: position.y + scroll.y
							});
						}.bind(this);

						this.store('pin:_scrollFixer', scrollFixer);
						window.addEvent('scroll', scrollFixer);
					}
					this.store('pin:_pinned', true);
				}

			} else {
				if (!this.retrieve('pin:_pinned')) return this;

				parent = this.getParent();
				var offsetParent = (parent.getComputedStyle('position') != 'static' ? parent : parent.getOffsetParent());

				pinnedPosition = this.getPosition(offsetParent);

				this.store('pin:_pinned', false);
				scrollFixer = this.retrieve('pin:_scrollFixer');
				if (!scrollFixer){
					this.setStyles({
						position: 'absolute',
						top: pinnedPosition.y + scroll.y,
						left: pinnedPosition.x + scroll.x
					});
				} else {
					this.store('pin:_scrollFixer', null);
					window.removeEvent('scroll', scrollFixer);
				}
				this.removeClass('isPinned');
			}
			return this;
		},

		unpin: function(){
			return this.pin(false);
		},

		togglePin: function(){
			return this.pin(!this.retrieve('pin:_pinned'));
		}

	});



})();


/*
---

script: Element.Position.js

name: Element.Position

description: Extends the Element native object to include methods useful positioning elements relative to others.

license: MIT-style license

authors:
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/Options
  - Core/Element.Dimensions
  - Element.Measure

provides: [Element.Position]

...
*/

(function(original){

var local = Element.Position = {

	options: {/*
		edge: false,
		returnPos: false,
		minimum: {x: 0, y: 0},
		maximum: {x: 0, y: 0},
		relFixedPosition: false,
		ignoreMargins: false,
		ignoreScroll: false,
		allowNegative: false,*/
		relativeTo: document.body,
		position: {
			x: 'center', //left, center, right
			y: 'center' //top, center, bottom
		},
		offset: {x: 0, y: 0}
	},

	getOptions: function(element, options){
		options = Object.merge({}, local.options, options);
		local.setPositionOption(options);
		local.setEdgeOption(options);
		local.setOffsetOption(element, options);
		local.setDimensionsOption(element, options);
		return options;
	},

	setPositionOption: function(options){
		options.position = local.getCoordinateFromValue(options.position);
	},

	setEdgeOption: function(options){
		var edgeOption = local.getCoordinateFromValue(options.edge);
		options.edge = edgeOption ? edgeOption :
			(options.position.x == 'center' && options.position.y == 'center') ? {x: 'center', y: 'center'} :
			{x: 'left', y: 'top'};
	},

	setOffsetOption: function(element, options){
		var parentOffset = {x: 0, y: 0},
			offsetParent = element.measure(function(){
				return document.id(this.getOffsetParent());
			}),
			parentScroll = offsetParent.getScroll();

		if (!offsetParent || offsetParent == element.getDocument().body) return;
		parentOffset = offsetParent.measure(function(){
			var position = this.getPosition();
			if (this.getStyle('position') == 'fixed'){
				var scroll = window.getScroll();
				position.x += scroll.x;
				position.y += scroll.y;
			}
			return position;
		});

		options.offset = {
			parentPositioned: offsetParent != document.id(options.relativeTo),
			x: options.offset.x - parentOffset.x + parentScroll.x,
			y: options.offset.y - parentOffset.y + parentScroll.y
		};
	},

	setDimensionsOption: function(element, options){
		options.dimensions = element.getDimensions({
			computeSize: true,
			styles: ['padding', 'border', 'margin']
		});
	},

	getPosition: function(element, options){
		var position = {};
		options = local.getOptions(element, options);
		var relativeTo = document.id(options.relativeTo) || document.body;

		local.setPositionCoordinates(options, position, relativeTo);
		if (options.edge) local.toEdge(position, options);

		var offset = options.offset;
		position.left = ((position.x >= 0 || offset.parentPositioned || options.allowNegative) ? position.x : 0).toInt();
		position.top = ((position.y >= 0 || offset.parentPositioned || options.allowNegative) ? position.y : 0).toInt();

		local.toMinMax(position, options);

		if (options.relFixedPosition || relativeTo.getStyle('position') == 'fixed') local.toRelFixedPosition(relativeTo, position);
		if (options.ignoreScroll) local.toIgnoreScroll(relativeTo, position);
		if (options.ignoreMargins) local.toIgnoreMargins(position, options);

		position.left = Math.ceil(position.left);
		position.top = Math.ceil(position.top);
		delete position.x;
		delete position.y;

		return position;
	},

	setPositionCoordinates: function(options, position, relativeTo){
		var offsetY = options.offset.y,
			offsetX = options.offset.x,
			calc = (relativeTo == document.body) ? window.getScroll() : relativeTo.getPosition(),
			top = calc.y,
			left = calc.x,
			winSize = window.getSize();

		switch(options.position.x){
			case 'left': position.x = left + offsetX; break;
			case 'right': position.x = left + offsetX + relativeTo.offsetWidth; break;
			default: position.x = left + ((relativeTo == document.body ? winSize.x : relativeTo.offsetWidth) / 2) + offsetX; break;
		}

		switch(options.position.y){
			case 'top': position.y = top + offsetY; break;
			case 'bottom': position.y = top + offsetY + relativeTo.offsetHeight; break;
			default: position.y = top + ((relativeTo == document.body ? winSize.y : relativeTo.offsetHeight) / 2) + offsetY; break;
		}
	},

	toMinMax: function(position, options){
		var xy = {left: 'x', top: 'y'}, value;
		['minimum', 'maximum'].each(function(minmax){
			['left', 'top'].each(function(lr){
				value = options[minmax] ? options[minmax][xy[lr]] : null;
				if (value != null && ((minmax == 'minimum') ? position[lr] < value : position[lr] > value)) position[lr] = value;
			});
		});
	},

	toRelFixedPosition: function(relativeTo, position){
		var winScroll = window.getScroll();
		position.top += winScroll.y;
		position.left += winScroll.x;
	},

	toIgnoreScroll: function(relativeTo, position){
		var relScroll = relativeTo.getScroll();
		position.top -= relScroll.y;
		position.left -= relScroll.x;
	},

	toIgnoreMargins: function(position, options){
		position.left += options.edge.x == 'right'
			? options.dimensions['margin-right']
			: (options.edge.x != 'center'
				? -options.dimensions['margin-left']
				: -options.dimensions['margin-left'] + ((options.dimensions['margin-right'] + options.dimensions['margin-left']) / 2));

		position.top += options.edge.y == 'bottom'
			? options.dimensions['margin-bottom']
			: (options.edge.y != 'center'
				? -options.dimensions['margin-top']
				: -options.dimensions['margin-top'] + ((options.dimensions['margin-bottom'] + options.dimensions['margin-top']) / 2));
	},

	toEdge: function(position, options){
		var edgeOffset = {},
			dimensions = options.dimensions,
			edge = options.edge;

		switch(edge.x){
			case 'left': edgeOffset.x = 0; break;
			case 'right': edgeOffset.x = -dimensions.x - dimensions.computedRight - dimensions.computedLeft; break;
			// center
			default: edgeOffset.x = -(Math.round(dimensions.totalWidth / 2)); break;
		}

		switch(edge.y){
			case 'top': edgeOffset.y = 0; break;
			case 'bottom': edgeOffset.y = -dimensions.y - dimensions.computedTop - dimensions.computedBottom; break;
			// center
			default: edgeOffset.y = -(Math.round(dimensions.totalHeight / 2)); break;
		}

		position.x += edgeOffset.x;
		position.y += edgeOffset.y;
	},

	getCoordinateFromValue: function(option){
		if (typeOf(option) != 'string') return option;
		option = option.toLowerCase();

		return {
			x: option.test('left') ? 'left'
				: (option.test('right') ? 'right' : 'center'),
			y: option.test(/upper|top/) ? 'top'
				: (option.test('bottom') ? 'bottom' : 'center')
		};
	}

};

Element.implement({

	position: function(options){
		if (options && (options.x != null || options.y != null)){
			return (original ? original.apply(this, arguments) : this);
		}
		var position = this.setStyle('position', 'absolute').calculatePosition(options);
		return (options && options.returnPos) ? position : this.setStyles(position);
	},

	calculatePosition: function(options){
		return local.getPosition(this, options);
	}

});

})(Element.prototype.position);


/*
---

script: Element.Shortcuts.js

name: Element.Shortcuts

description: Extends the Element native object to include some shortcut methods.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Style
  - /MooTools.More

provides: [Element.Shortcuts]

...
*/

Element.implement({

	isDisplayed: function(){
		return this.getStyle('display') != 'none';
	},

	isVisible: function(){
		var w = this.offsetWidth,
			h = this.offsetHeight;
		return (w == 0 && h == 0) ? false : (w > 0 && h > 0) ? true : this.style.display != 'none';
	},

	toggle: function(){
		return this[this.isDisplayed() ? 'hide' : 'show']();
	},

	hide: function(){
		var d;
		try {
			//IE fails here if the element is not in the dom
			d = this.getStyle('display');
		} catch(e){}
		if (d == 'none') return this;
		return this.store('element:_originalDisplay', d || '').setStyle('display', 'none');
	},

	show: function(display){
		if (!display && this.isDisplayed()) return this;
		display = display || this.retrieve('element:_originalDisplay') || 'block';
		return this.setStyle('display', (display == 'none') ? 'block' : display);
	},

	swapClass: function(remove, add){
		return this.removeClass(remove).addClass(add);
	}

});

Document.implement({

	clearSelection: function(){
		if (window.getSelection){
			var selection = window.getSelection();
			if (selection && selection.removeAllRanges) selection.removeAllRanges();
		} else if (document.selection && document.selection.empty){
			try {
				//IE fails here if selected element is not in dom
				document.selection.empty();
			} catch(e){}
		}
	}

});


/*
---

script: IframeShim.js

name: IframeShim

description: Defines IframeShim, a class for obscuring select lists and flash objects in IE.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Event
  - Core/Element.Style
  - Core/Options
  - Core/Events
  - /Element.Position
  - /Class.Occlude

provides: [IframeShim]

...
*/

var IframeShim = new Class({

	Implements: [Options, Events, Class.Occlude],

	options: {
		className: 'iframeShim',
		src: 'javascript:false;document.write("");',
		display: false,
		zIndex: null,
		margin: 0,
		offset: {x: 0, y: 0},
		browsers: (Browser.ie6 || (Browser.firefox && Browser.version < 3 && Browser.Platform.mac))
	},

	property: 'IframeShim',

	initialize: function(element, options){
		this.element = document.id(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.makeShim();
		return this;
	},

	makeShim: function(){
		if (this.options.browsers){
			var zIndex = this.element.getStyle('zIndex').toInt();

			if (!zIndex){
				zIndex = 1;
				var pos = this.element.getStyle('position');
				if (pos == 'static' || !pos) this.element.setStyle('position', 'relative');
				this.element.setStyle('zIndex', zIndex);
			}
			zIndex = ((this.options.zIndex != null || this.options.zIndex === 0) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1;
			if (zIndex < 0) zIndex = 1;
			this.shim = new Element('iframe', {
				src: this.options.src,
				scrolling: 'no',
				frameborder: 0,
				styles: {
					zIndex: zIndex,
					position: 'absolute',
					border: 'none',
					filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
				},
				'class': this.options.className
			}).store('IframeShim', this);
			var inject = (function(){
				this.shim.inject(this.element, 'after');
				this[this.options.display ? 'show' : 'hide']();
				this.fireEvent('inject');
			}).bind(this);
			if (!IframeShim.ready) window.addEvent('load', inject);
			else inject();
		} else {
			this.position = this.hide = this.show = this.dispose = Function.from(this);
		}
	},

	position: function(){
		if (!IframeShim.ready || !this.shim) return this;
		var size = this.element.measure(function(){
			return this.getSize();
		});
		if (this.options.margin != undefined){
			size.x = size.x - (this.options.margin * 2);
			size.y = size.y - (this.options.margin * 2);
			this.options.offset.x += this.options.margin;
			this.options.offset.y += this.options.margin;
		}
		this.shim.set({width: size.x, height: size.y}).position({
			relativeTo: this.element,
			offset: this.options.offset
		});
		return this;
	},

	hide: function(){
		if (this.shim) this.shim.setStyle('display', 'none');
		return this;
	},

	show: function(){
		if (this.shim) this.shim.setStyle('display', 'block');
		return this.position();
	},

	dispose: function(){
		if (this.shim) this.shim.dispose();
		return this;
	},

	destroy: function(){
		if (this.shim) this.shim.destroy();
		return this;
	}

});

window.addEvent('load', function(){
	IframeShim.ready = true;
});


/*
---

script: Mask.js

name: Mask

description: Creates a mask element to cover another.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - /Class.Binds
  - /Element.Position
  - /IframeShim

provides: [Mask]

...
*/

var Mask = new Class({

	Implements: [Options, Events],

	Binds: ['position'],

	options: {/*
		onShow: function(){},
		onHide: function(){},
		onDestroy: function(){},
		onClick: function(event){},
		inject: {
			where: 'after',
			target: null,
		},
		hideOnClick: false,
		id: null,
		destroyOnHide: false,*/
		style: {},
		'class': 'mask',
		maskMargins: false,
		useIframeShim: true,
		iframeShimOptions: {}
	},

	initialize: function(target, options){
		this.target = document.id(target) || document.id(document.body);
		this.target.store('mask', this);
		this.setOptions(options);
		this.render();
		this.inject();
	},

	render: function(){
		this.element = new Element('div', {
			'class': this.options['class'],
			id: this.options.id || 'mask-' + String.uniqueID(),
			styles: Object.merge({}, this.options.style, {
				display: 'none'
			}),
			events: {
				click: function(event){
					this.fireEvent('click', event);
					if (this.options.hideOnClick) this.hide();
				}.bind(this)
			}
		});

		this.hidden = true;
	},

	toElement: function(){
		return this.element;
	},

	inject: function(target, where){
		where = where || (this.options.inject ? this.options.inject.where : '') || this.target == document.body ? 'inside' : 'after';
		target = target || (this.options.inject && this.options.inject.target) || this.target;

		this.element.inject(target, where);

		if (this.options.useIframeShim){
			this.shim = new IframeShim(this.element, this.options.iframeShimOptions);

			this.addEvents({
				show: this.shim.show.bind(this.shim),
				hide: this.shim.hide.bind(this.shim),
				destroy: this.shim.destroy.bind(this.shim)
			});
		}
	},

	position: function(){
		this.resize(this.options.width, this.options.height);

		this.element.position({
			relativeTo: this.target,
			position: 'topLeft',
			ignoreMargins: !this.options.maskMargins,
			ignoreScroll: this.target == document.body
		});

		return this;
	},

	resize: function(x, y){
		var opt = {
			styles: ['padding', 'border']
		};
		if (this.options.maskMargins) opt.styles.push('margin');

		var dim = this.target.getComputedSize(opt);
		if (this.target == document.body){
			this.element.setStyles({width: 0, height: 0});
			var win = window.getScrollSize();
			if (dim.totalHeight < win.y) dim.totalHeight = win.y;
			if (dim.totalWidth < win.x) dim.totalWidth = win.x;
		}
		this.element.setStyles({
			width: Array.pick([x, dim.totalWidth, dim.x]),
			height: Array.pick([y, dim.totalHeight, dim.y])
		});

		return this;
	},

	show: function(){
		if (!this.hidden) return this;

		window.addEvent('resize', this.position);
		this.position();
		this.showMask.apply(this, arguments);

		return this;
	},

	showMask: function(){
		this.element.setStyle('display', 'block');
		this.hidden = false;
		this.fireEvent('show');
	},

	hide: function(){
		if (this.hidden) return this;

		window.removeEvent('resize', this.position);
		this.hideMask.apply(this, arguments);
		if (this.options.destroyOnHide) return this.destroy();

		return this;
	},

	hideMask: function(){
		this.element.setStyle('display', 'none');
		this.hidden = true;
		this.fireEvent('hide');
	},

	toggle: function(){
		this[this.hidden ? 'show' : 'hide']();
	},

	destroy: function(){
		this.hide();
		this.element.destroy();
		this.fireEvent('destroy');
		this.target.eliminate('mask');
	}

});

Element.Properties.mask = {

	set: function(options){
		var mask = this.retrieve('mask');
		if (mask) mask.destroy();
		return this.eliminate('mask').store('mask:options', options);
	},

	get: function(){
		var mask = this.retrieve('mask');
		if (!mask){
			mask = new Mask(this, this.retrieve('mask:options'));
			this.store('mask', mask);
		}
		return mask;
	}

};

Element.implement({

	mask: function(options){
		if (options) this.set('mask', options);
		this.get('mask').show();
		return this;
	},

	unmask: function(){
		this.get('mask').hide();
		return this;
	}

});


/*
---

script: Spinner.js

name: Spinner

description: Adds a semi-transparent overlay over a dom element with a spinnin ajax icon.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Tween
  - Core/Request
  - /Class.refactor
  - /Mask

provides: [Spinner]

...
*/

var Spinner = new Class({

	Extends: Mask,

	Implements: Chain,

	options: {/*
		message: false,*/
		'class': 'spinner',
		containerPosition: {},
		content: {
			'class': 'spinner-content'
		},
		messageContainer: {
			'class': 'spinner-msg'
		},
		img: {
			'class': 'spinner-img'
		},
		fxOptions: {
			link: 'chain'
		}
	},

	initialize: function(target, options){
		this.target = document.id(target) || document.id(document.body);
		this.target.store('spinner', this);
		this.setOptions(options);
		this.render();
		this.inject();

		// Add this to events for when noFx is true; parent methods handle hide/show.
		var deactivate = function(){ this.active = false; }.bind(this);
		this.addEvents({
			hide: deactivate,
			show: deactivate
		});
	},

	render: function(){
		this.parent();

		this.element.set('id', this.options.id || 'spinner-' + String.uniqueID());

		this.content = document.id(this.options.content) || new Element('div', this.options.content);
		this.content.inject(this.element);

		if (this.options.message){
			this.msg = document.id(this.options.message) || new Element('p', this.options.messageContainer).appendText(this.options.message);
			this.msg.inject(this.content);
		}

		if (this.options.img){
			this.img = document.id(this.options.img) || new Element('div', this.options.img);
			this.img.inject(this.content);
		}

		this.element.set('tween', this.options.fxOptions);
	},

	show: function(noFx){
		if (this.active) return this.chain(this.show.bind(this));
		if (!this.hidden){
			this.callChain.delay(20, this);
			return this;
		}

		this.active = true;

		return this.parent(noFx);
	},

	showMask: function(noFx){
		var pos = function(){
			this.content.position(Object.merge({
				relativeTo: this.element
			}, this.options.containerPosition));
		}.bind(this);

		if (noFx){
			this.parent();
			pos();
		} else {
			if (!this.options.style.opacity) this.options.style.opacity = this.element.getStyle('opacity').toFloat();
			this.element.setStyles({
				display: 'block',
				opacity: 0
			}).tween('opacity', this.options.style.opacity);
			pos();
			this.hidden = false;
			this.fireEvent('show');
			this.callChain();
		}
	},

	hide: function(noFx){
		if (this.active) return this.chain(this.hide.bind(this));
		if (this.hidden){
			this.callChain.delay(20, this);
			return this;
		}
		this.active = true;
		return this.parent(noFx);
	},

	hideMask: function(noFx){
		if (noFx) return this.parent();
		this.element.tween('opacity', 0).get('tween').chain(function(){
			this.element.setStyle('display', 'none');
			this.hidden = true;
			this.fireEvent('hide');
			this.callChain();
		}.bind(this));
	},

	destroy: function(){
		this.content.destroy();
		this.parent();
		this.target.eliminate('spinner');
	}

});

Request = Class.refactor(Request, {

	options: {
		useSpinner: false,
		spinnerOptions: {},
		spinnerTarget: false
	},

	initialize: function(options){
		this._send = this.send;
		this.send = function(options){
			var spinner = this.getSpinner();
			if (spinner) spinner.chain(this._send.pass(options, this)).show();
			else this._send(options);
			return this;
		};
		this.previous(options);
	},

	getSpinner: function(){
		if (!this.spinner){
			var update = document.id(this.options.spinnerTarget) || document.id(this.options.update);
			if (this.options.useSpinner && update){
				update.set('spinner', this.options.spinnerOptions);
				var spinner = this.spinner = update.get('spinner');
				['complete', 'exception', 'cancel'].each(function(event){
					this.addEvent(event, spinner.hide.bind(spinner));
				}, this);
			}
		}
		return this.spinner;
	}

});

Element.Properties.spinner = {

	set: function(options){
		var spinner = this.retrieve('spinner');
		if (spinner) spinner.destroy();
		return this.eliminate('spinner').store('spinner:options', options);
	},

	get: function(){
		var spinner = this.retrieve('spinner');
		if (!spinner){
			spinner = new Spinner(this, this.retrieve('spinner:options'));
			this.store('spinner', spinner);
		}
		return spinner;
	}

};

Element.implement({

	spin: function(options){
		if (options) this.set('spinner', options);
		this.get('spinner').show();
		return this;
	},

	unspin: function(){
		this.get('spinner').hide();
		return this;
	}

});


/*
---

script: Form.Request.js

name: Form.Request

description: Handles the basic functionality of submitting a form and updating a dom element with the result.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Request.HTML
  - /Class.Binds
  - /Class.Occlude
  - /Spinner
  - /String.QueryString
  - /Element.Delegation

provides: [Form.Request]

...
*/

if (!window.Form) window.Form = {};

(function(){

	Form.Request = new Class({

		Binds: ['onSubmit', 'onFormValidate'],

		Implements: [Options, Events, Class.Occlude],

		options: {/*
			onFailure: function(){},
			onSuccess: function(){}, // aliased to onComplete,
			onSend: function(){}*/
			requestOptions: {
				evalScripts: true,
				useSpinner: true,
				emulation: false,
				link: 'ignore'
			},
			sendButtonClicked: true,
			extraData: {},
			resetForm: true
		},

		property: 'form.request',

		initialize: function(form, target, options){
			this.element = document.id(form);
			if (this.occlude()) return this.occluded;
			this.setOptions(options)
				.setTarget(target)
				.attach();
		},

		setTarget: function(target){
			this.target = document.id(target);
			if (!this.request){
				this.makeRequest();
			} else {
				this.request.setOptions({
					update: this.target
				});
			}
			return this;
		},

		toElement: function(){
			return this.element;
		},

		makeRequest: function(){
			var self = this;
			this.request = new Request.HTML(Object.merge({
					update: this.target,
					emulation: false,
					spinnerTarget: this.element,
					method: this.element.get('method') || 'post'
			}, this.options.requestOptions)).addEvents({
				success: function(tree, elements, html, javascript){
					['complete', 'success'].each(function(evt){
						self.fireEvent(evt, [self.target, tree, elements, html, javascript]);
					});
				},
				failure: function(){
					self.fireEvent('complete', arguments).fireEvent('failure', arguments);
				},
				exception: function(){
					self.fireEvent('failure', arguments);
				}
			});
			return this.attachReset();
		},

		attachReset: function(){
			if (!this.options.resetForm) return this;
			this.request.addEvent('success', function(){
				Function.attempt(function(){
					this.element.reset();
				}.bind(this));
				if (window.OverText) OverText.update();
			}.bind(this));
			return this;
		},

		attach: function(attach){
			var method = (attach != false) ? 'addEvent' : 'removeEvent';
			this.element[method]('click:relay(button, input[type=submit])', this.saveClickedButton.bind(this));

			var fv = this.element.retrieve('validator');
			if (fv) fv[method]('onFormValidate', this.onFormValidate);
			else this.element[method]('submit', this.onSubmit);

			return this;
		},

		detach: function(){
			return this.attach(false);
		},

		//public method
		enable: function(){
			return this.attach();
		},

		//public method
		disable: function(){
			return this.detach();
		},

		onFormValidate: function(valid, form, event){
			//if there's no event, then this wasn't a submit event
			if (!event) return;
			var fv = this.element.retrieve('validator');
			if (valid || (fv && !fv.options.stopOnFailure)){
				event.stop();
				this.send();
			}
		},

		onSubmit: function(event){
			var fv = this.element.retrieve('validator');
			if (fv){
				//form validator was created after Form.Request
				this.element.removeEvent('submit', this.onSubmit);
				fv.addEvent('onFormValidate', this.onFormValidate);
				this.element.validate();
				return;
			}
			if (event) event.stop();
			this.send();
		},

		saveClickedButton: function(event, target){
			var targetName = target.get('name');
			if (!targetName || !this.options.sendButtonClicked) return;
			this.options.extraData[targetName] = target.get('value') || true;
			this.clickedCleaner = function(){
				delete this.options.extraData[targetName];
				this.clickedCleaner = function(){};
			}.bind(this);
		},

		clickedCleaner: function(){},

		send: function(){
			var str = this.element.toQueryString().trim(),
				data = Object.toQueryString(this.options.extraData);

			if (str) str += "&" + data;
			else str = data;

			this.fireEvent('send', [this.element, str.parseQueryString()]);
			this.request.send({
				data: str,
				url: this.options.requestOptions.url || this.element.get('action')
			});
			this.clickedCleaner();
			return this;
		}

	});

	Element.implement('formUpdate', function(update, options){
		var fq = this.retrieve('form.request');
		if (!fq){
			fq = new Form.Request(this, update, options);
		} else {
			if (update) fq.setTarget(update);
			if (options) fq.setOptions(options).makeRequest();
		}
		fq.send();
		return this;
	});

})();


/*
---

script: Fx.Reveal.js

name: Fx.Reveal

description: Defines Fx.Reveal, a class that shows and hides elements with a transition.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Morph
  - /Element.Shortcuts
  - /Element.Measure

provides: [Fx.Reveal]

...
*/

(function(){


var hideTheseOf = function(object){
	var hideThese = object.options.hideInputs;
	if (window.OverText){
		var otClasses = [null];
		OverText.each(function(ot){
			otClasses.include('.' + ot.options.labelClass);
		});
		if (otClasses) hideThese += otClasses.join(', ');
	}
	return (hideThese) ? object.element.getElements(hideThese) : null;
};


Fx.Reveal = new Class({

	Extends: Fx.Morph,

	options: {/*
		onShow: function(thisElement){},
		onHide: function(thisElement){},
		onComplete: function(thisElement){},
		heightOverride: null,
		widthOverride: null,*/
		link: 'cancel',
		styles: ['padding', 'border', 'margin'],
		transitionOpacity: !Browser.ie6,
		mode: 'vertical',
		display: function(){
			return this.element.get('tag') != 'tr' ? 'block' : 'table-row';
		},
		opacity: 1,
		hideInputs: Browser.ie ? 'select, input, textarea, object, embed' : null
	},

	dissolve: function(){
		if (!this.hiding && !this.showing){
			if (this.element.getStyle('display') != 'none'){
				this.hiding = true;
				this.showing = false;
				this.hidden = true;
				this.cssText = this.element.style.cssText;

				var startStyles = this.element.getComputedSize({
					styles: this.options.styles,
					mode: this.options.mode
				});
				if (this.options.transitionOpacity) startStyles.opacity = this.options.opacity;

				var zero = {};
				Object.each(startStyles, function(style, name){
					zero[name] = [style, 0];
				});

				this.element.setStyles({
					display: Function.from(this.options.display).call(this),
					overflow: 'hidden'
				});

				var hideThese = hideTheseOf(this);
				if (hideThese) hideThese.setStyle('visibility', 'hidden');

				this.$chain.unshift(function(){
					if (this.hidden){
						this.hiding = false;
						this.element.style.cssText = this.cssText;
						this.element.setStyle('display', 'none');
						if (hideThese) hideThese.setStyle('visibility', 'visible');
					}
					this.fireEvent('hide', this.element);
					this.callChain();
				}.bind(this));

				this.start(zero);
			} else {
				this.callChain.delay(10, this);
				this.fireEvent('complete', this.element);
				this.fireEvent('hide', this.element);
			}
		} else if (this.options.link == 'chain'){
			this.chain(this.dissolve.bind(this));
		} else if (this.options.link == 'cancel' && !this.hiding){
			this.cancel();
			this.dissolve();
		}
		return this;
	},

	reveal: function(){
		if (!this.showing && !this.hiding){
			if (this.element.getStyle('display') == 'none'){
				this.hiding = false;
				this.showing = true;
				this.hidden = false;
				this.cssText = this.element.style.cssText;

				var startStyles;
				this.element.measure(function(){
					startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
				}.bind(this));
				if (this.options.heightOverride != null) startStyles.height = this.options.heightOverride.toInt();
				if (this.options.widthOverride != null) startStyles.width = this.options.widthOverride.toInt();
				if (this.options.transitionOpacity){
					this.element.setStyle('opacity', 0);
					startStyles.opacity = this.options.opacity;
				}

				var zero = {
					height: 0,
					display: Function.from(this.options.display).call(this)
				};
				Object.each(startStyles, function(style, name){
					zero[name] = 0;
				});
				zero.overflow = 'hidden';

				this.element.setStyles(zero);

				var hideThese = hideTheseOf(this);
				if (hideThese) hideThese.setStyle('visibility', 'hidden');

				this.$chain.unshift(function(){
					this.element.style.cssText = this.cssText;
					this.element.setStyle('display', Function.from(this.options.display).call(this));
					if (!this.hidden) this.showing = false;
					if (hideThese) hideThese.setStyle('visibility', 'visible');
					this.callChain();
					this.fireEvent('show', this.element);
				}.bind(this));

				this.start(startStyles);
			} else {
				this.callChain();
				this.fireEvent('complete', this.element);
				this.fireEvent('show', this.element);
			}
		} else if (this.options.link == 'chain'){
			this.chain(this.reveal.bind(this));
		} else if (this.options.link == 'cancel' && !this.showing){
			this.cancel();
			this.reveal();
		}
		return this;
	},

	toggle: function(){
		if (this.element.getStyle('display') == 'none'){
			this.reveal();
		} else {
			this.dissolve();
		}
		return this;
	},

	cancel: function(){
		this.parent.apply(this, arguments);
		if (this.cssText != null) this.element.style.cssText = this.cssText;
		this.hiding = false;
		this.showing = false;
		return this;
	}

});

Element.Properties.reveal = {

	set: function(options){
		this.get('reveal').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var reveal = this.retrieve('reveal');
		if (!reveal){
			reveal = new Fx.Reveal(this);
			this.store('reveal', reveal);
		}
		return reveal;
	}

};

Element.Properties.dissolve = Element.Properties.reveal;

Element.implement({

	reveal: function(options){
		this.get('reveal').setOptions(options).reveal();
		return this;
	},

	dissolve: function(options){
		this.get('reveal').setOptions(options).dissolve();
		return this;
	},

	nix: function(options){
		var params = Array.link(arguments, {destroy: Type.isBoolean, options: Type.isObject});
		this.get('reveal').setOptions(options).dissolve().chain(function(){
			this[params.destroy ? 'destroy' : 'dispose']();
		}.bind(this));
		return this;
	},

	wink: function(){
		var params = Array.link(arguments, {duration: Type.isNumber, options: Type.isObject});
		var reveal = this.get('reveal').setOptions(params.options);
		reveal.reveal().chain(function(){
			(function(){
				reveal.dissolve();
			}).delay(params.duration || 2000);
		});
	}

});

})();


/*
---

script: Form.Request.Append.js

name: Form.Request.Append

description: Handles the basic functionality of submitting a form and updating a dom element with the result. The result is appended to the DOM element instead of replacing its contents.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Form.Request
  - /Fx.Reveal
  - /Elements.from

provides: [Form.Request.Append]

...
*/

Form.Request.Append = new Class({

	Extends: Form.Request,

	options: {
		//onBeforeEffect: function(){},
		useReveal: true,
		revealOptions: {},
		inject: 'bottom'
	},

	makeRequest: function(){
		this.request = new Request.HTML(Object.merge({
				url: this.element.get('action'),
				method: this.element.get('method') || 'post',
				spinnerTarget: this.element
			}, this.options.requestOptions, {
				evalScripts: false
			})
		).addEvents({
			success: function(tree, elements, html, javascript){
				var container;
				var kids = Elements.from(html);
				if (kids.length == 1){
					container = kids[0];
				} else {
					 container = new Element('div', {
						styles: {
							display: 'none'
						}
					}).adopt(kids);
				}
				container.inject(this.target, this.options.inject);
				if (this.options.requestOptions.evalScripts) Browser.exec(javascript);
				this.fireEvent('beforeEffect', container);
				var finish = function(){
					this.fireEvent('success', [container, this.target, tree, elements, html, javascript]);
				}.bind(this);
				if (this.options.useReveal){
					container.set('reveal', this.options.revealOptions).get('reveal').chain(finish);
					container.reveal();
				} else {
					finish();
				}
			}.bind(this),
			failure: function(xhr){
				this.fireEvent('failure', xhr);
			}.bind(this)
		});
		this.attachReset();
	}

});


/*
---

name: Locale.en-US.Form.Validator

description: Form Validator messages for English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale

provides: [Locale.en-US.Form.Validator]

...
*/

Locale.define('en-US', 'FormValidator', {

	required: 'This field is required.',
	length: 'Please enter {length} characters (you entered {elLength} characters)',
	minLength: 'Please enter at least {minLength} characters (you entered {length} characters).',
	maxLength: 'Please enter no more than {maxLength} characters (you entered {length} characters).',
	integer: 'Please enter an integer in this field. Numbers with decimals (e.g. 1.25) are not permitted.',
	numeric: 'Please enter only numeric values in this field (i.e. "1" or "1.1" or "-1" or "-1.1").',
	digits: 'Please use numbers and punctuation only in this field (for example, a phone number with dashes or dots is permitted).',
	alpha: 'Please use only letters (a-z) within this field. No spaces or other characters are allowed.',
	alphanum: 'Please use only letters (a-z) or numbers (0-9) in this field. No spaces or other characters are allowed.',
	dateSuchAs: 'Please enter a valid date such as {date}',
	dateInFormatMDY: 'Please enter a valid date such as MM/DD/YYYY (i.e. "12/31/1999")',
	email: 'Please enter a valid email address. For example "fred@domain.com".',
	url: 'Please enter a valid URL such as http://www.example.com.',
	currencyDollar: 'Please enter a valid $ amount. For example $100.00 .',
	oneRequired: 'Please enter something for at least one of these inputs.',
	errorPrefix: 'Error: ',
	warningPrefix: 'Warning: ',

	// Form.Validator.Extras
	noSpace: 'There can be no spaces in this input.',
	reqChkByNode: 'No items are selected.',
	requiredChk: 'This field is required.',
	reqChkByName: 'Please select a {label}.',
	match: 'This field needs to match the {matchName} field',
	startDate: 'the start date',
	endDate: 'the end date',
	currendDate: 'the current date',
	afterDate: 'The date should be the same or after {label}.',
	beforeDate: 'The date should be the same or before {label}.',
	startMonth: 'Please select a start month',
	sameMonth: 'These two dates must be in the same month - you must change one or the other.',
	creditcard: 'The credit card number entered is invalid. Please check the number and try again. {length} digits entered.'

});


/*
---

script: Form.Validator.js

name: Form.Validator

description: A css-class based form validation system.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Slick.Finder
  - Core/Element.Event
  - Core/Element.Style
  - Core/JSON
  - /Locale
  - /Class.Binds
  - /Date
  - /Element.Forms
  - /Locale.en-US.Form.Validator
  - /Element.Shortcuts

provides: [Form.Validator, InputValidator, FormValidator.BaseValidators]

...
*/
if (!window.Form) window.Form = {};

var InputValidator = this.InputValidator = new Class({

	Implements: [Options],

	options: {
		errorMsg: 'Validation failed.',
		test: Function.from(true)
	},

	initialize: function(className, options){
		this.setOptions(options);
		this.className = className;
	},

	test: function(field, props){
		field = document.id(field);
		return (field) ? this.options.test(field, props || this.getProps(field)) : false;
	},

	getError: function(field, props){
		field = document.id(field);
		var err = this.options.errorMsg;
		if (typeOf(err) == 'function') err = err(field, props || this.getProps(field));
		return err;
	},

	getProps: function(field){
		field = document.id(field);
		return (field) ? field.get('validatorProps') : {};
	}

});

Element.Properties.validators = {

	get: function(){
		return (this.get('data-validators') || this.className).clean().split(' ');
	}

};

Element.Properties.validatorProps = {

	set: function(props){
		return this.eliminate('$moo:validatorProps').store('$moo:validatorProps', props);
	},

	get: function(props){
		if (props) this.set(props);
		if (this.retrieve('$moo:validatorProps')) return this.retrieve('$moo:validatorProps');
		if (this.getProperty('data-validator-properties') || this.getProperty('validatorProps')){
			try {
				this.store('$moo:validatorProps', JSON.decode(this.getProperty('validatorProps') || this.getProperty('data-validator-properties')));
			}catch(e){
				return {};
			}
		} else {
			var vals = this.get('validators').filter(function(cls){
				return cls.test(':');
			});
			if (!vals.length){
				this.store('$moo:validatorProps', {});
			} else {
				props = {};
				vals.each(function(cls){
					var split = cls.split(':');
					if (split[1]){
						try {
							props[split[0]] = JSON.decode(split[1]);
						} catch(e){}
					}
				});
				this.store('$moo:validatorProps', props);
			}
		}
		return this.retrieve('$moo:validatorProps');
	}

};

Form.Validator = new Class({

	Implements: [Options, Events],

	Binds: ['onSubmit'],

	options: {/*
		onFormValidate: function(isValid, form, event){},
		onElementValidate: function(isValid, field, className, warn){},
		onElementPass: function(field){},
		onElementFail: function(field, validatorsFailed){}, */
		fieldSelectors: 'input, select, textarea',
		ignoreHidden: true,
		ignoreDisabled: true,
		useTitles: false,
		evaluateOnSubmit: true,
		evaluateFieldsOnBlur: true,
		evaluateFieldsOnChange: true,
		serial: true,
		stopOnFailure: true,
		warningPrefix: function(){
			return Form.Validator.getMsg('warningPrefix') || 'Warning: ';
		},
		errorPrefix: function(){
			return Form.Validator.getMsg('errorPrefix') || 'Error: ';
		}
	},

	initialize: function(form, options){
		this.setOptions(options);
		this.element = document.id(form);
		this.element.store('validator', this);
		this.warningPrefix = Function.from(this.options.warningPrefix)();
		this.errorPrefix = Function.from(this.options.errorPrefix)();
		if (this.options.evaluateOnSubmit) this.element.addEvent('submit', this.onSubmit);
		if (this.options.evaluateFieldsOnBlur || this.options.evaluateFieldsOnChange) this.watchFields(this.getFields());
	},

	toElement: function(){
		return this.element;
	},

	getFields: function(){
		return (this.fields = this.element.getElements(this.options.fieldSelectors));
	},

	watchFields: function(fields){
		fields.each(function(el){
			if (this.options.evaluateFieldsOnBlur)
				el.addEvent('blur', this.validationMonitor.pass([el, false], this));
			if (this.options.evaluateFieldsOnChange)
				el.addEvent('change', this.validationMonitor.pass([el, true], this));
		}, this);
	},

	validationMonitor: function(){
		clearTimeout(this.timer);
		this.timer = this.validateField.delay(50, this, arguments);
	},

	onSubmit: function(event){
		if (this.validate(event)) this.reset();
	},

	reset: function(){
		this.getFields().each(this.resetField, this);
		return this;
	},

	validate: function(event){
		var result = this.getFields().map(function(field){
			return this.validateField(field, true);
		}, this).every(function(v){
			return v;
		});
		this.fireEvent('formValidate', [result, this.element, event]);
		if (this.options.stopOnFailure && !result && event) event.preventDefault();
		return result;
	},

	validateField: function(field, force){
		if (this.paused) return true;
		field = document.id(field);
		var passed = !field.hasClass('validation-failed');
		var failed, warned;
		if (this.options.serial && !force){
			failed = this.element.getElement('.validation-failed');
			warned = this.element.getElement('.warning');
		}
		if (field && (!failed || force || field.hasClass('validation-failed') || (failed && !this.options.serial))){
			var validationTypes = field.get('validators');
			var validators = validationTypes.some(function(cn){
				return this.getValidator(cn);
			}, this);
			var validatorsFailed = [];
			validationTypes.each(function(className){
				if (className && !this.test(className, field)) validatorsFailed.include(className);
			}, this);
			passed = validatorsFailed.length === 0;
			if (validators && !this.hasValidator(field, 'warnOnly')){
				if (passed){
					field.addClass('validation-passed').removeClass('validation-failed');
					this.fireEvent('elementPass', [field]);
				} else {
					field.addClass('validation-failed').removeClass('validation-passed');
					this.fireEvent('elementFail', [field, validatorsFailed]);
				}
			}
			if (!warned){
				var warnings = validationTypes.some(function(cn){
					if (cn.test('^warn'))
						return this.getValidator(cn.replace(/^warn-/,''));
					else return null;
				}, this);
				field.removeClass('warning');
				var warnResult = validationTypes.map(function(cn){
					if (cn.test('^warn'))
						return this.test(cn.replace(/^warn-/,''), field, true);
					else return null;
				}, this);
			}
		}
		return passed;
	},

	test: function(className, field, warn){
		field = document.id(field);
		if ((this.options.ignoreHidden && !field.isVisible()) || (this.options.ignoreDisabled && field.get('disabled'))) return true;
		var validator = this.getValidator(className);
		if (warn != null) warn = false;
		if (this.hasValidator(field, 'warnOnly')) warn = true;
		var isValid = this.hasValidator(field, 'ignoreValidation') || (validator ? validator.test(field) : true);
		if (validator && field.isVisible()) this.fireEvent('elementValidate', [isValid, field, className, warn]);
		if (warn) return true;
		return isValid;
	},

	hasValidator: function(field, value){
		return field.get('validators').contains(value);
	},

	resetField: function(field){
		field = document.id(field);
		if (field){
			field.get('validators').each(function(className){
				if (className.test('^warn-')) className = className.replace(/^warn-/, '');
				field.removeClass('validation-failed');
				field.removeClass('warning');
				field.removeClass('validation-passed');
			}, this);
		}
		return this;
	},

	stop: function(){
		this.paused = true;
		return this;
	},

	start: function(){
		this.paused = false;
		return this;
	},

	ignoreField: function(field, warn){
		field = document.id(field);
		if (field){
			this.enforceField(field);
			if (warn) field.addClass('warnOnly');
			else field.addClass('ignoreValidation');
		}
		return this;
	},

	enforceField: function(field){
		field = document.id(field);
		if (field) field.removeClass('warnOnly').removeClass('ignoreValidation');
		return this;
	}

});

Form.Validator.getMsg = function(key){
	return Locale.get('FormValidator.' + key);
};

Form.Validator.adders = {

	validators:{},

	add : function(className, options){
		this.validators[className] = new InputValidator(className, options);
		//if this is a class (this method is used by instances of Form.Validator and the Form.Validator namespace)
		//extend these validators into it
		//this allows validators to be global and/or per instance
		if (!this.initialize){
			this.implement({
				validators: this.validators
			});
		}
	},

	addAllThese : function(validators){
		Array.from(validators).each(function(validator){
			this.add(validator[0], validator[1]);
		}, this);
	},

	getValidator: function(className){
		return this.validators[className.split(':')[0]];
	}

};

Object.append(Form.Validator, Form.Validator.adders);

Form.Validator.implement(Form.Validator.adders);

Form.Validator.add('IsEmpty', {

	errorMsg: false,
	test: function(element){
		if (element.type == 'select-one' || element.type == 'select')
			return !(element.selectedIndex >= 0 && element.options[element.selectedIndex].value != '');
		else
			return ((element.get('value') == null) || (element.get('value').length == 0));
	}

});

Form.Validator.addAllThese([

	['required', {
		errorMsg: function(){
			return Form.Validator.getMsg('required');
		},
		test: function(element){
			return !Form.Validator.getValidator('IsEmpty').test(element);
		}
	}],

	['length', {
		errorMsg: function(element, props){
			if (typeOf(props.length) != 'null')
				return Form.Validator.getMsg('length').substitute({length: props.length, elLength: element.get('value').length});
			else return '';
		},
		test: function(element, props){
			if (typeOf(props.length) != 'null') return (element.get('value').length == props.length || element.get('value').length == 0);
			else return true;
		}
	}],	

	['minLength', {
		errorMsg: function(element, props){
			if (typeOf(props.minLength) != 'null')
				return Form.Validator.getMsg('minLength').substitute({minLength: props.minLength, length: element.get('value').length});
			else return '';
		},
		test: function(element, props){
			if (typeOf(props.minLength) != 'null') return (element.get('value').length >= (props.minLength || 0));
			else return true;
		}
	}],

	['maxLength', {
		errorMsg: function(element, props){
			//props is {maxLength:10}
			if (typeOf(props.maxLength) != 'null')
				return Form.Validator.getMsg('maxLength').substitute({maxLength: props.maxLength, length: element.get('value').length});
			else return '';
		},
		test: function(element, props){
			return element.get('value').length <= (props.maxLength || 10000);
		}
	}],

	['validate-integer', {
		errorMsg: Form.Validator.getMsg.pass('integer'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^(-?[1-9]\d*|0)$/).test(element.get('value'));
		}
	}],

	['validate-numeric', {
		errorMsg: Form.Validator.getMsg.pass('numeric'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) ||
				(/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(element.get('value'));
		}
	}],

	['validate-digits', {
		errorMsg: Form.Validator.getMsg.pass('digits'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^[\d() .:\-\+#]+$/.test(element.get('value')));
		}
	}],

	['validate-alpha', {
		errorMsg: Form.Validator.getMsg.pass('alpha'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^[a-zA-Z]+$/).test(element.get('value'));
		}
	}],

	['validate-alphanum', {
		errorMsg: Form.Validator.getMsg.pass('alphanum'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) || !(/\W/).test(element.get('value'));
		}
	}],

	['validate-date', {
		errorMsg: function(element, props){
			if (Date.parse){
				var format = props.dateFormat || '%x';
				return Form.Validator.getMsg('dateSuchAs').substitute({date: new Date().format(format)});
			} else {
				return Form.Validator.getMsg('dateInFormatMDY');
			}
		},
		test: function(element, props){
			if (Form.Validator.getValidator('IsEmpty').test(element)) return true;
			var dateLocale = Locale.getCurrent().sets.Date,
				dateNouns = new RegExp([dateLocale.days, dateLocale.days_abbr, dateLocale.months, dateLocale.months_abbr].flatten().join('|'), 'i'),
				value = element.get('value'),
				wordsInValue = value.match(/[a-z]+/gi);

				if (wordsInValue && !wordsInValue.every(dateNouns.exec, dateNouns)) return false;

				var date = Date.parse(value),
					format = props.dateFormat || '%x',
					formatted = date.format(format);

				if (formatted != 'invalid date') element.set('value', formatted);
				return date.isValid();
		}
	}],

	['validate-email', {
		errorMsg: Form.Validator.getMsg.pass('email'),
		test: function(element){
			/*
			var chars = "[a-z0-9!#$%&'*+/=?^_`{|}~-]",
				local = '(?:' + chars + '\\.?){0,63}' + chars,

				label = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?',
				hostname = '(?:' + label + '\\.)*' + label;

				octet = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
				ipv4 = '\\[(?:' + octet + '\\.){3}' + octet + '\\]',

				domain = '(?:' + hostname + '|' + ipv4 + ')';

			var regex = new RegExp('^' + local + '@' + domain + '$', 'i');
			*/
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]\.?){0,63}[a-z0-9!#$%&'*+\/=?^_`{|}~-]@(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i).test(element.get('value'));
		}
	}],

	['validate-url', {
		errorMsg: Form.Validator.getMsg.pass('url'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(element.get('value'));
		}
	}],

	['validate-currency-dollar', {
		errorMsg: Form.Validator.getMsg.pass('currencyDollar'),
		test: function(element){
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/).test(element.get('value'));
		}
	}],

	['validate-one-required', {
		errorMsg: Form.Validator.getMsg.pass('oneRequired'),
		test: function(element, props){
			var p = document.id(props['validate-one-required']) || element.getParent(props['validate-one-required']);
			return p.getElements('input').some(function(el){
				if (['checkbox', 'radio'].contains(el.get('type'))) return el.get('checked');
				return el.get('value');
			});
		}
	}]

]);

Element.Properties.validator = {

	set: function(options){
		this.get('validator').setOptions(options);
	},

	get: function(){
		var validator = this.retrieve('validator');
		if (!validator){
			validator = new Form.Validator(this);
			this.store('validator', validator);
		}
		return validator;
	}

};

Element.implement({

	validate: function(options){
		if (options) this.set('validator', options);
		return this.get('validator').validate();
	}

});







/*
---

script: Form.Validator.Inline.js

name: Form.Validator.Inline

description: Extends Form.Validator to add inline messages.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Form.Validator

provides: [Form.Validator.Inline]

...
*/

Form.Validator.Inline = new Class({

	Extends: Form.Validator,

	options: {
		showError: function(errorElement){
			if (errorElement.reveal) errorElement.reveal();
			else errorElement.setStyle('display', 'block');
		},
		hideError: function(errorElement){
			if (errorElement.dissolve) errorElement.dissolve();
			else errorElement.setStyle('display', 'none');
		},
		scrollToErrorsOnSubmit: true,
		scrollToErrorsOnBlur: false,
		scrollToErrorsOnChange: false,
		scrollFxOptions: {
			transition: 'quad:out',
			offset: {
				y: -20
			}
		}
	},

	initialize: function(form, options){
		this.parent(form, options);
		this.addEvent('onElementValidate', function(isValid, field, className, warn){
			var validator = this.getValidator(className);
			if (!isValid && validator.getError(field)){
				if (warn) field.addClass('warning');
				var advice = this.makeAdvice(className, field, validator.getError(field), warn);
				this.insertAdvice(advice, field);
				this.showAdvice(className, field);
			} else {
				this.hideAdvice(className, field);
			}
		});
	},

	makeAdvice: function(className, field, error, warn){
		var errorMsg = (warn) ? this.warningPrefix : this.errorPrefix;
			errorMsg += (this.options.useTitles) ? field.title || error:error;
		var cssClass = (warn) ? 'warning-advice' : 'validation-advice';
		var advice = this.getAdvice(className, field);
		if (advice){
			advice = advice.set('html', errorMsg);
		} else {
			advice = new Element('div', {
				html: errorMsg,
				styles: { display: 'none' },
				id: 'advice-' + className.split(':')[0] + '-' + this.getFieldId(field)
			}).addClass(cssClass);
		}
		field.store('$moo:advice-' + className, advice);
		return advice;
	},

	getFieldId : function(field){
		return field.id ? field.id : field.id = 'input_' + field.name;
	},

	showAdvice: function(className, field){
		var advice = this.getAdvice(className, field);
		if (
			advice &&
			!field.retrieve('$moo:' + this.getPropName(className)) &&
			(
				advice.getStyle('display') == 'none' ||
				advice.getStyle('visiblity') == 'hidden' ||
				advice.getStyle('opacity') == 0
			)
		){
			field.store('$moo:' + this.getPropName(className), true);
			this.options.showError(advice);
			this.fireEvent('showAdvice', [field, advice, className]);
		}
	},

	hideAdvice: function(className, field){
		var advice = this.getAdvice(className, field);
		if (advice && field.retrieve('$moo:' + this.getPropName(className))){
			field.store('$moo:' + this.getPropName(className), false);
			this.options.hideError(advice);
			this.fireEvent('hideAdvice', [field, advice, className]);
		}
	},

	getPropName: function(className){
		return 'advice' + className;
	},

	resetField: function(field){
		field = document.id(field);
		if (!field) return this;
		this.parent(field);
		field.get('validators').each(function(className){
			this.hideAdvice(className, field);
		}, this);
		return this;
	},

	getAllAdviceMessages: function(field, force){
		var advice = [];
		if (field.hasClass('ignoreValidation') && !force) return advice;
		var validators = field.get('validators').some(function(cn){
			var warner = cn.test('^warn-') || field.hasClass('warnOnly');
			if (warner) cn = cn.replace(/^warn-/, '');
			var validator = this.getValidator(cn);
			if (!validator) return;
			advice.push({
				message: validator.getError(field),
				warnOnly: warner,
				passed: validator.test(),
				validator: validator
			});
		}, this);
		return advice;
	},

	getAdvice: function(className, field){
		return field.retrieve('$moo:advice-' + className);
	},

	insertAdvice: function(advice, field){
		//Check for error position prop
		var props = field.get('validatorProps');
		//Build advice
		if (!props.msgPos || !document.id(props.msgPos)){
			if (field.type && field.type.toLowerCase() == 'radio') field.getParent().adopt(advice);
			else advice.inject(document.id(field), 'after');
		} else {
			document.id(props.msgPos).grab(advice);
		}
	},

	validateField: function(field, force, scroll){
		var result = this.parent(field, force);
		if (((this.options.scrollToErrorsOnSubmit && scroll == null) || scroll) && !result){
			var failed = document.id(this).getElement('.validation-failed');
			var par = document.id(this).getParent();
			while (par != document.body && par.getScrollSize().y == par.getSize().y){
				par = par.getParent();
			}
			var fx = par.retrieve('$moo:fvScroller');
			if (!fx && window.Fx && Fx.Scroll){
				fx = new Fx.Scroll(par, this.options.scrollFxOptions);
				par.store('$moo:fvScroller', fx);
			}
			if (failed){
				if (fx) fx.toElement(failed);
				else par.scrollTo(par.getScroll().x, failed.getPosition(par).y - 20);
			}
		}
		return result;
	},

	watchFields: function(fields){
		fields.each(function(el){
		if (this.options.evaluateFieldsOnBlur){
			el.addEvent('blur', this.validationMonitor.pass([el, false, this.options.scrollToErrorsOnBlur], this));
		}
		if (this.options.evaluateFieldsOnChange){
				el.addEvent('change', this.validationMonitor.pass([el, true, this.options.scrollToErrorsOnChange], this));
			}
		}, this);
	}

});


/*
---

script: Form.Validator.Extras.js

name: Form.Validator.Extras

description: Additional validators for the Form.Validator class.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Form.Validator

provides: [Form.Validator.Extras]

...
*/
Form.Validator.addAllThese([

	['validate-enforce-oncheck', {
		test: function(element, props){
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			(props.toEnforce || document.id(props.enforceChildrenOf).getElements('input, select, textarea')).map(function(item){
				if (element.checked){
					fv.enforceField(item);
				} else {
					fv.ignoreField(item);
					fv.resetField(item);
				}
			});
			return true;
		}
	}],

	['validate-ignore-oncheck', {
		test: function(element, props){
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			(props.toIgnore || document.id(props.ignoreChildrenOf).getElements('input, select, textarea')).each(function(item){
				if (element.checked){
					fv.ignoreField(item);
					fv.resetField(item);
				} else {
					fv.enforceField(item);
				}
			});
			return true;
		}
	}],

	['validate-nospace', {
		errorMsg: function(){
			return Form.Validator.getMsg('noSpace');
		},
		test: function(element, props){
			return !element.get('value').test(/\s/);
		}
	}],

	['validate-toggle-oncheck', {
		test: function(element, props){
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			var eleArr = props.toToggle || document.id(props.toToggleChildrenOf).getElements('input, select, textarea');
			if (!element.checked){
				eleArr.each(function(item){
					fv.ignoreField(item);
					fv.resetField(item);
				});
			} else {
				eleArr.each(function(item){
					fv.enforceField(item);
				});
			}
			return true;
		}
	}],

	['validate-reqchk-bynode', {
		errorMsg: function(){
			return Form.Validator.getMsg('reqChkByNode');
		},
		test: function(element, props){
			return (document.id(props.nodeId).getElements(props.selector || 'input[type=checkbox], input[type=radio]')).some(function(item){
				return item.checked;
			});
		}
	}],

	['validate-required-check', {
		errorMsg: function(element, props){
			return props.useTitle ? element.get('title') : Form.Validator.getMsg('requiredChk');
		},
		test: function(element, props){
			return !!element.checked;
		}
	}],

	['validate-reqchk-byname', {
		errorMsg: function(element, props){
			return Form.Validator.getMsg('reqChkByName').substitute({label: props.label || element.get('type')});
		},
		test: function(element, props){
			var grpName = props.groupName || element.get('name');
			var oneCheckedItem = $$(document.getElementsByName(grpName)).some(function(item, index){
				return item.checked;
			});
			var fv = element.getParent('form').retrieve('validator');
			if (oneCheckedItem && fv) fv.resetField(element);
			return oneCheckedItem;
		}
	}],

	['validate-match', {
		errorMsg: function(element, props){
			return Form.Validator.getMsg('match').substitute({matchName: props.matchName || document.id(props.matchInput).get('name')});
		},
		test: function(element, props){
			var eleVal = element.get('value');
			var matchVal = document.id(props.matchInput) && document.id(props.matchInput).get('value');
			return eleVal && matchVal ? eleVal == matchVal : true;
		}
	}],

	['validate-after-date', {
		errorMsg: function(element, props){
			return Form.Validator.getMsg('afterDate').substitute({
				label: props.afterLabel || (props.afterElement ? Form.Validator.getMsg('startDate') : Form.Validator.getMsg('currentDate'))
			});
		},
		test: function(element, props){
			var start = document.id(props.afterElement) ? Date.parse(document.id(props.afterElement).get('value')) : new Date();
			var end = Date.parse(element.get('value'));
			return end && start ? end >= start : true;
		}
	}],

	['validate-before-date', {
		errorMsg: function(element, props){
			return Form.Validator.getMsg('beforeDate').substitute({
				label: props.beforeLabel || (props.beforeElement ? Form.Validator.getMsg('endDate') : Form.Validator.getMsg('currentDate'))
			});
		},
		test: function(element, props){
			var start = Date.parse(element.get('value'));
			var end = document.id(props.beforeElement) ? Date.parse(document.id(props.beforeElement).get('value')) : new Date();
			return end && start ? end >= start : true;
		}
	}],

	['validate-custom-required', {
		errorMsg: function(){
			return Form.Validator.getMsg('required');
		},
		test: function(element, props){
			return element.get('value') != props.emptyValue;
		}
	}],

	['validate-same-month', {
		errorMsg: function(element, props){
			var startMo = document.id(props.sameMonthAs) && document.id(props.sameMonthAs).get('value');
			var eleVal = element.get('value');
			if (eleVal != '') return Form.Validator.getMsg(startMo ? 'sameMonth' : 'startMonth');
		},
		test: function(element, props){
			var d1 = Date.parse(element.get('value'));
			var d2 = Date.parse(document.id(props.sameMonthAs) && document.id(props.sameMonthAs).get('value'));
			return d1 && d2 ? d1.format('%B') == d2.format('%B') : true;
		}
	}],


	['validate-cc-num', {
		errorMsg: function(element){
			var ccNum = element.get('value').replace(/[^0-9]/g, '');
			return Form.Validator.getMsg('creditcard').substitute({length: ccNum.length});
		},
		test: function(element){
			// required is a different test
			if (Form.Validator.getValidator('IsEmpty').test(element)) return true;

			// Clean number value
			var ccNum = element.get('value');
			ccNum = ccNum.replace(/[^0-9]/g, '');

			var valid_type = false;

			if (ccNum.test(/^4[0-9]{12}([0-9]{3})?$/)) valid_type = 'Visa';
			else if (ccNum.test(/^5[1-5]([0-9]{14})$/)) valid_type = 'Master Card';
			else if (ccNum.test(/^3[47][0-9]{13}$/)) valid_type = 'American Express';
			else if (ccNum.test(/^6011[0-9]{12}$/)) valid_type = 'Discover';

			if (valid_type){
				var sum = 0;
				var cur = 0;

				for (var i=ccNum.length-1; i>=0; --i){
					cur = ccNum.charAt(i).toInt();
					if (cur == 0) continue;

					if ((ccNum.length-i) % 2 == 0) cur += cur;
					if (cur > 9){
						cur = cur.toString().charAt(0).toInt() + cur.toString().charAt(1).toInt();
					}

					sum += cur;
				}
				if ((sum % 10) == 0) return true;
			}

			var chunks = '';
			while (ccNum != ''){
				chunks += ' ' + ccNum.substr(0,4);
				ccNum = ccNum.substr(4);
			}

			element.getParent('form').retrieve('validator').ignoreField(element);
			element.set('value', chunks.clean());
			element.getParent('form').retrieve('validator').enforceField(element);
			return false;
		}
	}]


]);


/*
---

script: OverText.js

name: OverText

description: Shows text over an input that disappears when the user clicks into it. The text remains hidden if the user adds a value.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - Class.Binds
  - Class.Occlude
  - Element.Position
  - Element.Shortcuts

provides: [OverText]

...
*/

var OverText = new Class({

	Implements: [Options, Events, Class.Occlude],

	Binds: ['reposition', 'assert', 'focus', 'hide'],

	options: {/*
		textOverride: null,
		onFocus: function(){},
		onTextHide: function(textEl, inputEl){},
		onTextShow: function(textEl, inputEl){}, */
		element: 'label',
		labelClass: 'overTxtLabel',
		positionOptions: {
			position: 'upperLeft',
			edge: 'upperLeft',
			offset: {
				x: 4,
				y: 2
			}
		},
		poll: false,
		pollInterval: 250,
		wrap: false
	},

	property: 'OverText',

	initialize: function(element, options){
		element = this.element = document.id(element);

		if (this.occlude()) return this.occluded;
		this.setOptions(options);

		this.attach(element);
		OverText.instances.push(this);

		if (this.options.poll) this.poll();
	},

	toElement: function(){
		return this.element;
	},

	attach: function(){
		var element = this.element,
			options = this.options,
			value = options.textOverride || element.get('alt') || element.get('title');

		if (!value) return this;

		var text = this.text = new Element(options.element, {
			'class': options.labelClass,
			styles: {
				lineHeight: 'normal',
				position: 'absolute',
				cursor: 'text'
			},
			html: value,
			events: {
				click: this.hide.pass(options.element == 'label', this)
			}
		}).inject(element, 'after');

		if (options.element == 'label'){
			if (!element.get('id')) element.set('id', 'input_' + String.uniqueID());
			text.set('for', element.get('id'));
		}

		if (options.wrap){
			this.textHolder = new Element('div.overTxtWrapper', {
				styles: {
					lineHeight: 'normal',
					position: 'relative'
				}
			}).grab(text).inject(element, 'before');
		}

		return this.enable();
	},

	destroy: function(){
		this.element.eliminate(this.property); // Class.Occlude storage
		this.disable();
		if (this.text) this.text.destroy();
		if (this.textHolder) this.textHolder.destroy();
		return this;
	},

	disable: function(){
		this.element.removeEvents({
			focus: this.focus,
			blur: this.assert,
			change: this.assert
		});
		window.removeEvent('resize', this.reposition);
		this.hide(true, true);
		return this;
	},

	enable: function(){
		this.element.addEvents({
			focus: this.focus,
			blur: this.assert,
			change: this.assert
		});
		window.addEvent('resize', this.reposition);
		this.reposition();
		return this;
	},

	wrap: function(){
		if (this.options.element == 'label'){
			if (!this.element.get('id')) this.element.set('id', 'input_' + String.uniqueID());
			this.text.set('for', this.element.get('id'));
		}
	},

	startPolling: function(){
		this.pollingPaused = false;
		return this.poll();
	},

	poll: function(stop){
		//start immediately
		//pause on focus
		//resumeon blur
		if (this.poller && !stop) return this;
		if (stop){
			clearInterval(this.poller);
		} else {
			this.poller = (function(){
				if (!this.pollingPaused) this.assert(true);
			}).periodical(this.options.pollInterval, this);
		}

		return this;
	},

	stopPolling: function(){
		this.pollingPaused = true;
		return this.poll(true);
	},

	focus: function(){
		if (this.text && (!this.text.isDisplayed() || this.element.get('disabled'))) return this;
		return this.hide();
	},

	hide: function(suppressFocus, force){
		if (this.text && (this.text.isDisplayed() && (!this.element.get('disabled') || force))){
			this.text.hide();
			this.fireEvent('textHide', [this.text, this.element]);
			this.pollingPaused = true;
			if (!suppressFocus){
				try {
					this.element.fireEvent('focus');
					this.element.focus();
				} catch(e){} //IE barfs if you call focus on hidden elements
			}
		}
		return this;
	},

	show: function(){
		if (this.text && !this.text.isDisplayed()){
			this.text.show();
			this.reposition();
			this.fireEvent('textShow', [this.text, this.element]);
			this.pollingPaused = false;
		}
		return this;
	},

	test: function(){
		return !this.element.get('value');
	},

	assert: function(suppressFocus){
		return this[this.test() ? 'show' : 'hide'](suppressFocus);
	},

	reposition: function(){
		this.assert(true);
		if (!this.element.isVisible()) return this.stopPolling().hide();
		if (this.text && this.test()){
			this.text.position(Object.merge(this.options.positionOptions, {
				relativeTo: this.element
			}));
		}
		return this;
	}

});

OverText.instances = [];

Object.append(OverText, {

	each: function(fn){
		return OverText.instances.each(function(ot, i){
			if (ot.element && ot.text) fn.call(OverText, ot, i);
		});
	},

	update: function(){

		return OverText.each(function(ot){
			return ot.reposition();
		});

	},

	hideAll: function(){

		return OverText.each(function(ot){
			return ot.hide(true, true);
		});

	},

	showAll: function(){
		return OverText.each(function(ot){
			return ot.show();
		});
	}

});



/*
---

script: Fx.Elements.js

name: Fx.Elements

description: Effect to change any number of CSS properties of any number of Elements.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx.CSS
  - /MooTools.More

provides: [Fx.Elements]

...
*/

Fx.Elements = new Class({

	Extends: Fx.CSS,

	initialize: function(elements, options){
		this.elements = this.subject = $$(elements);
		this.parent(options);
	},

	compute: function(from, to, delta){
		var now = {};

		for (var i in from){
			var iFrom = from[i], iTo = to[i], iNow = now[i] = {};
			for (var p in iFrom) iNow[p] = this.parent(iFrom[p], iTo[p], delta);
		}

		return now;
	},

	set: function(now){
		for (var i in now){
			if (!this.elements[i]) continue;

			var iNow = now[i];
			for (var p in iNow) this.render(this.elements[i], p, iNow[p], this.options.unit);
		}

		return this;
	},

	start: function(obj){
		if (!this.check(obj)) return this;
		var from = {}, to = {};

		for (var i in obj){
			if (!this.elements[i]) continue;

			var iProps = obj[i], iFrom = from[i] = {}, iTo = to[i] = {};

			for (var p in iProps){
				var parsed = this.prepare(this.elements[i], p, iProps[p]);
				iFrom[p] = parsed.from;
				iTo[p] = parsed.to;
			}
		}

		return this.parent(from, to);
	}

});


/*
---

script: Fx.Accordion.js

name: Fx.Accordion

description: An Fx.Elements extension which allows you to easily create accordion type controls.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /Fx.Elements

provides: [Fx.Accordion]

...
*/

Fx.Accordion = new Class({

	Extends: Fx.Elements,

	options: {/*
		onActive: function(toggler, section){},
		onBackground: function(toggler, section){},*/
		fixedHeight: false,
		fixedWidth: false,
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true,
		resetHeight: true
	},

	initialize: function(){
		var defined = function(obj){
			return obj != null;
		};

		var params = Array.link(arguments, {
			'container': Type.isElement, //deprecated
			'options': Type.isObject,
			'togglers': defined,
			'elements': defined
		});
		this.parent(params.elements, params.options);

		var options = this.options,
			togglers = this.togglers = $$(params.togglers);

		this.previous = -1;
		this.internalChain = new Chain();

		if (options.alwaysHide) this.options.link = 'chain';

		if (options.show || this.options.show === 0){
			options.display = false;
			this.previous = options.show;
		}

		if (options.start){
			options.display = false;
			options.show = false;
		}

		var effects = this.effects = {};

		if (options.opacity) effects.opacity = 'fullOpacity';
		if (options.width) effects.width = options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (options.height) effects.height = options.fixedHeight ? 'fullHeight' : 'scrollHeight';

		for (var i = 0, l = togglers.length; i < l; i++) this.addSection(togglers[i], this.elements[i]);

		this.elements.each(function(el, i){
			if (options.show === i){
				this.fireEvent('active', [togglers[i], el]);
			} else {
				for (var fx in effects) el.setStyle(fx, 0);
			}
		}, this);

		if (options.display || options.display === 0 || options.initialDisplayFx === false){
			this.display(options.display, options.initialDisplayFx);
		}

		if (options.fixedHeight !== false) options.resetHeight = false;
		this.addEvent('complete', this.internalChain.callChain.bind(this.internalChain));
	},

	addSection: function(toggler, element){
		toggler = document.id(toggler);
		element = document.id(element);
		this.togglers.include(toggler);
		this.elements.include(element);

		var togglers = this.togglers,
			options = this.options,
			test = togglers.contains(toggler),
			idx = togglers.indexOf(toggler),
			displayer = this.display.pass(idx, this);

		toggler.store('accordion:display', displayer)
			.addEvent(options.trigger, displayer);

		if (options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});

		element.fullOpacity = 1;
		if (options.fixedWidth) element.fullWidth = options.fixedWidth;
		if (options.fixedHeight) element.fullHeight = options.fixedHeight;
		element.setStyle('overflow', 'hidden');

		if (!test) for (var fx in this.effects){
			element.setStyle(fx, 0);
		}
		return this;
	},

	removeSection: function(toggler, displayIndex){
		var togglers = this.togglers,
			idx = togglers.indexOf(toggler),
			element = this.elements[idx];

		var remover = function(){
			togglers.erase(toggler);
			this.elements.erase(element);
			this.detach(toggler);
		}.bind(this);

		if (this.now == idx || displayIndex != null){
			this.display(displayIndex != null ? displayIndex : (idx - 1 >= 0 ? idx - 1 : 0)).chain(remover);
		} else {
			remover();
		}
		return this;
	},

	detach: function(toggler){
		var remove = function(toggler){
			toggler.removeEvent(this.options.trigger, toggler.retrieve('accordion:display'));
		}.bind(this);

		if (!toggler) this.togglers.each(remove);
		else remove(toggler);
		return this;
	},

	display: function(index, useFx){
		if (!this.check(index, useFx)) return this;

		var obj = {},
			elements = this.elements,
			options = this.options,
			effects = this.effects;

		if (useFx == null) useFx = true;
		if (typeOf(index) == 'element') index = elements.indexOf(index);
		if (index == this.previous && !options.alwaysHide) return this;

		if (options.resetHeight){
			var prev = elements[this.previous];
			if (prev && !this.selfHidden){
				for (var fx in effects) prev.setStyle(fx, prev[effects[fx]]);
			}
		}

		if ((this.timer && options.link == 'chain') || (index === this.previous && !options.alwaysHide)) return this;

		this.previous = index;
		this.selfHidden = false;

		elements.each(function(el, i){
			obj[i] = {};
			var hide;
			if (i != index){
				hide = true;
			} else if (options.alwaysHide && ((el.offsetHeight > 0 && options.height) || el.offsetWidth > 0 && options.width)){
				hide = true;
				this.selfHidden = true;
			}
			this.fireEvent(hide ? 'background' : 'active', [this.togglers[i], el]);
			for (var fx in effects) obj[i][fx] = hide ? 0 : el[effects[fx]];
			if (!useFx && !hide && options.resetHeight) obj[i].height = 'auto';
		}, this);

		this.internalChain.clearChain();
		this.internalChain.chain(function(){
			if (options.resetHeight && !this.selfHidden){
				var el = elements[index];
				if (el) el.setStyle('height', 'auto');
			}
		}.bind(this));

		return useFx ? this.start(obj) : this.set(obj).internalChain.callChain();
	}

});




/*
---

script: Fx.Move.js

name: Fx.Move

description: Defines Fx.Move, a class that works with Element.Position.js to transition an element from one location to another.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Morph
  - /Element.Position

provides: [Fx.Move]

...
*/

Fx.Move = new Class({

	Extends: Fx.Morph,

	options: {
		relativeTo: document.body,
		position: 'center',
		edge: false,
		offset: {x: 0, y: 0}
	},

	start: function(destination){
		var element = this.element,
			topLeft = element.getStyles('top', 'left');
		if (topLeft.top == 'auto' || topLeft.left == 'auto'){
			element.setPosition(element.getPosition(element.getOffsetParent()));
		}
		return this.parent(element.position(Object.merge({}, this.options, destination, {returnPos: true})));
	}

});

Element.Properties.move = {

	set: function(options){
		this.get('move').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var move = this.retrieve('move');
		if (!move){
			move = new Fx.Move(this, {link: 'cancel'});
			this.store('move', move);
		}
		return move;
	}

};

Element.implement({

	move: function(options){
		this.get('move').start(options);
		return this;
	}

});


/*
---

script: Fx.Scroll.js

name: Fx.Scroll

description: Effect to smoothly scroll any element, including the window.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Event
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Fx.Scroll]

...
*/

(function(){

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {x: 0, y: 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);

		if (typeOf(this.element) != 'element') this.element = document.id(this.element.getDocument().body);

		if (this.options.wheelStops){
			var stopper = this.element,
				cancel = this.cancel.pass(false, this);
			this.addEvent('start', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('complete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	set: function(){
		var now = Array.flatten(arguments);
		if (Browser.firefox) now = [Math.round(now[0]), Math.round(now[1])]; // not needed anymore in newer firefox versions
		this.element.scrollTo(now[0], now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var scroll = this.element.getScroll();
		return this.parent([scroll.x, scroll.y], [x, y]);
	},

	calculateScroll: function(x, y){
		var element = this.element,
			scrollSize = element.getScrollSize(),
			scroll = element.getScroll(),
			size = element.getSize(),
			offset = this.options.offset,
			values = {x: x, y: y};

		for (var z in values){
			if (!values[z] && values[z] !== 0) values[z] = scroll[z];
			if (typeOf(values[z]) != 'number') values[z] = scrollSize[z] - size[z];
			values[z] += offset[z];
		}

		return [values.x, values.y];
	},

	toTop: function(){
		return this.start.apply(this, this.calculateScroll(false, 0));
	},

	toLeft: function(){
		return this.start.apply(this, this.calculateScroll(0, false));
	},

	toRight: function(){
		return this.start.apply(this, this.calculateScroll('right', false));
	},

	toBottom: function(){
		return this.start.apply(this, this.calculateScroll(false, 'bottom'));
	},

	toElement: function(el, axes){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		var scroll = isBody(this.element) ? {x: 0, y: 0} : this.element.getScroll();
		var position = Object.map(document.id(el).getPosition(this.element), function(value, axis){
			return axes.contains(axis) ? value + scroll[axis] : false;
		});
		return this.start.apply(this, this.calculateScroll(position.x, position.y));
	},

	toElementEdge: function(el, axes, offset){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		el = document.id(el);
		var to = {},
			position = el.getPosition(this.element),
			size = el.getSize(),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize(),
			edge = {
				x: position.x + size.x,
				y: position.y + size.y
			};

		['x', 'y'].each(function(axis){
			if (axes.contains(axis)){
				if (edge[axis] > scroll[axis] + containerSize[axis]) to[axis] = edge[axis] - containerSize[axis];
				if (position[axis] < scroll[axis]) to[axis] = position[axis];
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	},

	toElementCenter: function(el, axes, offset){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		el = document.id(el);
		var to = {},
			position = el.getPosition(this.element),
			size = el.getSize(),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize();

		['x', 'y'].each(function(axis){
			if (axes.contains(axis)){
				to[axis] = position[axis] - (containerSize[axis] - size[axis]) / 2;
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	}

});



function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
}

})();


/*
---

script: Fx.Slide.js

name: Fx.Slide

description: Effect to slide an element in and out of view.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Style
  - /MooTools.More

provides: [Fx.Slide]

...
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical',
		wrapper: false,
		hideOverflow: true,
		resetHeight: false
	},

	initialize: function(element, options){
		element = this.element = this.subject = document.id(element);
		this.parent(options);
		options = this.options;

		var wrapper = element.retrieve('wrapper'),
			styles = element.getStyles('margin', 'position', 'overflow');

		if (options.hideOverflow) styles = Object.append(styles, {overflow: 'hidden'});
		if (options.wrapper) wrapper = document.id(options.wrapper).setStyles(styles);

		if (!wrapper) wrapper = new Element('div', {
			styles: styles
		}).wraps(element);

		element.store('wrapper', wrapper).setStyle('margin', 0);
		if (element.getStyle('overflow') == 'visible') element.setStyle('overflow', 'hidden');

		this.now = [];
		this.open = true;
		this.wrapper = wrapper;

		this.addEvent('complete', function(){
			this.open = (wrapper['offset' + this.layout.capitalize()] != 0);
			if (this.open && this.options.resetHeight) wrapper.setStyle('height', '');
		}, true);
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	set: function(now){
		this.element.setStyle(this.margin, now[0]);
		this.wrapper.setStyle(this.layout, now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(how, mode){
		if (!this.check(how, mode)) return this;
		this[mode || this.options.mode]();

		var margin = this.element.getStyle(this.margin).toInt(),
			layout = this.wrapper.getStyle(this.layout).toInt(),
			caseIn = [[margin, layout], [0, this.offset]],
			caseOut = [[margin, layout], [-this.offset, 0]],
			start;

		switch (how){
			case 'in': start = caseIn; break;
			case 'out': start = caseOut; break;
			case 'toggle': start = (layout == 0) ? caseIn : caseOut;
		}
		return this.parent(start[0], start[1]);
	},

	slideIn: function(mode){
		return this.start('in', mode);
	},

	slideOut: function(mode){
		return this.start('out', mode);
	},

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	toggle: function(mode){
		return this.start('toggle', mode);
	}

});

Element.Properties.slide = {

	set: function(options){
		this.get('slide').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var slide = this.retrieve('slide');
		if (!slide){
			slide = new Fx.Slide(this, {link: 'cancel'});
			this.store('slide', slide);
		}
		return slide;
	}

};

Element.implement({

	slide: function(how, mode){
		how = how || 'toggle';
		var slide = this.get('slide'), toggle;
		switch (how){
			case 'hide': slide.hide(mode); break;
			case 'show': slide.show(mode); break;
			case 'toggle':
				var flag = this.retrieve('slide:flag', slide.open);
				slide[flag ? 'slideOut' : 'slideIn'](mode);
				this.store('slide:flag', !flag);
				toggle = true;
			break;
			default: slide.start(how, mode);
		}
		if (!toggle) this.eliminate('slide:flag');
		return this;
	}

});


/*
---

script: Fx.SmoothScroll.js

name: Fx.SmoothScroll

description: Class for creating a smooth scrolling effect to all internal links on the page.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Slick.Finder
  - /Fx.Scroll

provides: [Fx.SmoothScroll]

...
*/

Fx.SmoothScroll = new Class({

	Extends: Fx.Scroll,

	options: {
		axes: ['x', 'y']
	},

	initialize: function(options, context){
		context = context || document;
		this.doc = context.getDocument();
		this.parent(this.doc, options);

		var win = context.getWindow(),
			location = win.location.href.match(/^[^#]*/)[0] + '#',
			links = $$(this.options.links || this.doc.links);

		links.each(function(link){
			if (link.href.indexOf(location) != 0) return;
			var anchor = link.href.substr(location.length);
			if (anchor) this.useLink(link, anchor);
		}, this);

		this.addEvent('complete', function(){
			win.location.hash = this.anchor;
			this.element.scrollTo(this.to[0], this.to[1]);
		}, true);
	},

	useLink: function(link, anchor){

		link.addEvent('click', function(event){
			var el = document.id(anchor) || this.doc.getElement('a[name=' + anchor + ']');
			if (!el) return;

			event.preventDefault();
			this.toElement(el, this.options.axes).chain(function(){
				this.fireEvent('scrolledTo', [link, el]);
			}.bind(this));

			this.anchor = anchor;

		}.bind(this));

		return this;
	}
});


/*
---

script: Fx.Sort.js

name: Fx.Sort

description: Defines Fx.Sort, a class that reorders lists with a transition.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Dimensions
  - /Fx.Elements
  - /Element.Measure

provides: [Fx.Sort]

...
*/

Fx.Sort = new Class({

	Extends: Fx.Elements,

	options: {
		mode: 'vertical'
	},

	initialize: function(elements, options){
		this.parent(elements, options);
		this.elements.each(function(el){
			if (el.getStyle('position') == 'static') el.setStyle('position', 'relative');
		});
		this.setDefaultOrder();
	},

	setDefaultOrder: function(){
		this.currentOrder = this.elements.map(function(el, index){
			return index;
		});
	},

	sort: function(){
		if (!this.check(arguments)) return this;
		var newOrder = Array.flatten(arguments);

		var top = 0,
			left = 0,
			next = {},
			zero = {},
			vert = this.options.mode == 'vertical';

		var current = this.elements.map(function(el, index){
			var size = el.getComputedSize({styles: ['border', 'padding', 'margin']});
			var val;
			if (vert){
				val = {
					top: top,
					margin: size['margin-top'],
					height: size.totalHeight
				};
				top += val.height - size['margin-top'];
			} else {
				val = {
					left: left,
					margin: size['margin-left'],
					width: size.totalWidth
				};
				left += val.width;
			}
			var plane = vert ? 'top' : 'left';
			zero[index] = {};
			var start = el.getStyle(plane).toInt();
			zero[index][plane] = start || 0;
			return val;
		}, this);

		this.set(zero);
		newOrder = newOrder.map(function(i){ return i.toInt(); });
		if (newOrder.length != this.elements.length){
			this.currentOrder.each(function(index){
				if (!newOrder.contains(index)) newOrder.push(index);
			});
			if (newOrder.length > this.elements.length)
				newOrder.splice(this.elements.length-1, newOrder.length - this.elements.length);
		}
		var margin = 0;
		top = left = 0;
		newOrder.each(function(item){
			var newPos = {};
			if (vert){
				newPos.top = top - current[item].top - margin;
				top += current[item].height;
			} else {
				newPos.left = left - current[item].left;
				left += current[item].width;
			}
			margin = margin + current[item].margin;
			next[item]=newPos;
		}, this);
		var mapped = {};
		Array.clone(newOrder).sort().each(function(index){
			mapped[index] = next[index];
		});
		this.start(mapped);
		this.currentOrder = newOrder;

		return this;
	},

	rearrangeDOM: function(newOrder){
		newOrder = newOrder || this.currentOrder;
		var parent = this.elements[0].getParent();
		var rearranged = [];
		this.elements.setStyle('opacity', 0);
		//move each element and store the new default order
		newOrder.each(function(index){
			rearranged.push(this.elements[index].inject(parent).setStyles({
				top: 0,
				left: 0
			}));
		}, this);
		this.elements.setStyle('opacity', 1);
		this.elements = $$(rearranged);
		this.setDefaultOrder();
		return this;
	},

	getDefaultOrder: function(){
		return this.elements.map(function(el, index){
			return index;
		});
	},

	getCurrentOrder: function(){
		return this.currentOrder;
	},

	forward: function(){
		return this.sort(this.getDefaultOrder());
	},

	backward: function(){
		return this.sort(this.getDefaultOrder().reverse());
	},

	reverse: function(){
		return this.sort(this.currentOrder.reverse());
	},

	sortByElements: function(elements){
		return this.sort(elements.map(function(el){
			return this.elements.indexOf(el);
		}, this));
	},

	swap: function(one, two){
		if (typeOf(one) == 'element') one = this.elements.indexOf(one);
		if (typeOf(two) == 'element') two = this.elements.indexOf(two);

		var newOrder = Array.clone(this.currentOrder);
		newOrder[this.currentOrder.indexOf(one)] = two;
		newOrder[this.currentOrder.indexOf(two)] = one;

		return this.sort(newOrder);
	}

});


/*
---

script: Drag.js

name: Drag

description: The base Drag Class. Can be used to drag and resize Elements using mouse events.

license: MIT-style license

authors:
  - Valerio Proietti
  - Tom Occhinno
  - Jan Kassens

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Drag]
...

*/

var Drag = new Class({

	Implements: [Events, Options],

	options: {/*
		onBeforeStart: function(thisElement){},
		onStart: function(thisElement, event){},
		onSnap: function(thisElement){},
		onDrag: function(thisElement, event){},
		onCancel: function(thisElement){},
		onComplete: function(thisElement, event){},*/
		snap: 6,
		unit: 'px',
		grid: false,
		style: true,
		limit: false,
		handle: false,
		invert: false,
		preventDefault: false,
		stopPropagation: false,
		modifiers: {x: 'left', y: 'top'}
	},

	initialize: function(){
		var params = Array.link(arguments, {
			'options': Type.isObject,
			'element': function(obj){
				return obj != null;
			}
		});

		this.element = document.id(params.element);
		this.document = this.element.getDocument();
		this.setOptions(params.options || {});
		var htype = typeOf(this.options.handle);
		this.handles = ((htype == 'array' || htype == 'collection') ? $$(this.options.handle) : document.id(this.options.handle)) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};

		this.selection = (Browser.ie) ? 'selectstart' : 'mousedown';


		if (Browser.ie && !Drag.ondragstartFixed){
			document.ondragstart = Function.from(false);
			Drag.ondragstartFixed = true;
		}

		this.bound = {
			start: this.start.bind(this),
			check: this.check.bind(this),
			drag: this.drag.bind(this),
			stop: this.stop.bind(this),
			cancel: this.cancel.bind(this),
			eventStop: Function.from(false)
		};
		this.attach();
	},

	attach: function(){
		this.handles.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach: function(){
		this.handles.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start: function(event){
		var options = this.options;

		if (event.rightClick) return;

		if (options.preventDefault) event.preventDefault();
		if (options.stopPropagation) event.stopPropagation();
		this.mouse.start = event.page;

		this.fireEvent('beforeStart', this.element);

		var limit = options.limit;
		this.limit = {x: [], y: []};

		var z, coordinates;
		for (z in options.modifiers){
			if (!options.modifiers[z]) continue;

			var style = this.element.getStyle(options.modifiers[z]);

			// Some browsers (IE and Opera) don't always return pixels.
			if (style && !style.match(/px$/)){
				if (!coordinates) coordinates = this.element.getCoordinates(this.element.getOffsetParent());
				style = coordinates[options.modifiers[z]];
			}

			if (options.style) this.value.now[z] = (style || 0).toInt();
			else this.value.now[z] = this.element[options.modifiers[z]];

			if (options.invert) this.value.now[z] *= -1;

			this.mouse.pos[z] = event.page[z] - this.value.now[z];

			if (limit && limit[z]){
				var i = 2;
				while (i--){
					var limitZI = limit[z][i];
					if (limitZI || limitZI === 0) this.limit[z][i] = (typeof limitZI == 'function') ? limitZI() : limitZI;
				}
			}
		}

		if (typeOf(this.options.grid) == 'number') this.options.grid = {
			x: this.options.grid,
			y: this.options.grid
		};

		var events = {
			mousemove: this.bound.check,
			mouseup: this.bound.cancel
		};
		events[this.selection] = this.bound.eventStop;
		this.document.addEvents(events);
	},

	check: function(event){
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	drag: function(event){
		var options = this.options;

		if (options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;

		for (var z in options.modifiers){
			if (!options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];

			if (options.invert) this.value.now[z] *= -1;

			if (options.limit && this.limit[z]){
				if ((this.limit[z][1] || this.limit[z][1] === 0) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
				} else if ((this.limit[z][0] || this.limit[z][0] === 0) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
				}
			}

			if (options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % options.grid[z]);

			if (options.style) this.element.setStyle(options.modifiers[z], this.value.now[z] + options.unit);
			else this.element[options.modifiers[z]] = this.value.now[z];
		}

		this.fireEvent('drag', [this.element, event]);
	},

	cancel: function(event){
		this.document.removeEvents({
			mousemove: this.bound.check,
			mouseup: this.bound.cancel
		});
		if (event){
			this.document.removeEvent(this.selection, this.bound.eventStop);
			this.fireEvent('cancel', this.element);
		}
	},

	stop: function(event){
		var events = {
			mousemove: this.bound.drag,
			mouseup: this.bound.stop
		};
		events[this.selection] = this.bound.eventStop;
		this.document.removeEvents(events);
		if (event) this.fireEvent('complete', [this.element, event]);
	}

});

Element.implement({

	makeResizable: function(options){
		var drag = new Drag(this, Object.merge({
			modifiers: {
				x: 'width',
				y: 'height'
			}
		}, options));

		this.store('resizer', drag);
		return drag.addEvent('drag', function(){
			this.fireEvent('resize', drag);
		}.bind(this));
	}

});


/*
---

script: Drag.Move.js

name: Drag.Move

description: A Drag extension that provides support for the constraining of draggables to containers and droppables.

license: MIT-style license

authors:
  - Valerio Proietti
  - Tom Occhinno
  - Jan Kassens
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Element.Dimensions
  - /Drag

provides: [Drag.Move]

...
*/

Drag.Move = new Class({

	Extends: Drag,

	options: {/*
		onEnter: function(thisElement, overed){},
		onLeave: function(thisElement, overed){},
		onDrop: function(thisElement, overed, event){},*/
		droppables: [],
		container: false,
		precalculate: false,
		includeMargins: true,
		checkDroppables: true
	},

	initialize: function(element, options){
		this.parent(element, options);
		element = this.element;

		this.droppables = $$(this.options.droppables);
		this.container = document.id(this.options.container);

		if (this.container && typeOf(this.container) != 'element')
			this.container = document.id(this.container.getDocument().body);

		if (this.options.style){
			if (this.options.modifiers.x == 'left' && this.options.modifiers.y == 'top'){
				var parent = element.getOffsetParent(),
					styles = element.getStyles('left', 'top');
				if (parent && (styles.left == 'auto' || styles.top == 'auto')){
					element.setPosition(element.getPosition(parent));
				}
			}

			if (element.getStyle('position') == 'static') element.setStyle('position', 'absolute');
		}

		this.addEvent('start', this.checkDroppables, true);
		this.overed = null;
	},

	start: function(event){
		if (this.container) this.options.limit = this.calculateLimit();

		if (this.options.precalculate){
			this.positions = this.droppables.map(function(el){
				return el.getCoordinates();
			});
		}

		this.parent(event);
	},

	calculateLimit: function(){
		var element = this.element,
			container = this.container,

			offsetParent = document.id(element.getOffsetParent()) || document.body,
			containerCoordinates = container.getCoordinates(offsetParent),
			elementMargin = {},
			elementBorder = {},
			containerMargin = {},
			containerBorder = {},
			offsetParentPadding = {};

		['top', 'right', 'bottom', 'left'].each(function(pad){
			elementMargin[pad] = element.getStyle('margin-' + pad).toInt();
			elementBorder[pad] = element.getStyle('border-' + pad).toInt();
			containerMargin[pad] = container.getStyle('margin-' + pad).toInt();
			containerBorder[pad] = container.getStyle('border-' + pad).toInt();
			offsetParentPadding[pad] = offsetParent.getStyle('padding-' + pad).toInt();
		}, this);

		var width = element.offsetWidth + elementMargin.left + elementMargin.right,
			height = element.offsetHeight + elementMargin.top + elementMargin.bottom,
			left = 0,
			top = 0,
			right = containerCoordinates.right - containerBorder.right - width,
			bottom = containerCoordinates.bottom - containerBorder.bottom - height;

		if (this.options.includeMargins){
			left += elementMargin.left;
			top += elementMargin.top;
		} else {
			right += elementMargin.right;
			bottom += elementMargin.bottom;
		}

		if (element.getStyle('position') == 'relative'){
			var coords = element.getCoordinates(offsetParent);
			coords.left -= element.getStyle('left').toInt();
			coords.top -= element.getStyle('top').toInt();

			left -= coords.left;
			top -= coords.top;
			if (container.getStyle('position') != 'relative'){
				left += containerBorder.left;
				top += containerBorder.top;
			}
			right += elementMargin.left - coords.left;
			bottom += elementMargin.top - coords.top;

			if (container != offsetParent){
				left += containerMargin.left + offsetParentPadding.left;
				top += ((Browser.ie6 || Browser.ie7) ? 0 : containerMargin.top) + offsetParentPadding.top;
			}
		} else {
			left -= elementMargin.left;
			top -= elementMargin.top;
			if (container != offsetParent){
				left += containerCoordinates.left + containerBorder.left;
				top += containerCoordinates.top + containerBorder.top;
			}
		}

		return {
			x: [left, right],
			y: [top, bottom]
		};
	},

	getDroppableCoordinates: function(element){
		var position = element.getCoordinates();
		if (element.getStyle('position') == 'fixed'){
			var scroll = window.getScroll();
			position.left += scroll.x;
			position.right += scroll.x;
			position.top += scroll.y;
			position.bottom += scroll.y;
		}
		return position;
	},

	checkDroppables: function(){
		var overed = this.droppables.filter(function(el, i){
			el = this.positions ? this.positions[i] : this.getDroppableCoordinates(el);
			var now = this.mouse.now;
			return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
		}, this).getLast();

		if (this.overed != overed){
			if (this.overed) this.fireEvent('leave', [this.element, this.overed]);
			if (overed) this.fireEvent('enter', [this.element, overed]);
			this.overed = overed;
		}
	},

	drag: function(event){
		this.parent(event);
		if (this.options.checkDroppables && this.droppables.length) this.checkDroppables();
	},

	stop: function(event){
		this.checkDroppables();
		this.fireEvent('drop', [this.element, this.overed, event]);
		this.overed = null;
		return this.parent(event);
	}

});

Element.implement({

	makeDraggable: function(options){
		var drag = new Drag.Move(this, options);
		this.store('dragger', drag);
		return drag;
	}

});


/*
---

script: Slider.js

name: Slider

description: Class for creating horizontal and vertical slider controls.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Dimensions
  - /Class.Binds
  - /Drag
  - /Element.Measure

provides: [Slider]

...
*/

var Slider = new Class({

	Implements: [Events, Options],

	Binds: ['clickedElement', 'draggedKnob', 'scrolledElement'],

	options: {/*
		onTick: function(intPosition){},
		onChange: function(intStep){},
		onComplete: function(strStep){},*/
		onTick: function(position){
			this.setKnobPosition( Math.round( position ));
		},
		initialStep: 0,
		snap: false,
		offset: 0,
		range: false,
		wheel: false,
		steps: 100,
		mode: 'horizontal'
	},

	initialize: function(element, knob, options){
		this.setOptions(options);
		options = this.options;
		this.element = document.id(element);
		knob = this.knob = document.id(knob);
		this.previousChange = this.previousEnd = this.step = -1;

		var limit = {},
			modifiers = {x: false, y: false};

		switch (options.mode){
			case 'vertical':
				this.axis = 'y';
				this.property = 'top';
				this.offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = 'x';
				this.property = 'left';
				this.offset = 'offsetWidth';
		}

		this.setSliderDimensions();
		this.setRange(options.range);

		if (knob.getStyle('position') == 'static') knob.setStyle('position', 'relative');
		knob.setStyle(this.property, -options.offset);
		modifiers[this.axis] = this.property;
		limit[this.axis] = [-options.offset, this.full - options.offset];

		var dragOptions = {
			snap: 0,
			limit: limit,
			modifiers: modifiers,
			onDrag: this.draggedKnob,
			onStart: this.draggedKnob,
			onBeforeStart: (function(){
				this.isDragging = true;
			}).bind(this),
			onCancel: function(){
				this.isDragging = false;
			}.bind(this),
			onComplete: function(){
				this.isDragging = false;
				this.draggedKnob();
				this.end();
			}.bind(this)
		};
		if (options.snap) this.setSnap(dragOptions);

		this.drag = new Drag(knob, dragOptions);
		this.attach();
		if (options.initialStep != null) this.set(options.initialStep);
	},

	attach: function(){
		this.element.addEvent('mousedown', this.clickedElement);
		if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement);
		this.drag.attach();
		return this;
	},

	detach: function(){
		this.element.removeEvent('mousedown', this.clickedElement)
			.removeEvent('mousewheel', this.scrolledElement);
		this.drag.detach();
		return this;
	},

	autosize: function(){
		this.setSliderDimensions().setKnobPosition(this.toPosition(this.step));
		this.drag.options.limit[this.axis] = [-this.options.offset, this.full - this.options.offset];
		if (this.options.snap) this.setSnap();
		return this;
	},

	setSnap: function(options){
		if (!options) options = this.drag.options;
		options.grid = Math.ceil(this.stepWidth);
		options.limit[this.axis][1] = this.full;
		return this;
	},

	setKnobPosition: function(position){
		if (this.options.snap) position = this.toPosition(this.step);
		this.knob.setStyle(this.property, Math.round( position ));
		return this;
	},

	setSliderDimensions: function(){
		this.full = this.element.measure(function(){
			this.half = this.knob[this.offset] / 2;
			return this.element[this.offset] - this.knob[this.offset] + (this.options.offset * 2);
		}.bind(this));
		return this;
	},

	set: function(step){
		if (!((this.range > 0) ^ (step < this.min))) step = this.min;
		if (!((this.range > 0) ^ (step > this.max))) step = this.max;

		this.step = Math.round(step);
		return this.checkStep()
			.fireEvent('tick', this.toPosition(this.step))
			.end();
	},

	setRange: function(range, pos){
		this.min = Array.pick([range[0], 0]);
		this.max = Array.pick([range[1], this.options.steps]);
		this.range = this.max - this.min;
		this.steps = this.options.steps || this.full;
		this.stepSize = Math.abs(this.range) / this.steps;
		this.stepWidth = this.stepSize * this.full / ( this.range > 0 ? Math.abs(this.range) : 1 );
		if( range ) this.set( Array.pick( [pos, this.step] ).floor( this.min ).max( this.max ));
		return this;
	},

	clickedElement: function(event){
		if (this.isDragging || event.target == this.knob) return;

		var dir = this.range < 0 ? -1 : 1,
			position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;

		position = position.limit(-this.options.offset, this.full - this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));

		this.checkStep()
			.fireEvent('tick', position)
			.end();
	},

	scrolledElement: function(event){
		var mode = (this.options.mode == 'horizontal') ? (event.wheel < 0) : (event.wheel > 0);
		this.set(this.step + (mode ? -1 : 1) * this.stepSize);
		event.stop();
	},

	draggedKnob: function(){
		var dir = this.range < 0 ? -1 : 1,
			position = this.drag.value.now[this.axis];

		position = position.limit(-this.options.offset, this.full -this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
	},

	checkStep: function(){
		var step = this.step;
		if (this.previousChange != step){
			this.previousChange = step;
			this.fireEvent('change', step);
		}
		return this;
	},

	end: function(){
		var step = this.step;
		if (this.previousEnd !== step){
			this.previousEnd = step;
			this.fireEvent('complete', step + '');
		}
		return this;
	},

	toStep: function(position){
		var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
		return this.options.steps ? Math.round(step -= step % this.stepSize) : step;
	},

	toPosition: function(step){
		return (this.full * Math.abs(this.min - step)) / ( this.steps > 0 && this.stepSize > 0 ? (this.steps * this.stepSize) - this.options.offset : 1 );
	}

});


/*
---

script: Sortables.js

name: Sortables

description: Class for creating a drag and drop sorting interface for lists of items.

license: MIT-style license

authors:
  - Tom Occhino

requires:
  - Core/Fx.Morph
  - /Drag.Move

provides: [Sortables]

...
*/

var Sortables = new Class({

	Implements: [Events, Options],

	options: {/*
		onSort: function(element, clone){},
		onStart: function(element, clone){},
		onComplete: function(element){},*/
		opacity: 1,
		clone: false,
		revert: false,
		handle: false,
		dragOptions: {}
	},

	initialize: function(lists, options){
		this.setOptions(options);

		this.elements = [];
		this.lists = [];
		this.idle = true;

		this.addLists($$(document.id(lists) || lists));

		if (!this.options.clone) this.options.revert = false;
		if (this.options.revert) this.effect = new Fx.Morph(null, Object.merge({
			duration: 250,
			link: 'cancel'
		}, this.options.revert));
	},

	attach: function(){
		this.addLists(this.lists);
		return this;
	},

	detach: function(){
		this.lists = this.removeLists(this.lists);
		return this;
	},

	addItems: function(){
		Array.flatten(arguments).each(function(element){
			this.elements.push(element);
			var start = element.retrieve('sortables:start', function(event){
				this.start.call(this, event, element);
			}.bind(this));
			(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', start);
		}, this);
		return this;
	},

	addLists: function(){
		Array.flatten(arguments).each(function(list){
			this.lists.include(list);
			this.addItems(list.getChildren());
		}, this);
		return this;
	},

	removeItems: function(){
		return $$(Array.flatten(arguments).map(function(element){
			this.elements.erase(element);
			var start = element.retrieve('sortables:start');
			(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', start);

			return element;
		}, this));
	},

	removeLists: function(){
		return $$(Array.flatten(arguments).map(function(list){
			this.lists.erase(list);
			this.removeItems(list.getChildren());

			return list;
		}, this));
	},

	getClone: function(event, element){
		if (!this.options.clone) return new Element(element.tagName).inject(document.body);
		if (typeOf(this.options.clone) == 'function') return this.options.clone.call(this, event, element, this.list);
		var clone = element.clone(true).setStyles({
			margin: 0,
			position: 'absolute',
			visibility: 'hidden',
			width: element.getStyle('width')
		}).addEvent('mousedown', function(event){
			element.fireEvent('mousedown', event);
		});
		//prevent the duplicated radio inputs from unchecking the real one
		if (clone.get('html').test('radio')){
			clone.getElements('input[type=radio]').each(function(input, i){
				input.set('name', 'clone_' + i);
				if (input.get('checked')) element.getElements('input[type=radio]')[i].set('checked', true);
			});
		}

		return clone.inject(this.list).setPosition(element.getPosition(element.getOffsetParent()));
	},

	getDroppables: function(){
		var droppables = this.list.getChildren().erase(this.clone).erase(this.element);
		if (!this.options.constrain) droppables.append(this.lists).erase(this.list);
		return droppables;
	},

	insert: function(dragging, element){
		var where = 'inside';
		if (this.lists.contains(element)){
			this.list = element;
			this.drag.droppables = this.getDroppables();
		} else {
			where = this.element.getAllPrevious().contains(element) ? 'before' : 'after';
		}
		this.element.inject(element, where);
		this.fireEvent('sort', [this.element, this.clone]);
	},

	start: function(event, element){
		if (
			!this.idle ||
			event.rightClick ||
			['button', 'input', 'a', 'textarea'].contains(event.target.get('tag'))
		) return;

		this.idle = false;
		this.element = element;
		this.opacity = element.get('opacity');
		this.list = element.getParent();
		this.clone = this.getClone(event, element);

		this.drag = new Drag.Move(this.clone, Object.merge({
			
			droppables: this.getDroppables()
		}, this.options.dragOptions)).addEvents({
			onSnap: function(){
				event.stop();
				this.clone.setStyle('visibility', 'visible');
				this.element.set('opacity', this.options.opacity || 0);
				this.fireEvent('start', [this.element, this.clone]);
			}.bind(this),
			onEnter: this.insert.bind(this),
			onCancel: this.end.bind(this),
			onComplete: this.end.bind(this)
		});

		this.clone.inject(this.element, 'before');
		this.drag.start(event);
	},

	end: function(){
		this.drag.detach();
		this.element.set('opacity', this.opacity);
		if (this.effect){
			var dim = this.element.getStyles('width', 'height'),
				clone = this.clone,
				pos = clone.computePosition(this.element.getPosition(this.clone.getOffsetParent()));

			var destroy = function(){
				this.removeEvent('cancel', destroy);
				clone.destroy();
			};

			this.effect.element = clone;
			this.effect.start({
				top: pos.top,
				left: pos.left,
				width: dim.width,
				height: dim.height,
				opacity: 0.25
			}).addEvent('cancel', destroy).chain(destroy);
		} else {
			this.clone.destroy();
		}
		this.reset();
	},

	reset: function(){
		this.idle = true;
		this.fireEvent('complete', this.element);
	},

	serialize: function(){
		var params = Array.link(arguments, {
			modifier: Type.isFunction,
			index: function(obj){
				return obj != null;
			}
		});
		var serial = this.lists.map(function(list){
			return list.getChildren().map(params.modifier || function(element){
				return element.get('id');
			}, this);
		}, this);

		var index = params.index;
		if (this.lists.length == 1) index = 0;
		return (index || index === 0) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});


/*
---

script: Request.JSONP.js

name: Request.JSONP

description: Defines Request.JSONP, a class for cross domain javascript via script injection.

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Arian Stolwijk

requires:
  - Core/Element
  - Core/Request
  - MooTools.More

provides: [Request.JSONP]

...
*/

Request.JSONP = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: function(src, scriptElement){},
		onComplete: function(data){},
		onSuccess: function(data){},
		onCancel: function(){},
		onTimeout: function(){},
		onError: function(){}, */
		onRequest: function(src){
			if (this.options.log && window.console && console.log){
				console.log('JSONP retrieving script with url:' + src);
			}
		},
		onError: function(src){
			if (this.options.log && window.console && console.warn){
				console.warn('JSONP '+ src +' will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs');
			}
		},
		url: '',
		callbackKey: 'callback',
		injectScript: document.head,
		data: '',
		link: 'ignore',
		timeout: 0,
		log: false
	},

	initialize: function(options){
		this.setOptions(options);
	},

	send: function(options){
		if (!Request.prototype.check.call(this, options)) return this;
		this.running = true;

		var type = typeOf(options);
		if (type == 'string' || type == 'element') options = {data: options};
		options = Object.merge(this.options, options || {});

		var data = options.data;
		switch (typeOf(data)){
			case 'element': data = document.id(data).toQueryString(); break;
			case 'object': case 'hash': data = Object.toQueryString(data);
		}

		var index = this.index = Request.JSONP.counter++;

		var src = options.url +
			(options.url.test('\\?') ? '&' :'?') +
			(options.callbackKey) +
			'=Request.JSONP.request_map.request_'+ index +
			(data ? '&' + data : '');

		if (src.length > 2083) this.fireEvent('error', src);

		Request.JSONP.request_map['request_' + index] = function(){
			this.success(arguments, index);
		}.bind(this);

		var script = this.getScript(src).inject(options.injectScript);
		this.fireEvent('request', [src, script]);

		if (options.timeout) this.timeout.delay(options.timeout, this);

		return this;
	},

	getScript: function(src){
		if (!this.script) this.script = new Element('script', {
			type: 'text/javascript',
			async: true,
			src: src
		});
		return this.script;
	},

	success: function(args, index){
		if (!this.running) return;
		this.clear()
			.fireEvent('complete', args).fireEvent('success', args)
			.callChain();
	},

	cancel: function(){
		if (this.running) this.clear().fireEvent('cancel');
		return this;
	},

	isRunning: function(){
		return !!this.running;
	},

	clear: function(){
		this.running = false;
		if (this.script){
			this.script.destroy();
			this.script = null;
		}
		return this;
	},

	timeout: function(){
		if (this.running){
			this.running = false;
			this.fireEvent('timeout', [this.script.get('src'), this.script]).fireEvent('failure').cancel();
		}
		return this;
	}

});

Request.JSONP.counter = 0;
Request.JSONP.request_map = {};


/*
---

script: Request.Queue.js

name: Request.Queue

description: Controls several instances of Request and its variants to run only one request at a time.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element
  - Core/Request
  - /Class.Binds

provides: [Request.Queue]

...
*/

Request.Queue = new Class({

	Implements: [Options, Events],

	Binds: ['attach', 'request', 'complete', 'cancel', 'success', 'failure', 'exception'],

	options: {/*
		onRequest: function(argsPassedToOnRequest){},
		onSuccess: function(argsPassedToOnSuccess){},
		onComplete: function(argsPassedToOnComplete){},
		onCancel: function(argsPassedToOnCancel){},
		onException: function(argsPassedToOnException){},
		onFailure: function(argsPassedToOnFailure){},
		onEnd: function(){},
		*/
		stopOnFailure: true,
		autoAdvance: true,
		concurrent: 1,
		requests: {}
	},

	initialize: function(options){
		var requests;
		if (options){
			requests = options.requests;
			delete options.requests;
		}
		this.setOptions(options);
		this.requests = {};
		this.queue = [];
		this.reqBinders = {};

		if (requests) this.addRequests(requests);
	},

	addRequest: function(name, request){
		this.requests[name] = request;
		this.attach(name, request);
		return this;
	},

	addRequests: function(obj){
		Object.each(obj, function(req, name){
			this.addRequest(name, req);
		}, this);
		return this;
	},

	getName: function(req){
		return Object.keyOf(this.requests, req);
	},

	attach: function(name, req){
		if (req._groupSend) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			if (!this.reqBinders[name]) this.reqBinders[name] = {};
			this.reqBinders[name][evt] = function(){
				this['on' + evt.capitalize()].apply(this, [name, req].append(arguments));
			}.bind(this);
			req.addEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req._groupSend = req.send;
		req.send = function(options){
			this.send(name, options);
			return req;
		}.bind(this);
		return this;
	},

	removeRequest: function(req){
		var name = typeOf(req) == 'object' ? this.getName(req) : req;
		if (!name && typeOf(name) != 'string') return this;
		req = this.requests[name];
		if (!req) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			req.removeEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req.send = req._groupSend;
		delete req._groupSend;
		return this;
	},

	getRunning: function(){
		return Object.filter(this.requests, function(r){
			return r.running;
		});
	},

	isRunning: function(){
		return !!(Object.keys(this.getRunning()).length);
	},

	send: function(name, options){
		var q = function(){
			this.requests[name]._groupSend(options);
			this.queue.erase(q);
		}.bind(this);

		q.name = name;
		if (Object.keys(this.getRunning()).length >= this.options.concurrent || (this.error && this.options.stopOnFailure)) this.queue.push(q);
		else q();
		return this;
	},

	hasNext: function(name){
		return (!name) ? !!this.queue.length : !!this.queue.filter(function(q){ return q.name == name; }).length;
	},

	resume: function(){
		this.error = false;
		(this.options.concurrent - Object.keys(this.getRunning()).length).times(this.runNext, this);
		return this;
	},

	runNext: function(name){
		if (!this.queue.length) return this;
		if (!name){
			this.queue[0]();
		} else {
			var found;
			this.queue.each(function(q){
				if (!found && q.name == name){
					found = true;
					q();
				}
			});
		}
		return this;
	},

	runAll: function(){
		this.queue.each(function(q){
			q();
		});
		return this;
	},

	clear: function(name){
		if (!name){
			this.queue.empty();
		} else {
			this.queue = this.queue.map(function(q){
				if (q.name != name) return q;
				else return false;
			}).filter(function(q){
				return q;
			});
		}
		return this;
	},

	cancel: function(name){
		this.requests[name].cancel();
		return this;
	},

	onRequest: function(){
		this.fireEvent('request', arguments);
	},

	onComplete: function(){
		this.fireEvent('complete', arguments);
		if (!this.queue.length) this.fireEvent('end');
	},

	onCancel: function(){
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('cancel', arguments);
	},

	onSuccess: function(){
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('success', arguments);
	},

	onFailure: function(){
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('failure', arguments);
	},

	onException: function(){
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('exception', arguments);
	}

});


/*
---

script: Request.Periodical.js

name: Request.Periodical

description: Requests the same URL to pull data from a server but increases the intervals if no data is returned to reduce the load

license: MIT-style license

authors:
  - Christoph Pojer

requires:
  - Core/Request
  - /MooTools.More

provides: [Request.Periodical]

...
*/

Request.implement({

	options: {
		initialDelay: 5000,
		delay: 5000,
		limit: 60000
	},

	startTimer: function(data){
		var fn = function(){
			if (!this.running) this.send({data: data});
		};
		this.lastDelay = this.options.initialDelay;
		this.timer = fn.delay(this.lastDelay, this);
		this.completeCheck = function(response){
			clearTimeout(this.timer);
			this.lastDelay = (response) ? this.options.delay : (this.lastDelay + this.options.delay).min(this.options.limit);
			this.timer = fn.delay(this.lastDelay, this);
		};
		return this.addEvent('complete', this.completeCheck);
	},

	stopTimer: function(){
		clearTimeout(this.timer);
		return this.removeEvent('complete', this.completeCheck);
	}

});


/*
---

script: Assets.js

name: Assets

description: Provides methods to dynamically load JavaScript, CSS, and Image files into the document.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /MooTools.More

provides: [Assets]

...
*/

var Asset = {

	javascript: function(source, properties){
		if (!properties) properties = {};

		var script = new Element('script', {src: source, type: 'text/javascript'}),
			doc = properties.document || document,
			load = properties.onload || properties.onLoad;

		delete properties.onload;
		delete properties.onLoad;
		delete properties.document;

		if (load){
			if (typeof script.onreadystatechange != 'undefined'){
				script.addEvent('readystatechange', function(){
					if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
				});
			} else {
				script.addEvent('load', load);
			}
		}

		return script.set(properties).inject(doc.head);
	},

	css: function(source, properties){
		if (!properties) properties = {};

		var link = new Element('link', {
			rel: 'stylesheet',
			media: 'screen',
			type: 'text/css',
			href: source
		});

		var load = properties.onload || properties.onLoad,
			doc = properties.document || document;

		delete properties.onload;
		delete properties.onLoad;
		delete properties.document;

		if (load) link.addEvent('load', load);
		return link.set(properties).inject(doc.head);
	},

	image: function(source, properties){
		if (!properties) properties = {};

		var image = new Image(),
			element = document.id(image) || new Element('img');

		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name,
				cap = 'on' + name.capitalize(),
				event = properties[type] || properties[cap] || function(){};

			delete properties[cap];
			delete properties[type];

			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});

		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	},

	images: function(sources, options){
		sources = Array.from(sources);

		var fn = function(){},
			counter = 0;

		options = Object.merge({
			onComplete: fn,
			onProgress: fn,
			onError: fn,
			properties: {}
		}, options);

		return new Elements(sources.map(function(source, index){
			return Asset.image(source, Object.append(options.properties, {
				onload: function(){
					counter++;
					options.onProgress.call(this, counter, index, source);
					if (counter == sources.length) options.onComplete();
				},
				onerror: function(){
					counter++;
					options.onError.call(this, counter, index, source);
					if (counter == sources.length) options.onComplete();
				}
			}));
		}));
	}

};


/*
---

script: Color.js

name: Color

description: Class for creating and manipulating colors in JavaScript. Supports HSB -> RGB Conversions and vice versa.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - Core/Hash
  - Core/Function
  - MooTools.More

provides: [Color]

...
*/

(function(){

var Color = this.Color = new Type('Color', function(color, type){
	if (arguments.length >= 3){
		type = 'rgb'; color = Array.slice(arguments, 0, 3);
	} else if (typeof color == 'string'){
		if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
		else if (color.match(/hsb/)) color = color.hsbToRgb();
		else color = color.hexToRgb(true);
	}
	type = type || 'rgb';
	switch (type){
		case 'hsb':
			var old = color;
			color = color.hsbToRgb();
			color.hsb = old;
		break;
		case 'hex': color = color.hexToRgb(true); break;
	}
	color.rgb = color.slice(0, 3);
	color.hsb = color.hsb || color.rgbToHsb();
	color.hex = color.rgbToHex();
	return Object.append(color, this);
});

Color.implement({

	mix: function(){
		var colors = Array.slice(arguments);
		var alpha = (typeOf(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

this.$RGB = function(r, g, b){
	return new Color([r, g, b], 'rgb');
};

this.$HSB = function(h, s, b){
	return new Color([h, s, b], 'hsb');
};

this.$HEX = function(hex){
	return new Color(hex, 'hex');
};

Array.implement({

	rgbToHsb: function(){
		var red = this[0],
				green = this[1],
				blue = this[2],
				hue = 0;
		var max = Math.max(red, green, blue),
				min = Math.min(red, green, blue);
		var delta = max - min;
		var brightness = max / 255,
				saturation = (max != 0) ? delta / max : 0;
		if (saturation != 0){
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	hsbToRgb: function(){
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}

});

String.implement({

	rgbToHsb: function(){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHsb() : null;
	},

	hsbToRgb: function(){
		var hsb = this.match(/\d{1,3}/g);
		return (hsb) ? hsb.hsbToRgb() : null;
	}

});

})();



/*
---

script: Group.js

name: Group

description: Class for monitoring collections of events

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Events
  - /MooTools.More

provides: [Group]

...
*/

(function(){

this.Group = new Class({

	initialize: function(){
		this.instances = Array.flatten(arguments);
	},

	addEvent: function(type, fn){
		var instances = this.instances,
			len = instances.length,
			togo = len,
			args = new Array(len),
			self = this;

		instances.each(function(instance, i){
			instance.addEvent(type, function(){
				if (!args[i]) togo--;
				args[i] = arguments;
				if (!togo){
					fn.call(self, instances, instance, args);
					togo = len;
					args = new Array(len);
				}
			});
		});
	}

});

})();


/*
---

script: Hash.Cookie.js

name: Hash.Cookie

description: Class for creating, reading, and deleting Cookies in JSON format.

license: MIT-style license

authors:
  - Valerio Proietti
  - Aaron Newton

requires:
  - Core/Cookie
  - Core/JSON
  - /MooTools.More
  - /Hash

provides: [Hash.Cookie]

...
*/

Hash.Cookie = new Class({

	Extends: Cookie,

	options: {
		autoSave: true
	},

	initialize: function(name, options){
		this.parent(name, options);
		this.load();
	},

	save: function(){
		var value = JSON.encode(this.hash);
		if (!value || value.length > 4096) return false; //cookie would be truncated!
		if (value == '{}') this.dispose();
		else this.write(value);
		return true;
	},

	load: function(){
		this.hash = new Hash(JSON.decode(this.read(), true));
		return this;
	}

});

Hash.each(Hash.prototype, function(method, name){
	if (typeof method == 'function') Hash.Cookie.implement(name, function(){
		var value = method.apply(this.hash, arguments);
		if (this.options.autoSave) this.save();
		return value;
	});
});


/*
---
name: Table
description: LUA-Style table implementation.
license: MIT-style license
authors:
  - Valerio Proietti
requires: [Core/Array]
provides: [Table]
...
*/

(function(){

var Table = this.Table = function(){

	this.length = 0;
	var keys = [],
	    values = [];
	
	this.set = function(key, value){
		var index = keys.indexOf(key);
		if (index == -1){
			var length = keys.length;
			keys[length] = key;
			values[length] = value;
			this.length++;
		} else {
			values[index] = value;
		}
		return this;
	};

	this.get = function(key){
		var index = keys.indexOf(key);
		return (index == -1) ? null : values[index];
	};

	this.erase = function(key){
		var index = keys.indexOf(key);
		if (index != -1){
			this.length--;
			keys.splice(index, 1);
			return values.splice(index, 1)[0];
		}
		return null;
	};

	this.each = this.forEach = function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, keys[i], values[i], this);
	};
	
};

if (this.Type) new Type('Table', Table);

})();


/*
---

script: HtmlTable.js

name: HtmlTable

description: Builds table elements with methods to add rows.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - /Class.Occlude

provides: [HtmlTable]

...
*/

var HtmlTable = new Class({

	Implements: [Options, Events, Class.Occlude],

	options: {
		properties: {
			cellpadding: 0,
			cellspacing: 0,
			border: 0
		},
		rows: [],
		headers: [],
		footers: []
	},

	property: 'HtmlTable',

	initialize: function(){
		var params = Array.link(arguments, {options: Type.isObject, table: Type.isElement, id: Type.isString});
		this.setOptions(params.options);
		if (!params.table && params.id) params.table = document.id(params.id);
		this.element = params.table || new Element('table', this.options.properties);
		if (this.occlude()) return this.occluded;
		this.build();
	},

	build: function(){
		this.element.store('HtmlTable', this);

		this.body = document.id(this.element.tBodies[0]) || new Element('tbody').inject(this.element);
		$$(this.body.rows);

		if (this.options.headers.length) this.setHeaders(this.options.headers);
		else this.thead = document.id(this.element.tHead);

		if (this.thead) this.head = this.getHead();
		if (this.options.footers.length) this.setFooters(this.options.footers);

		this.tfoot = document.id(this.element.tFoot);
		if (this.tfoot) this.foot = document.id(this.tfoot.rows[0]);

		this.options.rows.each(function(row){
			this.push(row);
		}, this);
	},

	toElement: function(){
		return this.element;
	},

	empty: function(){
		this.body.empty();
		return this;
	},

	set: function(what, items){
		var target = (what == 'headers') ? 'tHead' : 'tFoot',
			lower = target.toLowerCase();

		this[lower] = (document.id(this.element[target]) || new Element(lower).inject(this.element, 'top')).empty();
		var data = this.push(items, {}, this[lower], what == 'headers' ? 'th' : 'td');

		if (what == 'headers') this.head = this.getHead();
		else this.foot = this.getHead();

		return data;
	},

	getHead: function(){
		var rows = this.thead.rows;
		return rows.length > 1 ? $$(rows) : rows.length ? document.id(rows[0]) : false;
	},

	setHeaders: function(headers){
		this.set('headers', headers);
		return this;
	},

	setFooters: function(footers){
		this.set('footers', footers);
		return this;
	},

	update: function(tr, row, tag){
		var tds = tr.getChildren(tag || 'td'), last = tds.length - 1;

		row.each(function(data, index){
			var td = tds[index] || new Element(tag || 'td').inject(tr),
				content = (data ? data.content : '') || data,
				type = typeOf(content);

			if (data && data.properties) td.set(data.properties);
			if (/(element(s?)|array|collection)/.test(type)) td.empty().adopt(content);
			else td.set('html', content);

			if (index > last) tds.push(td);
			else tds[index] = td;
		});

		return {
			tr: tr,
			tds: tds
		};
	},

	push: function(row, rowProperties, target, tag, where){
		if (typeOf(row) == 'element' && row.get('tag') == 'tr'){
			row.inject(target || this.body, where);
			return {
				tr: row,
				tds: row.getChildren('td')
			};
		}
		return this.update(new Element('tr', rowProperties).inject(target || this.body, where), row, tag);
	},

	pushMany: function(rows, rowProperties, target, tag, where){
		return rows.map(function(row){
			return this.push(row, rowProperties, target, tag, where);
		}, this);
	}

});


['adopt', 'inject', 'wraps', 'grab', 'replaces', 'dispose'].each(function(method){
	HtmlTable.implement(method, function(){
		this.element[method].apply(this.element, arguments);
		return this;
	});
});




/*
---

script: HtmlTable.Zebra.js

name: HtmlTable.Zebra

description: Builds a stripy table with methods to add rows.

license: MIT-style license

authors:
  - Harald Kirschner
  - Aaron Newton

requires:
  - /HtmlTable
  - /Element.Shortcuts
  - /Class.refactor

provides: [HtmlTable.Zebra]

...
*/

HtmlTable = Class.refactor(HtmlTable, {

	options: {
		classZebra: 'table-tr-odd',
		zebra: true,
		zebraOnlyVisibleRows: true
	},

	initialize: function(){
		this.previous.apply(this, arguments);
		if (this.occluded) return this.occluded;
		if (this.options.zebra) this.updateZebras();
	},

	updateZebras: function(){
		var index = 0;
		Array.each(this.body.rows, function(row){
			if (!this.options.zebraOnlyVisibleRows || row.isDisplayed()){
				this.zebra(row, index++);
			}
		}, this);
	},

	setRowStyle: function(row, i){
		if (this.previous) this.previous(row, i);
		this.zebra(row, i);
	},

	zebra: function(row, i){
		return row[((i % 2) ? 'remove' : 'add')+'Class'](this.options.classZebra);
	},

	push: function(){
		var pushed = this.previous.apply(this, arguments);
		if (this.options.zebra) this.updateZebras();
		return pushed;
	}

});


/*
---

script: HtmlTable.Sort.js

name: HtmlTable.Sort

description: Builds a stripy, sortable table with methods to add rows.

license: MIT-style license

authors:
  - Harald Kirschner
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/Hash
  - /HtmlTable
  - /Class.refactor
  - /Element.Delegation
  - /String.Extras
  - /Date

provides: [HtmlTable.Sort]

...
*/

HtmlTable = Class.refactor(HtmlTable, {

	options: {/*
		onSort: function(){}, */
		sortIndex: 0,
		sortReverse: false,
		parsers: [],
		defaultParser: 'string',
		classSortable: 'table-sortable',
		classHeadSort: 'table-th-sort',
		classHeadSortRev: 'table-th-sort-rev',
		classNoSort: 'table-th-nosort',
		classGroupHead: 'table-tr-group-head',
		classGroup: 'table-tr-group',
		classCellSort: 'table-td-sort',
		classSortSpan: 'table-th-sort-span',
		sortable: false,
		thSelector: 'th'
	},

	initialize: function (){
		this.previous.apply(this, arguments);
		if (this.occluded) return this.occluded;
		this.sorted = {index: null, dir: 1};
		if (!this.bound) this.bound = {};
		this.bound.headClick = this.headClick.bind(this);
		this.sortSpans = new Elements();
		if (this.options.sortable){
			this.enableSort();
			if (this.options.sortIndex != null) this.sort(this.options.sortIndex, this.options.sortReverse);
		}
	},

	attachSorts: function(attach){
		this.detachSorts();
		if (attach !== false) this.element.addEvent('click:relay(' + this.options.thSelector + ')', this.bound.headClick);
	},

	detachSorts: function(){
		this.element.removeEvents('click:relay(' + this.options.thSelector + ')');
	},

	setHeaders: function(){
		this.previous.apply(this, arguments);
		if (this.sortEnabled) this.setParsers();
	},

	setParsers: function(){
		this.parsers = this.detectParsers();
	},

	detectParsers: function(){
		return this.head && this.head.getElements(this.options.thSelector).flatten().map(this.detectParser, this);
	},

	detectParser: function(cell, index){
		if (cell.hasClass(this.options.classNoSort) || cell.retrieve('htmltable-parser')) return cell.retrieve('htmltable-parser');
		var thDiv = new Element('div');
		thDiv.adopt(cell.childNodes).inject(cell);
		var sortSpan = new Element('span', {'class': this.options.classSortSpan}).inject(thDiv, 'top');
		this.sortSpans.push(sortSpan);
		var parser = this.options.parsers[index],
			rows = this.body.rows,
			cancel;
		switch (typeOf(parser)){
			case 'function': parser = {convert: parser}; cancel = true; break;
			case 'string': parser = parser; cancel = true; break;
		}
		if (!cancel){
			HtmlTable.ParserPriority.some(function(parserName){
				var current = HtmlTable.Parsers[parserName],
					match = current.match;
				if (!match) return false;
				for (var i = 0, j = rows.length; i < j; i++){
					var cell = document.id(rows[i].cells[index]),
						text = cell ? cell.get('html').clean() : '';
					if (text && match.test(text)){
						parser = current;
						return true;
					}
				}
			});
		}
		if (!parser) parser = this.options.defaultParser;
		cell.store('htmltable-parser', parser);
		return parser;
	},

	headClick: function(event, el){
		if (!this.head || el.hasClass(this.options.classNoSort)) return;
		return this.sort(Array.indexOf(this.head.getElements(this.options.thSelector).flatten(), el) % this.body.rows[0].cells.length);
	},

	serialize: function(){
		var previousSerialization = this.previous.apply(this, arguments) || {};
		if (this.options.sortable){
			previousSerialization.sortIndex = this.sorted.index;
			previousSerialization.sortReverse = this.sorted.reverse;
		}
		return previousSerialization;
	},

	restore: function(tableState){
		if(this.options.sortable && tableState.sortIndex){
			this.sort(tableState.sortIndex, tableState.sortReverse);
		}
		this.previous.apply(this, arguments);
	},

	setSortedState: function(index, reverse){
		if (reverse != null) this.sorted.reverse = reverse;
		else if (this.sorted.index == index) this.sorted.reverse = !this.sorted.reverse;
		else this.sorted.reverse = this.sorted.index == null;

		if (index != null) this.sorted.index = index;
	},

	setHeadSort: function(sorted){
		var head = $$(!this.head.length ? this.head.cells[this.sorted.index] : this.head.map(function(row){
			return row.getElements(this.options.thSelector)[this.sorted.index];
		}, this).clean());
		if (!head.length) return;
		if (sorted){
			head.addClass(this.options.classHeadSort);
			if (this.sorted.reverse) head.addClass(this.options.classHeadSortRev);
			else head.removeClass(this.options.classHeadSortRev);
		} else {
			head.removeClass(this.options.classHeadSort).removeClass(this.options.classHeadSortRev);
		}
	},

	setRowSort: function(data, pre){
		var count = data.length,
			body = this.body,
			group,
			rowIndex;

		while (count){
			var item = data[--count],
				position = item.position,
				row = body.rows[position];

			if (row.disabled) continue;
			if (!pre){
				group = this.setGroupSort(group, row, item);
				this.setRowStyle(row, count);
			}
			body.appendChild(row);

			for (rowIndex = 0; rowIndex < count; rowIndex++){
				if (data[rowIndex].position > position) data[rowIndex].position--;
			}
		}
	},

	setRowStyle: function(row, i){
		this.previous(row, i);
		row.cells[this.sorted.index].addClass(this.options.classCellSort);
	},

	setGroupSort: function(group, row, item){
		if (group == item.value) row.removeClass(this.options.classGroupHead).addClass(this.options.classGroup);
		else row.removeClass(this.options.classGroup).addClass(this.options.classGroupHead);
		return item.value;
	},

	getParser: function(){
		var parser = this.parsers[this.sorted.index];
		return typeOf(parser) == 'string' ? HtmlTable.Parsers[parser] : parser;
	},

	sort: function(index, reverse, pre){
		if (!this.head) return;

		if (!pre){
			this.clearSort();
			this.setSortedState(index, reverse);
			this.setHeadSort(true);
		}

		var parser = this.getParser();
		if (!parser) return;

		var rel;
		if (!Browser.ie){
			rel = this.body.getParent();
			this.body.dispose();
		}

		var data = this.parseData(parser).sort(function(a, b){
			if (a.value === b.value) return 0;
			return a.value > b.value ? 1 : -1;
		});

		if (this.sorted.reverse == (parser == HtmlTable.Parsers['input-checked'])) data.reverse(true);
		this.setRowSort(data, pre);

		if (rel) rel.grab(this.body);
		this.fireEvent('stateChanged');
		return this.fireEvent('sort', [this.body, this.sorted.index]);
	},

	parseData: function(parser){
		return Array.map(this.body.rows, function(row, i){
			var value = parser.convert.call(document.id(row.cells[this.sorted.index]));
			return {
				position: i,
				value: value
			};
		}, this);
	},

	clearSort: function(){
		this.setHeadSort(false);
		this.body.getElements('td').removeClass(this.options.classCellSort);
	},

	reSort: function(){
		if (this.sortEnabled) this.sort.call(this, this.sorted.index, this.sorted.reverse);
		return this;
	},

	enableSort: function(){
		this.element.addClass(this.options.classSortable);
		this.attachSorts(true);
		this.setParsers();
		this.sortEnabled = true;
		return this;
	},

	disableSort: function(){
		this.element.removeClass(this.options.classSortable);
		this.attachSorts(false);
		this.sortSpans.each(function(span){
			span.destroy();
		});
		this.sortSpans.empty();
		this.sortEnabled = false;
		return this;
	}

});

HtmlTable.ParserPriority = ['date', 'input-checked', 'input-value', 'float', 'number'];

HtmlTable.Parsers = {

	'date': {
		match: /^\d{2}[-\/ ]\d{2}[-\/ ]\d{2,4}$/,
		convert: function(){
			var d = Date.parse(this.get('text').stripTags());
			return (typeOf(d) == 'date') ? d.format('db') : '';
		},
		type: 'date'
	},
	'input-checked': {
		match: / type="(radio|checkbox)" /,
		convert: function(){
			return this.getElement('input').checked;
		}
	},
	'input-value': {
		match: /<input/,
		convert: function(){
			return this.getElement('input').value;
		}
	},
	'number': {
		match: /^\d+[^\d.,]*$/,
		convert: function(){
			return this.get('text').stripTags().toInt();
		},
		number: true
	},
	'numberLax': {
		match: /^[^\d]+\d+$/,
		convert: function(){
			return this.get('text').replace(/[^-?^0-9]/, '').stripTags().toInt();
		},
		number: true
	},
	'float': {
		match: /^[\d]+\.[\d]+/,
		convert: function(){
			return this.get('text').replace(/[^-?^\d.]/, '').stripTags().toFloat();
		},
		number: true
	},
	'floatLax': {
		match: /^[^\d]+[\d]+\.[\d]+$/,
		convert: function(){
			return this.get('text').replace(/[^-?^\d.]/, '').stripTags();
		},
		number: true
	},
	'string': {
		match: null,
		convert: function(){
			return this.get('text').stripTags().toLowerCase();
		}
	},
	'title': {
		match: null,
		convert: function(){
			return this.title;
		}
	}

};



HtmlTable.defineParsers = function(parsers){
	HtmlTable.Parsers = Object.append(HtmlTable.Parsers, parsers);
	for (var parser in parsers){
		HtmlTable.ParserPriority.unshift(parser);
	}
};


/*
---

script: Keyboard.js

name: Keyboard

description: KeyboardEvents used to intercept events on a class for keyboard and format modifiers in a specific order so as to make alt+shift+c the same as shift+alt+c.

license: MIT-style license

authors:
  - Perrin Westrich
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Element.Event.Pseudos.Keys

provides: [Keyboard]

...
*/

(function(){

	var Keyboard = this.Keyboard = new Class({

		Extends: Events,

		Implements: [Options],

		options: {/*
			onActivate: function(){},
			onDeactivate: function(){},*/
			defaultEventType: 'keydown',
			active: false,
			manager: null,
			events: {},
			nonParsedEvents: ['activate', 'deactivate', 'onactivate', 'ondeactivate', 'changed', 'onchanged']
		},

		initialize: function(options){
			if (options && options.manager){
				this._manager = options.manager;
				delete options.manager;
			}
			this.setOptions(options);
			this._setup();
		},

		addEvent: function(type, fn, internal){
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn, internal);
		},

		removeEvent: function(type, fn){
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn);
		},

		toggleActive: function(){
			return this[this.isActive() ? 'deactivate' : 'activate']();
		},

		activate: function(instance){
			if (instance){
				if (instance.isActive()) return this;
				//if we're stealing focus, store the last keyboard to have it so the relinquish command works
				if (this._activeKB && instance != this._activeKB){
					this.previous = this._activeKB;
					this.previous.fireEvent('deactivate');
				}
				//if we're enabling a child, assign it so that events are now passed to it
				this._activeKB = instance.fireEvent('activate');
				Keyboard.manager.fireEvent('changed');
			} else if (this._manager){
				//else we're enabling ourselves, we must ask our parent to do it for us
				this._manager.activate(this);
			}
			return this;
		},

		isActive: function(){
			return this._manager ? (this._manager._activeKB == this) : (Keyboard.manager == this);
		},

		deactivate: function(instance){
			if (instance){
				if (instance === this._activeKB){
					this._activeKB = null;
					instance.fireEvent('deactivate');
					Keyboard.manager.fireEvent('changed');
				}
			} else if (this._manager){
				this._manager.deactivate(this);
			}
			return this;
		},

		relinquish: function(){
			if (this.isActive() && this._manager && this._manager.previous) this._manager.activate(this._manager.previous);
			else this.deactivate();
			return this;
		},

		//management logic
		manage: function(instance){
			if (instance._manager) instance._manager.drop(instance);
			this._instances.push(instance);
			instance._manager = this;
			if (!this._activeKB) this.activate(instance);
			return this;
		},

		drop: function(instance){
			instance.relinquish();
			this._instances.erase(instance);
			if (this._activeKB == instance){
				if (this.previous && this._instances.contains(this.previous)) this.activate(this.previous);
				else this._activeKB = this._instances[0];
			}
			return this;
		},

		trace: function(){
			Keyboard.trace(this);
		},

		each: function(fn){
			Keyboard.each(this, fn);
		},

		/*
			PRIVATE METHODS
		*/

		_instances: [],

		_disable: function(instance){
			if (this._activeKB == instance) this._activeKB = null;
		},

		_setup: function(){
			this.addEvents(this.options.events);
			//if this is the root manager, nothing manages it
			if (Keyboard.manager && !this._manager) Keyboard.manager.manage(this);
			if (this.options.active) this.activate();
			else this.relinquish();
		},

		_handle: function(event, type){
			//Keyboard.stop(event) prevents key propagation
			if (event.preventKeyboardPropagation) return;

			var bubbles = !!this._manager;
			if (bubbles && this._activeKB){
				this._activeKB._handle(event, type);
				if (event.preventKeyboardPropagation) return;
			}
			this.fireEvent(type, event);

			if (!bubbles && this._activeKB) this._activeKB._handle(event, type);
		}

	});

	var parsed = {};
	var modifiers = ['shift', 'control', 'alt', 'meta'];
	var regex = /^(?:shift|control|ctrl|alt|meta)$/;

	Keyboard.parse = function(type, eventType, ignore){
		if (ignore && ignore.contains(type.toLowerCase())) return type;

		type = type.toLowerCase().replace(/^(keyup|keydown):/, function($0, $1){
			eventType = $1;
			return '';
		});

		if (!parsed[type]){
			var key, mods = {};
			type.split('+').each(function(part){
				if (regex.test(part)) mods[part] = true;
				else key = part;
			});

			mods.control = mods.control || mods.ctrl; // allow both control and ctrl

			var keys = [];
			modifiers.each(function(mod){
				if (mods[mod]) keys.push(mod);
			});

			if (key) keys.push(key);
			parsed[type] = keys.join('+');
		}

		return eventType + ':keys(' + parsed[type] + ')';
	};

	Keyboard.each = function(keyboard, fn){
		var current = keyboard || Keyboard.manager;
		while (current){
			fn.run(current);
			current = current._activeKB;
		}
	};

	Keyboard.stop = function(event){
		event.preventKeyboardPropagation = true;
	};

	Keyboard.manager = new Keyboard({
		active: true
	});

	Keyboard.trace = function(keyboard){
		keyboard = keyboard || Keyboard.manager;
		var hasConsole = window.console && console.log;
		if (hasConsole) console.log('the following items have focus: ');
		Keyboard.each(keyboard, function(current){
			if (hasConsole) console.log(document.id(current.widget) || current.wiget || current);
		});
	};

	var handler = function(event){
		var keys = [];
		modifiers.each(function(mod){
			if (event[mod]) keys.push(mod);
		});

		if (!regex.test(event.key)) keys.push(event.key);
		Keyboard.manager._handle(event, event.type + ':keys(' + keys.join('+') + ')');
	};

	document.addEvents({
		'keyup': handler,
		'keydown': handler
	});

})();


/*
---

script: Keyboard.Extras.js

name: Keyboard.Extras

description: Enhances Keyboard by adding the ability to name and describe keyboard shortcuts, and the ability to grab shortcuts by name and bind the shortcut to different keys.

license: MIT-style license

authors:
  - Perrin Westrich

requires:
  - /Keyboard
  - /MooTools.More

provides: [Keyboard.Extras]

...
*/
Keyboard.prototype.options.nonParsedEvents.combine(['rebound', 'onrebound']);

Keyboard.implement({

	/*
		shortcut should be in the format of:
		{
			'keys': 'shift+s', // the default to add as an event.
			'description': 'blah blah blah', // a brief description of the functionality.
			'handler': function(){} // the event handler to run when keys are pressed.
		}
	*/
	addShortcut: function(name, shortcut){
		this._shortcuts = this._shortcuts || [];
		this._shortcutIndex = this._shortcutIndex || {};

		shortcut.getKeyboard = Function.from(this);
		shortcut.name = name;
		this._shortcutIndex[name] = shortcut;
		this._shortcuts.push(shortcut);
		if (shortcut.keys) this.addEvent(shortcut.keys, shortcut.handler);
		return this;
	},

	addShortcuts: function(obj){
		for (var name in obj) this.addShortcut(name, obj[name]);
		return this;
	},

	removeShortcut: function(name){
		var shortcut = this.getShortcut(name);
		if (shortcut && shortcut.keys){
			this.removeEvent(shortcut.keys, shortcut.handler);
			delete this._shortcutIndex[name];
			this._shortcuts.erase(shortcut);
		}
		return this;
	},

	removeShortcuts: function(names){
		names.each(this.removeShortcut, this);
		return this;
	},

	getShortcuts: function(){
		return this._shortcuts || [];
	},

	getShortcut: function(name){
		return (this._shortcutIndex || {})[name];
	}

});

Keyboard.rebind = function(newKeys, shortcuts){
	Array.from(shortcuts).each(function(shortcut){
		shortcut.getKeyboard().removeEvent(shortcut.keys, shortcut.handler);
		shortcut.getKeyboard().addEvent(newKeys, shortcut.handler);
		shortcut.keys = newKeys;
		shortcut.getKeyboard().fireEvent('rebound');
	});
};


Keyboard.getActiveShortcuts = function(keyboard){
	var activeKBS = [], activeSCS = [];
	Keyboard.each(keyboard, [].push.bind(activeKBS));
	activeKBS.each(function(kb){ activeSCS.extend(kb.getShortcuts()); });
	return activeSCS;
};

Keyboard.getShortcut = function(name, keyboard, opts){
	opts = opts || {};
	var shortcuts = opts.many ? [] : null,
		set = opts.many ? function(kb){
				var shortcut = kb.getShortcut(name);
				if (shortcut) shortcuts.push(shortcut);
			} : function(kb){
				if (!shortcuts) shortcuts = kb.getShortcut(name);
			};
	Keyboard.each(keyboard, set);
	return shortcuts;
};

Keyboard.getShortcuts = function(name, keyboard){
	return Keyboard.getShortcut(name, keyboard, { many: true });
};


/*
---

script: HtmlTable.Select.js

name: HtmlTable.Select

description: Builds a stripy, sortable table with methods to add rows. Rows can be selected with the mouse or keyboard navigation.

license: MIT-style license

authors:
  - Harald Kirschner
  - Aaron Newton

requires:
  - /Keyboard
  - /Keyboard.Extras
  - /HtmlTable
  - /Class.refactor
  - /Element.Delegation
  - /Element.Shortcuts

provides: [HtmlTable.Select]

...
*/

HtmlTable = Class.refactor(HtmlTable, {

	options: {
		/*onRowFocus: function(){},
		onRowUnfocus: function(){},*/
		useKeyboard: true,
		classRowSelected: 'table-tr-selected',
		classRowHovered: 'table-tr-hovered',
		classSelectable: 'table-selectable',
		shiftForMultiSelect: true,
		allowMultiSelect: true,
		selectable: false,
		selectHiddenRows: false
	},

	initialize: function(){
		this.previous.apply(this, arguments);
		if (this.occluded) return this.occluded;

		this.selectedRows = new Elements();

		if (!this.bound) this.bound = {};
		this.bound.mouseleave = this.mouseleave.bind(this);
		this.bound.clickRow = this.clickRow.bind(this);
		this.bound.activateKeyboard = function(){
			if (this.keyboard && this.selectEnabled) this.keyboard.activate();
		}.bind(this);

		if (this.options.selectable) this.enableSelect();
	},

	empty: function(){
		this.selectNone();
		return this.previous();
	},

	enableSelect: function(){
		this.selectEnabled = true;
		this.attachSelects();
		this.element.addClass(this.options.classSelectable);
		return this;
	},

	disableSelect: function(){
		this.selectEnabled = false;
		this.attachSelects(false);
		this.element.removeClass(this.options.classSelectable);
		return this;
	},

	push: function(){
		var ret = this.previous.apply(this, arguments);
		this.updateSelects();
		return ret;
	},

	toggleRow: function(row){
		return this[(this.isSelected(row) ? 'de' : '') + 'selectRow'](row);
	},

	selectRow: function(row, _nocheck){
		//private variable _nocheck: boolean whether or not to confirm the row is in the table body
		//added here for optimization when selecting ranges
		if (this.isSelected(row) || (!_nocheck && !this.body.getChildren().contains(row))) return;
		if (!this.options.allowMultiSelect) this.selectNone();

		if (!this.isSelected(row)){
			this.selectedRows.push(row);
			row.addClass(this.options.classRowSelected);
			this.fireEvent('rowFocus', [row, this.selectedRows]);
			this.fireEvent('stateChanged');
		}

		this.focused = row;
		document.clearSelection();

		return this;
	},

	isSelected: function(row){
		return this.selectedRows.contains(row);
	},

	getSelected: function(){
		return this.selectedRows;
	},

	getSelected: function(){
		return this.selectedRows;
	},

	serialize: function(){
		var previousSerialization = this.previous.apply(this, arguments) || {};
		if (this.options.selectable){
			previousSerialization.selectedRows = this.selectedRows.map(function(row){
				return Array.indexOf(this.body.rows, row);
			}.bind(this));
		}
		return previousSerialization;
	},

	restore: function(tableState){
		if(this.options.selectable && tableState.selectedRows){
			tableState.selectedRows.each(function(index){
				this.selectRow(this.body.rows[index]);
			}.bind(this));
		}
		this.previous.apply(this, arguments);
	},

	deselectRow: function(row, _nocheck){
		if (!this.isSelected(row) || (!_nocheck && !this.body.getChildren().contains(row))) return;

		this.selectedRows = new Elements(Array.from(this.selectedRows).erase(row));
		row.removeClass(this.options.classRowSelected);
		this.fireEvent('rowUnfocus', [row, this.selectedRows]);
		this.fireEvent('stateChanged');
		return this;
	},

	selectAll: function(selectNone){
		if (!selectNone && !this.options.allowMultiSelect) return;
		this.selectRange(0, this.body.rows.length, selectNone);
		return this;
	},

	selectNone: function(){
		return this.selectAll(true);
	},

	selectRange: function(startRow, endRow, _deselect){
		if (!this.options.allowMultiSelect && !_deselect) return;
		var method = _deselect ? 'deselectRow' : 'selectRow',
			rows = Array.clone(this.body.rows);

		if (typeOf(startRow) == 'element') startRow = rows.indexOf(startRow);
		if (typeOf(endRow) == 'element') endRow = rows.indexOf(endRow);
		endRow = endRow < rows.length - 1 ? endRow : rows.length - 1;

		if (endRow < startRow){
			var tmp = startRow;
			startRow = endRow;
			endRow = tmp;
		}

		for (var i = startRow; i <= endRow; i++){
			if (this.options.selectHiddenRows || rows[i].isDisplayed()) this[method](rows[i], true);
		}

		return this;
	},

	deselectRange: function(startRow, endRow){
		this.selectRange(startRow, endRow, true);
	},

	getSelected: function(){
		return this.selectedRows;
	},

/*
	Private methods:
*/

	enterRow: function(row){
		if (this.hovered) this.hovered = this.leaveRow(this.hovered);
		this.hovered = row.addClass(this.options.classRowHovered);
	},

	leaveRow: function(row){
		row.removeClass(this.options.classRowHovered);
	},

	updateSelects: function(){
		Array.each(this.body.rows, function(row){
			var binders = row.retrieve('binders');
			if (!binders && !this.selectEnabled) return;
			if (!binders){
				binders = {
					mouseenter: this.enterRow.pass([row], this),
					mouseleave: this.leaveRow.pass([row], this)
				};
				row.store('binders', binders);
			}
			if (this.selectEnabled) row.addEvents(binders);
			else row.removeEvents(binders);
		}, this);
	},

	shiftFocus: function(offset, event){
		if (!this.focused) return this.selectRow(this.body.rows[0], event);
		var to = this.getRowByOffset(offset, this.options.selectHiddenRows);
		if (to === null || this.focused == this.body.rows[to]) return this;
		this.toggleRow(this.body.rows[to], event);
	},

	clickRow: function(event, row){
		var selecting = (event.shift || event.meta || event.control) && this.options.shiftForMultiSelect;
		if (!selecting && !(event.rightClick && this.isSelected(row) && this.options.allowMultiSelect)) this.selectNone();

		if (event.rightClick) this.selectRow(row);
		else this.toggleRow(row);

		if (event.shift){
			this.selectRange(this.rangeStart || this.body.rows[0], row, this.rangeStart ? !this.isSelected(row) : true);
			this.focused = row;
		}
		this.rangeStart = row;
	},

	getRowByOffset: function(offset, includeHiddenRows){
		if (!this.focused) return 0;
		var index = Array.indexOf(this.body.rows, this.focused);
		if ((index == 0 && offset < 0) || (index == this.body.rows.length -1 && offset > 0)) return null;
		if (includeHiddenRows){
			index += offset;
		} else {
			var limit = 0,
			    count = 0;
			if (offset > 0){
				while (count < offset && index < this.body.rows.length -1){
					if (this.body.rows[++index].isDisplayed()) count++;
				}
			} else {
				while (count > offset && index > 0){
					if (this.body.rows[--index].isDisplayed()) count--;
				}
			}
		}
		return index;
	},

	attachSelects: function(attach){
		attach = attach != null ? attach : true;

		var method = attach ? 'addEvents' : 'removeEvents';
		this.element[method]({
			mouseleave: this.bound.mouseleave,
			click: this.bound.activateKeyboard
		});

		this.body[method]({
			'click:relay(tr)': this.bound.clickRow,
			'contextmenu:relay(tr)': this.bound.clickRow
		});

		if (this.options.useKeyboard || this.keyboard){
			if (!this.keyboard) this.keyboard = new Keyboard();
			if (!this.selectKeysDefined){
				this.selectKeysDefined = true;
				var timer, held;

				var move = function(offset){
					var mover = function(e){
						clearTimeout(timer);
						e.preventDefault();
						var to = this.body.rows[this.getRowByOffset(offset, this.options.selectHiddenRows)];
						if (e.shift && to && this.isSelected(to)){
							this.deselectRow(this.focused);
							this.focused = to;
						} else {
							if (to && (!this.options.allowMultiSelect || !e.shift)){
								this.selectNone();
							}
							this.shiftFocus(offset, e);
						}

						if (held){
							timer = mover.delay(100, this, e);
						} else {
							timer = (function(){
								held = true;
								mover(e);
							}).delay(400);
						}
					}.bind(this);
					return mover;
				}.bind(this);

				var clear = function(){
					clearTimeout(timer);
					held = false;
				};

				this.keyboard.addEvents({
					'keydown:shift+up': move(-1),
					'keydown:shift+down': move(1),
					'keyup:shift+up': clear,
					'keyup:shift+down': clear,
					'keyup:up': clear,
					'keyup:down': clear
				});

				var shiftHint = '';
				if (this.options.allowMultiSelect && this.options.shiftForMultiSelect && this.options.useKeyboard){
					shiftHint = " (Shift multi-selects).";
				}

				this.keyboard.addShortcuts({
					'Select Previous Row': {
						keys: 'up',
						shortcut: 'up arrow',
						handler: move(-1),
						description: 'Select the previous row in the table.' + shiftHint
					},
					'Select Next Row': {
						keys: 'down',
						shortcut: 'down arrow',
						handler: move(1),
						description: 'Select the next row in the table.' + shiftHint
					}
				});

			}
			this.keyboard[attach ? 'activate' : 'deactivate']();
		}
		this.updateSelects();
	},

	mouseleave: function(){
		if (this.hovered) this.leaveRow(this.hovered);
	}

});


/*
---

script: Scroller.js

name: Scroller

description: Class which scrolls the contents of any Element (including the window) when the mouse reaches the Element's boundaries.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Core/Element.Dimensions
  - MooTools.More

provides: [Scroller]

...
*/

var Scroller = new Class({

	Implements: [Events, Options],

	options: {
		area: 20,
		velocity: 1,
		onChange: function(x, y){
			this.element.scrollTo(x, y);
		},
		fps: 50
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.docBody = document.id(this.element.getDocument().body);
		this.listener = (typeOf(this.element) != 'element') ? this.docBody : this.element;
		this.timer = null;
		this.bound = {
			attach: this.attach.bind(this),
			detach: this.detach.bind(this),
			getCoords: this.getCoords.bind(this)
		};
	},

	start: function(){
		this.listener.addEvents({
			mouseover: this.bound.attach,
			mouseleave: this.bound.detach
		});
		return this;
	},

	stop: function(){
		this.listener.removeEvents({
			mouseover: this.bound.attach,
			mouseleave: this.bound.detach
		});
		this.detach();
		this.timer = clearInterval(this.timer);
		return this;
	},

	attach: function(){
		this.listener.addEvent('mousemove', this.bound.getCoords);
	},

	detach: function(){
		this.listener.removeEvent('mousemove', this.bound.getCoords);
		this.timer = clearInterval(this.timer);
	},

	getCoords: function(event){
		this.page = (this.listener.get('tag') == 'body') ? event.client : event.page;
		if (!this.timer) this.timer = this.scroll.periodical(Math.round(1000 / this.options.fps), this);
	},

	scroll: function(){
		var size = this.element.getSize(),
			scroll = this.element.getScroll(),
			pos = this.element != this.docBody ? this.element.getOffsets() : {x: 0, y:0},
			scrollSize = this.element.getScrollSize(),
			change = {x: 0, y: 0},
			top = this.options.area.top || this.options.area,
			bottom = this.options.area.bottom || this.options.area;
		for (var z in this.page){
			if (this.page[z] < (top + pos[z]) && scroll[z] != 0){
				change[z] = (this.page[z] - top - pos[z]) * this.options.velocity;
			} else if (this.page[z] + bottom > (size[z] + pos[z]) && scroll[z] + size[z] != scrollSize[z]){
				change[z] = (this.page[z] - size[z] + bottom - pos[z]) * this.options.velocity;
			}
			change[z] = change[z].round();
		}
		if (change.y || change.x) this.fireEvent('change', [scroll.x + change.x, scroll.y + change.y]);
	}

});


/*
---

script: Tips.js

name: Tips

description: Class for creating nice tips that follow the mouse cursor when hovering an element.

license: MIT-style license

authors:
  - Valerio Proietti
  - Christoph Pojer
  - Luis Merino

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Tips]

...
*/

(function(){

var read = function(option, element){
	return (option) ? (typeOf(option) == 'function' ? option(element) : element.get(option)) : '';
};

this.Tips = new Class({

	Implements: [Events, Options],

	options: {/*
		id: null,
		onAttach: function(element){},
		onDetach: function(element){},
		onBound: function(coords){},*/
		onShow: function(){
			this.tip.setStyle('display', 'block');
		},
		onHide: function(){
			this.tip.setStyle('display', 'none');
		},
		title: 'title',
		text: function(element){
			return element.get('rel') || element.get('href');
		},
		showDelay: 100,
		hideDelay: 100,
		className: 'tip-wrap',
		offset: {x: 16, y: 16},
		windowPadding: {x:0, y:0},
		fixed: false,
		waiAria: true
	},

	initialize: function(){
		var params = Array.link(arguments, {
			options: Type.isObject,
			elements: function(obj){
				return obj != null;
			}
		});
		this.setOptions(params.options);
		if (params.elements) this.attach(params.elements);
		this.container = new Element('div', {'class': 'tip'});

		if (this.options.id){
			this.container.set('id', this.options.id);
			if (this.options.waiAria) this.attachWaiAria();
		}
	},

	toElement: function(){
		if (this.tip) return this.tip;

		this.tip = new Element('div', {
			'class': this.options.className,
			styles: {
				position: 'absolute',
				top: 0,
				left: 0
			}
		}).adopt(
			new Element('div', {'class': 'tip-top'}),
			this.container,
			new Element('div', {'class': 'tip-bottom'})
		);

		return this.tip;
	},

	attachWaiAria: function(){
		var id = this.options.id;
		this.container.set('role', 'tooltip');

		if (!this.waiAria){
			this.waiAria = {
				show: function(element){
					if (id) element.set('aria-describedby', id);
					this.container.set('aria-hidden', 'false');
				},
				hide: function(element){
					if (id) element.erase('aria-describedby');
					this.container.set('aria-hidden', 'true');
				}
			};
		}
		this.addEvents(this.waiAria);
	},

	detachWaiAria: function(){
		if (this.waiAria){
			this.container.erase('role');
			this.container.erase('aria-hidden');
			this.removeEvents(this.waiAria);
		}
	},

	attach: function(elements){
		$$(elements).each(function(element){
			var title = read(this.options.title, element),
				text = read(this.options.text, element);

			element.set('title', '').store('tip:native', title).retrieve('tip:title', title);
			element.retrieve('tip:text', text);
			this.fireEvent('attach', [element]);

			var events = ['enter', 'leave'];
			if (!this.options.fixed) events.push('move');

			events.each(function(value){
				var event = element.retrieve('tip:' + value);
				if (!event) event = function(event){
					this['element' + value.capitalize()].apply(this, [event, element]);
				}.bind(this);

				element.store('tip:' + value, event).addEvent('mouse' + value, event);
			}, this);
		}, this);

		return this;
	},

	detach: function(elements){
		$$(elements).each(function(element){
			['enter', 'leave', 'move'].each(function(value){
				element.removeEvent('mouse' + value, element.retrieve('tip:' + value)).eliminate('tip:' + value);
			});

			this.fireEvent('detach', [element]);

			if (this.options.title == 'title'){ // This is necessary to check if we can revert the title
				var original = element.retrieve('tip:native');
				if (original) element.set('title', original);
			}
		}, this);

		return this;
	},

	elementEnter: function(event, element){
		clearTimeout(this.timer);
		this.timer = (function(){
			this.container.empty();

			['title', 'text'].each(function(value){
				var content = element.retrieve('tip:' + value);
				var div = this['_' + value + 'Element'] = new Element('div', {
						'class': 'tip-' + value
					}).inject(this.container);
				if (content) this.fill(div, content);
			}, this);
			this.show(element);
			this.position((this.options.fixed) ? {page: element.getPosition()} : event);
		}).delay(this.options.showDelay, this);
	},

	elementLeave: function(event, element){
		clearTimeout(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this, element);
		this.fireForParent(event, element);
	},

	setTitle: function(title){
		if (this._titleElement){
			this._titleElement.empty();
			this.fill(this._titleElement, title);
		}
		return this;
	},

	setText: function(text){
		if (this._textElement){
			this._textElement.empty();
			this.fill(this._textElement, text);
		}
		return this;
	},

	fireForParent: function(event, element){
		element = element.getParent();
		if (!element || element == document.body) return;
		if (element.retrieve('tip:enter')) element.fireEvent('mouseenter', event);
		else this.fireForParent(event, element);
	},

	elementMove: function(event, element){
		this.position(event);
	},

	position: function(event){
		if (!this.tip) document.id(this);

		var size = window.getSize(), scroll = window.getScroll(),
			tip = {x: this.tip.offsetWidth, y: this.tip.offsetHeight},
			props = {x: 'left', y: 'top'},
			bounds = {y: false, x2: false, y2: false, x: false},
			obj = {};

		for (var z in props){
			obj[props[z]] = event.page[z] + this.options.offset[z];
			if (obj[props[z]] < 0) bounds[z] = true;
			if ((obj[props[z]] + tip[z] - scroll[z]) > size[z] - this.options.windowPadding[z]){
				obj[props[z]] = event.page[z] - this.options.offset[z] - tip[z];
				bounds[z+'2'] = true;
			}
		}

		this.fireEvent('bound', bounds);
		this.tip.setStyles(obj);
	},

	fill: function(element, contents){
		if (typeof contents == 'string') element.set('html', contents);
		else element.adopt(contents);
	},

	show: function(element){
		if (!this.tip) document.id(this);
		if (!this.tip.getParent()) this.tip.inject(document.body);
		this.fireEvent('show', [this.tip, element]);
	},

	hide: function(element){
		if (!this.tip) document.id(this);
		this.fireEvent('hide', [this.tip, element]);
	}

});

})();


/*
---

script: Locale.Set.From.js

name: Locale.Set.From

description: Provides an alternative way to create Locale.Set objects.

license: MIT-style license

authors:
  - Tim Wienk

requires:
  - Core/JSON
  - /Locale

provides: Locale.Set.From

...
*/

(function(){

var parsers = {
	'json': JSON.decode
};

Locale.Set.defineParser = function(name, fn){
	parsers[name] = fn;
};

Locale.Set.from = function(set, type){
	if (instanceOf(set, Locale.Set)) return set;

	if (!type && typeOf(set) == 'string') type = 'json';
	if (parsers[type]) set = parsers[type](set);

	var locale = new Locale.Set;

	locale.sets = set.sets || {};

	if (set.inherits){
		locale.inherits.locales = Array.from(set.inherits.locales);
		locale.inherits.sets = set.inherits.sets || {};
	}

	return locale;
};

})();


/*
---

name: Locale.ar.Date

description: Date messages for Arabic.

license: MIT-style license

authors:
  - Chafik Barbar

requires:
  - /Locale

provides: [Locale.ar.Date]

...
*/

Locale.define('ar', 'Date', {

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M'

});


/*
---

name: Locale.ar.Form.Validator

description: Form Validator messages for Arabic.

license: MIT-style license

authors:
  - Chafik Barbar

requires:
  - /Locale

provides: [Locale.ar.Form.Validator]

...
*/

Locale.define('ar', 'FormValidator', {

	required: 'Ů‡Ř°Ř§ Ř§Ů„Ř­Ů‚Ů„ Ů…Ř·Ů„Ů�Ř¨.',
	minLength: 'Ř±Ř¬Ř§ŘˇŮ‹ ŘĄŘŻŘ®Ř§Ů„ {minLength} ŘŁŘ­Ř±Ů� ŘąŮ„Ů‰ Ř§Ů„ŘŁŮ‚Ů„ (ŘŞŮ… ŘĄŘŻŘ®Ř§Ů„ {length} ŘŁŘ­Ř±Ů�).',
	maxLength: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘąŘŻŮ… ŘĄŘŻŘ®Ř§Ů„ ŘŁŮ�Ř«Ř± Ů…Ů† {maxLength} ŘŁŘ­Ř±Ů� (ŘŞŮ… ŘĄŘŻŘ®Ř§Ů„ {length} ŘŁŘ­Ř±Ů�).',
	integer: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ ŘąŘŻŘŻ ŘµŘ­ŮŠŘ­ Ů�ŮŠ Ů‡Ř°Ř§ Ř§Ů„Ř­Ů‚Ů„. ŘŁŮŠ Ř±Ů‚Ů… Ř°Ů� Ů�ŘłŘ± ŘąŘ´Ř±ŮŠ ŘŁŮ� Ů…Ř¦Ů�ŮŠ (Ů…Ř«Ř§Ů„ 1.25 ) ŘşŮŠŘ± Ů…ŘłŮ…Ů�Ř­.',
	numeric: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ Ů‚ŮŠŮ… Ř±Ů‚Ů…ŮŠŘ© Ů�ŮŠ Ů‡Ř°Ř§ Ř§Ů„Ř­Ů‚Ů„ (Ů…Ř«Ř§Ů„ "1" ŘŁŮ� "1.1" ŘŁŮ� "-1" ŘŁŮ� "-1.1").',
	digits: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘŁŘłŘŞŘ®ŘŻŘ§Ů… Ů‚ŮŠŮ… Ř±Ů‚Ů…ŮŠŘ© Ů�ŘąŮ„Ř§Ů…Ř§ŘŞ ŘŞŘ±Ů‚ŮŠŮ…ŮŠŘ© Ů�Ů‚Ř· Ů�ŮŠ Ů‡Ř°Ř§ Ř§Ů„Ř­Ů‚Ů„ (Ů…Ř«Ř§Ů„, Ř±Ů‚Ů… Ů‡Ř§ŘŞŮ� Ů…Řą Ů†Ů‚Ř·Ř© ŘŁŮ� Ř´Ř­Ř·Ř©)',
	alpha: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘŁŘłŘŞŘ®ŘŻŘ§Ů… ŘŁŘ­Ř±Ů� Ů�Ů‚Ř· (Ř§-ŮŠ) Ů�ŮŠ Ů‡Ř°Ř§ Ř§Ů„Ř­Ů‚Ů„. ŘŁŮŠ Ů�Ř±Ř§ŘşŘ§ŘŞ ŘŁŮ� ŘąŮ„Ř§Ů…Ř§ŘŞ ŘşŮŠŘ± Ů…ŘłŮ…Ů�Ř­Ř©.',
	alphanum: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘŁŘłŘŞŘ®ŘŻŘ§Ů… ŘŁŘ­Ř±Ů� Ů�Ů‚Ř· (Ř§-ŮŠ) ŘŁŮ� ŘŁŘ±Ů‚Ř§Ů… (0-9) Ů�Ů‚Ř· Ů�ŮŠ Ů‡Ř°Ř§ Ř§Ů„Ř­Ů‚Ů„. ŘŁŮŠ Ů�Ř±Ř§ŘşŘ§ŘŞ ŘŁŮ� ŘąŮ„Ř§Ů…Ř§ŘŞ ŘşŮŠŘ± Ů…ŘłŮ…Ů�Ř­Ř©.',
	dateSuchAs: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ ŘŞŘ§Ř±ŮŠŘ® ŘµŘ­ŮŠŘ­ Ů�Ř§Ů„ŘŞŘ§Ů„ŮŠ {date}',
	dateInFormatMDY: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ ŘŞŘ§Ř±ŮŠŘ® ŘµŘ­ŮŠŘ­ (Ů…Ř«Ř§Ů„, 31-12-1999)',
	email: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ Ř¨Ř±ŮŠŘŻ ŘĄŮ„Ů�ŘŞŘ±Ů�Ů†ŮŠ ŘµŘ­ŮŠŘ­.',
	url: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ ŘąŮ†Ů�Ř§Ů† ŘĄŮ„Ů�ŘŞŘ±Ů�Ů†ŮŠ ŘµŘ­ŮŠŘ­ Ů…Ř«Ů„ http://www.example.com',
	currencyDollar: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ Ů‚ŮŠŮ…Ř© $ ŘµŘ­ŮŠŘ­Ř©. Ů…Ř«Ř§Ů„, 100.00$',
	oneRequired: 'Ř§Ů„Ř±Ř¬Ř§Řˇ ŘĄŘŻŘ®Ř§Ů„ Ů‚ŮŠŮ…Ř© Ů�ŮŠ ŘŁŘ­ŘŻ Ů‡Ř°Ů‡ Ř§Ů„Ř­Ů‚Ů�Ů„ ŘąŮ„Ů‰ Ř§Ů„ŘŁŮ‚Ů„.',
	errorPrefix: 'Ř®Ř·ŘŁ: ',
	warningPrefix: 'ŘŞŘ­Ř°ŮŠŘ±: '

});


/*
---

name: Locale.ca-CA.Date

description: Date messages for Catalan.

license: MIT-style license

authors:
  - Ă�lfons Sanchez

requires:
  - /Locale

provides: [Locale.ca-CA.Date]

...
*/

Locale.define('ca-CA', 'Date', {

	months: ['Gener', 'Febrer', 'MarĂ§', 'Abril', 'Maig', 'Juny', 'Juli', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
	months_abbr: ['gen.', 'febr.', 'marĂ§', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'],
	days: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
	days_abbr: ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'],

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'fa menys d`un minut',
	minuteAgo: 'fa un minut',
	minutesAgo: 'fa {delta} minuts',
	hourAgo: 'fa un hora',
	hoursAgo: 'fa unes {delta} hores',
	dayAgo: 'fa un dia',
	daysAgo: 'fa {delta} dies',

	lessThanMinuteUntil: 'menys d`un minut des d`ara',
	minuteUntil: 'un minut des d`ara',
	minutesUntil: '{delta} minuts des d`ara',
	hourUntil: 'un hora des d`ara',
	hoursUntil: 'unes {delta} hores des d`ara',
	dayUntil: '1 dia des d`ara',
	daysUntil: '{delta} dies des d`ara'

});


/*
---

name: Locale.ca-CA.Form.Validator

description: Form Validator messages for Catalan.

license: MIT-style license

authors:
  - Miquel Hudin
  - Ă�lfons Sanchez

requires:
  - /Locale

provides: [Locale.ca-CA.Form.Validator]

...
*/

Locale.define('ca-CA', 'FormValidator', {

	required: 'Aquest camp es obligatori.',
	minLength: 'Per favor introdueix al menys {minLength} caracters (has introduit {length} caracters).',
	maxLength: 'Per favor introdueix no mes de {maxLength} caracters (has introduit {length} caracters).',
	integer: 'Per favor introdueix un nombre enter en aquest camp. Nombres amb decimals (p.e. 1,25) no estan permesos.',
	numeric: 'Per favor introdueix sols valors numerics en aquest camp (p.e. "1" o "1,1" o "-1" o "-1,1").',
	digits: 'Per favor usa sols numeros i puntuacio en aquest camp (per exemple, un nombre de telefon amb guions i punts no esta permes).',
	alpha: 'Per favor utilitza lletres nomes (a-z) en aquest camp. No sÂ´admiteixen espais ni altres caracters.',
	alphanum: 'Per favor, utilitza nomes lletres (a-z) o numeros (0-9) en aquest camp. No sÂ´admiteixen espais ni altres caracters.',
	dateSuchAs: 'Per favor introdueix una data valida com {date}',
	dateInFormatMDY: 'Per favor introdueix una data valida com DD/MM/YYYY (p.e. "31/12/1999")',
	email: 'Per favor, introdueix una adreĂ§a de correu electronic valida. Per exemple, "fred@domain.com".',
	url: 'Per favor introdueix una URL valida com http://www.example.com.',
	currencyDollar: 'Per favor introdueix una quantitat valida de â‚¬. Per exemple â‚¬100,00 .',
	oneRequired: 'Per favor introdueix alguna cosa per al menys una dÂ´aquestes entrades.',
	errorPrefix: 'Error: ',
	warningPrefix: 'Avis: ',

	// Form.Validator.Extras
	noSpace: 'No poden haver espais en aquesta entrada.',
	reqChkByNode: 'No hi han elements seleccionats.',
	requiredChk: 'Aquest camp es obligatori.',
	reqChkByName: 'Per favor selecciona una {label}.',
	match: 'Aquest camp necessita coincidir amb el camp {matchName}',
	startDate: 'la data de inici',
	endDate: 'la data de fi',
	currendDate: 'la data actual',
	afterDate: 'La data deu ser igual o posterior a {label}.',
	beforeDate: 'La data deu ser igual o anterior a {label}.',
	startMonth: 'Per favor selecciona un mes dÂ´orige',
	sameMonth: 'Aquestes dos dates deuen estar dins del mateix mes - deus canviar una o altra.'

});


/*
---

name: Locale.cs-CZ.Date

description: Date messages for Czech.

license: MIT-style license

authors:
  - Jan ÄŚernĂ˝ chemiX
  - Christopher Zukowski

requires:
  - /Locale

provides: [Locale.cs-CZ.Date]

...
*/
(function(){

// Czech language pluralization rules, see http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
// one -> n is 1;            1
// few -> n in 2..4;         2-4
// other -> everything else  0, 5-999, 1.31, 2.31, 5.31...
var pluralize = function (n, one, few, other){
	if (n == 1) return one;
	else if (n == 2 || n == 3 || n == 4) return few;
	else return other;
};

Locale.define('cs-CZ', 'Date', {

	months: ['Leden', 'Ăšnor', 'BĹ™ezen', 'Duben', 'KvÄ›ten', 'ÄŚerven', 'ÄŚervenec', 'Srpen', 'ZĂˇĹ™Ă­', 'Ĺ�Ă­jen', 'Listopad', 'Prosinec'],
	months_abbr: ['ledna', 'Ăşnora', 'bĹ™ezna', 'dubna', 'kvÄ›tna', 'ÄŤervna', 'ÄŤervence', 'srpna', 'zĂˇĹ™Ă­', 'Ĺ™Ă­jna', 'listopadu', 'prosince'],
	days: ['NedÄ›le', 'PondÄ›lĂ­', 'ĂšterĂ˝', 'StĹ™eda', 'ÄŚtvrtek', 'PĂˇtek', 'Sobota'],
	days_abbr: ['ne', 'po', 'Ăşt', 'st', 'ÄŤt', 'pĂˇ', 'so'],

	// Culture's date order: DD.MM.YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d.%m.%Y',
	shortTime: '%H:%M',
	AM: 'dop.',
	PM: 'odp.',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '.',

	lessThanMinuteAgo: 'pĹ™ed chvĂ­lĂ­',
	minuteAgo: 'pĹ™ibliĹľnÄ› pĹ™ed minutou',
	minutesAgo: function(delta){ return 'pĹ™ed {delta} ' + pluralize(delta, 'minutou', 'minutami', 'minutami'); },
	hourAgo: 'pĹ™ibliĹľnÄ› pĹ™ed hodinou',
	hoursAgo: function(delta){ return 'pĹ™ed {delta} ' + pluralize(delta, 'hodinou', 'hodinami', 'hodinami'); },
	dayAgo: 'pĹ™ed dnem',
	daysAgo: function(delta){ return 'pĹ™ed {delta} ' + pluralize(delta, 'dnem', 'dny', 'dny'); },
	weekAgo: 'pĹ™ed tĂ˝dnem',
	weeksAgo: function(delta){ return 'pĹ™ed {delta} ' + pluralize(delta, 'tĂ˝dnem', 'tĂ˝dny', 'tĂ˝dny'); },
	monthAgo: 'pĹ™ed mÄ›sĂ­cem',
	monthsAgo: function(delta){ return 'pĹ™ed {delta} ' + pluralize(delta, 'mÄ›sĂ­cem', 'mÄ›sĂ­ci', 'mÄ›sĂ­ci'); },
	yearAgo: 'pĹ™ed rokem',
	yearsAgo: function(delta){ return 'pĹ™ed {delta} ' + pluralize(delta, 'rokem', 'lety', 'lety'); },

	lessThanMinuteUntil: 'za chvĂ­li',
	minuteUntil: 'pĹ™ibliĹľnÄ› za minutu',
	minutesUntil: function(delta){ return 'za {delta} ' + pluralize(delta, 'minutu', 'minuty', 'minut'); },
	hourUntil: 'pĹ™ibliĹľnÄ› za hodinu',
	hoursUntil: function(delta){ return 'za {delta} ' + pluralize(delta, 'hodinu', 'hodiny', 'hodin'); },
	dayUntil: 'za den',
	daysUntil: function(delta){ return 'za {delta} ' + pluralize(delta, 'den', 'dny', 'dnĹŻ'); },
	weekUntil: 'za tĂ˝den',
	weeksUntil: function(delta){ return 'za {delta} ' + pluralize(delta, 'tĂ˝den', 'tĂ˝dny', 'tĂ˝dnĹŻ'); },
	monthUntil: 'za mÄ›sĂ­c',
	monthsUntil: function(delta){ return 'za {delta} ' + pluralize(delta, 'mÄ›sĂ­c', 'mÄ›sĂ­ce', 'mÄ›sĂ­cĹŻ'); },
	yearUntil: 'za rok',
	yearsUntil: function(delta){ return 'za {delta} ' + pluralize(delta, 'rok', 'roky', 'let'); }
});

})();


/*
---

name: Locale.cs-CZ.Form.Validator

description: Form Validator messages for Czech.

license: MIT-style license

authors:
  - Jan ÄŚernĂ˝ chemiX

requires:
  - /Locale

provides: [Locale.cs-CZ.Form.Validator]

...
*/

Locale.define('cs-CZ', 'FormValidator', {

	required: 'Tato poloĹľka je povinnĂˇ.',
	minLength: 'Zadejte prosĂ­m alespoĹ� {minLength} znakĹŻ (napsĂˇno {length} znakĹŻ).',
	maxLength: 'Zadejte prosĂ­m mĂ©nÄ› neĹľ {maxLength} znakĹŻ (nĂˇpsĂˇno {length} znakĹŻ).',
	integer: 'Zadejte prosĂ­m celĂ© ÄŤĂ­slo. DesetinnĂˇ ÄŤĂ­sla (napĹ™. 1.25) nejsou povolena.',
	numeric: 'Zadejte jen ÄŤĂ­selnĂ© hodnoty (tj. "1" nebo "1.1" nebo "-1" nebo "-1.1").',
	digits: 'Zadejte prosĂ­m pouze ÄŤĂ­sla a interpunkÄŤnĂ­ znamĂ©nka(napĹ™Ă­klad telefonnĂ­ ÄŤĂ­slo s pomlÄŤkami nebo teÄŤkami je povoleno).',
	alpha: 'Zadejte prosĂ­m pouze pĂ­smena (a-z). Mezery nebo jinĂ© znaky nejsou povoleny.',
	alphanum: 'Zadejte prosĂ­m pouze pĂ­smena (a-z) nebo ÄŤĂ­slice (0-9). Mezery nebo jinĂ© znaky nejsou povoleny.',
	dateSuchAs: 'Zadejte prosĂ­m platnĂ© datum jako {date}',
	dateInFormatMDY: 'Zadejte prosĂ­m platnĂ© datum jako MM / DD / RRRR (tj. "12/31/1999")',
	email: 'Zadejte prosĂ­m platnou e-mailovou adresu. NapĹ™Ă­klad "fred@domain.com".',
	url: 'Zadejte prosĂ­m platnou URL adresu jako http://www.example.com.',
	currencyDollar: 'Zadejte prosĂ­m platnou ÄŤĂˇstku. NapĹ™Ă­klad $100.00.',
	oneRequired: 'Zadejte prosĂ­m alespoĹ� jednu hodnotu pro tyto poloĹľky.',
	errorPrefix: 'Chyba: ',
	warningPrefix: 'UpozornÄ›nĂ­: ',

	// Form.Validator.Extras
	noSpace: 'V tĂ©to poloĹľce nejsou povoleny mezery',
	reqChkByNode: 'Nejsou vybrĂˇny ĹľĂˇdnĂ© poloĹľky.',
	requiredChk: 'Tato poloĹľka je vyĹľadovĂˇna.',
	reqChkByName: 'ProsĂ­m vyberte {label}.',
	match: 'Tato poloĹľka se musĂ­ shodovat s poloĹľkou {matchName}',
	startDate: 'datum zahĂˇjenĂ­',
	endDate: 'datum ukonÄŤenĂ­',
	currendDate: 'aktuĂˇlnĂ­ datum',
	afterDate: 'Datum by mÄ›lo bĂ˝t stejnĂ© nebo vÄ›tĹˇĂ­ neĹľ {label}.',
	beforeDate: 'Datum by mÄ›lo bĂ˝t stejnĂ© nebo menĹˇĂ­ neĹľ {label}.',
	startMonth: 'Vyberte poÄŤĂˇteÄŤnĂ­ mÄ›sĂ­c.',
	sameMonth: 'Tyto dva datumy musĂ­ bĂ˝t ve stejnĂ©m mÄ›sĂ­ci - zmÄ›Ĺ�te jeden z nich.',
	creditcard: 'ZadanĂ© ÄŤĂ­slo kreditnĂ­ karty je neplatnĂ©. ProsĂ­m opravte ho. Bylo zadĂˇno {length} ÄŤĂ­sel.'

});


/*
---

name: Locale.da-DK.Date

description: Date messages for Danish.

license: MIT-style license

authors:
  - Martin Overgaard
  - Henrik Hansen

requires:
  - /Locale

provides: [Locale.da-DK.Date]

...
*/

Locale.define('da-DK', 'Date', {

	months: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
	months_abbr: ['jan.', 'feb.', 'mar.', 'apr.', 'maj.', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
	days: ['SĂ¸ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'LĂ¸rdag'],
	days_abbr: ['sĂ¸n', 'man', 'tir', 'ons', 'tor', 'fre', 'lĂ¸r'],

	// Culture's date order: DD-MM-YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d-%m-%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '.',

	lessThanMinuteAgo: 'mindre end et minut siden',
	minuteAgo: 'omkring et minut siden',
	minutesAgo: '{delta} minutter siden',
	hourAgo: 'omkring en time siden',
	hoursAgo: 'omkring {delta} timer siden',
	dayAgo: '1 dag siden',
	daysAgo: '{delta} dage siden',
	weekAgo: '1 uge siden',
	weeksAgo: '{delta} uger siden',
	monthAgo: '1 mĂĄned siden',
	monthsAgo: '{delta} mĂĄneder siden',
	yearAgo: '1 ĂĄr siden',
	yearsAgo: '{delta} ĂĄr siden',

	lessThanMinuteUntil: 'mindre end et minut fra nu',
	minuteUntil: 'omkring et minut fra nu',
	minutesUntil: '{delta} minutter fra nu',
	hourUntil: 'omkring en time fra nu',
	hoursUntil: 'omkring {delta} timer fra nu',
	dayUntil: '1 dag fra nu',
	daysUntil: '{delta} dage fra nu',
	weekUntil: '1 uge fra nu',
	weeksUntil: '{delta} uger fra nu',
	monthUntil: '1 mĂĄned fra nu',
	monthsUntil: '{delta} mĂĄneder fra nu',
	yearUntil: '1 ĂĄr fra nu',
	yearsUntil: '{delta} ĂĄr fra nu'

});


/*
---

name: Locale.da-DK.Form.Validator

description: Form Validator messages for Danish.

license: MIT-style license

authors:
  - Martin Overgaard

requires:
  - /Locale

provides: [Locale.da-DK.Form.Validator]

...
*/

Locale.define('da-DK', 'FormValidator', {

	required: 'Feltet skal udfyldes.',
	minLength: 'Skriv mindst {minLength} tegn (du skrev {length} tegn).',
	maxLength: 'Skriv maksimalt {maxLength} tegn (du skrev {length} tegn).',
	integer: 'Skriv et tal i dette felt. Decimal tal (f.eks. 1.25) er ikke tilladt.',
	numeric: 'Skriv kun tal i dette felt (i.e. "1" eller "1.1" eller "-1" eller "-1.1").',
	digits: 'Skriv kun tal og tegnsĂ¦tning i dette felt (eksempel, et telefon nummer med bindestreg eller punktum er tilladt).',
	alpha: 'Skriv kun bogstaver (a-z) i dette felt. Mellemrum og andre tegn er ikke tilladt.',
	alphanum: 'Skriv kun bogstaver (a-z) eller tal (0-9) i dette felt. Mellemrum og andre tegn er ikke tilladt.',
	dateSuchAs: 'Skriv en gyldig dato som {date}',
	dateInFormatMDY: 'Skriv dato i formatet DD-MM-YYYY (f.eks. "31-12-1999")',
	email: 'Skriv en gyldig e-mail adresse. F.eks "fred@domain.com".',
	url: 'Skriv en gyldig URL adresse. F.eks "http://www.example.com".',
	currencyDollar: 'Skriv et gldigt belĂ¸b. F.eks Kr.100.00 .',
	oneRequired: 'Et eller flere af felterne i denne formular skal udfyldes.',
	errorPrefix: 'Fejl: ',
	warningPrefix: 'Advarsel: ',

	// Form.Validator.Extras
	noSpace: 'Der mĂĄ ikke benyttes mellemrum i dette felt.',
	reqChkByNode: 'Foretag et valg.',
	requiredChk: 'Dette felt skal udfyldes.',
	reqChkByName: 'VĂ¦lg en {label}.',
	match: 'Dette felt skal matche {matchName} feltet',
	startDate: 'start dato',
	endDate: 'slut dato',
	currendDate: 'dags dato',
	afterDate: 'Datoen skal vĂ¦re stĂ¸rre end eller lig med {label}.',
	beforeDate: 'Datoen skal vĂ¦re mindre end eller lig med {label}.',
	startMonth: 'VĂ¦lg en start mĂĄned',
	sameMonth: 'De valgte datoer skal vĂ¦re i samme mĂĄned - skift en af dem.'

});


/*
---

name: Locale.de-DE.Date

description: Date messages for German.

license: MIT-style license

authors:
  - Christoph Pojer
  - Frank Rossi
  - Ulrich Petri
  - Fabian Beiner

requires:
  - /Locale

provides: [Locale.de-DE.Date]

...
*/

Locale.define('de-DE', 'Date', {

	months: ['Januar', 'Februar', 'MĂ¤rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
	months_abbr: ['Jan', 'Feb', 'MĂ¤r', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
	days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
	days_abbr: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],

	// Culture's date order: DD.MM.YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d.%m.%Y',
	shortTime: '%H:%M',
	AM: 'vormittags',
	PM: 'nachmittags',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '.',

	lessThanMinuteAgo: 'vor weniger als einer Minute',
	minuteAgo: 'vor einer Minute',
	minutesAgo: 'vor {delta} Minuten',
	hourAgo: 'vor einer Stunde',
	hoursAgo: 'vor {delta} Stunden',
	dayAgo: 'vor einem Tag',
	daysAgo: 'vor {delta} Tagen',
	weekAgo: 'vor einer Woche',
	weeksAgo: 'vor {delta} Wochen',
	monthAgo: 'vor einem Monat',
	monthsAgo: 'vor {delta} Monaten',
	yearAgo: 'vor einem Jahr',
	yearsAgo: 'vor {delta} Jahren',

	lessThanMinuteUntil: 'in weniger als einer Minute',
	minuteUntil: 'in einer Minute',
	minutesUntil: 'in {delta} Minuten',
	hourUntil: 'in ca. einer Stunde',
	hoursUntil: 'in ca. {delta} Stunden',
	dayUntil: 'in einem Tag',
	daysUntil: 'in {delta} Tagen',
	weekUntil: 'in einer Woche',
	weeksUntil: 'in {delta} Wochen',
	monthUntil: 'in einem Monat',
	monthsUntil: 'in {delta} Monaten',
	yearUntil: 'in einem Jahr',
	yearsUntil: 'in {delta} Jahren'

});


/*
---

name: Locale.de-CH.Date

description: Date messages for German (Switzerland).

license: MIT-style license

authors:
  - Michael van der Weg

requires:
  - /Locale
  - /Locale.de-DE.Date

provides: [Locale.de-CH.Date]

...
*/

Locale.define('de-CH').inherit('de-DE', 'Date');


/*
---

name: Locale.de-CH.Form.Validator

description: Form Validator messages for German (Switzerland).

license: MIT-style license

authors:
  - Michael van der Weg

requires:
  - /Locale

provides: [Locale.de-CH.Form.Validator]

...
*/

Locale.define('de-CH', 'FormValidator', {

	required: 'Dieses Feld ist obligatorisch.',
	minLength: 'Geben Sie bitte mindestens {minLength} Zeichen ein (Sie haben {length} Zeichen eingegeben).',
	maxLength: 'Bitte geben Sie nicht mehr als {maxLength} Zeichen ein (Sie haben {length} Zeichen eingegeben).',
	integer: 'Geben Sie bitte eine ganze Zahl ein. Dezimalzahlen (z.B. 1.25) sind nicht erlaubt.',
	numeric: 'Geben Sie bitte nur Zahlenwerte in dieses Eingabefeld ein (z.B. &quot;1&quot;, &quot;1.1&quot;, &quot;-1&quot; oder &quot;-1.1&quot;).',
	digits: 'Benutzen Sie bitte nur Zahlen und Satzzeichen in diesem Eingabefeld (erlaubt ist z.B. eine Telefonnummer mit Bindestrichen und Punkten).',
	alpha: 'Benutzen Sie bitte nur Buchstaben (a-z) in diesem Feld. Leerzeichen und andere Zeichen sind nicht erlaubt.',
	alphanum: 'Benutzen Sie bitte nur Buchstaben (a-z) und Zahlen (0-9) in diesem Eingabefeld. Leerzeichen und andere Zeichen sind nicht erlaubt.',
	dateSuchAs: 'Geben Sie bitte ein g&uuml;ltiges Datum ein. Wie zum Beispiel {date}',
	dateInFormatMDY: 'Geben Sie bitte ein g&uuml;ltiges Datum ein. Wie zum Beispiel TT.MM.JJJJ (z.B. &quot;31.12.1999&quot;)',
	email: 'Geben Sie bitte eine g&uuml;ltige E-Mail Adresse ein. Wie zum Beispiel &quot;maria@bernasconi.ch&quot;.',
	url: 'Geben Sie bitte eine g&uuml;ltige URL ein. Wie zum Beispiel http://www.example.com.',
	currencyDollar: 'Geben Sie bitte einen g&uuml;ltigen Betrag in Schweizer Franken ein. Wie zum Beispiel 100.00 CHF .',
	oneRequired: 'Machen Sie f&uuml;r mindestens eines der Eingabefelder einen Eintrag.',
	errorPrefix: 'Fehler: ',
	warningPrefix: 'Warnung: ',

	// Form.Validator.Extras
	noSpace: 'In diesem Eingabefeld darf kein Leerzeichen sein.',
	reqChkByNode: 'Es wurden keine Elemente gew&auml;hlt.',
	requiredChk: 'Dieses Feld ist obligatorisch.',
	reqChkByName: 'Bitte w&auml;hlen Sie ein {label}.',
	match: 'Dieses Eingabefeld muss mit dem Feld {matchName} &uuml;bereinstimmen.',
	startDate: 'Das Anfangsdatum',
	endDate: 'Das Enddatum',
	currendDate: 'Das aktuelle Datum',
	afterDate: 'Das Datum sollte zur gleichen Zeit oder sp&auml;ter sein {label}.',
	beforeDate: 'Das Datum sollte zur gleichen Zeit oder fr&uuml;her sein {label}.',
	startMonth: 'W&auml;hlen Sie bitte einen Anfangsmonat',
	sameMonth: 'Diese zwei Datumsangaben m&uuml;ssen im selben Monat sein - Sie m&uuml;ssen eine von beiden ver&auml;ndern.',
	creditcard: 'Die eingegebene Kreditkartennummer ist ung&uuml;ltig. Bitte &uuml;berpr&uuml;fen Sie diese und versuchen Sie es erneut. {length} Zahlen eingegeben.'

});


/*
---

name: Locale.de-DE.Form.Validator

description: Form Validator messages for German.

license: MIT-style license

authors:
  - Frank Rossi
  - Ulrich Petri
  - Fabian Beiner

requires:
  - /Locale

provides: [Locale.de-DE.Form.Validator]

...
*/

Locale.define('de-DE', 'FormValidator', {

	required: 'Dieses Eingabefeld muss ausgefĂĽllt werden.',
	minLength: 'Geben Sie bitte mindestens {minLength} Zeichen ein (Sie haben nur {length} Zeichen eingegeben).',
	maxLength: 'Geben Sie bitte nicht mehr als {maxLength} Zeichen ein (Sie haben {length} Zeichen eingegeben).',
	integer: 'Geben Sie in diesem Eingabefeld bitte eine ganze Zahl ein. Dezimalzahlen (z.B. "1.25") sind nicht erlaubt.',
	numeric: 'Geben Sie in diesem Eingabefeld bitte nur Zahlenwerte (z.B. "1", "1.1", "-1" oder "-1.1") ein.',
	digits: 'Geben Sie in diesem Eingabefeld bitte nur Zahlen und Satzzeichen ein (z.B. eine Telefonnummer mit Bindestrichen und Punkten ist erlaubt).',
	alpha: 'Geben Sie in diesem Eingabefeld bitte nur Buchstaben (a-z) ein. Leerzeichen und andere Zeichen sind nicht erlaubt.',
	alphanum: 'Geben Sie in diesem Eingabefeld bitte nur Buchstaben (a-z) und Zahlen (0-9) ein. Leerzeichen oder andere Zeichen sind nicht erlaubt.',
	dateSuchAs: 'Geben Sie bitte ein gĂĽltiges Datum ein (z.B. "{date}").',
	dateInFormatMDY: 'Geben Sie bitte ein gĂĽltiges Datum im Format TT.MM.JJJJ ein (z.B. "31.12.1999").',
	email: 'Geben Sie bitte eine gĂĽltige E-Mail-Adresse ein (z.B. "max@mustermann.de").',
	url: 'Geben Sie bitte eine gĂĽltige URL ein (z.B. "http://www.example.com").',
	currencyDollar: 'Geben Sie bitte einen gĂĽltigen Betrag in EURO ein (z.B. 100.00â‚¬).',
	oneRequired: 'Bitte fĂĽllen Sie mindestens ein Eingabefeld aus.',
	errorPrefix: 'Fehler: ',
	warningPrefix: 'Warnung: ',

	// Form.Validator.Extras
	noSpace: 'Es darf kein Leerzeichen in diesem Eingabefeld sein.',
	reqChkByNode: 'Es wurden keine Elemente gewĂ¤hlt.',
	requiredChk: 'Dieses Feld muss ausgefĂĽllt werden.',
	reqChkByName: 'Bitte wĂ¤hlen Sie ein {label}.',
	match: 'Dieses Eingabefeld muss mit dem {matchName} Eingabefeld ĂĽbereinstimmen.',
	startDate: 'Das Anfangsdatum',
	endDate: 'Das Enddatum',
	currendDate: 'Das aktuelle Datum',
	afterDate: 'Das Datum sollte zur gleichen Zeit oder spĂ¤ter sein als {label}.',
	beforeDate: 'Das Datum sollte zur gleichen Zeit oder frĂĽher sein als {label}.',
	startMonth: 'WĂ¤hlen Sie bitte einen Anfangsmonat',
	sameMonth: 'Diese zwei Datumsangaben mĂĽssen im selben Monat sein - Sie mĂĽssen eines von beiden verĂ¤ndern.',
	creditcard: 'Die eingegebene Kreditkartennummer ist ungĂĽltig. Bitte ĂĽberprĂĽfen Sie diese und versuchen Sie es erneut. {length} Zahlen eingegeben.'

});


/*
---

name: Locale.EU.Number

description: Number messages for Europe.

license: MIT-style license

authors:
  - Arian Stolwijk

requires:
  - /Locale

provides: [Locale.EU.Number]

...
*/

Locale.define('EU', 'Number', {

	decimal: ',',
	group: '.',

	currency: {
		prefix: 'â‚¬ '
	}

});


/*
---

name: Locale.de-DE.Number

description: Number messages for German.

license: MIT-style license

authors:
  - Christoph Pojer

requires:
  - /Locale
  - /Locale.EU.Number

provides: [Locale.de-DE.Number]

...
*/

Locale.define('de-DE').inherit('EU', 'Number');


/*
---

name: Locale.en-GB.Date

description: Date messages for British English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale
  - /Locale.en-US.Date

provides: [Locale.en-GB.Date]

...
*/

Locale.define('en-GB', 'Date', {

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M'

}).inherit('en-US', 'Date');


/*
---

name: Locale.es-ES.Date

description: Date messages for Spanish.

license: MIT-style license

authors:
  - Ă�lfons Sanchez

requires:
  - /Locale

provides: [Locale.es-ES.Date]

...
*/

Locale.define('es-ES', 'Date', {

	months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	months_abbr: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
	days: ['Domingo', 'Lunes', 'Martes', 'MiĂ©rcoles', 'Jueves', 'Viernes', 'SĂˇbado'],
	days_abbr: ['dom', 'lun', 'mar', 'miĂ©', 'juv', 'vie', 'sĂˇb'],

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'hace menos de un minuto',
	minuteAgo: 'hace un minuto',
	minutesAgo: 'hace {delta} minutos',
	hourAgo: 'hace una hora',
	hoursAgo: 'hace unas {delta} horas',
	dayAgo: 'hace un dĂ­a',
	daysAgo: 'hace {delta} dĂ­as',
	weekAgo: 'hace una semana',
	weeksAgo: 'hace unas {delta} semanas',
	monthAgo: 'hace un mes',
	monthsAgo: 'hace {delta} meses',
	yearAgo: 'hace un aĂ±o',
	yearsAgo: 'hace {delta} aĂ±os',

	lessThanMinuteUntil: 'menos de un minuto desde ahora',
	minuteUntil: 'un minuto desde ahora',
	minutesUntil: '{delta} minutos desde ahora',
	hourUntil: 'una hora desde ahora',
	hoursUntil: 'unas {delta} horas desde ahora',
	dayUntil: 'un dĂ­a desde ahora',
	daysUntil: '{delta} dĂ­as desde ahora',
	weekUntil: 'una semana desde ahora',
	weeksUntil: 'unas {delta} semanas desde ahora',
	monthUntil: 'un mes desde ahora',
	monthsUntil: '{delta} meses desde ahora',
	yearUntil: 'un aĂ±o desde ahora',
	yearsUntil: '{delta} aĂ±os desde ahora'

});


/*
---

name: Locale.es-AR.Date

description: Date messages for Spanish (Argentina).

license: MIT-style license

authors:
  - Ă�lfons Sanchez
  - Diego Massanti

requires:
  - /Locale
  - /Locale.es-ES.Date

provides: [Locale.es-AR.Date]

...
*/

Locale.define('es-AR').inherit('es-ES', 'Date');


/*
---

name: Locale.es-AR.Form.Validator

description: Form Validator messages for Spanish (Argentina).

license: MIT-style license

authors:
  - Diego Massanti

requires:
  - /Locale

provides: [Locale.es-AR.Form.Validator]

...
*/

Locale.define('es-AR', 'FormValidator', {

	required: 'Este campo es obligatorio.',
	minLength: 'Por favor ingrese al menos {minLength} caracteres (ha ingresado {length} caracteres).',
	maxLength: 'Por favor no ingrese mĂˇs de {maxLength} caracteres (ha ingresado {length} caracteres).',
	integer: 'Por favor ingrese un nĂşmero entero en este campo. NĂşmeros con decimales (p.e. 1,25) no se permiten.',
	numeric: 'Por favor ingrese solo valores numĂ©ricos en este campo (p.e. "1" o "1,1" o "-1" o "-1,1").',
	digits: 'Por favor use sĂłlo nĂşmeros y puntuaciĂłn en este campo (por ejemplo, un nĂşmero de telĂ©fono con guiones y/o puntos no estĂˇ permitido).',
	alpha: 'Por favor use sĂłlo letras (a-z) en este campo. No se permiten espacios ni otros caracteres.',
	alphanum: 'Por favor, usa sĂłlo letras (a-z) o nĂşmeros (0-9) en este campo. No se permiten espacios u otros caracteres.',
	dateSuchAs: 'Por favor ingrese una fecha vĂˇlida como {date}',
	dateInFormatMDY: 'Por favor ingrese una fecha vĂˇlida, utulizando el formato DD/MM/YYYY (p.e. "31/12/1999")',
	email: 'Por favor, ingrese una direcciĂłn de e-mail vĂˇlida. Por ejemplo, "fred@dominio.com".',
	url: 'Por favor ingrese una URL vĂˇlida como http://www.example.com.',
	currencyDollar: 'Por favor ingrese una cantidad vĂˇlida de pesos. Por ejemplo $100,00 .',
	oneRequired: 'Por favor ingrese algo para por lo menos una de estas entradas.',
	errorPrefix: 'Error: ',
	warningPrefix: 'Advertencia: ',

	// Form.Validator.Extras
	noSpace: 'No se permiten espacios en este campo.',
	reqChkByNode: 'No hay elementos seleccionados.',
	requiredChk: 'Este campo es obligatorio.',
	reqChkByName: 'Por favor selecciona una {label}.',
	match: 'Este campo necesita coincidir con el campo {matchName}',
	startDate: 'la fecha de inicio',
	endDate: 'la fecha de fin',
	currendDate: 'la fecha actual',
	afterDate: 'La fecha debe ser igual o posterior a {label}.',
	beforeDate: 'La fecha debe ser igual o anterior a {label}.',
	startMonth: 'Por favor selecciona un mes de origen',
	sameMonth: 'Estas dos fechas deben estar en el mismo mes - debes cambiar una u otra.'

});


/*
---

name: Locale.es-ES.Form.Validator

description: Form Validator messages for Spanish.

license: MIT-style license

authors:
  - Ă�lfons Sanchez

requires:
  - /Locale

provides: [Locale.es-ES.Form.Validator]

...
*/

Locale.define('es-ES', 'FormValidator', {

	required: 'Este campo es obligatorio.',
	minLength: 'Por favor introduce al menos {minLength} caracteres (has introducido {length} caracteres).',
	maxLength: 'Por favor introduce no m&aacute;s de {maxLength} caracteres (has introducido {length} caracteres).',
	integer: 'Por favor introduce un n&uacute;mero entero en este campo. N&uacute;meros con decimales (p.e. 1,25) no se permiten.',
	numeric: 'Por favor introduce solo valores num&eacute;ricos en este campo (p.e. "1" o "1,1" o "-1" o "-1,1").',
	digits: 'Por favor usa solo n&uacute;meros y puntuaci&oacute;n en este campo (por ejemplo, un n&uacute;mero de tel&eacute;fono con guiones y puntos no esta permitido).',
	alpha: 'Por favor usa letras solo (a-z) en este campo. No se admiten espacios ni otros caracteres.',
	alphanum: 'Por favor, usa solo letras (a-z) o n&uacute;meros (0-9) en este campo. No se admiten espacios ni otros caracteres.',
	dateSuchAs: 'Por favor introduce una fecha v&aacute;lida como {date}',
	dateInFormatMDY: 'Por favor introduce una fecha v&aacute;lida como DD/MM/YYYY (p.e. "31/12/1999")',
	email: 'Por favor, introduce una direcci&oacute;n de email v&aacute;lida. Por ejemplo, "fred@domain.com".',
	url: 'Por favor introduce una URL v&aacute;lida como http://www.example.com.',
	currencyDollar: 'Por favor introduce una cantidad v&aacute;lida de â‚¬. Por ejemplo â‚¬100,00 .',
	oneRequired: 'Por favor introduce algo para por lo menos una de estas entradas.',
	errorPrefix: 'Error: ',
	warningPrefix: 'Aviso: ',

	// Form.Validator.Extras
	noSpace: 'No pueden haber espacios en esta entrada.',
	reqChkByNode: 'No hay elementos seleccionados.',
	requiredChk: 'Este campo es obligatorio.',
	reqChkByName: 'Por favor selecciona una {label}.',
	match: 'Este campo necesita coincidir con el campo {matchName}',
	startDate: 'la fecha de inicio',
	endDate: 'la fecha de fin',
	currendDate: 'la fecha actual',
	afterDate: 'La fecha debe ser igual o posterior a {label}.',
	beforeDate: 'La fecha debe ser igual o anterior a {label}.',
	startMonth: 'Por favor selecciona un mes de origen',
	sameMonth: 'Estas dos fechas deben estar en el mismo mes - debes cambiar una u otra.'

});


/*
---

name: Locale.et-EE.Date

description: Date messages for Estonian.

license: MIT-style license

authors:
  - Kevin Valdek

requires:
  - /Locale

provides: [Locale.et-EE.Date]

...
*/

Locale.define('et-EE', 'Date', {

	months: ['jaanuar', 'veebruar', 'mĂ¤rts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
	months_abbr: ['jaan', 'veebr', 'mĂ¤rts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'],
	days: ['pĂĽhapĂ¤ev', 'esmaspĂ¤ev', 'teisipĂ¤ev', 'kolmapĂ¤ev', 'neljapĂ¤ev', 'reede', 'laupĂ¤ev'],
	days_abbr: ['pĂĽhap', 'esmasp', 'teisip', 'kolmap', 'neljap', 'reede', 'laup'],

	// Culture's date order: MM.DD.YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m.%d.%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'vĂ¤hem kui minut aega tagasi',
	minuteAgo: 'umbes minut aega tagasi',
	minutesAgo: '{delta} minutit tagasi',
	hourAgo: 'umbes tund aega tagasi',
	hoursAgo: 'umbes {delta} tundi tagasi',
	dayAgo: '1 pĂ¤ev tagasi',
	daysAgo: '{delta} pĂ¤eva tagasi',
	weekAgo: '1 nĂ¤dal tagasi',
	weeksAgo: '{delta} nĂ¤dalat tagasi',
	monthAgo: '1 kuu tagasi',
	monthsAgo: '{delta} kuud tagasi',
	yearAgo: '1 aasta tagasi',
	yearsAgo: '{delta} aastat tagasi',

	lessThanMinuteUntil: 'vĂ¤hem kui minuti aja pĂ¤rast',
	minuteUntil: 'umbes minuti aja pĂ¤rast',
	minutesUntil: '{delta} minuti pĂ¤rast',
	hourUntil: 'umbes tunni aja pĂ¤rast',
	hoursUntil: 'umbes {delta} tunni pĂ¤rast',
	dayUntil: '1 pĂ¤eva pĂ¤rast',
	daysUntil: '{delta} pĂ¤eva pĂ¤rast',
	weekUntil: '1 nĂ¤dala pĂ¤rast',
	weeksUntil: '{delta} nĂ¤dala pĂ¤rast',
	monthUntil: '1 kuu pĂ¤rast',
	monthsUntil: '{delta} kuu pĂ¤rast',
	yearUntil: '1 aasta pĂ¤rast',
	yearsUntil: '{delta} aasta pĂ¤rast'

});


/*
---

name: Locale.et-EE.Form.Validator

description: Form Validator messages for Estonian.

license: MIT-style license

authors:
  - Kevin Valdek

requires:
  - /Locale

provides: [Locale.et-EE.Form.Validator]

...
*/

Locale.define('et-EE', 'FormValidator', {

	required: 'VĂ¤li peab olema tĂ¤idetud.',
	minLength: 'Palun sisestage vĂ¤hemalt {minLength} tĂ¤hte (te sisestasite {length} tĂ¤hte).',
	maxLength: 'Palun Ă¤rge sisestage rohkem kui {maxLength} tĂ¤hte (te sisestasite {length} tĂ¤hte).',
	integer: 'Palun sisestage vĂ¤ljale tĂ¤isarv. KĂĽmnendarvud (nĂ¤iteks 1.25) ei ole lubatud.',
	numeric: 'Palun sisestage ainult numbreid vĂ¤ljale (nĂ¤iteks "1", "1.1", "-1" vĂµi "-1.1").',
	digits: 'Palun kasutage ainult numbreid ja kirjavahemĂ¤rke (telefoninumbri sisestamisel on lubatud kasutada kriipse ja punkte).',
	alpha: 'Palun kasutage ainult tĂ¤hti (a-z). TĂĽhikud ja teised sĂĽmbolid on keelatud.',
	alphanum: 'Palun kasutage ainult tĂ¤hti (a-z) vĂµi numbreid (0-9). TĂĽhikud ja teised sĂĽmbolid on keelatud.',
	dateSuchAs: 'Palun sisestage kehtiv kuupĂ¤ev kujul {date}',
	dateInFormatMDY: 'Palun sisestage kehtiv kuupĂ¤ev kujul MM.DD.YYYY (nĂ¤iteks: "12.31.1999").',
	email: 'Palun sisestage kehtiv e-maili aadress (nĂ¤iteks: "fred@domain.com").',
	url: 'Palun sisestage kehtiv URL (nĂ¤iteks: http://www.example.com).',
	currencyDollar: 'Palun sisestage kehtiv $ summa (nĂ¤iteks: $100.00).',
	oneRequired: 'Palun sisestage midagi vĂ¤hemalt ĂĽhele antud vĂ¤ljadest.',
	errorPrefix: 'Viga: ',
	warningPrefix: 'Hoiatus: ',

	// Form.Validator.Extras
	noSpace: 'VĂ¤li ei tohi sisaldada tĂĽhikuid.',
	reqChkByNode: 'Ăśkski vĂ¤ljadest pole valitud.',
	requiredChk: 'VĂ¤lja tĂ¤itmine on vajalik.',
	reqChkByName: 'Palun valige ĂĽks {label}.',
	match: 'VĂ¤li peab sobima {matchName} vĂ¤ljaga',
	startDate: 'algkuupĂ¤ev',
	endDate: 'lĂµppkuupĂ¤ev',
	currendDate: 'praegune kuupĂ¤ev',
	afterDate: 'KuupĂ¤ev peab olema vĂµrdne vĂµi pĂ¤rast {label}.',
	beforeDate: 'KuupĂ¤ev peab olema vĂµrdne vĂµi enne {label}.',
	startMonth: 'Palun valige algkuupĂ¤ev.',
	sameMonth: 'Antud kaks kuupĂ¤eva peavad olema samas kuus - peate muutma ĂĽhte kuupĂ¤eva.'

});


/*
---

name: Locale.fa.Date

description: Date messages for Persian.

license: MIT-style license

authors:
  - Amir Hossein Hodjaty Pour

requires:
  - /Locale

provides: [Locale.fa.Date]

...
*/

Locale.define('fa', 'Date', {

	months: ['Ú�Ř§Ů†Ů�ŰŚŮ‡', 'Ů�Ů�Ř±ŰŚŮ‡', 'Ů…Ř§Ř±Řł', 'Ř˘ŮľŘ±ŰŚŮ„', 'Ů…Ů‡', 'Ú�Ů�Ř¦Ů†', 'Ú�Ů�Ř¦ŰŚŮ‡', 'Ř˘ÚŻŮ�ŘłŘŞ', 'ŘłŮľŘŞŘ§Ů…Ř¨Ř±', 'Ř§Ú©ŘŞŘ¨Ř±', 'Ů†Ů�Ř§Ů…Ř¨Ř±', 'ŘŻŘłŘ§Ů…Ř¨Ř±'],
	months_abbr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
	days: ['ŰŚÚ©Ř´Ů†Ř¨Ů‡', 'ŘŻŮ�Ř´Ů†Ř¨Ů‡', 'ŘłŮ‡ Ř´Ů†Ř¨Ů‡', 'Ú†Ů‡Ř§Ř±Ř´Ů†Ř¨Ů‡', 'ŮľŮ†Ř¬Ř´Ů†Ř¨Ů‡', 'Ř¬Ů…ŘąŮ‡', 'Ř´Ů†Ř¨Ů‡'],
	days_abbr: ['ŮŠ', 'ŘŻ', 'Řł', 'Ú†', 'Ůľ', 'Ř¬', 'Ř´'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'Ů‚.Ř¸',
	PM: 'Ř¨.Ř¸',

	// Date.Extras
	ordinal: 'Ř§Ů…',

	lessThanMinuteAgo: 'Ú©Ů…ŘŞŘ± Ř§Ř˛ ŰŚÚ© ŘŻŮ‚ŰŚŮ‚Ů‡ ŮľŰŚŘ´',
	minuteAgo: 'Ř­ŘŻŮ�ŘŻ ŰŚÚ© ŘŻŮ‚ŰŚŮ‚Ů‡ ŮľŰŚŘ´',
	minutesAgo: '{delta} ŘŻŮ‚ŰŚŮ‚Ů‡ ŮľŰŚŘ´',
	hourAgo: 'Ř­ŘŻŮ�ŘŻ ŰŚÚ© ŘłŘ§ŘąŘŞ ŮľŰŚŘ´',
	hoursAgo: 'Ř­ŘŻŮ�ŘŻ {delta} ŘłŘ§ŘąŘŞ ŮľŰŚŘ´',
	dayAgo: '1 Ř±Ů�Ř˛ ŮľŰŚŘ´',
	daysAgo: '{delta} Ř±Ů�Ř˛ ŮľŰŚŘ´',
	weekAgo: '1 Ů‡Ů�ŘŞŮ‡ ŮľŰŚŘ´',
	weeksAgo: '{delta} Ů‡Ů�ŘŞŮ‡ ŮľŰŚŘ´',
	monthAgo: '1 Ů…Ř§Ů‡ ŮľŰŚŘ´',
	monthsAgo: '{delta} Ů…Ř§Ů‡ ŮľŰŚŘ´',
	yearAgo: '1 ŘłŘ§Ů„ ŮľŰŚŘ´',
	yearsAgo: '{delta} ŘłŘ§Ů„ ŮľŰŚŘ´',

	lessThanMinuteUntil: 'Ú©Ů…ŘŞŘ± Ř§Ř˛ ŰŚÚ© ŘŻŮ‚ŰŚŮ‚Ů‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	minuteUntil: 'Ř­ŘŻŮ�ŘŻ ŰŚÚ© ŘŻŮ‚ŰŚŮ‚Ů‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	minutesUntil: '{delta} ŘŻŮ‚ŰŚŮ‚Ů‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	hourUntil: 'Ř­ŘŻŮ�ŘŻ ŰŚÚ© ŘłŘ§ŘąŘŞ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	hoursUntil: 'Ř­ŘŻŮ�ŘŻ {delta} ŘłŘ§ŘąŘŞ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	dayUntil: '1 Ř±Ů�Ř˛ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	daysUntil: '{delta} Ř±Ů�Ř˛ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	weekUntil: '1 Ů‡Ů�ŘŞŮ‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	weeksUntil: '{delta} Ů‡Ů�ŘŞŮ‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	monthUntil: '1 Ů…Ř§Ů‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	monthsUntil: '{delta} Ů…Ř§Ů‡ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	yearUntil: '1 ŘłŘ§Ů„ Ř§Ř˛ Ř­Ř§Ů„Ř§',
	yearsUntil: '{delta} ŘłŘ§Ů„ Ř§Ř˛ Ř­Ř§Ů„Ř§'

});


/*
---

name: Locale.fa.Form.Validator

description: Form Validator messages for Persian.

license: MIT-style license

authors:
  - Amir Hossein Hodjaty Pour

requires:
  - /Locale

provides: [Locale.fa.Form.Validator]

...
*/

Locale.define('fa', 'FormValidator', {

	required: 'Ř§ŰŚŮ† Ů�ŰŚŮ„ŘŻ Ř§Ů„Ř˛Ř§Ů…ŰŚ Ř§ŘłŘŞ.',
	minLength: 'Ř´Ů…Ř§ Ř¨Ř§ŰŚŘŻ Ř­ŘŻŘ§Ů‚Ů„ {minLength} Ř­Ř±Ů� Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ ({length} Ř­Ř±Ů� Ů�Ř§Ř±ŘŻ Ú©Ř±ŘŻŮ‡ Ř§ŰŚŘŻ).',
	maxLength: 'Ů„Ř·Ů�Ř§ Ř­ŘŻŘ§Ú©Ř«Ř± {maxLength} Ř­Ř±Ů� Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ (Ř´Ů…Ř§ {length} Ř­Ř±Ů� Ů�Ř§Ř±ŘŻ Ú©Ř±ŘŻŮ‡ Ř§ŰŚŘŻ).',
	integer: 'Ů„Ř·Ů�Ř§ Ř§Ř˛ ŘąŘŻŘŻ ŘµŘ­ŰŚŘ­ Ř§ŘłŘŞŮ�Ř§ŘŻŮ‡ Ú©Ů†ŰŚŘŻ. Ř§ŘąŘŻŘ§ŘŻ Ř§ŘąŘ´Ř§Ř±ŰŚ (Ů…Ř§Ů†Ů†ŘŻ 1.25) Ů…Ř¬Ř§Ř˛ Ů†ŰŚŘłŘŞŮ†ŘŻ.',
	numeric: 'Ů„Ř·Ů�Ř§ Ů�Ů‚Ř· ŘŻŘ§ŘŻŮ‡ ŘąŘŻŘŻŰŚ Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ (Ů…Ř§Ů†Ů†ŘŻ "1" ŰŚŘ§ "1.1" ŰŚŘ§ "1-" ŰŚŘ§ "1.1-").',
	digits: 'Ů„Ř·Ů�Ř§ Ů�Ů‚Ř· Ř§Ř˛ Ř§ŘąŘŻŘ§ŘŻ Ů� ŘąŮ„Ř§Ů…ŘŞŮ‡Ř§ ŘŻŘ± Ř§ŰŚŮ† Ů�ŰŚŮ„ŘŻ Ř§ŘłŘŞŮ�Ř§ŘŻŮ‡ Ú©Ů†ŰŚŘŻ (Ř¨Ř±Ř§ŰŚ Ů…Ř«Ř§Ů„ Ř´Ů…Ř§Ř±Ů‡ ŘŞŮ„Ů�Ů† Ř¨Ř§ Ř®Ř· ŘŞŰŚŘ±Ů‡ Ů� Ů†Ů‚Ř·Ů‡ Ů‚Ř§Ř¨Ů„ Ů‚Ř¨Ů�Ů„ Ř§ŘłŘŞ).',
	alpha: 'Ů„Ř·Ů�Ř§ Ů�Ů‚Ř· Ř§Ř˛ Ř­Ř±Ů�Ů� Ř§Ů„Ů�Ř¨Ř§Řˇ Ř¨Ř±Ř§ŰŚ Ř§ŰŚŮ† Ř¨Ř®Ř´ Ř§ŘłŘŞŮ�Ř§ŘŻŮ‡ Ú©Ů†ŰŚŘŻ. Ú©Ř§Ř±Ř§Ú©ŘŞŘ±Ů‡Ř§ŰŚ ŘŻŰŚÚŻŘ± Ů� Ů�Ř§ŘµŮ„Ů‡ Ů…Ř¬Ř§Ř˛ Ů†ŰŚŘłŘŞŮ†ŘŻ.',
	alphanum: 'Ů„Ř·Ů�Ř§ Ů�Ů‚Ř· Ř§Ř˛ Ř­Ř±Ů�Ů� Ř§Ů„Ů�Ř¨Ř§Řˇ Ů� Ř§ŘąŘŻŘ§ŘŻ ŘŻŘ± Ř§ŰŚŮ† Ř¨Ř®Ř´ Ř§ŘłŘŞŮ�Ř§ŘŻŮ‡ Ú©Ů†ŰŚŘŻ. Ú©Ř§Ř±Ř§Ú©ŘŞŘ±Ů‡Ř§ŰŚ ŘŻŰŚÚŻŘ± Ů� Ů�Ř§ŘµŮ„Ů‡ Ů…Ř¬Ř§Ř˛ Ů†ŰŚŘłŘŞŮ†ŘŻ.',
	dateSuchAs: 'Ů„Ř·Ů�Ř§ ŰŚÚ© ŘŞŘ§Ř±ŰŚŘ® Ů…ŘąŘŞŘ¨Ř± Ů…Ř§Ů†Ů†ŘŻ {date} Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ.',
	dateInFormatMDY: 'Ů„Ř·Ů�Ř§ ŰŚÚ© ŘŞŘ§Ř±ŰŚŘ® Ů…ŘąŘŞŘ¨Ř± Ř¨Ů‡ Ř´Ú©Ů„ MM/DD/YYYY Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ (Ů…Ř§Ů†Ů†ŘŻ "12/31/1999").',
	email: 'Ů„Ř·Ů�Ř§ ŰŚÚ© Ř˘ŘŻŘ±Řł Ř§ŰŚŮ…ŰŚŮ„ Ů…ŘąŘŞŘ¨Ř± Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ. Ř¨Ř±Ř§ŰŚ Ů…Ř«Ř§Ů„ "fred@domain.com".',
	url: 'Ů„Ř·Ů�Ř§ ŰŚÚ© URL Ů…ŘąŘŞŘ¨Ř± Ů…Ř§Ů†Ů†ŘŻ http://www.example.com Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ.',
	currencyDollar: 'Ů„Ř·Ů�Ř§ ŰŚÚ© Ů…Ř­ŘŻŮ�ŘŻŮ‡ Ů…ŘąŘŞŘ¨Ř± Ř¨Ř±Ř§ŰŚ Ř§ŰŚŮ† Ř¨Ř®Ř´ Ů�Ř§Ř±ŘŻ Ú©Ů†ŰŚŘŻ Ů…Ř§Ů†Ů†ŘŻ 100.00$ .',
	oneRequired: 'Ů„Ř·Ů�Ř§ Ř­ŘŻŘ§Ů‚Ů„ ŰŚÚ©ŰŚ Ř§Ř˛ Ů�ŰŚŮ„ŘŻŮ‡Ř§ Ř±Ř§ ŮľŘ± Ú©Ů†ŰŚŘŻ.',
	errorPrefix: 'Ř®Ř·Ř§: ',
	warningPrefix: 'Ů‡Ř´ŘŻŘ§Ř±: ',

	// Form.Validator.Extras
	noSpace: 'Ř§ŘłŘŞŮ�Ř§ŘŻŮ‡ Ř§Ř˛ Ů�Ř§ŘµŮ„Ů‡ ŘŻŘ± Ř§ŰŚŮ† Ř¨Ř®Ř´ Ů…Ř¬Ř§Ř˛ Ů†ŰŚŘłŘŞ.',
	reqChkByNode: 'Ů…Ů�Ř±ŘŻŰŚ Ř§Ů†ŘŞŘ®Ř§Ř¨ Ů†Ř´ŘŻŮ‡ Ř§ŘłŘŞ.',
	requiredChk: 'Ř§ŰŚŮ† Ů�ŰŚŮ„ŘŻ Ř§Ů„Ř˛Ř§Ů…ŰŚ Ř§ŘłŘŞ.',
	reqChkByName: 'Ů„Ř·Ů�Ř§ ŰŚÚ© {label} Ř±Ř§ Ř§Ů†ŘŞŘ®Ř§Ř¨ Ú©Ů†ŰŚŘŻ.',
	match: 'Ř§ŰŚŮ† Ů�ŰŚŮ„ŘŻ Ř¨Ř§ŰŚŘŻ Ř¨Ř§ Ů�ŰŚŮ„ŘŻ {matchName} Ů…Ř·Ř§Ř¨Ů‚ŘŞ ŘŻŘ§Ř´ŘŞŮ‡ Ř¨Ř§Ř´ŘŻ.',
	startDate: 'ŘŞŘ§Ř±ŰŚŘ® Ř´Ř±Ů�Řą',
	endDate: 'ŘŞŘ§Ř±ŰŚŘ® ŮľŘ§ŰŚŘ§Ů†',
	currendDate: 'ŘŞŘ§Ř±ŰŚŘ® Ú©Ů†Ů�Ů†ŰŚ',
	afterDate: 'ŘŞŘ§Ř±ŰŚŘ® Ů…ŰŚŘ¨Ř§ŰŚŘłŘŞ Ř¨Ř±Ř§Ř¨Ř± ŰŚŘ§ Ř¨ŘąŘŻ Ř§Ř˛ {label} Ř¨Ř§Ř´ŘŻ',
	beforeDate: 'ŘŞŘ§Ř±ŰŚŘ® Ů…ŰŚŘ¨Ř§ŰŚŘłŘŞ Ř¨Ř±Ř§Ř¨Ř± ŰŚŘ§ Ů‚Ř¨Ů„ Ř§Ř˛ {label} Ř¨Ř§Ř´ŘŻ',
	startMonth: 'Ů„Ř·Ů�Ř§ Ů…Ř§Ů‡ Ř´Ř±Ů�Řą Ř±Ř§ Ř§Ů†ŘŞŘ®Ř§Ř¨ Ú©Ů†ŰŚŘŻ',
	sameMonth: 'Ř§ŰŚŮ† ŘŻŮ� ŘŞŘ§Ř±ŰŚŘ® Ř¨Ř§ŰŚŘŻ ŘŻŘ± ŰŚÚ© Ů…Ř§Ů‡ Ř¨Ř§Ř´Ů†ŘŻ - Ř´Ů…Ř§ Ř¨Ř§ŰŚŘŻ ŰŚÚ©ŰŚ ŰŚŘ§ Ů‡Ř± ŘŻŮ� Ř±Ř§ ŘŞŘşŰŚŰŚŘ± ŘŻŮ‡ŰŚŘŻ.',
	creditcard: 'Ř´Ů…Ř§Ř±Ů‡ Ú©Ř§Ř±ŘŞ Ř§ŘąŘŞŘ¨Ř§Ř±ŰŚ Ú©Ů‡ Ů�Ř§Ř±ŘŻ Ú©Ř±ŘŻŮ‡ Ř§ŰŚŘŻ Ů…ŘąŘŞŘ¨Ř± Ů†ŰŚŘłŘŞ. Ů„Ř·Ů�Ř§ Ř´Ů…Ř§Ř±Ů‡ Ř±Ř§ Ř¨Ř±Ř±ŘłŰŚ Ú©Ů†ŰŚŘŻ Ů� Ů…Ř¬ŘŻŘŻŘ§ ŘŞŮ„Ř§Ř´ Ú©Ů†ŰŚŘŻ. {length} Ř±Ů‚Ů… Ů�Ř§Ř±ŘŻ Ř´ŘŻŮ‡ Ř§ŘłŘŞ.'

});


/*
---

name: Locale.fi-FI.Date

description: Date messages for Finnish.

license: MIT-style license

authors:
  - ksel

requires:
  - /Locale

provides: [Locale.fi-FI.Date]

...
*/

Locale.define('fi-FI', 'Date', {

	// NOTE: months and days are not capitalized in finnish
	months: ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesĂ¤kuu', 'heinĂ¤kuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'],

	// these abbreviations are really not much used in finnish because they obviously won't abbreviate very much. ;)
	// NOTE: sometimes one can see forms such as "tammi", "helmi", etc. but that is not proper finnish.
	months_abbr: ['tammik.', 'helmik.', 'maalisk.', 'huhtik.', 'toukok.', 'kesĂ¤k.', 'heinĂ¤k.', 'elok.', 'syysk.', 'lokak.', 'marrask.', 'jouluk.'],

	days: ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
	days_abbr: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d.%m.%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '.',

	lessThanMinuteAgo: 'vajaa minuutti sitten',
	minuteAgo: 'noin minuutti sitten',
	minutesAgo: '{delta} minuuttia sitten',
	hourAgo: 'noin tunti sitten',
	hoursAgo: 'noin {delta} tuntia sitten',
	dayAgo: 'pĂ¤ivĂ¤ sitten',
	daysAgo: '{delta} pĂ¤ivĂ¤Ă¤ sitten',
	weekAgo: 'viikko sitten',
	weeksAgo: '{delta} viikkoa sitten',
	monthAgo: 'kuukausi sitten',
	monthsAgo: '{delta} kuukautta sitten',
	yearAgo: 'vuosi sitten',
	yearsAgo: '{delta} vuotta sitten',

	lessThanMinuteUntil: 'vajaan minuutin kuluttua',
	minuteUntil: 'noin minuutin kuluttua',
	minutesUntil: '{delta} minuutin kuluttua',
	hourUntil: 'noin tunnin kuluttua',
	hoursUntil: 'noin {delta} tunnin kuluttua',
	dayUntil: 'pĂ¤ivĂ¤n kuluttua',
	daysUntil: '{delta} pĂ¤ivĂ¤n kuluttua',
	weekUntil: 'viikon kuluttua',
	weeksUntil: '{delta} viikon kuluttua',
	monthUntil: 'kuukauden kuluttua',
	monthsUntil: '{delta} kuukauden kuluttua',
	yearUntil: 'vuoden kuluttua',
	yearsUntil: '{delta} vuoden kuluttua'

});


/*
---

name: Locale.fi-FI.Form.Validator

description: Form Validator messages for Finnish.

license: MIT-style license

authors:
  - ksel

requires:
  - /Locale

provides: [Locale.fi-FI.Form.Validator]

...
*/

Locale.define('fi-FI', 'FormValidator', {

	required: 'TĂ¤mĂ¤ kenttĂ¤ on pakollinen.',
	minLength: 'Ole hyvĂ¤ ja anna vĂ¤hintĂ¤Ă¤n {minLength} merkkiĂ¤ (annoit {length} merkkiĂ¤).',
	maxLength: 'Ă„lĂ¤ anna enempĂ¤Ă¤ kuin {maxLength} merkkiĂ¤ (annoit {length} merkkiĂ¤).',
	integer: 'Ole hyvĂ¤ ja anna kokonaisluku. Luvut, joissa on desimaaleja (esim. 1.25) eivĂ¤t ole sallittuja.',
	numeric: 'Anna tĂ¤hĂ¤n kenttĂ¤Ă¤n lukuarvo (kuten "1" tai "1.1" tai "-1" tai "-1.1").',
	digits: 'KĂ¤ytĂ¤ pelkĂ¤stĂ¤Ă¤n numeroita ja vĂ¤limerkkejĂ¤ tĂ¤ssĂ¤ kentĂ¤ssĂ¤ (syĂ¶tteet, kuten esim. puhelinnumero, jossa on vĂ¤liviivoja, pilkkuja tai pisteitĂ¤, kelpaa).',
	alpha: 'Anna tĂ¤hĂ¤n kenttĂ¤Ă¤n vain kirjaimia (a-z). VĂ¤lilyĂ¶nnit tai muut merkit eivĂ¤t ole sallittuja.',
	alphanum: 'Anna tĂ¤hĂ¤n kenttĂ¤Ă¤n vain kirjaimia (a-z) tai numeroita (0-9). VĂ¤lilyĂ¶nnit tai muut merkit eivĂ¤t ole sallittuja.',
	dateSuchAs: 'Ole hyvĂ¤ ja anna kelvollinen pĂ¤ivmĂ¤Ă¤rĂ¤, kuten esimerkiksi {date}',
	dateInFormatMDY: 'Ole hyvĂ¤ ja anna kelvollinen pĂ¤ivĂ¤mĂ¤Ă¤rĂ¤ muodossa pp/kk/vvvv (kuten "12/31/1999")',
	email: 'Ole hyvĂ¤ ja anna kelvollinen sĂ¤hkĂ¶postiosoite (kuten esimerkiksi "matti@meikalainen.com").',
	url: 'Ole hyvĂ¤ ja anna kelvollinen URL, kuten esimerkiksi http://www.example.com.',
	currencyDollar: 'Ole hyvĂ¤ ja anna kelvollinen eurosumma (kuten esimerkiksi 100,00 EUR) .',
	oneRequired: 'Ole hyvĂ¤ ja syĂ¶tĂ¤ jotakin ainakin johonkin nĂ¤istĂ¤ kentistĂ¤.',
	errorPrefix: 'Virhe: ',
	warningPrefix: 'Varoitus: ',

	// Form.Validator.Extras
	noSpace: 'TĂ¤ssĂ¤ syĂ¶tteessĂ¤ ei voi olla vĂ¤lilyĂ¶ntejĂ¤',
	reqChkByNode: 'Ei valintoja.',
	requiredChk: 'TĂ¤mĂ¤ kenttĂ¤ on pakollinen.',
	reqChkByName: 'Ole hyvĂ¤ ja valitse {label}.',
	match: 'TĂ¤mĂ¤n kentĂ¤n tulee vastata kenttĂ¤Ă¤ {matchName}',
	startDate: 'alkupĂ¤ivĂ¤mĂ¤Ă¤rĂ¤',
	endDate: 'loppupĂ¤ivĂ¤mĂ¤Ă¤rĂ¤',
	currendDate: 'nykyinen pĂ¤ivĂ¤mĂ¤Ă¤rĂ¤',
	afterDate: 'PĂ¤ivĂ¤mĂ¤Ă¤rĂ¤n tulisi olla sama tai myĂ¶hĂ¤isempi ajankohta kuin {label}.',
	beforeDate: 'PĂ¤ivĂ¤mĂ¤Ă¤rĂ¤n tulisi olla sama tai aikaisempi ajankohta kuin {label}.',
	startMonth: 'Ole hyvĂ¤ ja valitse aloituskuukausi',
	sameMonth: 'NĂ¤iden kahden pĂ¤ivĂ¤mĂ¤Ă¤rĂ¤n tulee olla saman kuun sisĂ¤llĂ¤ -- sinun pitĂ¤Ă¤ muuttaa jompaa kumpaa.',
	creditcard: 'Annettu luottokortin numero ei kelpaa. Ole hyvĂ¤ ja tarkista numero sekĂ¤ yritĂ¤ uudelleen. {length} numeroa syĂ¶tetty.'

});


/*
---

name: Locale.fi-FI.Number

description: Finnish number messages

license: MIT-style license

authors:
  - ksel

requires:
  - /Locale
  - /Locale.EU.Number

provides: [Locale.fi-FI.Number]

...
*/

Locale.define('fi-FI', 'Number', {

	group: ' ' // grouped by space

}).inherit('EU', 'Number');


/*
---

name: Locale.fr-FR.Date

description: Date messages for French.

license: MIT-style license

authors:
  - Nicolas Sorosac
  - Antoine Abt

requires:
  - /Locale

provides: [Locale.fr-FR.Date]

...
*/

Locale.define('fr-FR', 'Date', {

	months: ['Janvier', 'FĂ©vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'AoĂ»t', 'Septembre', 'Octobre', 'Novembre', 'DĂ©cembre'],
	months_abbr: ['janv.', 'fĂ©vr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'aoĂ»t', 'sept.', 'oct.', 'nov.', 'dĂ©c.'],
	days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
	days_abbr: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: function(dayOfMonth){
		return (dayOfMonth > 1) ? '' : 'er';
	},

	lessThanMinuteAgo: "il y a moins d'une minute",
	minuteAgo: 'il y a une minute',
	minutesAgo: 'il y a {delta} minutes',
	hourAgo: 'il y a une heure',
	hoursAgo: 'il y a {delta} heures',
	dayAgo: 'il y a un jour',
	daysAgo: 'il y a {delta} jours',
	weekAgo: 'il y a une semaine',
	weeksAgo: 'il y a {delta} semaines',
	monthAgo: 'il y a 1 mois',
	monthsAgo: 'il y a {delta} mois',
	yearthAgo: 'il y a 1 an',
	yearsAgo: 'il y a {delta} ans',

	lessThanMinuteUntil: "dans moins d'une minute",
	minuteUntil: 'dans une minute',
	minutesUntil: 'dans {delta} minutes',
	hourUntil: 'dans une heure',
	hoursUntil: 'dans {delta} heures',
	dayUntil: 'dans un jour',
	daysUntil: 'dans {delta} jours',
	weekUntil: 'dans 1 semaine',
	weeksUntil: 'dans {delta} semaines',
	monthUntil: 'dans 1 mois',
	monthsUntil: 'dans {delta} mois',
	yearUntil: 'dans 1 an',
	yearsUntil: 'dans {delta} ans'

});


/*
---

name: Locale.fr-FR.Form.Validator

description: Form Validator messages for French.

license: MIT-style license

authors:
  - Miquel Hudin
  - Nicolas Sorosac

requires:
  - /Locale

provides: [Locale.fr-FR.Form.Validator]

...
*/

Locale.define('fr-FR', 'FormValidator', {

	required: 'Ce champ est obligatoire.',
	length: 'Veuillez saisir {length} caract&egrave;re(s) (vous avez saisi {elLength} caract&egrave;re(s)',
	minLength: 'Veuillez saisir un minimum de {minLength} caract&egrave;re(s) (vous avez saisi {length} caract&egrave;re(s)).',
	maxLength: 'Veuillez saisir un maximum de {maxLength} caract&egrave;re(s) (vous avez saisi {length} caract&egrave;re(s)).',
	integer: 'Veuillez saisir un nombre entier dans ce champ. Les nombres d&eacute;cimaux (ex : "1,25") ne sont pas autoris&eacute;s.',
	numeric: 'Veuillez saisir uniquement des chiffres dans ce champ (ex : "1" ou "1,1" ou "-1" ou "-1,1").',
	digits: "Veuillez saisir uniquement des chiffres et des signes de ponctuation dans ce champ (ex : un num&eacute;ro de t&eacute;l&eacute;phone avec des traits d'union est autoris&eacute;).",
	alpha: 'Veuillez saisir uniquement des lettres (a-z) dans ce champ. Les espaces ou autres caract&egrave;res ne sont pas autoris&eacute;s.',
	alphanum: 'Veuillez saisir uniquement des lettres (a-z) ou des chiffres (0-9) dans ce champ. Les espaces ou autres caract&egrave;res ne sont pas autoris&eacute;s.',
	dateSuchAs: 'Veuillez saisir une date correcte comme {date}',
	dateInFormatMDY: 'Veuillez saisir une date correcte, au format JJ/MM/AAAA (ex : "31/11/1999").',
	email: 'Veuillez saisir une adresse de courrier &eacute;lectronique. Par example "fred@domaine.com".',
	url: 'Veuillez saisir une URL, comme http://www.example.com.',
	currencyDollar: 'Veuillez saisir une quantit&eacute; correcte. Par example 100,00&euro;.',
	oneRequired: 'Veuillez s&eacute;lectionner au moins une de ces options.',
	errorPrefix: 'Erreur : ',
	warningPrefix: 'Attention : ',

	// Form.Validator.Extras
	noSpace: "Ce champ n'accepte pas les espaces.",
	reqChkByNode: "Aucun &eacute;l&eacute;ment n'est s&eacute;lectionn&eacute;.",
	requiredChk: 'Ce champ est obligatoire.',
	reqChkByName: 'Veuillez s&eacute;lectionner un(e) {label}.',
	match: 'Ce champ doit correspondre avec le champ {matchName}.',
	startDate: 'date de d&eacute;but',
	endDate: 'date de fin',
	currendDate: 'date actuelle',
	afterDate: 'La date doit &ecirc;tre identique ou post&eacute;rieure &agrave; {label}.',
	beforeDate: 'La date doit &ecirc;tre identique ou ant&eacute;rieure &agrave; {label}.',
	startMonth: 'Veuillez s&eacute;lectionner un mois de d&eacute;but.',
	sameMonth: 'Ces deux dates doivent &ecirc;tre dans le m&ecirc;me mois - vous devez en modifier une.',
	creditcard: 'Le num&eacute;ro de carte de cr&eacute;dit est invalide. Merci de v&eacute;rifier le num&eacute;ro et de r&eacute;essayer. Vous avez entr&eacute; {length} chiffre(s).'

});


/*
---

name: Locale.fr-FR.Number

description: Number messages for French.

license: MIT-style license

authors:
  - Arian Stolwijk
  - sv1l

requires:
  - /Locale
  - /Locale.EU.Number

provides: [Locale.fr-FR.Number]

...
*/

Locale.define('fr-FR', 'Number', {

	group: ' ' // In fr-FR localization, group character is a blank space

}).inherit('EU', 'Number');


/*
---

name: Locale.he-IL.Date

description: Date messages for Hebrew.

license: MIT-style license

authors:
  - Elad Ossadon

requires:
  - /Locale

provides: [Locale.he-IL.Date]

...
*/

Locale.define('he-IL', 'Date', {

	months: ['×™× ×•×�×¨', '×¤×‘×¨×•×�×¨', '×ž×¨×Ą', '×�×¤×¨×™×ś', '×ž×�×™', '×™×•× ×™', '×™×•×ś×™', '×�×•×’×•×ˇ×�', '×ˇ×¤×�×ž×‘×¨', '×�×•×§×�×•×‘×¨', '× ×•×‘×ž×‘×¨', '×“×¦×ž×‘×¨'],
	months_abbr: ['×™× ×•×�×¨', '×¤×‘×¨×•×�×¨', '×ž×¨×Ą', '×�×¤×¨×™×ś', '×ž×�×™', '×™×•× ×™', '×™×•×ś×™', '×�×•×’×•×ˇ×�', '×ˇ×¤×�×ž×‘×¨', '×�×•×§×�×•×‘×¨', '× ×•×‘×ž×‘×¨', '×“×¦×ž×‘×¨'],
	days: ['×¨×�×©×•×ź', '×©× ×™', '×©×ś×™×©×™', '×¨×‘×™×˘×™', '×—×ž×™×©×™', '×©×™×©×™', '×©×‘×Ş'],
	days_abbr: ['×¨×�×©×•×ź', '×©× ×™', '×©×ś×™×©×™', '×¨×‘×™×˘×™', '×—×ž×™×©×™', '×©×™×©×™', '×©×‘×Ş'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: '×ś×¤× ×™ ×¤×—×•×Ş ×ž×“×§×”',
	minuteAgo: '×ś×¤× ×™ ×›×“×§×”',
	minutesAgo: '×ś×¤× ×™ {delta} ×“×§×•×Ş',
	hourAgo: '×ś×¤× ×™ ×›×©×˘×”',
	hoursAgo: '×ś×¤× ×™ {delta} ×©×˘×•×Ş',
	dayAgo: '×ś×¤× ×™ ×™×•×ť',
	daysAgo: '×ś×¤× ×™ {delta} ×™×ž×™×ť',
	weekAgo: '×ś×¤× ×™ ×©×‘×•×˘',
	weeksAgo: '×ś×¤× ×™ {delta} ×©×‘×•×˘×•×Ş',
	monthAgo: '×ś×¤× ×™ ×—×•×“×©',
	monthsAgo: '×ś×¤× ×™ {delta} ×—×•×“×©×™×ť',
	yearAgo: '×ś×¤× ×™ ×©× ×”',
	yearsAgo: '×ś×¤× ×™ {delta} ×©× ×™×ť',

	lessThanMinuteUntil: '×‘×˘×•×“ ×¤×—×•×Ş ×ž×“×§×”',
	minuteUntil: '×‘×˘×•×“ ×›×“×§×”',
	minutesUntil: '×‘×˘×•×“ {delta} ×“×§×•×Ş',
	hourUntil: '×‘×˘×•×“ ×›×©×˘×”',
	hoursUntil: '×‘×˘×•×“ {delta} ×©×˘×•×Ş',
	dayUntil: '×‘×˘×•×“ ×™×•×ť',
	daysUntil: '×‘×˘×•×“ {delta} ×™×ž×™×ť',
	weekUntil: '×‘×˘×•×“ ×©×‘×•×˘',
	weeksUntil: '×‘×˘×•×“ {delta} ×©×‘×•×˘×•×Ş',
	monthUntil: '×‘×˘×•×“ ×—×•×“×©',
	monthsUntil: '×‘×˘×•×“ {delta} ×—×•×“×©×™×ť',
	yearUntil: '×‘×˘×•×“ ×©× ×”',
	yearsUntil: '×‘×˘×•×“ {delta} ×©× ×™×ť'

});


/*
---

name: Locale.he-IL.Form.Validator

description: Form Validator messages for Hebrew.

license: MIT-style license

authors:
  - Elad Ossadon

requires:
  - /Locale

provides: [Locale.he-IL.Form.Validator]

...
*/

Locale.define('he-IL', 'FormValidator', {

	required: '× ×� ×ś×ž×ś×� ×©×“×” ×–×”.',
	minLength: '× ×� ×ś×”×–×™×ź ×ś×¤×—×•×Ş {minLength} ×Ş×•×•×™×ť (×”×–× ×Ş {length} ×Ş×•×•×™×ť).',
	maxLength: '× ×� ×ś×”×–×™×ź ×˘×“ {maxLength} ×Ş×•×•×™×ť (×”×–× ×Ş {length} ×Ş×•×•×™×ť).',
	integer: '× ×� ×ś×”×–×™×ź ×ž×ˇ×¤×¨ ×©×ś×ť ×ś×©×“×” ×–×”. ×ž×ˇ×¤×¨×™×ť ×˘×©×¨×•× ×™×™×ť (×›×ž×• 1.25) ×�×™× ×ť ×—×•×§×™×™×ť.',
	numeric: '× ×� ×ś×”×–×™×ź ×˘×¨×š ×ž×ˇ×¤×¨×™ ×‘×ś×‘×“ ×‘×©×“×” ×–×” (×›×ž×• "1", "1.1", "-1" ×�×• "-1.1").',
	digits: '× ×� ×ś×”×–×™×ź ×¨×§ ×ˇ×¤×¨×•×Ş ×•×ˇ×™×ž× ×™ ×”×¤×¨×“×” ×‘×©×“×” ×–×” (×ś×ž×©×ś, ×ž×ˇ×¤×¨ ×�×ś×¤×•×ź ×˘×ť ×ž×§×¤×™×ť ×�×• × ×§×•×“×•×Ş ×”×•×� ×—×•×§×™).',
	alpha: '× ×� ×ś×”×–×™×ź ×¨×§ ×�×•×Ş×™×•×Ş ×‘×�× ×’×ś×™×Ş (a-z) ×‘×©×“×” ×–×”. ×¨×•×•×—×™×ť ×�×• ×Ş×•×•×™×ť ×�×—×¨×™×ť ×�×™× ×ť ×—×•×§×™×™×ť.',
	alphanum: '× ×� ×ś×”×–×™×ź ×¨×§ ×�×•×Ş×¨×™×•×Ş ×‘×�× ×’×ś×™×Ş (a-z) ×�×• ×ˇ×¤×¨×•×Ş (0-9) ×‘×©×“×” ×–×”. ×�×•×•×—×¨×™×ť ×�×• ×Ş×•×•×™×ť ×�×—×¨×™×ť ×�×™× ×ť ×—×•×§×™×™×ť.',
	dateSuchAs: '× ×� ×ś×”×–×™×ź ×Ş×�×¨×™×š ×—×•×§×™, ×›×ž×• {date}',
	dateInFormatMDY: '× ×� ×ś×”×–×™×ź ×Ş×�×¨×™×š ×—×•×§×™ ×‘×¤×•×¨×ž×� MM/DD/YYYY (×›×ž×• "12/31/1999")',
	email: '× ×� ×ś×”×–×™×ź ×›×Ş×•×‘×Ş ×�×™×ž×™×™×ś ×—×•×§×™×Ş. ×ś×“×•×’×ž×”: "fred@domain.com".',
	url: '× ×� ×ś×”×–×™×ź ×›×Ş×•×‘×Ş ×�×Ş×¨ ×—×•×§×™×Ş, ×›×ž×• http://www.example.com.',
	currencyDollar: '× ×� ×ś×”×–×™×ź ×ˇ×›×•×ť ×“×•×ś×¨×™ ×—×•×§×™. ×ś×“×•×’×ž×” $100.00.',
	oneRequired: '× ×� ×ś×‘×—×•×¨ ×ś×¤×—×•×Ş ×‘×©×“×” ×�×—×“.',
	errorPrefix: '×©×’×™×�×”: ',
	warningPrefix: '×�×–×”×¨×”: ',

	// Form.Validator.Extras
	noSpace: '×�×™×ź ×ś×”×–×™×ź ×¨×•×•×—×™×ť ×‘×©×“×” ×–×”.',
	reqChkByNode: '× ×� ×ś×‘×—×•×¨ ×�×—×Ş ×ž×”×�×¤×©×¨×•×™×•×Ş.',
	requiredChk: '×©×“×” ×–×” × ×“×¨×©.',
	reqChkByName: '× ×� ×ś×‘×—×•×¨ {label}.',
	match: '×©×“×” ×–×” ×¦×¨×™×š ×ś×”×Ş×�×™×ť ×ś×©×“×” {matchName}',
	startDate: '×Ş×�×¨×™×š ×”×”×Ş×—×ś×”',
	endDate: '×Ş×�×¨×™×š ×”×ˇ×™×•×ť',
	currendDate: '×”×Ş×�×¨×™×š ×”× ×•×›×—×™',
	afterDate: '×”×Ş×�×¨×™×š ×¦×¨×™×š ×ś×”×™×•×Ş ×–×”×” ×�×• ×�×—×¨×™ {label}.',
	beforeDate: '×”×Ş×�×¨×™×š ×¦×¨×™×š ×ś×”×™×•×Ş ×–×”×” ×�×• ×ś×¤× ×™ {label}.',
	startMonth: '× ×� ×ś×‘×—×•×¨ ×—×•×“×© ×”×Ş×—×ś×”',
	sameMonth: '×©× ×™ ×Ş×�×¨×™×›×™×ť ×�×ś×” ×¦×¨×™×›×™×ť ×ś×”×™×•×Ş ×‘×�×•×Ş×• ×—×•×“×© - × ×� ×ś×©× ×•×Ş ×�×—×“ ×”×Ş×�×¨×™×›×™×ť.',
	creditcard: '×ž×ˇ×¤×¨ ×›×¨×�×™×ˇ ×”×�×©×¨×�×™ ×©×”×•×–×ź ×�×™× ×• ×—×•×§×™. × ×� ×ś×‘×“×•×§ ×©× ×™×Ş. ×”×•×–× ×• {length} ×ˇ×¤×¨×•×Ş.'

});


/*
---

name: Locale.he-IL.Number

description: Number messages for Hebrew.

license: MIT-style license

authors:
  - Elad Ossadon

requires:
  - /Locale

provides: [Locale.he-IL.Number]

...
*/

Locale.define('he-IL', 'Number', {

	decimal: '.',
	group: ',',

	currency: {
		suffix: ' â‚Ş'
	}

});


/*
---

name: Locale.hu-HU.Date

description: Date messages for Hungarian.

license: MIT-style license

authors:
  - Zsolt SzegheĹ‘

requires:
  - /Locale

provides: [Locale.hu-HU.Date]

...
*/

Locale.define('hu-HU', 'Date', {

	months: ['JanuĂˇr', 'FebruĂˇr', 'MĂˇrcius', 'Ă�prilis', 'MĂˇjus', 'JĂşnius', 'JĂşlius', 'Augusztus', 'Szeptember', 'OktĂłber', 'November', 'December'],
	months_abbr: ['jan.', 'febr.', 'mĂˇrc.', 'Ăˇpr.', 'mĂˇj.', 'jĂşn.', 'jĂşl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'],
	days: ['VasĂˇrnap', 'HĂ©tfĹ‘', 'Kedd', 'Szerda', 'CsĂĽtĂ¶rtĂ¶k', 'PĂ©ntek', 'Szombat'],
	days_abbr: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],

	// Culture's date order: YYYY.MM.DD.
	dateOrder: ['year', 'month', 'date'],
	shortDate: '%Y.%m.%d.',
	shortTime: '%I:%M',
	AM: 'de.',
	PM: 'du.',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '.',

	lessThanMinuteAgo: 'alig egy perce',
	minuteAgo: 'egy perce',
	minutesAgo: '{delta} perce',
	hourAgo: 'egy ĂłrĂˇja',
	hoursAgo: '{delta} ĂłrĂˇja',
	dayAgo: '1 napja',
	daysAgo: '{delta} napja',
	weekAgo: '1 hete',
	weeksAgo: '{delta} hete',
	monthAgo: '1 hĂłnapja',
	monthsAgo: '{delta} hĂłnapja',
	yearAgo: '1 Ă©ve',
	yearsAgo: '{delta} Ă©ve',

	lessThanMinuteUntil: 'alig egy perc mĂşlva',
	minuteUntil: 'egy perc mĂşlva',
	minutesUntil: '{delta} perc mĂşlva',
	hourUntil: 'egy Ăłra mĂşlva',
	hoursUntil: '{delta} Ăłra mĂşlva',
	dayUntil: '1 nap mĂşlva',
	daysUntil: '{delta} nap mĂşlva',
	weekUntil: '1 hĂ©t mĂşlva',
	weeksUntil: '{delta} hĂ©t mĂşlva',
	monthUntil: '1 hĂłnap mĂşlva',
	monthsUntil: '{delta} hĂłnap mĂşlva',
	yearUntil: '1 Ă©v mĂşlva',
	yearsUntil: '{delta} Ă©v mĂşlva'

});


/*
---

name: Locale.hu-HU.Form.Validator

description: Form Validator messages for Hungarian.

license: MIT-style license

authors:
  - Zsolt SzegheĹ‘

requires:
  - /Locale

provides: [Locale.hu-HU.Form.Validator]

...
*/

Locale.define('hu-HU', 'FormValidator', {

	required: 'A mezĹ‘ kitĂ¶ltĂ©se kĂ¶telezĹ‘.',
	minLength: 'LegalĂˇbb {minLength} karakter megadĂˇsa szĂĽksĂ©ges (megadva {length} karakter).',
	maxLength: 'Legfeljebb {maxLength} karakter megadĂˇsa lehetsĂ©ges (megadva {length} karakter).',
	integer: 'EgĂ©sz szĂˇm megadĂˇsa szĂĽksĂ©ges. A tizedesjegyek (pl. 1.25) nem engedĂ©lyezettek.',
	numeric: 'SzĂˇm megadĂˇsa szĂĽksĂ©ges (pl. "1" vagy "1.1" vagy "-1" vagy "-1.1").',
	digits: 'Csak szĂˇmok Ă©s Ă­rĂˇsjelek megadĂˇsa lehetsĂ©ges (pl. telefonszĂˇm kĂ¶tĹ‘jelek Ă©s/vagy perjelekkel).',
	alpha: 'Csak betĹ±k (a-z) megadĂˇsa lehetsĂ©ges. SzĂłkĂ¶z Ă©s egyĂ©b karakterek nem engedĂ©lyezettek.',
	alphanum: 'Csak betĹ±k (a-z) vagy szĂˇmok (0-9) megadĂˇsa lehetsĂ©ges. SzĂłkĂ¶z Ă©s egyĂ©b karakterek nem engedĂ©lyezettek.',
	dateSuchAs: 'ValĂłs dĂˇtum megadĂˇsa szĂĽksĂ©ges (pl. {date}).',
	dateInFormatMDY: 'ValĂłs dĂˇtum megadĂˇsa szĂĽksĂ©ges Ă‰Ă‰Ă‰Ă‰.HH.NN. formĂˇban. (pl. "1999.12.31.")',
	email: 'ValĂłs e-mail cĂ­m megadĂˇsa szĂĽksĂ©ges (pl. "fred@domain.hu").',
	url: 'ValĂłs URL megadĂˇsa szĂĽksĂ©ges (pl. http://www.example.com).',
	currencyDollar: 'ValĂłs pĂ©nzĂ¶sszeg megadĂˇsa szĂĽksĂ©ges (pl. 100.00 Ft.).',
	oneRequired: 'Az alĂˇbbi mezĹ‘k legalĂˇbb egyikĂ©nek kitĂ¶ltĂ©se kĂ¶telezĹ‘.',
	errorPrefix: 'Hiba: ',
	warningPrefix: 'Figyelem: ',

	// Form.Validator.Extras
	noSpace: 'A mezĹ‘ nem tartalmazhat szĂłkĂ¶zĂ¶ket.',
	reqChkByNode: 'Nincs egyetlen kijelĂ¶lt elem sem.',
	requiredChk: 'A mezĹ‘ kitĂ¶ltĂ©se kĂ¶telezĹ‘.',
	reqChkByName: 'Egy {label} kivĂˇlasztĂˇsa szĂĽksĂ©ges.',
	match: 'A mezĹ‘nek egyeznie kell a(z) {matchName} mezĹ‘vel.',
	startDate: 'a kezdet dĂˇtuma',
	endDate: 'a vĂ©g dĂˇtuma',
	currendDate: 'jelenlegi dĂˇtum',
	afterDate: 'A dĂˇtum nem lehet kisebb, mint {label}.',
	beforeDate: 'A dĂˇtum nem lehet nagyobb, mint {label}.',
	startMonth: 'Kezdeti hĂłnap megadĂˇsa szĂĽksĂ©ges.',
	sameMonth: 'A kĂ©t dĂˇtumnak ugyanazon hĂłnapban kell lennie.',
	creditcard: 'A megadott bankkĂˇrtyaszĂˇm nem valĂłdi (megadva {length} szĂˇmjegy).'

});


/*
---

name: Locale.it-IT.Date

description: Date messages for Italian.

license: MIT-style license.

authors:
  - Andrea Novero
  - Valerio Proietti

requires:
  - /Locale

provides: [Locale.it-IT.Date]

...
*/

Locale.define('it-IT', 'Date', {

	months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
	months_abbr: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
	days: ['Domenica', 'LunedĂ¬', 'MartedĂ¬', 'MercoledĂ¬', 'GiovedĂ¬', 'VenerdĂ¬', 'Sabato'],
	days_abbr: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H.%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: 'Âş',

	lessThanMinuteAgo: 'meno di un minuto fa',
	minuteAgo: 'circa un minuto fa',
	minutesAgo: 'circa {delta} minuti fa',
	hourAgo: "circa un'ora fa",
	hoursAgo: 'circa {delta} ore fa',
	dayAgo: 'circa 1 giorno fa',
	daysAgo: 'circa {delta} giorni fa',
	weekAgo: 'una settimana fa',
	weeksAgo: '{delta} settimane fa',
	monthAgo: 'un mese fa',
	monthsAgo: '{delta} mesi fa',
	yearAgo: 'un anno fa',
	yearsAgo: '{delta} anni fa',

	lessThanMinuteUntil: 'tra meno di un minuto',
	minuteUntil: 'tra circa un minuto',
	minutesUntil: 'tra circa {delta} minuti',
	hourUntil: "tra circa un'ora",
	hoursUntil: 'tra circa {delta} ore',
	dayUntil: 'tra circa un giorno',
	daysUntil: 'tra circa {delta} giorni',
	weekUntil: 'tra una settimana',
	weeksUntil: 'tra {delta} settimane',
	monthUntil: 'tra un mese',
	monthsUntil: 'tra {delta} mesi',
	yearUntil: 'tra un anno',
	yearsUntil: 'tra {delta} anni'

});


/*
---

name: Locale.it-IT.Form.Validator

description: Form Validator messages for Italian.

license: MIT-style license

authors:
  - Leonardo Laureti
  - Andrea Novero

requires:
  - /Locale

provides: [Locale.it-IT.Form.Validator]

...
*/

Locale.define('it-IT', 'FormValidator', {

	required: 'Il campo &egrave; obbligatorio.',
	minLength: 'Inserire almeno {minLength} caratteri (ne sono stati inseriti {length}).',
	maxLength: 'Inserire al massimo {maxLength} caratteri (ne sono stati inseriti {length}).',
	integer: 'Inserire un numero intero. Non sono consentiti decimali (es.: 1.25).',
	numeric: 'Inserire solo valori numerici (es.: "1" oppure "1.1" oppure "-1" oppure "-1.1").',
	digits: 'Inserire solo numeri e caratteri di punteggiatura. Per esempio &egrave; consentito un numero telefonico con trattini o punti.',
	alpha: 'Inserire solo lettere (a-z). Non sono consentiti spazi o altri caratteri.',
	alphanum: 'Inserire solo lettere (a-z) o numeri (0-9). Non sono consentiti spazi o altri caratteri.',
	dateSuchAs: 'Inserire una data valida del tipo {date}',
	dateInFormatMDY: 'Inserire una data valida nel formato MM/GG/AAAA (es.: "12/31/1999")',
	email: 'Inserire un indirizzo email valido. Per esempio "nome@dominio.com".',
	url: 'Inserire un indirizzo valido. Per esempio "http://www.example.com".',
	currencyDollar: 'Inserire un importo valido. Per esempio "$100.00".',
	oneRequired: 'Completare almeno uno dei campi richiesti.',
	errorPrefix: 'Errore: ',
	warningPrefix: 'Attenzione: ',

	// Form.Validator.Extras
	noSpace: 'Non sono consentiti spazi.',
	reqChkByNode: 'Nessuna voce selezionata.',
	requiredChk: 'Il campo &egrave; obbligatorio.',
	reqChkByName: 'Selezionare un(a) {label}.',
	match: 'Il valore deve corrispondere al campo {matchName}',
	startDate: "data d'inizio",
	endDate: 'data di fine',
	currendDate: 'data attuale',
	afterDate: 'La data deve corrispondere o essere successiva al {label}.',
	beforeDate: 'La data deve corrispondere o essere precedente al {label}.',
	startMonth: "Selezionare un mese d'inizio",
	sameMonth: 'Le due date devono essere dello stesso mese - occorre modificarne una.'

});


/*
---

name: Locale.ja-JP.Date

description: Date messages for Japanese.

license: MIT-style license

authors:
  - Noritaka Horio

requires:
  - /Locale

provides: [Locale.ja-JP.Date]

...
*/

Locale.define('ja-JP', 'Date', {

	months: ['1ćś�', '2ćś�', '3ćś�', '4ćś�', '5ćś�', '6ćś�', '7ćś�', '8ćś�', '9ćś�', '10ćś�', '11ćś�', '12ćś�'],
	months_abbr: ['1ćś�', '2ćś�', '3ćś�', '4ćś�', '5ćś�', '6ćś�', '7ćś�', '8ćś�', '9ćś�', '10ćś�', '11ćś�', '12ćś�'],
	days: ['ć—Ąć›ść—Ą', 'ćś�ć›ść—Ą', 'ç�«ć›ść—Ą', 'ć°´ć›ść—Ą', 'ćś¨ć›ść—Ą', 'é‡‘ć›ść—Ą', 'ĺśźć›ść—Ą'],
	days_abbr: ['ć—Ą', 'ćś�', 'ç�«', 'ć°´', 'ćś¨', 'é‡‘', 'ĺśź'],

	// Culture's date order: YYYY/MM/DD
	dateOrder: ['year', 'month', 'date'],
	shortDate: '%Y/%m/%d',
	shortTime: '%H:%M',
	AM: 'ĺŤ�ĺ‰Ť',
	PM: 'ĺŤ�ĺľŚ',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: '1ĺ�†ä»Ąĺ†…ĺ‰Ť',
	minuteAgo: 'ç´„1ĺ�†ĺ‰Ť',
	minutesAgo: 'ç´„{delta}ĺ�†ĺ‰Ť',
	hourAgo: 'ç´„1ć™‚é–“ĺ‰Ť',
	hoursAgo: 'ç´„{delta}ć™‚é–“ĺ‰Ť',
	dayAgo: '1ć—Ąĺ‰Ť',
	daysAgo: '{delta}ć—Ąĺ‰Ť',
	weekAgo: '1é€±é–“ĺ‰Ť',
	weeksAgo: '{delta}é€±é–“ĺ‰Ť',
	monthAgo: '1ă�¶ćś�ĺ‰Ť',
	monthsAgo: '{delta}ă�¶ćś�ĺ‰Ť',
	yearAgo: '1ĺą´ĺ‰Ť',
	yearsAgo: '{delta}ĺą´ĺ‰Ť',

	lessThanMinuteUntil: 'ä»Šă�‹ă‚‰ç´„1ĺ�†ä»Ąĺ†…',
	minuteUntil: 'ä»Šă�‹ă‚‰ç´„1ĺ�†',
	minutesUntil: 'ä»Šă�‹ă‚‰ç´„{delta}ĺ�†',
	hourUntil: 'ä»Šă�‹ă‚‰ç´„1ć™‚é–“',
	hoursUntil: 'ä»Šă�‹ă‚‰ç´„{delta}ć™‚é–“',
	dayUntil: 'ä»Šă�‹ă‚‰1ć—Ąé–“',
	daysUntil: 'ä»Šă�‹ă‚‰{delta}ć—Ąé–“',
	weekUntil: 'ä»Šă�‹ă‚‰1é€±é–“',
	weeksUntil: 'ä»Šă�‹ă‚‰{delta}é€±é–“',
	monthUntil: 'ä»Šă�‹ă‚‰1ă�¶ćś�',
	monthsUntil: 'ä»Šă�‹ă‚‰{delta}ă�¶ćś�',
	yearUntil: 'ä»Šă�‹ă‚‰1ĺą´',
	yearsUntil: 'ä»Šă�‹ă‚‰{delta}ĺą´'

});


/*
---

name: Locale.ja-JP.Form.Validator

description: Form Validator messages for Japanese.

license: MIT-style license

authors:
  - Noritaka Horio

requires:
  - /Locale

provides: [Locale.ja-JP.Form.Validator]

...
*/

Locale.define("ja-JP", "FormValidator", {

	required: 'ĺ…ĄĺŠ›ă�Żĺż…é �ă�§ă�™ă€‚',
	minLength: 'ĺ…ĄĺŠ›ć–‡ĺ­—ć•°ă�Ż{minLength}ä»Ąä¸Šă�«ă�—ă�¦ă�Źă� ă�•ă�„ă€‚({length}ć–‡ĺ­—)',
	maxLength: 'ĺ…ĄĺŠ›ć–‡ĺ­—ć•°ă�Ż{maxLength}ä»Ąä¸‹ă�«ă�—ă�¦ă�Źă� ă�•ă�„ă€‚({length}ć–‡ĺ­—)',
	integer: 'ć•´ć•°ă‚’ĺ…ĄĺŠ›ă�—ă�¦ă�Źă� ă�•ă�„ă€‚',
	numeric: 'ĺ…ĄĺŠ›ă�§ă�Ťă‚‹ă�®ă�Żć•°ĺ€¤ă� ă�‘ă�§ă�™ă€‚(äľ‹: "1", "1.1", "-1", "-1.1"....)',
	digits: 'ĺ…ĄĺŠ›ă�§ă�Ťă‚‹ă�®ă�Żć•°ĺ€¤ă�¨ĺŹĄčŞ­č¨�ĺŹ·ă�§ă�™ă€‚ (äľ‹: -ă‚„+ă‚’ĺ�«ă‚€é›»č©±ç•ŞĺŹ·ă�Şă�©).',
	alpha: 'ĺ…ĄĺŠ›ă�§ă�Ťă‚‹ă�®ă�ŻĺŤŠč§’č‹±ĺ­—ă� ă�‘ă�§ă�™ă€‚ă�ťă‚Śä»Ąĺ¤–ă�®ć–‡ĺ­—ă�Żĺ…ĄĺŠ›ă�§ă�Ťă�ľă�›ă‚“ă€‚',
	alphanum: 'ĺ…ĄĺŠ›ă�§ă�Ťă‚‹ă�®ă�ŻĺŤŠč§’č‹±ć•°ĺ­—ă� ă�‘ă�§ă�™ă€‚ă�ťă‚Śä»Ąĺ¤–ă�®ć–‡ĺ­—ă�Żĺ…ĄĺŠ›ă�§ă�Ťă�ľă�›ă‚“ă€‚',
	dateSuchAs: 'ćś‰ĺŠąă�Şć—Ąä»�ă‚’ĺ…ĄĺŠ›ă�—ă�¦ă�Źă� ă�•ă�„ă€‚{date}',
	dateInFormatMDY: 'ć—Ąä»�ă�®ć›¸ĺĽŹă�«čŞ¤ă‚Šă�Śă�‚ă‚Šă�ľă�™ă€‚YYYY/MM/DD (i.e. "1999/12/31")',
	email: 'ă�ˇă�Ľă�«ă‚˘ă�‰ă�¬ă‚ąă�«čŞ¤ă‚Šă�Śă�‚ă‚Šă�ľă�™ă€‚',
	url: 'URLă‚˘ă�‰ă�¬ă‚ąă�«čŞ¤ă‚Šă�Śă�‚ă‚Šă�ľă�™ă€‚',
	currencyDollar: 'é‡‘éˇŤă�«čŞ¤ă‚Šă�Śă�‚ă‚Šă�ľă�™ă€‚',
	oneRequired: 'ă�˛ă�¨ă�¤ä»Ąä¸Šĺ…ĄĺŠ›ă�—ă�¦ă�Źă� ă�•ă�„ă€‚',
	errorPrefix: 'ă‚¨ă�©ă�Ľ: ',
	warningPrefix: 'č­¦ĺ‘Š: ',

	// FormValidator.Extras
	noSpace: 'ă‚ąă�šă�Ľă‚ąă�Żĺ…ĄĺŠ›ă�§ă�Ťă�ľă�›ă‚“ă€‚',
	reqChkByNode: 'é�¸ćŠžă�•ă‚Śă�¦ă�„ă�ľă�›ă‚“ă€‚',
	requiredChk: 'ă�“ă�®é …ç›®ă�Żĺż…é �ă�§ă�™ă€‚',
	reqChkByName: '{label}ă‚’é�¸ćŠžă�—ă�¦ă�Źă� ă�•ă�„ă€‚',
	match: '{matchName}ă�Śĺ…ĄĺŠ›ă�•ă‚Śă�¦ă�„ă‚‹ĺ ´ĺ��ĺż…é �ă�§ă�™ă€‚',
	startDate: 'é–‹ĺ§‹ć—Ą',
	endDate: 'çµ‚äş†ć—Ą',
	currendDate: 'ä»Šć—Ą',
	afterDate: '{label}ä»Ąé™Ťă�®ć—Ąä»�ă�«ă�—ă�¦ă�Źă� ă�•ă�„ă€‚',
	beforeDate: '{label}ä»Ąĺ‰Ťă�®ć—Ąä»�ă�«ă�—ă�¦ă�Źă� ă�•ă�„ă€‚',
	startMonth: 'é–‹ĺ§‹ćś�ă‚’é�¸ćŠžă�—ă�¦ă�Źă� ă�•ă�„ă€‚',
	sameMonth: 'ć—Ąä»�ă�Śĺ�Śä¸€ă�§ă�™ă€‚ă�©ă�ˇă‚‰ă�‹ă‚’ĺ¤‰ć›´ă�—ă�¦ă�Źă� ă�•ă�„ă€‚'

});


/*
---

name: Locale.ja-JP.Number

description: Number messages for Japanese.

license: MIT-style license

authors:
  - Noritaka Horio

requires:
  - /Locale

provides: [Locale.ja-JP.Number]

...
*/

Locale.define('ja-JP', 'Number', {

	decimal: '.',
	group: ',',

	currency: {
		decimals: 0,
		prefix: '\\'
	}

});


/*
---

name: Locale.nl-NL.Date

description: Date messages for Dutch.

license: MIT-style license

authors:
  - Lennart Pilon
  - Tim Wienk

requires:
  - /Locale

provides: [Locale.nl-NL.Date]

...
*/

Locale.define('nl-NL', 'Date', {

	months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
	months_abbr: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
	days: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
	days_abbr: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],

	// Culture's date order: DD-MM-YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d-%m-%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: 'e',

	lessThanMinuteAgo: 'minder dan een minuut geleden',
	minuteAgo: 'ongeveer een minuut geleden',
	minutesAgo: '{delta} minuten geleden',
	hourAgo: 'ongeveer een uur geleden',
	hoursAgo: 'ongeveer {delta} uur geleden',
	dayAgo: 'een dag geleden',
	daysAgo: '{delta} dagen geleden',
	weekAgo: 'een week geleden',
	weeksAgo: '{delta} weken geleden',
	monthAgo: 'een maand geleden',
	monthsAgo: '{delta} maanden geleden',
	yearAgo: 'een jaar geleden',
	yearsAgo: '{delta} jaar geleden',

	lessThanMinuteUntil: 'over minder dan een minuut',
	minuteUntil: 'over ongeveer een minuut',
	minutesUntil: 'over {delta} minuten',
	hourUntil: 'over ongeveer een uur',
	hoursUntil: 'over {delta} uur',
	dayUntil: 'over ongeveer een dag',
	daysUntil: 'over {delta} dagen',
	weekUntil: 'over een week',
	weeksUntil: 'over {delta} weken',
	monthUntil: 'over een maand',
	monthsUntil: 'over {delta} maanden',
	yearUntil: 'over een jaar',
	yearsUntil: 'over {delta} jaar'

});


/*
---

name: Locale.nl-NL.Form.Validator

description: Form Validator messages for Dutch.

license: MIT-style license

authors:
  - Lennart Pilon
  - Arian Stolwijk
  - Tim Wienk

requires:
  - /Locale

provides: [Locale.nl-NL.Form.Validator]

...
*/

Locale.define('nl-NL', 'FormValidator', {

	required: 'Dit veld is verplicht.',
	length: 'Vul precies {length} karakters in (je hebt {elLength} karakters ingevoerd).',
	minLength: 'Vul minimaal {minLength} karakters in (je hebt {length} karakters ingevoerd).',
	maxLength: 'Vul niet meer dan {maxLength} karakters in (je hebt {length} karakters ingevoerd).',
	integer: 'Vul een getal in. Getallen met decimalen (bijvoorbeeld 1.25) zijn niet toegestaan.',
	numeric: 'Vul alleen numerieke waarden in (bijvoorbeeld "1" of "1.1" of "-1" of "-1.1").',
	digits: 'Vul alleen nummers en leestekens in (bijvoorbeeld een telefoonnummer met streepjes is toegestaan).',
	alpha: 'Vul alleen letters in (a-z). Spaties en andere karakters zijn niet toegestaan.',
	alphanum: 'Vul alleen letters (a-z) of nummers (0-9) in. Spaties en andere karakters zijn niet toegestaan.',
	dateSuchAs: 'Vul een geldige datum in, zoals {date}',
	dateInFormatMDY: 'Vul een geldige datum, in het formaat MM/DD/YYYY (bijvoorbeeld "12/31/1999")',
	email: 'Vul een geldig e-mailadres in. Bijvoorbeeld "fred@domein.nl".',
	url: 'Vul een geldige URL in, zoals http://www.example.com.',
	currencyDollar: 'Vul een geldig $ bedrag in. Bijvoorbeeld $100.00 .',
	oneRequired: 'Vul iets in bij in ieder geval een van deze velden.',
	warningPrefix: 'Waarschuwing: ',
	errorPrefix: 'Fout: ',

	// Form.Validator.Extras
	noSpace: 'Spaties zijn niet toegestaan in dit veld.',
	reqChkByNode: 'Er zijn geen items geselecteerd.',
	requiredChk: 'Dit veld is verplicht.',
	reqChkByName: 'Selecteer een {label}.',
	match: 'Dit veld moet overeen komen met het {matchName} veld',
	startDate: 'de begin datum',
	endDate: 'de eind datum',
	currendDate: 'de huidige datum',
	afterDate: 'De datum moet hetzelfde of na {label} zijn.',
	beforeDate: 'De datum moet hetzelfde of voor {label} zijn.',
	startMonth: 'Selecteer een begin maand',
	sameMonth: 'Deze twee data moeten in dezelfde maand zijn - u moet een van beide aanpassen.',
	creditcard: 'Het ingevulde creditcardnummer is niet geldig. Controleer het nummer en probeer opnieuw. {length} getallen ingevuld.'

});


/*
---

name: Locale.nl-NL.Number

description: Number messages for Dutch.

license: MIT-style license

authors:
  - Arian Stolwijk

requires:
  - /Locale
  - /Locale.EU.Number

provides: [Locale.nl-NL.Number]

...
*/

Locale.define('nl-NL').inherit('EU', 'Number');





/*
---

name: Locale.no-NO.Date

description: Date messages for Norwegian.

license: MIT-style license

authors:
  - Espen 'Rexxars' Hovlandsdal

requires:
  - /Locale

provides: [Locale.no-NO.Date]

...
*/

Locale.define('no-NO', 'Date', {

	// Culture's date order: DD.MM.YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d.%m.%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	lessThanMinuteAgo: 'kortere enn et minutt siden',
	minuteAgo: 'omtrent et minutt siden',
	minutesAgo: '{delta} minutter siden',
	hourAgo: 'omtrent en time siden',
	hoursAgo: 'omtrent {delta} timer siden',
	dayAgo: '{delta} dag siden',
	daysAgo: '{delta} dager siden'

});


/*
---

name: Locale.no-NO.Form.Validator

description: Form Validator messages for Norwegian.

license: MIT-style license

authors:
  - Espen 'Rexxars' Hovlandsdal

requires:
  - /Locale

provides: [Locale.no-NO.Form.Validator]

...
*/

Locale.define('no-NO', 'FormValidator', {

	required: 'Dette feltet er pĂ�ÂĄkrevd.',
	minLength: 'Vennligst skriv inn minst {minLength} tegn (du skrev {length} tegn).',
	maxLength: 'Vennligst skriv inn maksimalt {maxLength} tegn (du skrev {length} tegn).',
	integer: 'Vennligst skriv inn et tall i dette feltet. Tall med desimaler (for eksempel 1,25) er ikke tillat.',
	numeric: 'Vennligst skriv inn kun numeriske verdier i dette feltet (for eksempel "1", "1.1", "-1" eller "-1.1").',
	digits: 'Vennligst bruk kun nummer og skilletegn i dette feltet.',
	alpha: 'Vennligst bruk kun bokstaver (a-z) i dette feltet. Ingen mellomrom eller andre tegn er tillat.',
	alphanum: 'Vennligst bruk kun bokstaver (a-z) eller nummer (0-9) i dette feltet. Ingen mellomrom eller andre tegn er tillat.',
	dateSuchAs: 'Vennligst skriv inn en gyldig dato, som {date}',
	dateInFormatMDY: 'Vennligst skriv inn en gyldig dato, i formatet MM/DD/YYYY (for eksempel "12/31/1999")',
	email: 'Vennligst skriv inn en gyldig epost-adresse. For eksempel "espen@domene.no".',
	url: 'Vennligst skriv inn en gyldig URL, for eksempel http://www.example.com.',
	currencyDollar: 'Vennligst fyll ut et gyldig $ belĂ�Â¸p. For eksempel $100.00 .',
	oneRequired: 'Vennligst fyll ut noe i minst ett av disse feltene.',
	errorPrefix: 'Feil: ',
	warningPrefix: 'Advarsel: '

});


/*
---

name: Locale.pl-PL.Date

description: Date messages for Polish.

license: MIT-style license

authors:
  - Oskar Krawczyk

requires:
  - /Locale

provides: [Locale.pl-PL.Date]

...
*/

Locale.define('pl-PL', 'Date', {

	months: ['StyczeĹ„', 'Luty', 'Marzec', 'KwiecieĹ„', 'Maj', 'Czerwiec', 'Lipiec', 'SierpieĹ„', 'WrzesieĹ„', 'PaĹşdziernik', 'Listopad', 'GrudzieĹ„'],
	months_abbr: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paĹş', 'lis', 'gru'],
	days: ['Niedziela', 'PoniedziaĹ‚ek', 'Wtorek', 'Ĺšroda', 'Czwartek', 'PiÄ…tek', 'Sobota'],
	days_abbr: ['niedz.', 'pon.', 'wt.', 'Ĺ›r.', 'czw.', 'pt.', 'sob.'],

	// Culture's date order: YYYY-MM-DD
	dateOrder: ['year', 'month', 'date'],
	shortDate: '%Y-%m-%d',
	shortTime: '%H:%M',
	AM: 'nad ranem',
	PM: 'po poĹ‚udniu',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: function(dayOfMonth){
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'ty' : ['ty', 'szy', 'gi', 'ci', 'ty'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'mniej niĹĽ minute temu',
	minuteAgo: 'okoĹ‚o minutÄ™ temu',
	minutesAgo: '{delta} minut temu',
	hourAgo: 'okoĹ‚o godzinÄ™ temu',
	hoursAgo: 'okoĹ‚o {delta} godzin temu',
	dayAgo: 'Wczoraj',
	daysAgo: '{delta} dni temu',

	lessThanMinuteUntil: 'za niecaĹ‚Ä… minutÄ™',
	minuteUntil: 'za okoĹ‚o minutÄ™',
	minutesUntil: 'za {delta} minut',
	hourUntil: 'za okoĹ‚o godzinÄ™',
	hoursUntil: 'za okoĹ‚o {delta} godzin',
	dayUntil: 'za 1 dzieĹ„',
	daysUntil: 'za {delta} dni'

});


/*
---

name: Locale.pl-PL.Form.Validator

description: Form Validator messages for Polish.

license: MIT-style license

authors:
  - Oskar Krawczyk

requires:
  - /Locale

provides: [Locale.pl-PL.Form.Validator]

...
*/

Locale.define('pl-PL', 'FormValidator', {

	required: 'To pole jest wymagane.',
	minLength: 'Wymagane jest przynajmniej {minLength} znakĂłw (wpisanych zostaĹ‚o tylko {length}).',
	maxLength: 'Dozwolone jest nie wiÄ™cej niĹĽ {maxLength} znakĂłw (wpisanych zostaĹ‚o {length})',
	integer: 'To pole wymaga liczb caĹ‚ych. Liczby dziesiÄ™tne (np. 1.25) sÄ… niedozwolone.',
	numeric: 'Prosimy uĹĽywaÄ‡ tylko numerycznych wartoĹ›ci w tym polu (np. "1", "1.1", "-1" lub "-1.1").',
	digits: 'Prosimy uĹĽywaÄ‡ liczb oraz zankow punktuacyjnych w typ polu (dla przykĹ‚adu, przy numerze telefonu myĹ›lniki i kropki sÄ… dozwolone).',
	alpha: 'Prosimy uĹĽywaÄ‡ tylko liter (a-z) w tym polu. Spacje oraz inne znaki sÄ… niedozwolone.',
	alphanum: 'Prosimy uĹĽywaÄ‡ tylko liter (a-z) lub liczb (0-9) w tym polu. Spacje oraz inne znaki sÄ… niedozwolone.',
	dateSuchAs: 'Prosimy podaÄ‡ prawidĹ‚owÄ… datÄ™ w formacie: {date}',
	dateInFormatMDY: 'Prosimy podaÄ‡ poprawnÄ… date w formacie DD.MM.RRRR (i.e. "12.01.2009")',
	email: 'Prosimy podaÄ‡ prawidĹ‚owy adres e-mail, np. "jan@domena.pl".',
	url: 'Prosimy podaÄ‡ prawidĹ‚owy adres URL, np. http://www.example.com.',
	currencyDollar: 'Prosimy podaÄ‡ prawidĹ‚owÄ… sumÄ™ w PLN. Dla przykĹ‚adu: 100.00 PLN.',
	oneRequired: 'Prosimy wypeĹ‚niÄ‡ chociaĹĽ jedno z pĂłl.',
	errorPrefix: 'BĹ‚Ä…d: ',
	warningPrefix: 'Uwaga: ',

	// Form.Validator.Extras
	noSpace: 'W tym polu nie mogÄ… znajdowaÄ‡ siÄ™ spacje.',
	reqChkByNode: 'Brak zaznaczonych elementĂłw.',
	requiredChk: 'To pole jest wymagane.',
	reqChkByName: 'Prosimy wybraÄ‡ z {label}.',
	match: 'To pole musi byÄ‡ takie samo jak {matchName}',
	startDate: 'data poczÄ…tkowa',
	endDate: 'data koĹ„cowa',
	currendDate: 'aktualna data',
	afterDate: 'Podana data poinna byÄ‡ taka sama lub po {label}.',
	beforeDate: 'Podana data poinna byÄ‡ taka sama lub przed {label}.',
	startMonth: 'Prosimy wybraÄ‡ poczÄ…tkowy miesiÄ…c.',
	sameMonth: 'Te dwie daty muszÄ… byÄ‡ w zakresie tego samego miesiÄ…ca - wymagana jest zmiana ktĂłregoĹ› z pĂłl.'

});


/*
---

name: Locale.pt-PT.Date

description: Date messages for Portuguese.

license: MIT-style license

authors:
  - Fabio Miranda Costa

requires:
  - /Locale

provides: [Locale.pt-PT.Date]

...
*/

Locale.define('pt-PT', 'Date', {

	months: ['Janeiro', 'Fevereiro', 'MarĂ§o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
	months_abbr: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
	days: ['Domingo', 'Segunda-feira', 'TerĂ§a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'SĂˇbado'],
	days_abbr: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'SĂˇb'],

	// Culture's date order: DD-MM-YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d-%m-%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: 'Âş',

	lessThanMinuteAgo: 'hĂˇ menos de um minuto',
	minuteAgo: 'hĂˇ cerca de um minuto',
	minutesAgo: 'hĂˇ {delta} minutos',
	hourAgo: 'hĂˇ cerca de uma hora',
	hoursAgo: 'hĂˇ cerca de {delta} horas',
	dayAgo: 'hĂˇ um dia',
	daysAgo: 'hĂˇ {delta} dias',
	weekAgo: 'hĂˇ uma semana',
	weeksAgo: 'hĂˇ {delta} semanas',
	monthAgo: 'hĂˇ um mĂŞs',
	monthsAgo: 'hĂˇ {delta} meses',
	yearAgo: 'hĂˇ um ano',
	yearsAgo: 'hĂˇ {delta} anos',

	lessThanMinuteUntil: 'em menos de um minuto',
	minuteUntil: 'em um minuto',
	minutesUntil: 'em {delta} minutos',
	hourUntil: 'em uma hora',
	hoursUntil: 'em {delta} horas',
	dayUntil: 'em um dia',
	daysUntil: 'em {delta} dias',
	weekUntil: 'em uma semana',
	weeksUntil: 'em {delta} semanas',
	monthUntil: 'em um mĂŞs',
	monthsUntil: 'em {delta} meses',
	yearUntil: 'em um ano',
	yearsUntil: 'em {delta} anos'

});


/*
---

name: Locale.pt-BR.Date

description: Date messages for Portuguese (Brazil).

license: MIT-style license

authors:
  - Fabio Miranda Costa

requires:
  - /Locale
  - /Locale.pt-PT.Date

provides: [Locale.pt-BR.Date]

...
*/

Locale.define('pt-BR', 'Date', {

	// Culture's date order: DD/MM/YYYY
	shortDate: '%d/%m/%Y'

}).inherit('pt-PT', 'Date');


/*
---

name: Locale.pt-BR.Form.Validator

description: Form Validator messages for Portuguese (Brazil).

license: MIT-style license

authors:
  - FĂˇbio Miranda Costa

requires:
  - /Locale

provides: [Locale.pt-BR.Form.Validator]

...
*/

Locale.define('pt-BR', 'FormValidator', {

	required: 'Este campo Ă© obrigatĂłrio.',
	minLength: 'Digite pelo menos {minLength} caracteres (tamanho atual: {length}).',
	maxLength: 'NĂŁo digite mais de {maxLength} caracteres (tamanho atual: {length}).',
	integer: 'Por favor digite apenas um nĂşmero inteiro neste campo. NĂŁo sĂŁo permitidos nĂşmeros decimais (por exemplo, 1,25).',
	numeric: 'Por favor digite apenas valores numĂ©ricos neste campo (por exemplo, "1" ou "1.1" ou "-1" ou "-1,1").',
	digits: 'Por favor use apenas nĂşmeros e pontuaĂ§ĂŁo neste campo (por exemplo, um nĂşmero de telefone com traĂ§os ou pontos Ă© permitido).',
	alpha: 'Por favor use somente letras (a-z). EspaĂ§o e outros caracteres nĂŁo sĂŁo permitidos.',
	alphanum: 'Use somente letras (a-z) ou nĂşmeros (0-9) neste campo. EspaĂ§o e outros caracteres nĂŁo sĂŁo permitidos.',
	dateSuchAs: 'Digite uma data vĂˇlida, como {date}',
	dateInFormatMDY: 'Digite uma data vĂˇlida, como DD/MM/YYYY (por exemplo, "31/12/1999")',
	email: 'Digite um endereĂ§o de email vĂˇlido. Por exemplo "nome@dominio.com".',
	url: 'Digite uma URL vĂˇlida. Exemplo: http://www.example.com.',
	currencyDollar: 'Digite um valor em dinheiro vĂˇlido. Exemplo: R$100,00 .',
	oneRequired: 'Digite algo para pelo menos um desses campos.',
	errorPrefix: 'Erro: ',
	warningPrefix: 'Aviso: ',

	// Form.Validator.Extras
	noSpace: 'NĂŁo Ă© possĂ­vel digitar espaĂ§os neste campo.',
	reqChkByNode: 'NĂŁo foi selecionado nenhum item.',
	requiredChk: 'Este campo Ă© obrigatĂłrio.',
	reqChkByName: 'Por favor digite um {label}.',
	match: 'Este campo deve ser igual ao campo {matchName}.',
	startDate: 'a data inicial',
	endDate: 'a data final',
	currendDate: 'a data atual',
	afterDate: 'A data deve ser igual ou posterior a {label}.',
	beforeDate: 'A data deve ser igual ou anterior a {label}.',
	startMonth: 'Por favor selecione uma data inicial.',
	sameMonth: 'Estas duas datas devem ter o mesmo mĂŞs - vocĂŞ deve modificar uma das duas.',
	creditcard: 'O nĂşmero do cartĂŁo de crĂ©dito informado Ă© invĂˇlido. Por favor verifique o valor e tente novamente. {length} nĂşmeros informados.'

});


/*
---

name: Locale.pt-PT.Form.Validator

description: Form Validator messages for Portuguese.

license: MIT-style license

authors:
  - Miquel Hudin

requires:
  - /Locale

provides: [Locale.pt-PT.Form.Validator]

...
*/

Locale.define('pt-PT', 'FormValidator', {

	required: 'Este campo Ă© necessĂˇrio.',
	minLength: 'Digite pelo menos{minLength} caracteres (comprimento {length} caracteres).',
	maxLength: 'NĂŁo insira mais de {maxLength} caracteres (comprimento {length} caracteres).',
	integer: 'Digite um nĂşmero inteiro neste domĂ­nio. Com nĂşmeros decimais (por exemplo, 1,25), nĂŁo sĂŁo permitidas.',
	numeric: 'Digite apenas valores numĂ©ricos neste domĂ­nio (p.ex., "1" ou "1.1" ou "-1" ou "-1,1").',
	digits: 'Por favor, use nĂşmeros e pontuaĂ§ĂŁo apenas neste campo (p.ex., um nĂşmero de telefone com traĂ§os ou pontos Ă© permitida).',
	alpha: 'Por favor use somente letras (a-z), com nesta Ăˇrea. NĂŁo utilize espaĂ§os nem outros caracteres sĂŁo permitidos.',
	alphanum: 'Use somente letras (a-z) ou nĂşmeros (0-9) neste campo. NĂŁo utilize espaĂ§os nem outros caracteres sĂŁo permitidos.',
	dateSuchAs: 'Digite uma data vĂˇlida, como {date}',
	dateInFormatMDY: 'Digite uma data vĂˇlida, como DD/MM/YYYY (p.ex. "31/12/1999")',
	email: 'Digite um endereĂ§o de email vĂˇlido. Por exemplo "fred@domain.com".',
	url: 'Digite uma URL vĂˇlida, como http://www.example.com.',
	currencyDollar: 'Digite um valor vĂˇlido $. Por exemplo $ 100,00. ',
	oneRequired: 'Digite algo para pelo menos um desses insumos.',
	errorPrefix: 'Erro: ',
	warningPrefix: 'Aviso: '

});


/*
---

name: Locale.ru-RU-unicode.Date

description: Date messages for Russian (utf-8).

license: MIT-style license

authors:
  - Evstigneev Pavel
  - Kuryanovich Egor

requires:
  - /Locale

provides: [Locale.ru-RU.Date]

...
*/

(function(){

// Russian language pluralization rules, taken from CLDR project, http://unicode.org/cldr/
// one -> n mod 10 is 1 and n mod 100 is not 11;
// few -> n mod 10 in 2..4 and n mod 100 not in 12..14;
// many -> n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14;
// other -> everything else (example 3.14)
var pluralize = function (n, one, few, many, other){
	var modulo10 = n % 10,
		modulo100 = n % 100;

	if (modulo10 == 1 && modulo100 != 11){
		return one;
	} else if ((modulo10 == 2 || modulo10 == 3 || modulo10 == 4) && !(modulo100 == 12 || modulo100 == 13 || modulo100 == 14)){
		return few;
	} else if (modulo10 == 0 || (modulo10 == 5 || modulo10 == 6 || modulo10 == 7 || modulo10 == 8 || modulo10 == 9) || (modulo100 == 11 || modulo100 == 12 || modulo100 == 13 || modulo100 == 14)){
		return many;
	} else {
		return other;
	}
};

Locale.define('ru-RU', 'Date', {

	months: ['ĐŻĐ˝Đ˛Đ°Ń€ŃŚ', 'Đ¤ĐµĐ˛Ń€Đ°Đ»ŃŚ', 'ĐśĐ°Ń€Ń‚', 'Đ�ĐżŃ€ĐµĐ»ŃŚ', 'ĐśĐ°Đą', 'Đ�ŃŽĐ˝ŃŚ', 'Đ�ŃŽĐ»ŃŚ', 'Đ�Đ˛ĐłŃ�Ń�Ń‚', 'ĐˇĐµĐ˝Ń‚ŃŹĐ±Ń€ŃŚ', 'ĐžĐşŃ‚ŃŹĐ±Ń€ŃŚ', 'ĐťĐľŃŹĐ±Ń€ŃŚ', 'Đ”ĐµĐşĐ°Đ±Ń€ŃŚ'],
	months_abbr: ['ŃŹĐ˝Đ˛', 'Ń„ĐµĐ˛Ń€', 'ĐĽĐ°Ń€Ń‚', 'Đ°ĐżŃ€', 'ĐĽĐ°Đą','Đ¸ŃŽĐ˝ŃŚ','Đ¸ŃŽĐ»ŃŚ','Đ°Đ˛Đł','Ń�ĐµĐ˝Ń‚','ĐľĐşŃ‚','Đ˝ĐľŃŹĐ±','Đ´ĐµĐş'],
	days: ['Đ’ĐľŃ�ĐşŃ€ĐµŃ�ĐµĐ˝ŃŚĐµ', 'ĐźĐľĐ˝ĐµĐ´ĐµĐ»ŃŚĐ˝Đ¸Đş', 'Đ’Ń‚ĐľŃ€Đ˝Đ¸Đş', 'ĐˇŃ€ĐµĐ´Đ°', 'Đ§ĐµŃ‚Đ˛ĐµŃ€Đł', 'ĐźŃŹŃ‚Đ˝Đ¸Ń†Đ°', 'ĐˇŃ�Đ±Đ±ĐľŃ‚Đ°'],
	days_abbr: ['Đ’Ń�', 'ĐźĐ˝', 'Đ’Ń‚', 'ĐˇŃ€', 'Đ§Ń‚', 'ĐźŃ‚', 'ĐˇĐ±'],

	// Culture's date order: DD.MM.YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d.%m.%Y',
	shortTime: '%H:%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'ĐĽĐµĐ˝ŃŚŃ�Đµ ĐĽĐ¸Đ˝Ń�Ń‚Ń‹ Đ˝Đ°Đ·Đ°Đ´',
	minuteAgo: 'ĐĽĐ¸Đ˝Ń�Ń‚Ń� Đ˝Đ°Đ·Đ°Đ´',
	minutesAgo: function(delta){ return '{delta} ' + pluralize(delta, 'ĐĽĐ¸Đ˝Ń�Ń‚Ń�', 'ĐĽĐ¸Đ˝Ń�Ń‚Ń‹', 'ĐĽĐ¸Đ˝Ń�Ń‚') + ' Đ˝Đ°Đ·Đ°Đ´'; },
	hourAgo: 'Ń‡Đ°Ń� Đ˝Đ°Đ·Đ°Đ´',
	hoursAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Ń‡Đ°Ń�', 'Ń‡Đ°Ń�Đ°', 'Ń‡Đ°Ń�ĐľĐ˛') + ' Đ˝Đ°Đ·Đ°Đ´'; },
	dayAgo: 'Đ˛Ń‡ĐµŃ€Đ°',
	daysAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Đ´ĐµĐ˝ŃŚ', 'Đ´Đ˝ŃŹ', 'Đ´Đ˝ĐµĐą') + ' Đ˝Đ°Đ·Đ°Đ´'; },
	weekAgo: 'Đ˝ĐµĐ´ĐµĐ»ŃŽ Đ˝Đ°Đ·Đ°Đ´',
	weeksAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Đ˝ĐµĐ´ĐµĐ»ŃŹ', 'Đ˝ĐµĐ´ĐµĐ»Đ¸', 'Đ˝ĐµĐ´ĐµĐ»ŃŚ') + ' Đ˝Đ°Đ·Đ°Đ´'; },
	monthAgo: 'ĐĽĐµŃ�ŃŹŃ† Đ˝Đ°Đ·Đ°Đ´',
	monthsAgo: function(delta){ return '{delta} ' + pluralize(delta, 'ĐĽĐµŃ�ŃŹŃ†', 'ĐĽĐµŃ�ŃŹŃ†Đ°', 'ĐĽĐµŃ�ĐµŃ†ĐµĐ˛') + ' Đ˝Đ°Đ·Đ°Đ´'; },
	yearAgo: 'ĐłĐľĐ´ Đ˝Đ°Đ·Đ°Đ´',
	yearsAgo: function(delta){ return '{delta} ' + pluralize(delta, 'ĐłĐľĐ´', 'ĐłĐľĐ´Đ°', 'Đ»ĐµŃ‚') + ' Đ˝Đ°Đ·Đ°Đ´'; },

	lessThanMinuteUntil: 'ĐĽĐµĐ˝ŃŚŃ�Đµ Ń‡ĐµĐĽ Ń‡ĐµŃ€ĐµĐ· ĐĽĐ¸Đ˝Ń�Ń‚Ń�',
	minuteUntil: 'Ń‡ĐµŃ€ĐµĐ· ĐĽĐ¸Đ˝Ń�Ń‚Ń�',
	minutesUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Ń‡Đ°Ń�', 'Ń‡Đ°Ń�Đ°', 'Ń‡Đ°Ń�ĐľĐ˛') + ''; },
	hourUntil: 'Ń‡ĐµŃ€ĐµĐ· Ń‡Đ°Ń�',
	hoursUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Ń‡Đ°Ń�', 'Ń‡Đ°Ń�Đ°', 'Ń‡Đ°Ń�ĐľĐ˛') + ''; },
	dayUntil: 'Đ·Đ°Đ˛Ń‚Ń€Đ°',
	daysUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Đ´ĐµĐ˝ŃŚ', 'Đ´Đ˝ŃŹ', 'Đ´Đ˝ĐµĐą') + ''; },
	weekUntil: 'Ń‡ĐµŃ€ĐµĐ· Đ˝ĐµĐ´ĐµĐ»ŃŽ',
	weeksUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Đ˝ĐµĐ´ĐµĐ»ŃŽ', 'Đ˝ĐµĐ´ĐµĐ»Đ¸', 'Đ˝ĐµĐ´ĐµĐ»ŃŚ') + ''; },
	monthUntil: 'Ń‡ĐµŃ€ĐµĐ· ĐĽĐµŃ�ŃŹŃ†',
	monthsUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'ĐĽĐµŃ�ŃŹŃ†', 'ĐĽĐµŃ�ŃŹŃ†Đ°', 'ĐĽĐµŃ�ĐµŃ†ĐµĐ˛') + ''; },
	yearUntil: 'Ń‡ĐµŃ€ĐµĐ·',
	yearsUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'ĐłĐľĐ´', 'ĐłĐľĐ´Đ°', 'Đ»ĐµŃ‚') + ''; }

});



})();


/*
---

name: Locale.ru-RU-unicode.Form.Validator

description: Form Validator messages for Russian (utf-8).

license: MIT-style license

authors:
  - Chernodarov Egor

requires:
  - /Locale

provides: [Locale.ru-RU.Form.Validator]

...
*/

Locale.define('ru-RU', 'FormValidator', {

	required: 'Đ­Ń‚Đľ ĐżĐľĐ»Đµ ĐľĐ±ŃŹĐ·Đ°Ń‚ĐµĐ»ŃŚĐ˝Đľ Đş Đ·Đ°ĐżĐľĐ»Đ˝ĐµĐ˝Đ¸ŃŽ.',
	minLength: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ Ń…ĐľŃ‚ŃŹ Đ±Ń‹ {minLength} Ń�Đ¸ĐĽĐ˛ĐľĐ»ĐľĐ˛ (Đ’Ń‹ Đ˛Đ˛ĐµĐ»Đ¸ {length}).',
	maxLength: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ Đ˝Đµ Đ±ĐľĐ»ŃŚŃ�Đµ {maxLength} Ń�Đ¸ĐĽĐ˛ĐľĐ»ĐľĐ˛ (Đ’Ń‹ Đ˛Đ˛ĐµĐ»Đ¸ {length}).',
	integer: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ Đ˛ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ Ń‡Đ¸Ń�Đ»Đľ. Đ”Ń€ĐľĐ±Đ˝Ń‹Đµ Ń‡Đ¸Ń�Đ»Đ° (Đ˝Đ°ĐżŃ€Đ¸ĐĽĐµŃ€ 1.25) Ń‚Ń�Ń‚ Đ˝Đµ Ń€Đ°Đ·Ń€ĐµŃ�ĐµĐ˝Ń‹.',
	numeric: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ Đ˛ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ Ń‡Đ¸Ń�Đ»Đľ (Đ˝Đ°ĐżŃ€Đ¸ĐĽĐµŃ€ "1" Đ¸Đ»Đ¸ "1.1", Đ¸Đ»Đ¸ "-1", Đ¸Đ»Đ¸ "-1.1").',
	digits: 'Đ’ ŃŤŃ‚ĐľĐĽ ĐżĐľĐ»Đµ Đ’Ń‹ ĐĽĐľĐ¶ĐµŃ‚Đµ Đ¸Ń�ĐżĐľĐ»ŃŚĐ·ĐľĐ˛Đ°Ń‚ŃŚ Ń‚ĐľĐ»ŃŚĐşĐľ Ń†Đ¸Ń„Ń€Ń‹ Đ¸ Đ·Đ˝Đ°ĐşĐ¸ ĐżŃ�Đ˝ĐşŃ‚Ń�Đ°Ń†Đ¸Đ¸ (Đ˝Đ°ĐżŃ€Đ¸ĐĽĐµŃ€, Ń‚ĐµĐ»ĐµŃ„ĐľĐ˝Đ˝Ń‹Đą Đ˝ĐľĐĽĐµŃ€ Ń�Đľ Đ·Đ˝Đ°ĐşĐ°ĐĽĐ¸ Đ´ĐµŃ„Đ¸Ń�Đ° Đ¸Đ»Đ¸ Ń� Ń‚ĐľŃ‡ĐşĐ°ĐĽĐ¸).',
	alpha: 'Đ’ ŃŤŃ‚ĐľĐĽ ĐżĐľĐ»Đµ ĐĽĐľĐ¶Đ˝Đľ Đ¸Ń�ĐżĐľĐ»ŃŚĐ·ĐľĐ˛Đ°Ń‚ŃŚ Ń‚ĐľĐ»ŃŚĐşĐľ Đ»Đ°Ń‚Đ¸Đ˝Ń�ĐşĐ¸Đµ Đ±Ń�ĐşĐ˛Ń‹ (a-z). ĐźŃ€ĐľĐ±ĐµĐ»Ń‹ Đ¸ Đ´Ń€Ń�ĐłĐ¸Đµ Ń�Đ¸ĐĽĐ˛ĐľĐ»Ń‹ Đ·Đ°ĐżŃ€ĐµŃ‰ĐµĐ˝Ń‹.',
	alphanum: 'Đ’ ŃŤŃ‚ĐľĐĽ ĐżĐľĐ»Đµ ĐĽĐľĐ¶Đ˝Đľ Đ¸Ń�ĐżĐľĐ»ŃŚĐ·ĐľĐ˛Đ°Ń‚ŃŚ Ń‚ĐľĐ»ŃŚĐşĐľ Đ»Đ°Ń‚Đ¸Đ˝Ń�ĐşĐ¸Đµ Đ±Ń�ĐşĐ˛Ń‹ (a-z) Đ¸ Ń†Đ¸Ń„Ń€Ń‹ (0-9). ĐźŃ€ĐľĐ±ĐµĐ»Ń‹ Đ¸ Đ´Ń€Ń�ĐłĐ¸Đµ Ń�Đ¸ĐĽĐ˛ĐľĐ»Ń‹ Đ·Đ°ĐżŃ€ĐµŃ‰ĐµĐ˝Ń‹.',
	dateSuchAs: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ ĐşĐľŃ€Ń€ĐµĐşŃ‚Đ˝Ń�ŃŽ Đ´Đ°Ń‚Ń� {date}',
	dateInFormatMDY: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ Đ´Đ°Ń‚Ń� Đ˛ Ń„ĐľŃ€ĐĽĐ°Ń‚Đµ ĐśĐś/Đ”Đ”/Đ“Đ“Đ“Đ“ (Đ˝Đ°ĐżŃ€Đ¸ĐĽĐµŃ€ "12/31/1999")',
	email: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ ĐşĐľŃ€Ń€ĐµĐşŃ‚Đ˝Ń‹Đą ĐµĐĽĐµĐąĐ»-Đ°Đ´Ń€ĐµŃ�. Đ”Đ»ŃŹ ĐżŃ€Đ¸ĐĽĐµŃ€Đ° "fred@domain.com".',
	url: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ ĐżŃ€Đ°Đ˛Đ¸Đ»ŃŚĐ˝Ń�ŃŽ Ń�Ń�Ń‹Đ»ĐşŃ� Đ˛Đ¸Đ´Đ° http://www.example.com.',
	currencyDollar: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Đ˛ĐµĐ´Đ¸Ń‚Đµ Ń�Ń�ĐĽĐĽŃ� Đ˛ Đ´ĐľĐ»Đ»Đ°Ń€Đ°Ń…. ĐťĐ°ĐżŃ€Đ¸ĐĽĐµŃ€: $100.00 .',
	oneRequired: 'ĐźĐľĐ¶Đ°Đ»Ń�ĐąŃ�Ń‚Đ°, Đ˛Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Ń…ĐľŃ‚ŃŚ Ń‡Ń‚Đľ-Đ˝Đ¸Đ±Ń�Đ´ŃŚ Đ˛ ĐľĐ´Đ˝ĐľĐĽ Đ¸Đ· ŃŤŃ‚Đ¸Ń… ĐżĐľĐ»ĐµĐą.',
	errorPrefix: 'ĐžŃ�Đ¸Đ±ĐşĐ°: ',
	warningPrefix: 'Đ’Đ˝Đ¸ĐĽĐ°Đ˝Đ¸Đµ: '

});




/*
---

name: Locale.si-SI.Date

description: Date messages for Slovenian.

license: MIT-style license

authors:
  - Radovan Lozej

requires:
  - /Locale

provides: [Locale.si-SI.Date]

...
*/

(function(){

var pluralize = function(n, one, two, three, other){
	return (n >= 1 && n <= 3) ? arguments[n] : other;
};

Locale.define('si-SI', 'Date', {

	months: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
	months_abbr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
	days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'ÄŤetrtek', 'petek', 'sobota'],
	days_abbr: ['ned', 'pon', 'tor', 'sre', 'ÄŤet', 'pet', 'sob'],

	// Culture's date order: DD.MM.YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d.%m.%Y',
	shortTime: '%H.%M',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '.',

	lessThanMinuteAgo: 'manj kot minuto nazaj',
	minuteAgo: 'minuto nazaj',
	minutesAgo: function(delta){ return '{delta} ' + pluralize(delta, 'minuto', 'minuti', 'minute', 'minut') + ' nazaj'; },
	hourAgo: 'uro nazaj',
	hoursAgo: function(delta){ return '{delta} ' + pluralize(delta, 'uro', 'uri', 'ure', 'ur') + ' nazaj'; },
	dayAgo: 'dan nazaj',
	daysAgo: function(delta){ return '{delta} ' + pluralize(delta, 'dan', 'dneva', 'dni', 'dni') + ' nazaj'; },
	weekAgo: 'teden nazaj',
	weeksAgo: function(delta){ return '{delta} ' + pluralize(delta, 'teden', 'tedna', 'tedne', 'tednov') + ' nazaj'; },
	monthAgo: 'mesec nazaj',
	monthsAgo: function(delta){ return '{delta} ' + pluralize(delta, 'mesec', 'meseca', 'mesece', 'mesecov') + ' nazaj'; },
	yearthAgo: 'leto nazaj',
	yearsAgo: function(delta){ return '{delta} ' + pluralize(delta, 'leto', 'leti', 'leta', 'let') + ' nazaj'; },

	lessThanMinuteUntil: 'Ĺˇe manj kot minuto',
	minuteUntil: 'Ĺˇe minuta',
	minutesUntil: function(delta){ return 'Ĺˇe {delta} ' + pluralize(delta, 'minuta', 'minuti', 'minute', 'minut'); },
	hourUntil: 'Ĺˇe ura',
	hoursUntil: function(delta){ return 'Ĺˇe {delta} ' + pluralize(delta, 'ura', 'uri', 'ure', 'ur'); },
	dayUntil: 'Ĺˇe dan',
	daysUntil: function(delta){ return 'Ĺˇe {delta} ' + pluralize(delta, 'dan', 'dneva', 'dnevi', 'dni'); },
	weekUntil: 'Ĺˇe tedn',
	weeksUntil: function(delta){ return 'Ĺˇe {delta} ' + pluralize(delta, 'teden', 'tedna', 'tedni', 'tednov'); },
	monthUntil: 'Ĺˇe mesec',
	monthsUntil: function(delta){ return 'Ĺˇe {delta} ' + pluralize(delta, 'mesec', 'meseca', 'meseci', 'mesecov'); },
	yearUntil: 'Ĺˇe leto',
	yearsUntil: function(delta){ return 'Ĺˇe {delta} ' + pluralize(delta, 'leto', 'leti', 'leta', 'let'); }

});

})();


/*
---

name: Locale.si-SI.Form.Validator

description: Form Validator messages for Slovenian.

license: MIT-style license

authors:
  - Radovan Lozej

requires:
  - /Locale

provides: [Locale.si-SI.Form.Validator]

...
*/

Locale.define('si-SI', 'FormValidator', {

	required: 'To polje je obvezno',
	minLength: 'Prosim, vnesite vsaj {minLength} znakov (vnesli ste {length} znakov).',
	maxLength: 'Prosim, ne vnesite veÄŤ kot {maxLength} znakov (vnesli ste {length} znakov).',
	integer: 'Prosim, vnesite celo Ĺˇtevilo. Decimalna Ĺˇtevila (kot 1,25) niso dovoljena.',
	numeric: 'Prosim, vnesite samo numeriÄŤne vrednosti (kot "1" ali "1.1" ali "-1" ali "-1.1").',
	digits: 'Prosim, uporabite Ĺˇtevilke in loÄŤila le na tem polju (na primer, dovoljena je telefonska Ĺˇtevilka z pomiĹˇlaji ali pikami).',
	alpha: 'Prosim, uporabite le ÄŤrke v tem plju. Presledki in drugi znaki niso dovoljeni.',
	alphanum: 'Prosim, uporabite samo ÄŤrke ali Ĺˇtevilke v tem polju. Presledki in drugi znaki niso dovoljeni.',
	dateSuchAs: 'Prosim, vnesite pravilen datum kot {date}',
	dateInFormatMDY: 'Prosim, vnesite pravilen datum kot MM.DD.YYYY (primer "12.31.1999")',
	email: 'Prosim, vnesite pravilen email naslov. Na primer "fred@domain.com".',
	url: 'Prosim, vnesite pravilen URL kot http://www.example.com.',
	currencyDollar: 'Prosim, vnesit epravilno vrednost â‚¬. Primer 100,00â‚¬ .',
	oneRequired: 'Prosimo, vnesite nekaj za vsaj eno izmed teh polj.',
	errorPrefix: 'Napaka: ',
	warningPrefix: 'Opozorilo: ',

	// Form.Validator.Extras
	noSpace: 'To vnosno polje ne dopuĹˇÄŤa presledkov.',
	reqChkByNode: 'NiÄŤ niste izbrali.',
	requiredChk: 'To polje je obvezno',
	reqChkByName: 'Prosim, izberite {label}.',
	match: 'To polje se mora ujemati z poljem {matchName}',
	startDate: 'datum zaÄŤetka',
	endDate: 'datum konca',
	currendDate: 'trenuten datum',
	afterDate: 'Datum bi moral biti isti ali po {label}.',
	beforeDate: 'Datum bi moral biti isti ali pred {label}.',
	startMonth: 'Prosim, vnesite zaÄŤetni datum',
	sameMonth: 'Ta dva datuma morata biti v istem mesecu - premeniti morate eno ali drugo.',
	creditcard: 'Ĺ tevilka kreditne kartice ni pravilna. Preverite Ĺˇtevilko ali poskusite Ĺˇe enkrat. VneĹˇenih {length} znakov.'

});


/*
---

name: Locale.sv-SE.Date

description: Date messages for Swedish.

license: MIT-style license

authors:
  - Martin Lundgren

requires:
  - /Locale

provides: [Locale.sv-SE.Date]

...
*/

Locale.define('sv-SE', 'Date', {

	months: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
	months_abbr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
	days: ['sĂ¶ndag', 'mĂĄndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lĂ¶rdag'],
	days_abbr: ['sĂ¶n', 'mĂĄn', 'tis', 'ons', 'tor', 'fre', 'lĂ¶r'],

	// Culture's date order: YYYY-MM-DD
	dateOrder: ['year', 'month', 'date'],
	shortDate: '%Y-%m-%d',
	shortTime: '%H:%M',
	AM: '',
	PM: '',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'mindre Ă¤n en minut sedan',
	minuteAgo: 'ungefĂ¤r en minut sedan',
	minutesAgo: '{delta} minuter sedan',
	hourAgo: 'ungefĂ¤r en timme sedan',
	hoursAgo: 'ungefĂ¤r {delta} timmar sedan',
	dayAgo: '1 dag sedan',
	daysAgo: '{delta} dagar sedan',

	lessThanMinuteUntil: 'mindre Ă¤n en minut sedan',
	minuteUntil: 'ungefĂ¤r en minut sedan',
	minutesUntil: '{delta} minuter sedan',
	hourUntil: 'ungefĂ¤r en timme sedan',
	hoursUntil: 'ungefĂ¤r {delta} timmar sedan',
	dayUntil: '1 dag sedan',
	daysUntil: '{delta} dagar sedan'

});


/*
---

name: Locale.sv-SE.Form.Validator

description: Form Validator messages for Swedish.

license: MIT-style license

authors:
  - Martin Lundgren

requires:
  - /Locale

provides: [Locale.sv-SE.Form.Validator]

...
*/

Locale.define('sv-SE', 'FormValidator', {

	required: 'FĂ¤ltet Ă¤r obligatoriskt.',
	minLength: 'Ange minst {minLength} tecken (du angav {length} tecken).',
	maxLength: 'Ange hĂ¶gst {maxLength} tecken (du angav {length} tecken). ',
	integer: 'Ange ett heltal i fĂ¤ltet. Tal med decimaler (t.ex. 1,25) Ă¤r inte tillĂĄtna.',
	numeric: 'Ange endast numeriska vĂ¤rden i detta fĂ¤lt (t.ex. "1" eller "1.1" eller "-1" eller "-1,1").',
	digits: 'AnvĂ¤nd endast siffror och skiljetecken i detta fĂ¤lt (till exempel ett telefonnummer med bindestreck tillĂĄtet).',
	alpha: 'AnvĂ¤nd endast bokstĂ¤ver (a-Ă¶) i detta fĂ¤lt. Inga mellanslag eller andra tecken Ă¤r tillĂĄtna.',
	alphanum: 'AnvĂ¤nd endast bokstĂ¤ver (a-Ă¶) och siffror (0-9) i detta fĂ¤lt. Inga mellanslag eller andra tecken Ă¤r tillĂĄtna.',
	dateSuchAs: 'Ange ett giltigt datum som t.ex. {date}',
	dateInFormatMDY: 'Ange ett giltigt datum som t.ex. YYYY-MM-DD (i.e. "1999-12-31")',
	email: 'Ange en giltig e-postadress. Till exempel "erik@domain.com".',
	url: 'Ange en giltig webbadress som http://www.example.com.',
	currencyDollar: 'Ange en giltig belopp. Exempelvis 100,00.',
	oneRequired: 'VĂ¤nligen ange minst ett av dessa alternativ.',
	errorPrefix: 'Fel: ',
	warningPrefix: 'Varning: ',

	// Form.Validator.Extras
	noSpace: 'Det fĂĄr inte finnas nĂĄgra mellanslag i detta fĂ¤lt.',
	reqChkByNode: 'Inga objekt Ă¤r valda.',
	requiredChk: 'Detta Ă¤r ett obligatoriskt fĂ¤lt.',
	reqChkByName: 'VĂ¤lj en {label}.',
	match: 'Detta fĂ¤lt mĂĄste matcha {matchName}',
	startDate: 'startdatumet',
	endDate: 'slutdatum',
	currendDate: 'dagens datum',
	afterDate: 'Datumet bĂ¶r vara samma eller senare Ă¤n {label}.',
	beforeDate: 'Datumet bĂ¶r vara samma eller tidigare Ă¤n {label}.',
	startMonth: 'VĂ¤lj en start mĂĄnad',
	sameMonth: 'Dessa tvĂĄ datum mĂĄste vara i samma mĂĄnad - du mĂĄste Ă¤ndra det ena eller det andra.'

});


/*
---

name: Locale.uk-UA.Date

description: Date messages for Ukrainian (utf-8).

license: MIT-style license

authors:
  - Slik

requires:
  - /Locale

provides: [Locale.uk-UA.Date]

...
*/

(function(){

var pluralize = function(n, one, few, many, other){
	var d = (n / 10).toInt(),
		z = n % 10,
		s = (n / 100).toInt();

	if (d == 1 && n > 10) return many;
	if (z == 1) return one;
	if (z > 0 && z < 5) return few;
	return many;
};

Locale.define('uk-UA', 'Date', {

	months: ['ĐˇŃ–Ń‡ĐµĐ˝ŃŚ', 'Đ›ŃŽŃ‚Đ¸Đą', 'Đ‘ĐµŃ€ĐµĐ·ĐµĐ˝ŃŚ', 'ĐšĐ˛Ń–Ń‚ĐµĐ˝ŃŚ', 'Đ˘Ń€Đ°Đ˛ĐµĐ˝ŃŚ', 'Đ§ĐµŃ€Đ˛ĐµĐ˝ŃŚ', 'Đ›Đ¸ĐżĐµĐ˝ŃŚ', 'ĐˇĐµŃ€ĐżĐµĐ˝ŃŚ', 'Đ’ĐµŃ€ĐµŃ�ĐµĐ˝ŃŚ', 'Đ–ĐľĐ˛Ń‚ĐµĐ˝ŃŚ', 'Đ›Đ¸Ń�Ń‚ĐľĐżĐ°Đ´', 'Đ“Ń€Ń�Đ´ĐµĐ˝ŃŚ'],
	months_abbr: ['ĐˇŃ–Ń‡', 'Đ›ŃŽŃ‚', 'Đ‘ĐµŃ€', 'ĐšĐ˛Ń–Ń‚', 'Đ˘Ń€Đ°Đ˛', 'Đ§ĐµŃ€Đ˛', 'Đ›Đ¸Đż', 'ĐˇĐµŃ€Đż', 'Đ’ĐµŃ€', 'Đ–ĐľĐ˛Ń‚', 'Đ›Đ¸Ń�Ń‚', 'Đ“Ń€Ń�Đ´' ],
	days: ['ĐťĐµĐ´Ń–Đ»ŃŹ', 'ĐźĐľĐ˝ĐµĐ´Ń–Đ»ĐľĐş', 'Đ’Ń–Đ˛Ń‚ĐľŃ€ĐľĐş', 'ĐˇĐµŃ€ĐµĐ´Đ°', 'Đ§ĐµŃ‚Đ˛ĐµŃ€', "Đź'ŃŹŃ‚Đ˝Đ¸Ń†ŃŹ", 'ĐˇŃ�Đ±ĐľŃ‚Đ°'],
	days_abbr: ['ĐťĐ´', 'ĐźĐ˝', 'Đ’Ń‚', 'ĐˇŃ€', 'Đ§Ń‚', 'ĐźŃ‚', 'ĐˇĐ±'],

	// Culture's date order: DD/MM/YYYY
	dateOrder: ['date', 'month', 'year'],
	shortDate: '%d/%m/%Y',
	shortTime: '%H:%M',
	AM: 'Đ´Đľ ĐżĐľĐ»Ń�Đ´Đ˝ŃŹ',
	PM: 'ĐżĐľ ĐżĐľĐ»Ń�Đ´Đ˝ŃŽ',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'ĐĽĐµĐ˝ŃŚŃ�Đµ Ń…Đ˛Đ¸Đ»Đ¸Đ˝Đ¸ Ń‚ĐľĐĽŃ�',
	minuteAgo: 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝Ń� Ń‚ĐľĐĽŃ�',
	minutesAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝Ń�', 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝Đ¸', 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝') + ' Ń‚ĐľĐĽŃ�'; },
	hourAgo: 'ĐłĐľĐ´Đ¸Đ˝Ń� Ń‚ĐľĐĽŃ�',
	hoursAgo: function(delta){ return '{delta} ' + pluralize(delta, 'ĐłĐľĐ´Đ¸Đ˝Ń�', 'ĐłĐľĐ´Đ¸Đ˝Đ¸', 'ĐłĐľĐ´Đ¸Đ˝') + ' Ń‚ĐľĐĽŃ�'; },
	dayAgo: 'Đ˛Ń‡ĐľŃ€Đ°',
	daysAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Đ´ĐµĐ˝ŃŚ', 'Đ´Đ˝ŃŹ', 'Đ´Đ˝Ń–Đ˛') + ' Ń‚ĐľĐĽŃ�'; },
	weekAgo: 'Ń‚Đ¸Đ¶Đ´ĐµĐ˝ŃŚ Ń‚ĐľĐĽŃ�',
	weeksAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Ń‚Đ¸Đ¶Đ´ĐµĐ˝ŃŚ', 'Ń‚Đ¸Đ¶Đ˝Ń–', 'Ń‚Đ¸Đ¶Đ˝Ń–Đ˛') + ' Ń‚ĐľĐĽŃ�'; },
	monthAgo: 'ĐĽŃ–Ń�ŃŹŃ†ŃŚ Ń‚ĐľĐĽŃ�',
	monthsAgo: function(delta){ return '{delta} ' + pluralize(delta, 'ĐĽŃ–Ń�ŃŹŃ†ŃŚ', 'ĐĽŃ–Ń�ŃŹŃ†Ń–', 'ĐĽŃ–Ń�ŃŹŃ†Ń–Đ˛') + ' Ń‚ĐľĐĽŃ�'; },
	yearAgo: 'Ń€Ń–Đş Ń‚ĐľĐĽŃ�',
	yearsAgo: function(delta){ return '{delta} ' + pluralize(delta, 'Ń€Ń–Đş', 'Ń€ĐľĐşĐ¸', 'Ń€ĐľĐşŃ–Đ˛') + ' Ń‚ĐľĐĽŃ�'; },

	lessThanMinuteUntil: 'Đ·Đ° ĐĽĐ¸Ń‚ŃŚ',
	minuteUntil: 'Ń‡ĐµŃ€ĐµĐ· Ń…Đ˛Đ¸Đ»Đ¸Đ˝Ń�',
	minutesUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝Ń�', 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝Đ¸', 'Ń…Đ˛Đ¸Đ»Đ¸Đ˝'); },
	hourUntil: 'Ń‡ĐµŃ€ĐµĐ· ĐłĐľĐ´Đ¸Đ˝Ń�',
	hoursUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'ĐłĐľĐ´Đ¸Đ˝Ń�', 'ĐłĐľĐ´Đ¸Đ˝Đ¸', 'ĐłĐľĐ´Đ¸Đ˝'); },
	dayUntil: 'Đ·Đ°Đ˛Ń‚Ń€Đ°',
	daysUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Đ´ĐµĐ˝ŃŚ', 'Đ´Đ˝ŃŹ', 'Đ´Đ˝Ń–Đ˛'); },
	weekUntil: 'Ń‡ĐµŃ€ĐµĐ· Ń‚Đ¸Đ¶Đ´ĐµĐ˝ŃŚ',
	weeksUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Ń‚Đ¸Đ¶Đ´ĐµĐ˝ŃŚ', 'Ń‚Đ¸Đ¶Đ˝Ń–', 'Ń‚Đ¸Đ¶Đ˝Ń–Đ˛'); },
	monthUntil: 'Ń‡ĐµŃ€ĐµĐ· ĐĽŃ–Ń�ŃŹŃ†ŃŚ',
	monthesUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'ĐĽŃ–Ń�ŃŹŃ†ŃŚ', 'ĐĽŃ–Ń�ŃŹŃ†Ń–', 'ĐĽŃ–Ń�ŃŹŃ†Ń–Đ˛'); },
	yearUntil: 'Ń‡ĐµŃ€ĐµĐ· Ń€Ń–Đş',
	yearsUntil: function(delta){ return 'Ń‡ĐµŃ€ĐµĐ· {delta} ' + pluralize(delta, 'Ń€Ń–Đş', 'Ń€ĐľĐşĐ¸', 'Ń€ĐľĐşŃ–Đ˛'); }

});

})();


/*
---

name: Locale.uk-UA.Form.Validator

description: Form Validator messages for Ukrainian (utf-8).

license: MIT-style license

authors:
  - Slik

requires:
  - /Locale

provides: [Locale.uk-UA.Form.Validator]

...
*/

Locale.define('uk-UA', 'FormValidator', {

	required: 'Đ¦Đµ ĐżĐľĐ»Đµ ĐżĐľĐ˛Đ¸Đ˝Đ˝Đµ Đ±Ń�Ń‚Đ¸ Đ·Đ°ĐżĐľĐ˛Đ˝ĐµĐ˝Đ¸ĐĽ.',
	minLength: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ Ń…ĐľŃ‡Đ° Đ± {minLength} Ń�Đ¸ĐĽĐ˛ĐľĐ»Ń–Đ˛ (Đ’Đ¸ Đ˛Đ˛ĐµĐ»Đ¸ {length}).',
	maxLength: 'ĐšŃ–Đ»ŃŚĐşŃ–Ń�Ń‚ŃŚ Ń�Đ¸ĐĽĐ˛ĐľĐ»Ń–Đ˛ Đ˝Đµ ĐĽĐľĐ¶Đµ Đ±Ń�Ń‚Đ¸ Đ±Ń–Đ»ŃŚŃ�Đµ {maxLength} (Đ’Đ¸ Đ˛Đ˛ĐµĐ»Đ¸ {length}).',
	integer: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ Đ˛ Ń†Đµ ĐżĐľĐ»Đµ Ń‡Đ¸Ń�Đ»Đľ. Đ”Ń€ĐľĐ±ĐľĐ˛Ń– Ń‡Đ¸Ń�Đ»Đ° (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´ 1.25) Đ˝Đµ Đ´ĐľĐ·Đ˛ĐľĐ»ĐµĐ˝Ń–.',
	numeric: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ Đ˛ Ń†Đµ ĐżĐľĐ»Đµ Ń‡Đ¸Ń�Đ»Đľ (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´ "1" Đ°Đ±Đľ "1.1", Đ°Đ±Đľ "-1", Đ°Đ±Đľ "-1.1").',
	digits: 'Đ’ Ń†ŃŚĐľĐĽŃ� ĐżĐľĐ»Ń– Đ˛Đ¸ ĐĽĐľĐ¶ĐµŃ‚Đµ Đ˛Đ¸ĐşĐľŃ€Đ¸Ń�Ń‚ĐľĐ˛Ń�Đ˛Đ°Ń‚Đ¸ Đ»Đ¸Ń�Đµ Ń†Đ¸Ń„Ń€Đ¸ Ń– Đ·Đ˝Đ°ĐşĐ¸ ĐżŃ�Đ˝ĐşŃ‚Ń–Đ°Ń†Ń–Ń— (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´, Ń‚ĐµĐ»ĐµŃ„ĐľĐ˝Đ˝Đ¸Đą Đ˝ĐľĐĽĐµŃ€ Đ· Đ·Đ˝Đ°ĐşĐ°ĐĽĐ¸ Đ´ĐµŃ„Ń–Đ·Ń� Đ°Đ±Đľ Đ· ĐşŃ€Đ°ĐżĐşĐ°ĐĽĐ¸).',
	alpha: 'Đ’ Ń†ŃŚĐľĐĽŃ� ĐżĐľĐ»Ń– ĐĽĐľĐ¶Đ˝Đ° Đ˛Đ¸ĐşĐľŃ€Đ¸Ń�Ń‚ĐľĐ˛Ń�Đ˛Đ°Ń‚Đ¸ Đ»Đ¸Ń�Đµ Đ»Đ°Ń‚Đ¸Đ˝Ń�ŃŚĐşŃ– Đ»Ń–Ń‚ĐµŃ€Đ¸ (a-z). ĐźŃ€ĐľĐ±Ń–Đ»Đ¸ Ń– Ń–Đ˝Ń�Ń– Ń�Đ¸ĐĽĐ˛ĐľĐ»Đ¸ Đ·Đ°Đ±ĐľŃ€ĐľĐ˝ĐµĐ˝Ń–.',
	alphanum: 'Đ’ Ń†ŃŚĐľĐĽŃ� ĐżĐľĐ»Ń– ĐĽĐľĐ¶Đ˝Đ° Đ˛Đ¸ĐşĐľŃ€Đ¸Ń�Ń‚ĐľĐ˛Ń�Đ˛Đ°Ń‚Đ¸ Đ»Đ¸Ń�Đµ Đ»Đ°Ń‚Đ¸Đ˝Ń�ŃŚĐşŃ– Đ»Ń–Ń‚ĐµŃ€Đ¸ (a-z) Ń– Ń†Đ¸Ń„Ń€Đ¸ (0-9). ĐźŃ€ĐľĐ±Ń–Đ»Đ¸ Ń– Ń–Đ˝Ń�Ń– Ń�Đ¸ĐĽĐ˛ĐľĐ»Đ¸ Đ·Đ°Đ±ĐľŃ€ĐľĐ˝ĐµĐ˝Ń–.',
	dateSuchAs: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ ĐşĐľŃ€ĐµĐşŃ‚Đ˝Ń� Đ´Đ°Ń‚Ń� {date}.',
	dateInFormatMDY: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ Đ´Đ°Ń‚Ń� Đ˛ Ń„ĐľŃ€ĐĽĐ°Ń‚Ń– ĐśĐś/Đ”Đ”/Đ Đ Đ Đ  (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´ "12/31/2009").',
	email: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ ĐşĐľŃ€ĐµĐşŃ‚Đ˝Ń� Đ°Đ´Ń€ĐµŃ�Ń� ĐµĐ»ĐµĐşŃ‚Ń€ĐľĐ˝Đ˝ĐľŃ— ĐżĐľŃ�Ń‚Đ¸ (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´ "name@domain.com").',
	url: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ ĐşĐľŃ€ĐµĐşŃ‚Đ˝Đµ Ń–Đ˝Ń‚ĐµŃ€Đ˝ĐµŃ‚-ĐżĐľŃ�Đ¸Đ»Đ°Đ˝Đ˝ŃŹ (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´ http://www.example.com).',
	currencyDollar: 'Đ’Đ˛ĐµĐ´Ń–Ń‚ŃŚ Ń�Ń�ĐĽŃ� Đ˛ Đ´ĐľĐ»Đ°Ń€Đ°Ń… (Đ˝Đ°ĐżŃ€Đ¸ĐşĐ»Đ°Đ´ "$100.00").',
	oneRequired: 'Đ—Đ°ĐżĐľĐ˛Đ˝Ń–Ń‚ŃŚ ĐľĐ´Đ˝Đµ Đ· ĐżĐľĐ»Ń–Đ˛.',
	errorPrefix: 'ĐźĐľĐĽĐ¸Đ»ĐşĐ°: ',
	warningPrefix: 'ĐŁĐ˛Đ°ĐłĐ°: ',

	noSpace: 'ĐźŃ€ĐľĐ±Ń–Đ»Đ¸ Đ·Đ°Đ±ĐľŃ€ĐľĐ˝ĐµĐ˝Ń–.',
	reqChkByNode: 'ĐťĐµ Đ˛Ń–Đ´ĐĽŃ–Ń‡ĐµĐ˝Đľ Đ¶ĐľĐ´Đ˝ĐľĐłĐľ Đ˛Đ°Ń€Ń–Đ°Đ˝Ń‚Ń�.',
	requiredChk: 'Đ¦Đµ ĐżĐľĐ»Đµ ĐżĐľĐ˛Đ¸Đ˝Đ˝Đµ Đ±Ń�Ń‚Đ¸ Đ˛Ń–ĐĽŃ–Ń‡ĐµĐ˝Đ¸ĐĽ.',
	reqChkByName: 'Đ‘Ń�Đ´ŃŚ Đ»Đ°Ń�ĐşĐ°, Đ˛Ń–Đ´ĐĽŃ–Ń‚ŃŚŃ‚Đµ {label}.',
	match: 'Đ¦Đµ ĐżĐľĐ»Đµ ĐżĐľĐ˛Đ¸Đ˝Đ˝Đľ Đ˛Ń–Đ´ĐżĐľĐ˛Ń–Đ´Đ°Ń‚Đ¸ {matchName}',
	startDate: 'ĐżĐľŃ‡Đ°Ń‚ĐşĐľĐ˛Đ° Đ´Đ°Ń‚Đ°',
	endDate: 'ĐşŃ–Đ˝Ń†ĐµĐ˛Đ° Đ´Đ°Ń‚Đ°',
	currendDate: 'Ń�ŃŚĐľĐłĐľĐ´Đ˝Ń–Ń�Đ˝ŃŹ Đ´Đ°Ń‚Đ°',
	afterDate: 'Đ¦ŃŹ Đ´Đ°Ń‚Đ° ĐżĐľĐ˛Đ¸Đ˝Đ˝Đ° Đ±Ń�Ń‚Đ¸ Ń‚Đ°ĐşĐľŃŽ Đ¶, Đ°Đ±Đľ ĐżŃ–Đ·Đ˝Ń–Ń�ĐľŃŽ Đ·Đ° {label}.',
	beforeDate: 'Đ¦ŃŹ Đ´Đ°Ń‚Đ° ĐżĐľĐ˛Đ¸Đ˝Đ˝Đ° Đ±Ń�Ń‚Đ¸ Ń‚Đ°ĐşĐľŃŽ Đ¶, Đ°Đ±Đľ Ń€Đ°Đ˝Ń–Ń�ĐľŃŽ Đ·Đ° {label}.',
	startMonth: 'Đ‘Ń�Đ´ŃŚ Đ»Đ°Ń�ĐşĐ°, Đ˛Đ¸Đ±ĐµŃ€Ń–Ń‚ŃŚ ĐżĐľŃ‡Đ°Ń‚ĐşĐľĐ˛Đ¸Đą ĐĽŃ–Ń�ŃŹŃ†ŃŚ',
	sameMonth: 'Đ¦Ń– Đ´Đ°Ń‚Đ¸ ĐżĐľĐ˛Đ¸Đ˝Đ˝Ń– Đ˛Ń–Đ´Đ˝ĐľŃ�Đ¸Ń‚Đ¸Ń�ŃŚ ĐľĐ´Đ˝ĐľĐłĐľ Ń– Ń‚ĐľĐłĐľ Đ¶ ĐĽŃ–Ń�ŃŹŃ†ŃŹ. Đ‘Ń�Đ´ŃŚ Đ»Đ°Ń�ĐşĐ°, Đ·ĐĽŃ–Đ˝Ń–Ń‚ŃŚ ĐľĐ´Đ˝Ń� Đ· Đ˝Đ¸Ń….',
	creditcard: 'ĐťĐľĐĽĐµŃ€ ĐşŃ€ĐµĐ´Đ¸Ń‚Đ˝ĐľŃ— ĐşĐ°Ń€Ń‚Đ¸ Đ˛Đ˛ĐµĐ´ĐµĐ˝Đ¸Đą Đ˝ĐµĐżŃ€Đ°Đ˛Đ¸Đ»ŃŚĐ˝Đľ. Đ‘Ń�Đ´ŃŚ Đ»Đ°Ń�ĐşĐ°, ĐżĐµŃ€ĐµĐ˛Ń–Ń€Ń‚Đµ ĐąĐľĐłĐľ. Đ’Đ˛ĐµĐ´ĐµĐ˝Đľ {length} Ń�Đ¸ĐĽĐ˛ĐľĐ»Ń–Đ˛.'

});


/*
---

name: Locale.zh-CH.Date

description: Date messages for Chinese (simplified and traditional).

license: MIT-style license

authors:
  - YMind Chan

requires:
  - /Locale

provides: [Locale.zh-CH.Date]

...
*/

// Simplified Chinese
Locale.define('zh-CHS', 'Date', {

	months: ['ä¸€ćś�', 'äşŚćś�', 'ä¸‰ćś�', 'ĺ››ćś�', 'äş”ćś�', 'ĺ…­ćś�', 'ä¸�ćś�', 'ĺ…«ćś�', 'äąťćś�', 'ĺŤ�ćś�', 'ĺŤ�ä¸€ćś�', 'ĺŤ�äşŚćś�'],
	months_abbr: ['ä¸€', 'äşŚ', 'ä¸‰', 'ĺ››', 'äş”', 'ĺ…­', 'ä¸�', 'ĺ…«', 'äąť', 'ĺŤ�', 'ĺŤ�ä¸€', 'ĺŤ�äşŚ'],
	days: ['ć�źćśźć—Ą', 'ć�źćśźä¸€', 'ć�źćśźäşŚ', 'ć�źćśźä¸‰', 'ć�źćśźĺ››', 'ć�źćśźäş”', 'ć�źćśźĺ…­'],
	days_abbr: ['ć—Ą', 'ä¸€', 'äşŚ', 'ä¸‰', 'ĺ››', 'äş”', 'ĺ…­'],

	// Culture's date order: YYYY-MM-DD
	dateOrder: ['year', 'month', 'date'],
	shortDate: '%Y-%m-%d',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'ä¸Ťĺ�°1ĺ�†é’źĺ‰Ť',
	minuteAgo: 'ĺ¤§çş¦1ĺ�†é’źĺ‰Ť',
	minutesAgo: '{delta}ĺ�†é’źäą‹ĺ‰Ť',
	hourAgo: 'ĺ¤§çş¦1ĺ°Źć—¶ĺ‰Ť',
	hoursAgo: 'ĺ¤§çş¦{delta}ĺ°Źć—¶ĺ‰Ť',
	dayAgo: '1ĺ¤©ĺ‰Ť',
	daysAgo: '{delta}ĺ¤©ĺ‰Ť',
	weekAgo: '1ć�źćśźĺ‰Ť',
	weeksAgo: '{delta}ć�źćśźĺ‰Ť',
	monthAgo: '1ä¸Şćś�ĺ‰Ť',
	monthsAgo: '{delta}ä¸Şćś�ĺ‰Ť',
	yearAgo: '1ĺą´ĺ‰Ť',
	yearsAgo: '{delta}ĺą´ĺ‰Ť',

	lessThanMinuteUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹ä¸Ťĺ�°1ĺ�†é’ź',
	minuteUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹ç´„1ĺ�†é’ź',
	minutesUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹çş¦{delta}ĺ�†é’ź',
	hourUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹1ĺ°Źć—¶',
	hoursUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹çş¦{delta}ĺ°Źć—¶',
	dayUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹1ĺ¤©',
	daysUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹{delta}ĺ¤©',
	weekUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹1ć�źćśź',
	weeksUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹{delta}ć�źćśź',
	monthUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹ä¸€ä¸Şćś�',
	monthsUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹{delta}ä¸Şćś�',
	yearUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹1ĺą´',
	yearsUntil: 'ä»ŽçŽ°ĺś¨ĺĽ€ĺ§‹{delta}ĺą´'

});

// Traditional Chinese
Locale.define('zh-CHT', 'Date', {

	months: ['ä¸€ćś�', 'äşŚćś�', 'ä¸‰ćś�', 'ĺ››ćś�', 'äş”ćś�', 'ĺ…­ćś�', 'ä¸�ćś�', 'ĺ…«ćś�', 'äąťćś�', 'ĺŤ�ćś�', 'ĺŤ�ä¸€ćś�', 'ĺŤ�äşŚćś�'],
	months_abbr: ['ä¸€', 'äşŚ', 'ä¸‰', 'ĺ››', 'äş”', 'ĺ…­', 'ä¸�', 'ĺ…«', 'äąť', 'ĺŤ�', 'ĺŤ�ä¸€', 'ĺŤ�äşŚ'],
	days: ['ć�źćśźć—Ą', 'ć�źćśźä¸€', 'ć�źćśźäşŚ', 'ć�źćśźä¸‰', 'ć�źćśźĺ››', 'ć�źćśźäş”', 'ć�źćśźĺ…­'],
	days_abbr: ['ć—Ą', 'ä¸€', 'äşŚ', 'ä¸‰', 'ĺ››', 'äş”', 'ĺ…­'],

	// Culture's date order: YYYY-MM-DD
	dateOrder: ['year', 'month', 'date'],
	shortDate: '%Y-%m-%d',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 1,

	// Date.Extras
	ordinal: '',

	lessThanMinuteAgo: 'ä¸Ťĺ�°1ĺ�†é��ĺ‰Ť',
	minuteAgo: 'ĺ¤§ç´„1ĺ�†é��ĺ‰Ť',
	minutesAgo: '{delta}ĺ�†é��äą‹ĺ‰Ť',
	hourAgo: 'ĺ¤§ç´„1ĺ°Źć™‚ĺ‰Ť',
	hoursAgo: 'ĺ¤§ç´„{delta}ĺ°Źć™‚ĺ‰Ť',
	dayAgo: '1ĺ¤©ĺ‰Ť',
	daysAgo: '{delta}ĺ¤©ĺ‰Ť',
	weekAgo: '1ć�źćśźĺ‰Ť',
	weeksAgo: '{delta}ć�źćśźĺ‰Ť',
	monthAgo: '1ä¸Şćś�ĺ‰Ť',
	monthsAgo: '{delta}ä¸Şćś�ĺ‰Ť',
	yearAgo: '1ĺą´ĺ‰Ť',
	yearsAgo: '{delta}ĺą´ĺ‰Ť',

	lessThanMinuteUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹ä¸Ťĺ�°1ĺ�†é��',
	minuteUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹ç´„1ĺ�†é��',
	minutesUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹ç´„{delta}ĺ�†é��',
	hourUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹1ĺ°Źć™‚',
	hoursUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹ç´„{delta}ĺ°Źć™‚',
	dayUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹1ĺ¤©',
	daysUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹{delta}ĺ¤©',
	weekUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹1ć�źćśź',
	weeksUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹{delta}ć�źćśź',
	monthUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹ä¸€ĺ€‹ćś�',
	monthsUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹{delta}ĺ€‹ćś�',
	yearUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹1ĺą´',
	yearsUntil: 'ĺľžçŹľĺś¨é–‹ĺ§‹{delta}ĺą´'

});


/*
---

name: Locale.zh-CH.Form.Validator

description: Form Validator messages for Chinese (simplified and traditional).

license: MIT-style license

authors:
  - YMind Chan

requires:
  - /Locale
  - /Form.Validator

provides: [Form.zh-CH.Form.Validator, Form.Validator.CurrencyYuanValidator]

...
*/

// Simplified Chinese
Locale.define('zh-CHS', 'FormValidator', {

	required: 'ć­¤éˇąĺż…ĺˇ«ă€‚',
	minLength: 'čŻ·č‡łĺ°‘čľ“ĺ…Ą {minLength} ä¸Şĺ­—ç¬¦ (ĺ·˛čľ“ĺ…Ą {length} ä¸Ş)ă€‚',
	maxLength: 'ćś€ĺ¤šĺŹŞč�˝čľ“ĺ…Ą {maxLength} ä¸Şĺ­—ç¬¦ (ĺ·˛čľ“ĺ…Ą {length} ä¸Ş)ă€‚',
	integer: 'čŻ·čľ“ĺ…Ąä¸€ä¸Şć•´ć•°ďĽŚä¸Ťč�˝ĺŚ…ĺ�«ĺ°Źć•°ç‚ąă€‚äľ‹ĺ¦‚ďĽš"1", "200"ă€‚',
	numeric: 'čŻ·čľ“ĺ…Ąä¸€ä¸Şć•°ĺ­—ďĽŚäľ‹ĺ¦‚ďĽš"1", "1.1", "-1", "-1.1"ă€‚',
	digits: 'čŻ·čľ“ĺ…Ąç”±ć•°ĺ­—ĺ’Ść ‡ç‚ąç¬¦ĺŹ·ç»„ć��çš„ĺ†…ĺ®ąă€‚äľ‹ĺ¦‚ç”µčŻťĺŹ·ç �ă€‚',
	alpha: 'čŻ·čľ“ĺ…Ą A-Z çš„ 26 ä¸Şĺ­—ćŻŤďĽŚä¸Ťč�˝ĺŚ…ĺ�«ç©şć Ľć�–ä»»ä˝•ĺ…¶ä»–ĺ­—ç¬¦ă€‚',
	alphanum: 'čŻ·čľ“ĺ…Ą A-Z çš„ 26 ä¸Şĺ­—ćŻŤć�– 0-9 çš„ 10 ä¸Şć•°ĺ­—ďĽŚä¸Ťč�˝ĺŚ…ĺ�«ç©şć Ľć�–ä»»ä˝•ĺ…¶ä»–ĺ­—ç¬¦ă€‚',
	dateSuchAs: 'čŻ·čľ“ĺ…Ąĺ��ćł•çš„ć—Ąćśźć ĽĺĽŹďĽŚĺ¦‚ďĽš{date}ă€‚',
	dateInFormatMDY: 'čŻ·čľ“ĺ…Ąĺ��ćł•çš„ć—Ąćśźć ĽĺĽŹďĽŚäľ‹ĺ¦‚ďĽšYYYY-MM-DD ("2010-12-31")ă€‚',
	email: 'čŻ·čľ“ĺ…Ąĺ��ćł•çš„ç”µĺ­�äżˇç®±ĺś°ĺť€ďĽŚäľ‹ĺ¦‚ďĽš"fred@domain.com"ă€‚',
	url: 'čŻ·čľ“ĺ…Ąĺ��ćł•çš„ Url ĺś°ĺť€ďĽŚäľ‹ĺ¦‚ďĽšhttp://www.example.comă€‚',
	currencyDollar: 'čŻ·čľ“ĺ…Ąĺ��ćł•çš„č´§ĺ¸�ç¬¦ĺŹ·ďĽŚäľ‹ĺ¦‚ďĽšďżĄ100.0',
	oneRequired: 'čŻ·č‡łĺ°‘é€‰ć‹©ä¸€éˇąă€‚',
	errorPrefix: 'é”™čŻŻďĽš',
	warningPrefix: 'č­¦ĺ‘ŠďĽš',

	// Form.Validator.Extras
	noSpace: 'ä¸Ťč�˝ĺŚ…ĺ�«ç©şć Ľă€‚',
	reqChkByNode: 'ćśŞé€‰ć‹©ä»»ä˝•ĺ†…ĺ®ąă€‚',
	requiredChk: 'ć­¤éˇąĺż…ĺˇ«ă€‚',
	reqChkByName: 'čŻ·é€‰ć‹© {label}.',
	match: 'ĺż…éˇ»ä¸Ž{matchName}ç›¸ĺŚąé…Ť',
	startDate: 'čµ·ĺ§‹ć—Ąćśź',
	endDate: 'ç»“ćťźć—Ąćśź',
	currendDate: 'ĺ˝“ĺ‰Ťć—Ąćśź',
	afterDate: 'ć—Ąćśźĺż…éˇ»ç­‰äşŽć�–ć™šäşŽ {label}.',
	beforeDate: 'ć—Ąćśźĺż…éˇ»ć—©äşŽć�–ç­‰äşŽ {label}.',
	startMonth: 'čŻ·é€‰ć‹©čµ·ĺ§‹ćś�ä»˝',
	sameMonth: 'ć‚¨ĺż…éˇ»äż®ć”ąä¸¤ä¸Şć—Ąćśźä¸­çš„ä¸€ä¸ŞďĽŚä»Ąçˇ®äżťĺ®�ä»¬ĺś¨ĺ�Śä¸€ćś�ä»˝ă€‚',
	creditcard: 'ć‚¨čľ“ĺ…Ąçš„äżˇç”¨ĺŤˇĺŹ·ç �ä¸Ťć­Łçˇ®ă€‚ĺ˝“ĺ‰Ťĺ·˛čľ“ĺ…Ą{length}ä¸Şĺ­—ç¬¦ă€‚'

});

// Traditional Chinese
Locale.define('zh-CHT', 'FormValidator', {

	required: 'ć­¤é …ĺż…ĺˇ«ă€‚ ',
	minLength: 'č«‹č‡łĺ°‘čĽ¸ĺ…Ą{minLength} ĺ€‹ĺ­—ç¬¦(ĺ·˛čĽ¸ĺ…Ą{length} ĺ€‹)ă€‚ ',
	maxLength: 'ćś€ĺ¤šĺŹŞč�˝čĽ¸ĺ…Ą{maxLength} ĺ€‹ĺ­—ç¬¦(ĺ·˛čĽ¸ĺ…Ą{length} ĺ€‹)ă€‚ ',
	integer: 'č«‹čĽ¸ĺ…Ąä¸€ĺ€‹ć•´ć•¸ďĽŚä¸Ťč�˝ĺŚ…ĺ�«ĺ°Źć•¸é»žă€‚äľ‹ĺ¦‚ďĽš"1", "200"ă€‚ ',
	numeric: 'č«‹čĽ¸ĺ…Ąä¸€ĺ€‹ć•¸ĺ­—ďĽŚäľ‹ĺ¦‚ďĽš"1", "1.1", "-1", "-1.1"ă€‚ ',
	digits: 'č«‹čĽ¸ĺ…Ąç”±ć•¸ĺ­—ĺ’Ść¨™é»žç¬¦č™źçµ„ć��çš„ĺ…§ĺ®ąă€‚äľ‹ĺ¦‚é›»č©±č™źç˘Ľă€‚ ',
	alpha: 'č«‹čĽ¸ĺ…ĄAZ çš„26 ĺ€‹ĺ­—ćŻŤďĽŚä¸Ťč�˝ĺŚ…ĺ�«ç©şć Ľć�–ä»»ä˝•ĺ…¶ä»–ĺ­—ç¬¦ă€‚ ',
	alphanum: 'č«‹čĽ¸ĺ…ĄAZ çš„26 ĺ€‹ĺ­—ćŻŤć�–0-9 çš„10 ĺ€‹ć•¸ĺ­—ďĽŚä¸Ťč�˝ĺŚ…ĺ�«ç©şć Ľć�–ä»»ä˝•ĺ…¶ä»–ĺ­—ç¬¦ă€‚ ',
	dateSuchAs: 'č«‹čĽ¸ĺ…Ąĺ��ćł•çš„ć—Ąćśźć ĽĺĽŹďĽŚĺ¦‚ďĽš{date}ă€‚ ',
	dateInFormatMDY: 'č«‹čĽ¸ĺ…Ąĺ��ćł•çš„ć—Ąćśźć ĽĺĽŹďĽŚäľ‹ĺ¦‚ďĽšYYYY-MM-DD ("2010-12-31")ă€‚ ',
	email: 'č«‹čĽ¸ĺ…Ąĺ��ćł•çš„é›»ĺ­�äżˇç®±ĺś°ĺť€ďĽŚäľ‹ĺ¦‚ďĽš"fred@domain.com"ă€‚ ',
	url: 'č«‹čĽ¸ĺ…Ąĺ��ćł•çš„Url ĺś°ĺť€ďĽŚäľ‹ĺ¦‚ďĽšhttp://www.example.comă€‚ ',
	currencyDollar: 'č«‹čĽ¸ĺ…Ąĺ��ćł•çš„č˛¨ĺąŁç¬¦č™źďĽŚäľ‹ĺ¦‚ďĽšďżĄ100.0',
	oneRequired: 'č«‹č‡łĺ°‘é�¸ć“‡ä¸€é …ă€‚ ',
	errorPrefix: 'éŚŻčŞ¤ďĽš',
	warningPrefix: 'č­¦ĺ‘ŠďĽš',

	// Form.Validator.Extras
	noSpace: 'ä¸Ťč�˝ĺŚ…ĺ�«ç©şć Ľă€‚ ',
	reqChkByNode: 'ćśŞé�¸ć“‡ä»»ä˝•ĺ…§ĺ®ąă€‚ ',
	requiredChk: 'ć­¤é …ĺż…ĺˇ«ă€‚ ',
	reqChkByName: 'č«‹é�¸ć“‡ {label}.',
	match: 'ĺż…é �č�‡{matchName}ç›¸ĺŚąé…Ť',
	startDate: 'čµ·ĺ§‹ć—Ąćśź',
	endDate: 'çµ�ćťźć—Ąćśź',
	currendDate: 'ç•¶ĺ‰Ťć—Ąćśź',
	afterDate: 'ć—Ąćśźĺż…é �ç­‰ć–Ľć�–ć™šć–Ľ{label}.',
	beforeDate: 'ć—Ąćśźĺż…é �ć—©ć–Ľć�–ç­‰ć–Ľ{label}.',
	startMonth: 'č«‹é�¸ć“‡čµ·ĺ§‹ćś�ä»˝',
	sameMonth: 'ć‚¨ĺż…é �äż®ć”ąĺ…©ĺ€‹ć—Ąćśźä¸­çš„ä¸€ĺ€‹ďĽŚä»Ąç˘şäżťĺ®�ĺ€‘ĺś¨ĺ�Śä¸€ćś�ä»˝ă€‚ ',
	creditcard: 'ć‚¨čĽ¸ĺ…Ąçš„äżˇç”¨ĺŤˇč™źç˘Ľä¸Ťć­Łç˘şă€‚ç•¶ĺ‰Ťĺ·˛čĽ¸ĺ…Ą{length}ĺ€‹ĺ­—ç¬¦ă€‚ '

});

Form.Validator.add('validate-currency-yuan', {

	errorMsg: function(){
		return Form.Validator.getMsg('currencyYuan');
	},

	test: function(element){
		// [ďżĄ]1[##][,###]+[.##]
		// [ďżĄ]1###+[.##]
		// [ďżĄ]0.##
		// [ďżĄ].##
		return Form.Validator.getValidator('IsEmpty').test(element) || (/^ďżĄ?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/).test(element.get('value'));
	}

});

