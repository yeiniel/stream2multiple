
'use strict';

const stream = require('stream');

/** Pipe same stream content into multiple destinations
 *
 * @extends stream.Writable
 */
class Stream2Multiple extends stream.Writable {

	/** Constructor
	 *
	 * @param {stream.Writable[]} destinations Array of stream destinations.
	 * @param {Object} options Parent options.
	 */
	constructor(destinations, options={}){

		super(options);

		// store destinations for latter use
		this.destinations = destinations;

		// setup error handling
		destinations.forEach((destination) => {
			destination.on('error', (err) => this.emit('error', err));
		});

		// setup writer end transmission
		this.on('finish', () => {
			destinations.forEach((destination) => destination.end());
		});
	}

	_promiseToWrite(destination, chunk, encoding){
		return new Promise((resolve, reject) => {
			destination.write(chunk, encoding, (err) => {
				if(err){ return reject(err); }
				else { resolve(); }
			});
		});
	}

	_write(chunk, encoding, callback){
		Promise.all(this.destinations.map(
			(destination) => this._promiseToWrite(destination, chunk, encoding)))
			.then(() => callback(), (err) => callback(err));
	}
}

module.exports = Stream2Multiple;
