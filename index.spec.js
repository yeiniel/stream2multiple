
'use strict';

const ava = require('ava');
const spec = require('stream-spec');
const tester = require('stream-tester');

const Stream2Multiple = require('.');

const MIN_DESTINATIONS = 2;
const MAX_DESTINATIONS = 100;

let stream;

ava.beforeEach(() => {
	// create a random number of destinations
	const numDestinations = Math.floor(
		Math.random() * (MAX_DESTINATIONS - MIN_DESTINATIONS + 1))
				+ MIN_DESTINATIONS;

	const destinations = Array.apply(null, new Array(numDestinations))
		.map(() => tester.createPauseStream());

	// create the stream to multiple instance use on tests
	stream = new Stream2Multiple(destinations, { objectMode: true });
});

ava.cb((t) => {

	spec(stream)
		.writable()
		.drainable()
		.validateOnExit();

	tester.createRandomStream(function () {
		return [new Date(), 'line ' + Math.random()];
	}, 1000)
		.pipe(stream);

	stream.on('end', t.end);
	stream.on('error', t.end);
});

