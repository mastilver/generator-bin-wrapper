import path from 'path';
import test from 'ava';
import {test as helpers} from 'yeoman-generator';
import assert from 'yeoman-assert';
import pify from 'pify';
import P from 'pinkie-promise'

let generator;

test.beforeEach(async () => {
	await pify(helpers.testDirectory, P)(path.join(__dirname, 'temp'));
	generator = helpers.createGenerator('bin-wrapper:app', ['../app'], null, {skipInstall: true});
});

test.serial('generates expected files', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com'
	});

	await pify(generator.run.bind(generator), P)();

	assert.file([
		'.editorconfig',
		'.git',
		'.gitattributes',
		'.gitignore',
		'.travis.yml',
		'index.js',
		'license',
		'package.json',
		'readme.md',
		'test.js'
	]);
});
