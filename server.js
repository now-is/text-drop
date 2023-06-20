const fastify = require('fastify')({
	logger: true
})

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const qrcode = require('qrcode')
const replaceStream = require('replacestream')
const listenConfig = require('./listen_config.js')

fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public')
})

/* trivial mapping to A-Z0-5 */
const prefix_codes = new Uint8Array(8)
crypto.getRandomValues(prefix_codes)
const prefix = String.fromCharCode(... prefix_codes.map(n => { n >>= 3; return n + (n < 26 ? 97 : 22) }))

fastify.get(`/${prefix}/succeeded`, (req, res) => res.sendFile('text-drop-succeeded.html'))
fastify.get(`/${prefix}/failed`,    (req, res) => res.sendFile('text-drop-failed.html'))

fastify.get(`/${prefix}/`, async (req, res) => {
	const stream = fs.createReadStream(
		path.join(__dirname, 'public', 'text-drop.html'),
		'utf8'
	).pipe(replaceStream('%prefix%', prefix))

	res.header('Content-Type', 'text/html')
	await res.send(stream)
})

fastify.route({
	method: 'POST',
	path: `/${prefix}/text-drop-process`,
	handler: async (req, res) => {
		const drop_path = path.join(__dirname, 'drops', `${new Date() .toISOString()}.txt`)
		try {
			fs.writeFileSync(drop_path, req.body.dropped_text);
		} catch (err) {
			fastify.log.error(`Could not write to ${drop_path}`)
			res.status(503).send({ ok: false })
		}
		await res.send({ ok: true })
		process.exit(1)
	}
})

fastify.listen({
	... listenConfig,
	listenTextResolver: address => {
		return `Listening at ${address}/${prefix}/`
	}
}, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	qrcode.toFile(
		path.join(__dirname, 'private', 'qr_url.png'),
		`${address}/${prefix}/`,
		function (err) {
			if (err) {
				fastify.log.error(err)
				process.exit(1)
			}
			else {
				fastify.log.info('qr code written to disk')
			}
		}
	)
})
