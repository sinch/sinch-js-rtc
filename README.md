Sinch Javascript SDK 1.3.1
==========================
Welcome to Sinch JS SDK, http://www.sinch.com

Copyright 2014-2015, Sinch AB (reg. no 556969-5397)


Features
========
- Sinch SDK for web
- PSTN Calling
 - Make calls using WebRTC
- Web/app calling 
 - Make and receive calls using WebRTC
 - Call both web clients and native (iOS and Android)
- Instant messaging
 - Cross platform, using native SDK's for iOS and Android
 - Conversations with up to 10 participants
 - Delivery receipts
- Video calling (beta)
 - Web clients only
- Group calling / conferencing (beta)
 - Web clients only
- Phone number verification 
- Partner user management
 - Authentication ticket for session creation
 - Allows full user management for partner
 - Sample python (tornado) backend in samples folder (SinchAUTHsample)
 - NOTE: Review your app setting for "JS Auth" in the Sinch portal
- Sinch user management
 - Create user, update password and basic profile
 - Authenticate as user
 - Generate authentication tickets when running as backend

Should you encounter any bugs, glitches, lack of functionality or other problems
using  our SDK, please send us an email to dev@sinch.com. 
Your help in this regard is greatly appreciated.


Quick start
===========

- Include Sinch JS SDK with:

		<script src="//cdn.sinch.com/latest/sinch.min.js"></script>

- Read the user-guide for introduction and the reference docs for details

- Look at the sample apps for inspiration


Install using Bower
===================

You can install Sinch RTC SDK in your project using Bower;

	bower install sinch-rtc

Import the Sinch SDK in your website using

	<script src="PATH_TO_BOWER_MODULES/sinch-rtc/sinch.min.js"></script>


Install using Node JS
=====================

Sinch is also available as a node package. Install Sinch RTC SDK using;

	npm install sinch-rtc

Import Sinch SDK in your javascript using

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

Applications developed with node package does not quite yet support Browserify,
without some minor modifications.


Getting Started
===============
Familiarise yourself with the user guide (documentation folder or online).

Have a look at the Sample App in the samples/ folder, where you'll find:
- SinchIMsample, our Instant Messaging sample app
- SinchPSTNsample, our PSTN calling sample app
- SinchWEBsample, our Web to Web calling sample app
- SinchAUTHsample, our sample for demonstrating integrating a custom backend
  for user authentication (useful for native app compatability)
- python-backend-sample, a sample backend for Sinch written in Python 
  (see README.md for more information on getting started)
- SinchVIDEOsample, sample for person to person video calling
- SinchGROUPVIDEOsample, sample for group video conferencing
- SinchGROUPAUDIOsample, sample for group audio conferencing
- SinchVERsample, sample for number verification

These sample apps demonstrate user management, session handling and more. 
The interesting stuff can be found in the .js files.

In order to get started follow these steps: 

1. Try open SinchIMsample/index.html in a web-browser (Chrome or Firefox). 
   Open the developer console. 
2. In the browser window you should see a web form where you can either create 
   a new user or login as a user. 
3. Try creating a user
4. An error message "Illegal Authorization Header" error is shown. This is 
   because the sample app don't use your app key yet. 
5. Go to www.sinch.com, create an account and a new application (or use an 
   already existing app)
6. Replace MY_APPLICATION_KEY in IMsample.js with your application key. 
7. Try creating a user, now it should work!
8. Open the same page in a separate window and create another user
9. You can now try sending messages between these two users.

Have a look at the source code in IMsample.js, enable the onLogMessage callback 
if you're curious about the activity under the hood. It's a good way to have 
logging enabled during development for easy error tracking.

You can also activate session loading by enabling the if-statement on line 36, 
by removing "false" from the if-statement. The PSTN and AUTH sample application 
has this activated by default, please see the PSTNsample.js file for reference.

As for the PSTN sample app, you may have to load the application from a web 
server (can be local), depending on the security settings for WebRTC in your 
browser. Also, when trying PSTN calls please ensure you replace 
"MY_APPLICATION_KEY" with your actual key. 


Documentation
=============
The user-guide is available in the docs/ folder. 
Simply open index.html and read about:

- Instructions for first-time developers
- Using Sinch in your app for sending and receiving messages
- Using Sinch in your app for making PSTN calls
- Using Sinch in your app for making data calls
- Learn about sinch authentication 
- Session Management 
- Other information about Sinch, such as creating your app, note on export 
  regulations and more.

Reference documentation is available in docs/ folder. Read about: 

- SinchClient (starting point)
- MessageClient
- CallClient


Known issues
============
- There is an issue running too many instances at the same time. No more than 
  5-6 instances can be run at the same time in the same browser. 
  (if problem experienced, restart browser and only run one instance and try 
  again with fewer instances)
- After three failed login attempts on one user accounts, that account is 
  locked for a while with no ability to unlock.
- Restore messages missed since last login is currently disabled. 
- When browser close, any ongoing PSTN calls are not terminated properly but 
  relies on B-side doing a time-out. (~ 1 minute)
- Browserify is not yet supported for Node JS distribution. 








