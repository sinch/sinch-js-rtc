sinch-js-rtc
============

Sinch JS SDK for real time communication

Bower
=====

You can install Sinch RTC SDK in your project using Bower;

	bower install sinch-rtc

Import the Sinch SDK in your website using

	<script src="<PATH_TO_BOWER_MODULES>/sinch-rtc/sinch.min.js"></script>


Node JS
=======

Sinch is also available as a node package. Install Sinch RTC SDK using;

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

Applications developed with node package does not quite yet support Browserify without some minor modifications.





