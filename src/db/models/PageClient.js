const Sequelize = require('sequelize')
const errors = require('../../utils/validationErrors')

class PageClient extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
			},
			psId: {
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
		this.hasMany(models.InteractionIn,  {
			foreignKey: {
				allowNull: true
			}
		})
		this.hasMany(models.InteractionOut,  {
			foreignKey: {
				allowNull: true
			}
		})
		this.belongsTo(models.Page,  {
			foreignKey: {
				name: 'PageId',
				allowNull: false
			},
			as: 'Page'
		})
	}
}

module.exports = PageClient