const fastify = require('fastify')({
	logger: true
})

const path = require('path')
const fs = require('fs')

fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public')
})

/* trivial mapping to A-Z0-5 */
const prefix_codes = new Uint8Array(8)
crypto.getRandomValues(prefix_codes)
const prefix = String.fromCharCode(... prefix_codes.map(n => { n >>= 3; return n + (n < 26 ? 97 : 22) }))
fastify.log.info(`Planned prefix: ${prefix}`)

fastify.get(`/${prefix}/`,          (req, res) => res.sendFile('text-drop.html'))
fastify.get(`/${prefix}/succeeded`, (req, res) => res.sendFile('text-drop-succeeded.html'))
fastify.get(`/${prefix}/failed`,    (req, res) => res.sendFile('text-drop-failed.html'))

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
		res.send({ ok: true })
	}
})

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})

function send_html_file (public_filename) {
	return async (req, res) => {
		const stream = fs.createReadStream(
			path.join(__dirname, 'public', public_filename),
			'utf8'
		)
		res.header('Content-Type', 'text/html')
		await res.send(stream)
	}
}
