const Sequelize = require('sequelize')
// eslint-disable-next-line no-unused-vars
const errors = require('../../utils/validationErrors')

class Inflow extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUID
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
		this.belongsToMany(models.Outflow, {
			through: 'PreviousOutflows', 
			as: 'PreviousOuts'
		})
		this.belongsToMany(models.Outflow, {
			through: 'PreviousInflows'
		})
		this.hasOne(models.MessegeIn, {
			foreignKey: {
				allowNull: true
			},
			onDelete: 'CASCADE'
		})
	}
}

module.exports = Inflow