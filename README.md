sinch-js-rtc
============

Sinch JS SDK for real time communication

Node JS
=======

Install Sinch RTC SDK using

	npm install sinch-rtc

Simple code example

	var SinchClient = require('sinch-rtc');

	var sinchClient = new SinchClient({
		applicationKey: 'YOUR KEY',
		capabilities: {messaging: true},
		onLogMessage: function(message) {
			console.log(message);
		}
		});

	sinchClient.start(CREDENTIALS).then(function() {
			console.log('Success!');
		})

Applications developed with node package does not quite yet support Browserify. 

Bower
=====

For webpages the Sinch bower package is preferred. Install using





