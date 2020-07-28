#!/usr/bin/env node

// eslint-disable-next-line no-undef
require('dotenv').config({path: `${process.cwd()}/.env`})
const db = require('../db')

/**
 * Sync database and exit
 */
db.sequelize.sync({ force: true }).then(() => {
	console.log('Reset tables successfully')
	// eslint-disable-next-line no-undef
	process.exit(0)
}).catch(e => {
	console.error(e)
	// eslint-disable-next-line no-undef
	process.exit(1)
})