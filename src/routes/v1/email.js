const nodemailer = require('nodemailer')
require('dotenv').config()

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:   {
		user: 'qubitapptestmail@gmail.com',
		pass: '#qubit!testmail123'
	}
})

let mailOptions = {
    from: 'qubitapptestmail@gmail.com',
	to: 'popjoshuabloo@gmail.com' ,
    subject: 'testing',
    text: 'El url es : '
}

transporter.sendMail(mailOptions, function(err, data){
    if (err) {
        console.log('ocurrio un error', err)
    } else {
        console.log('email enviado')
    }
});