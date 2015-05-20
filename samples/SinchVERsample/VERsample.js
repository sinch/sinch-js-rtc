
sinchClient = new SinchClient({
	applicationKey: 'MY_APPLICATION_KEY',
	//Note: For additional loging, please uncomment the three rows below
	//onLogMessage: function(message) {
	//	console.log(message);
	//}
});

var ongoingVerification;

$('button#sendSMS').on('click', function(event) {
	event.preventDefault();
	clearError();

	var selectedPhoneNumber = $('input#phoneNumber').val();
	console.log('Will send new SMS', selectedPhoneNumber);

	ongoingVerification = sinchClient.createSmsVerification(selectedPhoneNumber);

	ongoingVerification.initiate().then(function() {
		//If successful
		$('form#newVerification').toggle();
		$('form#verifyCode').toggle();
	}).fail(handleError);
});

$('button#verifySMS').on('click', function(event) {
	event.preventDefault();
	clearError();

	var verificationCode = $('input#phoneCode').val();
	console.log('Will verify SMS', verificationCode);

	ongoingVerification.verify(verificationCode).then(function() {
		//If successful
		$('div.success').show();
		$('form#verifyCode').toggle();
	}).fail(handleError);
});

/*** Handle errors, report them and re-enable UI ***/

var handleError = function(error) {
	console.log('Verification error', error);
	
	$('div.error').text(error.message || error.data.message);
	$('div.error').show();
}

/** Always clear errors **/
var clearError = function() {
	$('div.error').hide();
}

