
//Support functions
var getUuid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

/** Chrome check for file - This will warn developers of using file: protocol when testing WebRTC **/
if(navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
	$('div#chromeWarning').show();
	$('div.container').hide();
}

// === The sample === 

sinchClient = new SinchClient({
	applicationKey: 'MY_APPLICATION_KEY',
	applicationSecret: 'MY_APPLICATION_SECRET', //WARNING: This is insecure, only for demo easy/instant sign-in where we don't care about user identification
	capabilities: {calling: true, video: true, multiCall: true},
	startActiveConnection: true,
	onLogMessage: function(message) {
		console.log(message);
	},
	onLogMxpMessage: function(message) {
		console.log(message);
	},
});

//Generate & store random username
var username = getUuid();
window.location.hash = window.location.hash || getUuid(); //random channel name
channel = window.location.hash; //Get channel from the URL hash
var remoteCalls = []; //Track a number of incoming calls. For more calls - edit the HTML
console.log('Starting with username: ', username);
console.log('Will join channel: ', channel);

//Get callClient, start it and then join the group
var callClient = sinchClient.getCallClient();
sinchClient.start({username: username}).then(function() {
	var groupCall = callClient.callGroup(channel);
	
	groupCall.addEventListener({
		onGroupRemoteCallAdded: function(call) {
			remoteCalls.push(call);
			var callIdx = remoteCalls.indexOf(call);
			$('video#other'+callIdx).attr('src', call.incomingStreamURL);
		},
		onGroupLocalMediaAdded: function(stream) {
			$('video#me').attr('src', window.URL.createObjectURL(stream));
			$("video#me").prop("volume", 0);
		},
		onGroupRemoteCallRemoved: function(call) {
			var callIdx = remoteCalls.indexOf(call);
			remoteCalls.splice(callIdx, 1);

			$('video[id^=other]').attr('src', function(index) {
				$('video#other'+index).attr('src', (remoteCalls[index] || {}).incomingStreamURL || '');
			});
		},
	});
});









