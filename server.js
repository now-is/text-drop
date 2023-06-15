const fastify = require('fastify')({
	logger: true
})

const path = require('path')

fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public')
})

fastify.register(require('@fastify/formbody'))

fastify.post('/text-drop', function (req, res) {
	res.send(req.body)
})

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
