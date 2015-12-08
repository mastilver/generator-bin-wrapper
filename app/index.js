'use strict';
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');
var semver = require('semver');

module.exports = yeoman.generators.Base.extend({
	init: function () {
		var cb = this.async();
		var self = this;

		this.prompt([{
			name: 'softwareName',
			message: 'Which software do you want to wrap?',
			default: this.appname.replace(/\s/g, '-'),
			filter: function (x) {
				return _s.slugify(x);
			}
		},
		{
			name: 'softwareVersion',
			message: 'What is the version of this software?',
			filter: function (x) {
				return semver.valid(x);
			}
		},
		{
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate: function (x) {
				return x.length > 0 ? true : 'You have to provide a username';
			}
		},
		{
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate: function (x) {
				return x.length > 0 ? true : 'You have to provide a website URL';
			},
			filter: function (x) {
				return normalizeUrl(x);
			}
		}], function (props) {
			askBinaries.bind(self)(function (binaries) {
				var tpl = {
					softwareName: props.softwareName,
					moduleName: props.softwareName + '-bin',
					camelModuleName: _s.camelize(props.moduleName),
					githubUsername: props.githubUsername,
					name: self.user.git.name(),
					email: self.user.git.email(),
					website: props.website,
					humanizedWebsite: humanizeUrl(props.website),
					softwareVersion: props.softwareVersion,
					binaries: binaries
				};

				var mv = function (from, to) {
					self.fs.move(self.destinationPath(from), self.destinationPath(to));
				};

				self.fs.copyTpl([
					self.templatePath() + '/**',
					'!**/cli.js'
				], self.destinationPath(), tpl);

				if (props.cli) {
					self.fs.copyTpl(self.templatePath('cli.js'), self.destinationPath('cli.js'), tpl);
				}

				mv('editorconfig', '.editorconfig');
				mv('gitattributes', '.gitattributes');
				mv('gitignore', '.gitignore');
				mv('travis.yml', '.travis.yml');
				mv('_package.json', 'package.json');

				cb();
			});
		});
	},
	git: function () {
		this.spawnCommandSync('git', ['init']);
	},
	install: function () {
		this.installDependencies({bower: false});
	}
});

function askBinaries(cb) {
	var self = this;
	var answers = [];

	this.prompt([
		{
			name: 'os',
			message: 'Which os your binary support?',
			type: 'list',
			choices: ['darwin', 'freebsd', 'linux', 'sunos', 'win32']
		},
		{
			name: 'arch',
			message: 'Which architecture your binary support?',
			type: 'list',
			choices: ['arm', 'ia32', 'x64']
		},
		{
			name: 'url',
			message: 'What is the url of the binary?',
			validate: function (x) {
				return x.length > 0 ? true : 'You have to provide a website URL';
			}
		},
		{
			name: 'continue',
			message: 'Do you have another binary to add? (Y/n)',
			type: 'input',
			validate: function (x) {
				return 	x === 'y' || x === 'Y' || x === 'n' || x === 'N';
			},
			filter: function (x) {
				return x === 'y' || x === 'Y';
			}
		}
	], function (a) {
		answers = answers.concat(a);
		var shouldContinue = a.continue;
		delete a.continue;

		if (shouldContinue) {
			askBinaries.bind(self)(function (b) {
				answers = answers.concat(b);
				cb(answers);
			});
		} else {
			cb(answers);
		}
	});
}
