const fastify = require('fastify')({
	logger: true
})

const path = require('path')
const fs = require('fs')
const replaceStream = require('replacestream')

fastify.register(require('@fastify/cookie'))
fastify.register(require('@fastify/csrf-protection'))
fastify.register(require('@fastify/formbody'))

fastify.get('/', async (req, res) => {
	const stream = fs.createReadStream(
		path.join(__dirname, 'public', 'text-drop.html'),
		'utf8'
	).pipe(replaceStream('%CSRF_TOKEN%', await res.generateCsrf()))

	res.header('Content-Type', 'text/html')
	await res.send(stream)
})

fastify.route({
	method: 'POST',
	path: '/text-drop',
	onRequest: fastify.csrfProtection,
	handler: async (req, res) => {
		return req.body
	}
})

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
