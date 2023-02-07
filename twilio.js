require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken, {
  autoRetry: true,
  maxRetries: 3
})

module.exports.call = async () => {
  const call = await client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+447946114932',
    from: '+19012950513'
  })
  console.log(call.sid)
}
