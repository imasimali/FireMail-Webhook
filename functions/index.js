const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const senderEmail = functions.config().smtp.email;
const senderPass = functions.config().smtp.pass;

// Configure the SMTP transporter using Mailgun's SMTP credentials
const mailTransport = nodemailer.createTransport({
  host: "smtp.eu.mailgun.org",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: senderEmail,
    pass: senderPass,
  },
});

exports.sendEmailUpdate = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Extracting common fields from the request body
  const { event, recipient, timestamp, 'delivery-status': deliveryStatus = {}, 'message': message = {}, 'client-info': clientInfo = {}, geolocation = {} } = req.body['event-data'];
  const { country, city } = geolocation;
  const { 'client-name': clientName, 'client-os': clientOs } = clientInfo;

  if (!event || !recipient) {
    return res.status(400).send('Missing required fields');
  }

  let emailText = `Event: ${event}\nRecipient: ${recipient}\nTime: ${new Date(timestamp * 1000).toISOString()}\n`;

  // Customize email body based on the event type
  if (event === "delivered") {
    const { tls, 'mx-host': mxHost, code, description, 'session-seconds': sessionSeconds, 'message': deliveryMessage } = deliveryStatus;
    emailText += `Delivery Status: ${deliveryMessage}\nTLS: ${tls}\nMX-Host: ${mxHost}\nCode: ${code}\nDescription: ${description || 'N/A'}\nSession Seconds: ${sessionSeconds}\n`;
  } else if (event === "opened") {
    emailText += `Location: ${country}, ${city}\nClient: ${clientName} (${clientOs})\n`;
  } else if (event === "clicked") {
    // Assuming IP, user-agent, and click location data are part of the request for clicked events
    const { ip, 'client-info': { 'client-name': browser, 'device-type': deviceType, 'client-os': os }, geolocation: { country, city } } = req.body['event-data'];
    emailText += `Clicked Information:\nIP: ${ip}\nLocation: ${country}, ${city}\nClient: ${browser} on ${os}, Device Type: ${deviceType}\n`;
  }

  // Adding message ID and subject if available
  const { 'headers': { 'message-id': messageId, 'subject': subject } = {} } = message;
  if (messageId) emailText += `Message ID: ${messageId}\n`;
  if (subject) emailText += `Subject: ${subject}\n`;

  const mailOptions = {
    from: `"Email Status Notifier" <${senderEmail}>`,
    to: 'm.asimali69@gmail.com',
    subject: `Email ${event.charAt(0).toUpperCase() + event.slice(1)} Notification for ${recipient}`,
    text: emailText,
  };

  try {
    await mailTransport.sendMail(mailOptions);
    res.send('Email update sent successfully');
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).send('Internal Server Error');
  }
});
