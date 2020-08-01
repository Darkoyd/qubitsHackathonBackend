/* eslint-disable no-mixed-spaces-and-tabs */
const debug = require('debug')('backend:routes:webhook')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')
const router = express.Router()
const wrapper = require('express-debug-async-wrap')(debug)

const axios = require('axios')
const request = require('request')

// eslint-disable-next-line no-unused-vars
const { User, Page, Bot, Inflow, Outflow, MessegeIn, MessegeOut, InteractionIn, InteractionOut, PageClient, PreviousInflow, PreviousOutflow} = require(`${process.cwd()}/src/db`)


router.post('/webhook', wrapper(async (req, res) => {
	let body = req.body
	const entrys = body.entry
	
	if (body.object === 'page') {
		for (let index = 0; index < entrys.length; index++) {
			const entry = entrys[index]

			let page_id = entry.id
			
			let webhook_event = entry.messaging[0]
			console.log(webhook_event)


			let sender_psid = webhook_event.sender.id
			console.log('Sender PSID: ' + sender_psid)

			let client = await PageClient.findOne({ where: { psId: sender_psid, PageId: page_id } })
			if(client === 0)
			{
				//const info = await getUserData(sender_psid)
				client = await PageClient.create({id: uuidv4(), psId: sender_psid, PageId: page_id})

			}
			
			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message, page_id)
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback, page_id)
			} 
		}
		// Returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEIVED')
	} else {
		// Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404)
	}
}))

router.get('/webhook', wrapper(async (req, res) => {
	// Your verify token. Should be a random string.
	// eslint-disable-next-line no-undef
	let VERIFY_TOKEN = process.env.VERIFY_TOKEN
	// Parse the query params
	let mode = req.query['hub.mode']
	let token = req.query['hub.verify_token']
	let challenge = req.query['hub.challenge']
	// Checks if a token and mode is in the query string of the request
	if (mode && token) {
		// Checks the mode and token sent is correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED')
			res.status(200).send(challenge)
		} else {
			// Responds with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403)
		}
	}
}))

//async function newInteraction(messegeInId, messegeOutId, sender_psid, page_id){

//}

// Handles messages events
async function handleMessage(sender_psid, inflowId, page_id) {
	let response
	// Check if the message contains text
	if (inflowId) {
		//TODO Conseguir el siguiente en el flujo
		const bot = await Bot.findOne({where: {PageId: page_id}})
		const outflowId = await Outflow.findOne({where: {BotId: bot.id, first: true}})
		const messageOut = await MessegeOut.findOne({where: {OutflowId: outflowId}})
		response = messageOut.message
	} else {
		throw new Error('Flow error')
	}
	// if (received_message.attachments) {
	// Get the URL of the message attachment
	// 	let attachment_url = received_message.attachments[0].payload.url
	// 	response = {
	// 	  'attachment': {
	// 			'type': 'template',
	// 			'payload': {
	// 		  'template_type': 'generic',
	// 		  'elements': [{
	// 					'title': 'Is this the right picture?',
	// 					'subtitle': 'Tap a button to answer.',
	// 					'image_url': attachment_url,
	// 					'buttons': [
	// 			  {
	// 							'type': 'postback',
	// 							'title': 'Yes!',
	// 							'payload': 'yes',
	// 			  },
	// 			  {
	// 							'type': 'postback',
	// 							'title': 'No!',
	// 							'payload': 'no',
	// 			  }
	// 					],
	// 		  }]
	// 			}
	// 	  }
	// 	}
	//   }

	// Sends the response message
	callSendAPI(sender_psid, response, page_id)

}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback, page_id) {
	let response
	// Get the payload for the postback
	let inflowId = received_postback.payload

	if (inflowId) {
		const mesInflow = await MessegeIn.findOne({where: {InflowId: inflowId}})
		if(mesInflow.content.url){
			await sceenicMessage(inflowId, sender_psid, page_id)
		}
		else{
			//TODO Conseguir el siguiente en el flujo
			const outflowId = await nextInFlow(sender_psid, inflowId)
			const messageOut = await MessegeOut.findOne({where: {OutflowId: outflowId}})

			const messageIns = await followingOptions(sender_psid, outflowId) //TODO algun metodo que retorne todos los inflows (OBJETOS NO IDS) del outflow ESTO ES AWAIT
			const buttons = messageIns.forEach((el) => {
			//SI ESTE FOR EACH FALLA, HACER FOREACH A LA ANTIGUA
				buttons.push({
					type: 'postback',
					title: el.message.text,
					payload: el.id
				})
			})
			response = {
				message: {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'button',
							text: messageOut.message.text,
							buttons: buttons
						}
					}
				}
			}
		}
	} else {
		throw new Error('Flow error')
	}
	callSendAPI(sender_psid, response, page_id)

}

