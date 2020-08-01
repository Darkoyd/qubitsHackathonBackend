const cron = require('node-cron')
const cleanNonReadFlows = require('../src/utils/cleanNonReadFlows')

module.exports(
	cron.schedule('* * 2 * * *', () => {
		cleanNonReadFlows.clean()
	})
)