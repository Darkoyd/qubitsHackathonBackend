const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class Inflow extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
			},
			message: {
				type: Sequelize.JSONB,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: errors.empty('message')
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
		this.belongsTo(models.Bot,  {
			foreignKey: {
				name: 'BotId'
			},
			onDelete: 'restrict',
			as: 'Bot'
		})
		this.hasOne(models.Outflow)
	}
}

module.exports = Inflow