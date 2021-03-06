const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class Bot extends Sequelize.Model {
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
			}
		}, {
			sequelize,
			paranoid: true,
			hooks: {}
		})
	}

	static associate (models) {
		this.belongsTo(models.User,  {
			foreignKey: {
				name: 'UserId'
			},
			onDelete: 'restrict',
			as: 'User'
		})
		this.belongsTo(models.Page,  {
			foreignKey: {
				name: 'PageId'
			},
			onDelete: 'restrict',
			as: 'Page'
		})
		this.hasMany(models.Outflow, {
			foreignKey: {
				allowNull: true
			}
		})
		this.hasMany(models.Inflow, {
			foreignKey: {
				allowNull: true
			}
		})
	}
}

module.exports = Bot