# Pipe same stream content into multiple destinations

This package provide a Node.js writable stream that pipe all the content write
to it into multiple writable streams.

At the time of creating this package the most used solution to the problem of
multiple destination streams is to use an intermediate [stream.PassThrough][1]
duplex stream. This works if the buffers are not overloaded otherwise content
is lost for the slower destination stream. The implementation provided by this
package solve this by ingesting data as fast as the slowest of the destination
streams.

[1]: https://nodejs.org/api/stream.html#stream_class_stream_passthrough