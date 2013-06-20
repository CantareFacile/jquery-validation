var parts = document.location.search.slice( 1 ).split( "&" ),
	length = parts.length,
	i = 0,
	current,
	version = "1.10.1",
	jqueryPath = "http://code.jquery.com/jquery-git";

for ( ; i < length; i++ ) {
	current = parts[ i ].split( "=" );
	if ( current[ 0 ] === "jquery" ) {
		version = current[ 1 ];
		break;
	}
}

if (version != "git") {
	jqueryPath = "../lib/jquery-" + version;
}

require.config({
  urlArgs: "_dc="+(new Date().getTime()),
  paths: {
  	'jquery': jqueryPath,
  	'jquery.form': '../lib/jquery.form',
  	'jquery.mockjax': '../lib/jquery.mockjax',
  	'jquery.validate': '../jquery.validate',
  	'jquery.validate.additional': '../additional-methods'
  },
  shim: {
		'jquery.form': {
			deps: ['jquery']
		},
		'jquery.mockjax': {
			deps: ['jquery']
		},
  }
});

require([
	'jquery',
	'jquery.form',
	'jquery.mockjax',
	'validator_tests',
	'rules_tests',
	'messages_tests',
	'methods_tests'
], function() {
	if ( window.sessionStorage ) {
		sessionStorage.clear();
	}
	jQuery.validator.defaults.debug = true;
	$.mockjaxSettings.log = $.noop;

	$.mockjax({
		url: "form.php?user=Peter&password=foobar",
		responseText: 'Hi Peter, welcome back.',
		responseStatus: 200,
		responseTime: 1
	});
	$.mockjax({
		url: "users.php",
		data: { username: /Peter2?|asdf/},
		responseText: 'false',
		responseStatus: 200,
		responseTime: 1
	});
	$.mockjax({
		url: "users2.php",
		data: { username: "asdf"},
		responseText: '"asdf is already taken, please try something else"',
		responseStatus: 200,
		responseTime: 1
	});
	$.mockjax({
		url: "echo.php",
		response: function(data) {
			this.responseText = JSON.stringify(data.data);
		},
		responseTime: 100
	});

	// Start the test suite
	$(function() { QUnit.start(); });
});