async function nextInFlow(sender_psid, inflowId){
	const temp = await PreviousInflow.findOne({where: {InflowId: inflowId}})
	return temp.OutflowId
}

async function followingOptions(sender_psid, outflowId){
	const intermediarios = await PreviousOutflow.findAll({where: {InflowId: outflowId}})
	let options = []
	for (let index = 0; index < intermediarios.length; index++) {
		const midle = intermediarios[index]
		const inflow = await Inflow.findOne({where: {id: midle.OutflowId}})
		options.push(inflow)
	}
	return options
}

async function getUserData(sender_psid, page_id){
	const page = await Page.findOne({where: {id: page_id}})
	return new Promise(function(resolve, reject) {
		let body = []
  
		// Send the HTTP request to the Graph API
		request({
		  // eslint-disable-next-line no-undef
		  uri: `${process.env.MESSENGER_PLATFORM}/${sender_psid}`,
		  qs: {
				access_token: page.pageAccessToken,
				fields: 'first_name, last_name, gender, locale, timezone'
		  },
		  method: 'GET'
		})
		  .on('response', function(response) {
			// console.log(response.statusCode);
  
				if (response.statusCode !== 200) {
			  reject(Error(response.statusCode))
				}
		  })
		  .on('data', function(chunk) {
				body.push(chunk)
		  })
		  .on('error', function(error) {
				console.error('Unable to fetch profile:' + error)
				reject(Error('Network Error'))
		  })
		  .on('end', () => {
				//body = Buffer.concat(body).toString()
				// console.log(JSON.parse(body));
  
				//resolve(JSON.parse(body))
		  })
	  })
}

// Sends response messages via the Send API
async function callSendAPI(sender_psid, response, page_id) {
	// Construct the message body
	const page = await Page.findOne({where: {id: page_id}})
	let request_body = {
		'recipient': {
		  'id': sender_psid
		},
		'message': response
	  }

	// eslint-disable-next-line no-undef
	axios.post(`${process.env.MESSENGER_PLATFORM}/me/messages?access_token=${page.pageAccessToken}`, request_body).then(function (response) {
		console.log('message sent!')
	  })
	  .catch(function (error) {
			console.log('Unable to send message:' + error)
	  })
}

async function sceenicMessage(inflowID, sender_psid, page_id){

	const midflow = await PreviousInflow.findOne({where: {InflowId: inflowID}})
	const outflow = await Outflow.findOne({where: {id: midflow.OutflowId}})
	const message = await MessegeOut.findOne({where:{OutflowId: outflow.id}})
	let urlId = message.content.text
	let sessionId = uuidv4()
	let url = urlId.replace('{{ID}}', sessionId)

	let request = {
		'text':'sigue el siguiente url para conectarte a la llamada ' + url + ' El id de la session es '+ sessionId
	}
	await sendEmailSceenicURL(url, page_id, sessionId)
	callSendAPI(sender_psid,request)
}


//send email with sceenic url 
async function sendEmailSceenicURL(urlSceenic, page_id, sessionId){
	const page = await Page.findOne({where: {id: page_id}})
	const user = await User.findOne({where: {id: page.UserId}})
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:   {
			user: 'qubitapptestmail@gmail.com',
			pass: '#qubit!testmail123'
		}
	})
	
	let mailOptions = {
		from: 'qubitapptestmail@gmail.com',
		to: user.email ,
		subject: 'Reunion solicitad mediante un bot',
		text: 'El url de la reunion es : ' + urlSceenic +'. El id de la sesion es: ' + sessionId
	}
	
	transporter.sendMail(mailOptions, function(err, data){
		if (err) {
			console.log('ocurrio un error', err)
		} else {
			console.log('email enviado '+ data)
		}
	})
}


module.exports = router