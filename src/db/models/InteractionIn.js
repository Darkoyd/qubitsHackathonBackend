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
			facebookName: {
				type: Sequelize.STRING,
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