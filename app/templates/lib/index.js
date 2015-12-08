'use strict';
var path = require('path');
var BinWrapper = require('bin-wrapper');

module.exports = new BinWrapper()<% for(var i = 0; i < binaries.length; i++) { %>
	.src('<%= binaries[i].url %>', '<%= binaries[i].os %>'<% if (binaries[i].arch) { %>, '<%= binaries[i].arch %>'<% } %>)<% } %>
	.dest(path.join(__dirname, '../vendor'))
	.use('<%= softwareName %>');
