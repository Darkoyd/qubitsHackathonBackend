#!/usr/bin/env node

const db = require('../db')
require('dotenv').config({path: '../../../.env'})

/**
 * Sync database and exit
 */
db.sequelize.sync().then(() => {
	console.log('Reset tables successfully')
	process.exit(0)
}).catch(e => {
	console.error(e)
	process.exit(1)
})