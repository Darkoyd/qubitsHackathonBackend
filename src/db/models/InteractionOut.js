const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class InteractionOut extends Sequelize.Model {
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
		this.belongsTo(models.MessegeOut,  {
			foreignKey: {
				name: 'MessegeOutId',
				allowNull: false
			},
			as: 'MessegeOut'
		})
	}
}

module.exports = InteractionOut