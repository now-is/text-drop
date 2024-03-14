# Text Drop

Send your deep textual thoughts from your phone to your laptop. 

You jotted down many thoughts at the concert. Now at home, you want to beam them to your laptop. Alas, you do not possess an app account in the sky that you can bounce them off. Yet, your laptop is in front of you, inside a safe intranet.

There are a few approaches to this quandary. You could use cutting edge Tailscale features. You could encode the entire text of your thoughts into a URL. These may work. You could also use the present facility, a single-journey server, which does work. Sure, you need node. But only on your laptop.

## Preparation

After `pnpm install` or similar, create, in the root directory:

- A read-writable directory called `private`.
- A `listen_config.js` file which looks like:

```
	module.exports = {
		'host': '192.168.0.42',
		'port': 3000
	}
```

The `host` value should be an address with which you can reach your laptop from your phone. The `port` value should be free on your laptop—and it doesn't have to be sequence of the digits `3` and `0`!

## Use

Start the server with:

	node server

Then display `private/qr_url.png` with any out of band method, for instance on your laptop's screen, not peeked at by anybody else.

Load the URL from the QR code in your phone's browser, paste the text you want to transfer, and save.

The server exits after saving the text in the directory named `drops`. It will be in a file named with a suitable timestamp.

That's it. Clean the `drops` directory if you want, make a blog from all your uploads, or cram them all into a finely engineered prompt.

This server is for a single user with a single workflow. A random one-time URL is deemed sufficient security. Maybe don't use it on a public network.
