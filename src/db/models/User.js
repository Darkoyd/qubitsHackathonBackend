const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const errors  = require('../../utils/validationErrors')

class User extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
			},
			email: {
				type: Sequelize.STRING,
				allowNull: null,
				unique: true,
				validate: {
					notEmpty: {
						args: true,
						msg: errors.empty('email')
					}
				}
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
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [8, 256],
						msg: errors.len('password', 8, 256)
					}
				}
			}
		}, {
			sequelize,
			paranoid: true,
			hooks: {
				// eslint-disable-next-line no-unused-vars
				async beforeSave (user, options) {
					if (user.changed('password')) {
						const salt = await bcrypt.genSalt(10)
						user.password = await bcrypt.hash(user.password, salt)
					}
				}
			}
		})
	}

	authenticate (password) {
		return bcrypt.compareSync(password, this.password)
	}

	static associate (models) {
		this.hasMany(models.Bot, {
			foreignKey: {
				allowNull: true
			}
		})

		this.hasMany(models.Page,{
			foreignKey: {
				allowNull: true
			}
		})
	}
}

module.exports = User