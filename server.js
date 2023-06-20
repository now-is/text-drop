const fastify = require('fastify')({
	logger: true
})

const path = require('path')
const fs = require('fs')

fastify.register(require('@fastify/formbody'))

fastify.get('/', async (req, res) => {
	const stream = fs.createReadStream(
		path.join(__dirname, 'public', 'text-drop.html'),
		'utf8'
	)
	res.header('Content-Type', 'text/html')
	await res.send(stream)
})

fastify.route({
	method: 'POST',
	path: '/text-drop',
	handler: async (req, res) => {
		/* TODO save to drops/`new Date() .toISOString()`.txt */
		res.send(req.body)
	}
})

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
