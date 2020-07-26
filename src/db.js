const config = require('../src/db/config')
const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')

const db = {}

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
)

fs
	.readdirSync('./src/db/models')
	.filter(file => {
		return (file.indexOf('.js') > 0)
	})
	.forEach(file => {
		const modelPath = path.resolve('./src/db/models', file)
		const model = require(modelPath)
		db[model.name] = model.init(sequelize)
		console.log(`Loaded ${model.name} model`)
	})

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
		console.log(`Associated ${modelName}`)
	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db._dbConfig = config

async function test() {
	try {
		await sequelize.authenticate()
		console.log('Connection has been established successfully.')
	}
	catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

test()

module.exports = db