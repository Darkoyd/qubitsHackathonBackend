const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class Bot extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false
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
	}
}