// eslint-disable-next-line no-undef
const { InteractionIn, InteractionOut } = require(`${process.cwd()}/src/db`)
const debug = require('debug')('backend:routes:CRON')

async function clean() {
	try {
		await InteractionIn.destroy({ where: { finalizada: false } })
		await InteractionOut.destroy({ where: {finalizada: false} })
	} catch (error) {
		debug('Cron Job error')
	}
}

module.exports = clean()
