const blocked = require('blocked-at')
const compression = require('compression')
const cors = require('cors')
const debug = require('debug')('backend:server')
const express = require('express')
const logger = require('morgan-debug')
const path = require('path')
const fs = require('fs')

/**
 * Debug if event loop if blocked for more than 100 ms
 */
blocked((time, stack) => {
	debug(`Blocked for ${time}ms, operation started here: `, stack)
}, { threshold: 100 })

const app = express()

app.set('trust proxy', 'loopback')
app.use((req, res, next) => {
	res.removeHeader('X-Powered-By')
	res.set({
		'Content-Security-Policy': 'default-src https: self',
		'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'DENY',
		'X-XSS-Protection': '1'
	})
	next()
})
app.use(compression())
app.use(cors())
app.use(logger('backend:requests', 'START :method :url', { immediate: true }))
app.use(logger('backend:requests', 'DONE :method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())

/**
 * Use automatic route loader
 */
function loadRoutes(app, routerPath = 'src/routes') {
	const routes = fs.readdirSync(routerPath)
	routes.forEach(file => {
		const filePath = path.join(routerPath,file)
		const stat = fs.statSync(filePath)
		if (stat.isDirectory()) {
			loadRoutes(app, filePath)
		} else {
			const route = filePath.replace('src\\routes\\', '/').replace('\\','/').replace('.js', '').replace('index', '')
			console.log(route)
			const requireFilePath = path.resolve(filePath)
			app.use(route, require(requireFilePath))
			console.log(requireFilePath)
		}
	})
}

loadRoutes(app)

/**
 * 404 error handler
 */
app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

/**
 * Custom error handler that adds errors and uses custom debug if sent by error thrower
 */
app.use((err, req, res, next) => {
	err.status = err.status || 500
	const betterDebug = err.debug ? err.debug : debug
	delete err.debug
	if (err.status < 500 && err.status !== 400) delete err.stack
	betterDebug(err)

	const jsonToSend = { error: err.message }

	if (err.errors) jsonToSend.errors = err.errors.map(er => er.message || er)

	res.status(err.status)
	res.json(jsonToSend)
})

/**
 * Export express app
 */
module.exports = app