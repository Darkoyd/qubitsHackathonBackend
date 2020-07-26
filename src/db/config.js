const defaults = {
	database: process.env.DB_NAME,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOSTNAME,
	port: process.env.DB_PORT,
	dialect: 'postgres',
	logging: false,
	pool: {
		max: 20,
	},
}

module.exports = {
	development: Object.assign({}, defaults, {
		username: 'postgres',
		password: 'postgres',
		database: 'algo',
	}),
	test: Object.assign({}, defaults),
	production: Object.assign({}, defaults),
}
