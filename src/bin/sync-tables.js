#!/usr/bin/env node

const db = require('../db')
// eslint-disable-next-line no-undef
require('dotenv').config({path: `${process.cwd()}/.env`})

/**
 * Sync database and exit
 */
db.sequelize.sync().then(() => {
	console.log('Reset tables successfully')
	// eslint-disable-next-line no-undef
	process.exit(0)
}).catch(e => {
	console.error(e)
	// eslint-disable-next-line no-undef
	process.exit(1)
})