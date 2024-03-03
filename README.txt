PREPARE:

In the root directory, you need to create:

1. A read-writable directory called private.
2. A listen_config.js file which looks like:

	module.exports = {
		'host': '192.168.0.42',
		'port': 3000
	}

These are both in .gitignore. They could be made the responsibilty of a
"post-clone" hook, but it's unclear how useful it would be.


USE:

Start the server with:

	node server

Display private/qr_url.png with any out of band method. E.g. on your laptop's
screen.

Train your phone on this URL and paste whatever text you want transferred to
your laptop. The server exits after saving the text in the directory named
drops.

That's it.

A cryptographically generated single-serve URL is deemed sufficient security
for this homemade project.
