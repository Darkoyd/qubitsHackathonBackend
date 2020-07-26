const Sequelize = require('sequelize')
const crypto = require('crypto')

class UserAuthToken extends Sequelize.Model {
	static init (sequelize) {
		return super.init({
			token: {
				type: Sequelize.STRING(512),
				allowNull: false,
				unique: true,
				defaultValue: function () {
					return crypto.randomBytes(128).toString('base64')
				}
			}
		}, {
			sequelize,
			updatedAt: false
		})
	}

	static associate (models) {
		this.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		})
	}
}

module.exports = UserAuthToken