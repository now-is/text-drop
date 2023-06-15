const fastify = require('fastify')({
	logger: true
})

const path = require('path')

fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public')
})

fastify.get('/', function (request, reply) {
	reply.send({ hello: 'world' })
})

fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
