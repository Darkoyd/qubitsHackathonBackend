
module.exports = {
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
	dialect: 'postgres'
}
