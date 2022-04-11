'use strict';

const stream = require('stream');
const ava = require('ava');
const spec = require('stream-spec');
const tester = require('stream-tester');

const Stream2Multiple = require('.');

const MIN_DESTINATIONS = 2;
const MAX_DESTINATIONS = 100;

let s;

ava.beforeEach(() => {
	// create a random number of destinations
	const numDestinations = Math.floor(
		Math.random() * (MAX_DESTINATIONS - MIN_DESTINATIONS + 1))
		+ MIN_DESTINATIONS;

	const destinations = Array.apply(null, new Array(numDestinations))
		.map(() => {
			let pause = new stream.Writable({
				objectMode: true,
				write(chunk, encoding, callback) { callback(); }
			});

			return pause;
		});

	// create the stream to multiple instance use on tests
	s = new Stream2Multiple(destinations, { objectMode: true });
});

ava('valid writable stream', (t) => {
	return new Promise((resolve, reject) => {
		spec(s)
			.writable()
			.drainable()
			.validateOnExit();

		tester.createRandomStream(function () {
			return [new Date(), 'line ' + Math.random()];
		}, 100)
			.pipe(s);

		s.on('finish', () => {
			t.pass();
			resolve();
		});
		s.on('error', error => reject(error));
	});
});

