const fastify = require('fastify')({
	logger: true
})

const path = require('path')
const fs = require('fs')

fastify.register(require('@fastify/formbody'))

fastify.route({
	method: 'GET',
	path: '/',
	handler: send_html_file('text-drop.html')
})

fastify.route({
	method: 'POST',
	path: '/text-drop',
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
