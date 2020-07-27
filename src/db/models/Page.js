const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const errors = require('../../utils/validationErrors')

class Page extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: errors.empty('name')
					}
				}
			},
			url: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					args: true,
					msg: errors.url('URL')
				}
			},
			pageId:{
				type: Sequelize.STRING,
				allowNull: false
			},
			appId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			pageAccessToken: {
				type: Sequelize.STRING,
				allowNull: false
			},
			appSecret: {
				type: Sequelize.STRING,
				allowNull: false
			}
		}, {
			sequelize,
			paranoid: true,
			hooks: {
				// eslint-disable-next-line no-unused-vars
				async beforeSave (page, options) {
					if (page.changed('pageId')) {
						const salt = await bcrypt.genSalt(10)
						page.pageId = await bcrypt.hash(page.pageId, salt)
					}
					if (page.changed('appId')) {
						const salt = await bcrypt.genSalt(10)
						page.appId = await bcrypt.hash(page.appId, salt)
					}
					if (page.changed('pageAccessToken')) {
						const salt = await bcrypt.genSalt(10)
						page.pageAccessToken = await bcrypt.hash(page.pageAccessToken, salt)
					}
					if (page.changed('appSecret')) {
						const salt = await bcrypt.genSalt(10)
						page.appSecret = await bcrypt.hash(page.appSecret, salt)
					}
				}
			}
		})
	}
	authenticate(pageId, appId, pageAccessToken, appSecret) {
		const authPageId = bcrypt.compareSync(pageId, this.pageId)
		const authAppId = bcrypt.compareSync(appId, this.appId)
		const authPageAccessToken = bcrypt.compareSync(pageAccessToken, this.pageAccessToken)
		const authAppSecret = bcrypt.compareSync(appSecret, this.appSecret)
		return [authPageId, authAppId, authPageAccessToken, authAppSecret]
	}

	static associate (models) {
		this.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		})
		this.hasMany(models.Bot, {
			foreignKey: {
				allowNull: true
			}
		})
	}
}

module.exports = Page