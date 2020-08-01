/* eslint-disable no-mixed-spaces-and-tabs */
const debug = require('debug')('backend:routes:webhook')
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()
const wrapper = require('express-debug-async-wrap')(debug)

const axios = require('axios')

const { Page, Bot, Inflow, Outflow, MessegeIn, MessegeOut, InteractionIn, InteractionOut, PageClient} = require(`${process.cwd()}/src/db`)

router.post('/webhook', wrapper(async (req, res) => {
	let body = req.body
	
	if (body.object === 'page') {
		
		body.entry.forEach(function(entry) {

			let page_id = entry.id
			
			let webhook_event = entry.messaging[0]
			console.log(webhook_event)


			let sender_psid = webhook_event.sender.id
			console.log('Sender PSID: ' + sender_psid)

			const client = PageClient.findOne({ where: { psId: sender_psid, PageId: page_id } })
			if(client === 0)
			{
				const info = await this.getUserData(sender_psid)
				client = await PageClient.create({id: uuidv4(), psId: sender_psid, data: info, PageId: page_id})

			}

			
			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message)        
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback)
			}
		})
		// Returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEIVED')
	} else {
		// Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404)
	}
}))

router.get('/webhook', wrapper(async (req, res) => {
	// Your verify token. Should be a random string.
	let VERIFY_TOKEN = 'abc'
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

// Handles messages events
function handleMessage(sender_psid, received_message) {
	let response

	// Check if the message contains text
	if (received_message.text) {    

		// Create the payload for a basic text message
		response = {
			'text': `You sent the message: "${received_message.text}". Now send me an image!`
		}
	}  else if (received_message.attachments) {
		// Get the URL of the message attachment
		let attachment_url = received_message.attachments[0].payload.url;
		response = {
		  'attachment': {
				'type': 'template',
				'payload': {
			  'template_type': 'generic',
			  'elements': [{
						'title': 'Is this the right picture?',
						'subtitle': 'Tap a button to answer.',
						'image_url': attachment_url,
						'buttons': [
				  {
								'type': 'postback',
								'title': 'Yes!',
								'payload': 'yes',
				  },
				  {
								'type': 'postback',
								'title': 'No!',
								'payload': 'no',
				  }
						],
			  }]
				}
		  }
		}
	  } 
  
	// Sends the response message
	callSendAPI(sender_psid, response)

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
	let response
  
	// Get the payload for the postback
	let payload = received_postback.payload

	// Set the response based on the postback payload
	if (payload === 'yes') {
		response = { 'text': 'Thanks!' }
	} else if (payload === 'no') {
		response = { 'text': 'Oops, try sending another image.' }
	}
	// Send the message to acknowledge the postback
	callSendAPI(sender_psid, response)

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
	// Construct the message body
	let request_body = {
		'recipient': {
		  'id': sender_psid
		},
		'message': response
	  }

	axios.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.ACCESS_TOKEN}`, request_body).then(function (response) {
		console.log('message sent!')
	  })
	  .catch(function (error) {
			console.log('Unable to send message:' + error)
	  })
}

module.exports = router