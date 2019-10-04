#!/usr/bin/env node
'use strict';
const meow = require('meow');
const gulpfile = require('./gulpfile.js');

const cli = meow(`
	Usage
	  $ sandpaper [lint] [build] [sync]

	Options
		--strict	-s	Lint Codding style in addition to errors.
		--fixStyle	-f	Attempt to Fix lint errors caused by style problems.
		--watch		-w	Constantly run, and re-run lint or build whenever a file is changed.
		--prod		-p	Build for production, Don't include sourcemaps, and minified code.

	Examples
	  $ sandpaper lint
	  $ sandpaper build
	  $ sandpaper sync
	  $ sandpaper lint -s -w
	  $ sandpaper lint -s -f
	  $ sandpaper build -w
	  $ sandpaper build -w -p
	  $ sandpaper lint build -w -p
	  $ sandpaper lint build sync

	  $ sandpaper --lint
	  $ sandpaper --build
	  $ sandpaper --sync
	  $ sandpaper --lint -strict -watch
	  $ sandpaper --lint -strict -fixstyle
	  $ sandpaper --build -watch
	  $ sandpaper --build -watch -production
	  $ sandpaper --lint --build --watch --production
	  $ sandpaper --lint --build --sync

`, {
	flags: {
		lint: {
			type: 'boolean',
			default: false
		},
		build: {
			type: 'boolean',
			default: false
		},
		sync: {
			type: 'boolean',
			default: false
		},
		strict: {
			type: 'boolean',
			default: false
		},
		fixStyle: {
			type: 'boolean',
			default: false
		},
		watch: {
			type: 'boolean',
			default: false
		},
		production: {
			type: 'boolean',
			default: false
		}
	}
});

// CLI logic (input handler)

(async () => {
	await Promise.all([
		(async () => {
			console.log(cli.flags);
		})(),
		(async () => {
			if (cli.flags.lint === true) {
				lint();
			}
		})(),
		(async () => {
			if (cli.flags.build === true && cli.flags.sync === false) {
				await build();
			}
		})(),
		(async () => {
			if (cli.flags.sync === true) {
				await sync();
			}
		})(),
		(async () => {
			if (cli.input.length > 0) {
				console.log('Unrecognized input: ' + cli.input + ' use Sandpaper --help for a list of valid inputs.');
			}
		})()
	]);
})();

// Functions for interfacing between CLI logic and program logic.

async function lint() {
	if (cli.flags.strict === true) {
		if (cli.flags.watch === true) {
			// Lint Strict True, Watch True
			gulpfile.watchLintStrict();
		} else {
			// Lint Strict True, Watch False
			gulpfile.lintStrict();
		}
	} else if (cli.flags.watch === true) {
		// Lint Strict False, Watch True
		gulpfile.watchLint();
	} else {
		// Lint Strict False, Watch False
		gulpfile.lint();
	}

	if (cli.flags.fixStyle === true) {
		// Not implemented yet.
	}
}

async function build() {
	if (cli.flags.prod === true) {
		if (cli.flags.watch === true) {
			// Build Production True, Watch True
			gulpfile.watchProd();
		} else {
			// Build Production True, Watch False
			gulpfile.buildProd();
		}
	} else if (cli.flags.watch === true) {
		// Build Production False, Watch True
		gulpfile.watchDev();
	} else {
		// Build Production False, Watch False
		gulpfile.buildDev();
	}
}

async function sync() {
	if (cli.flags.prod === true) {
		gulpfile.syncProd();
	} else {
		gulpfile.syncDev();
	}
}
