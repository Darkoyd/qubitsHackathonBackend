const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class MessegeIn extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
			},
			content: {
				type: Sequelize.JSONB,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: errors.empty('content')
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
		this.belongsTo(models.Inflow,  {
			foreignKey: {
				name: 'InflowId',
				allowNull: false
			},
			as: 'Inflow'
		})
		this.hasMany(models.InteractionIn, {
			foreignKey: {
				allowNull: true
			},
			onDelete: 'CASCADE'
		})
	}
}

module.exports = MessegeIn