
const defaults = {
	// eslint-disable-next-line no-undef
	database: process.env.DB_NAME,
	// eslint-disable-next-line no-undef
	username: process.env.DB_USERNAME,
	// eslint-disable-next-line no-undef
	password: process.env.DB_PASSWORD,
	// eslint-disable-next-line no-undef
	host: process.env.DB_HOSTNAME,
	// eslint-disable-next-line no-undef
	port: process.env.DB_PORT,
	dialect: 'postgres',
	logging: false,
	pool: {
		max: 20
	}
}
module.exports = {
	development: Object.assign({}, defaults, {
		username: 'postgres',
		password: 'postgres',
		database: 'qubits_hackathon_db'
	}),
	test: Object.assign({}, defaults),
	production: Object.assign({}, defaults)
}
