const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class InteractionIn extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
			},
			psId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: errors.empty('content')
					}
				}
			},
			finalizada: {
				type: Sequelize.INTEGER,
				defaultValue: false,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: errors.empty('content')
					}
				}
			},
			data: {
				type: Sequelize.JSONB,
				allowNull: true,
			}
		}, {
			sequelize,
			paranoid: true,
			hooks: {}
		})
	}

	static associate (models) {
		this.belongsTo(models.MessegeIn,  {
			foreignKey: {
				name: 'MessegeInId',
				allowNull: false
			},
			as: 'MessegeIn'
		})
	}
}

module.exports = InteractionIn