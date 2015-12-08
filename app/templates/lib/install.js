'use strict';
var log = require('logalot');
var bin = require('./');

bin.run(['--version'], function (err) {
	if (err) {
		log.error(err.message);
		log.error('<%= softwareName %> binary test failed');
		return;
	}

	log.success('<%= softwareName %> binary test passed successfully');
});
