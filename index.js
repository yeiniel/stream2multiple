
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
	}
}

module.exports = Stream2Multiple;