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
			finalizada: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
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
		this.belongsTo(models.MessegeIn,  {
			foreignKey: {
				name: 'MessegeInId',
				allowNull: false
			},
			as: 'MessegeIn'
		})
		this.belongsTo(models.PageClient,  {
			foreignKey: {
				name: 'PageClientId',
				allowNull: false
			},
			as: 'PageClient'
		})
	}
}

module.exports = InteractionIn