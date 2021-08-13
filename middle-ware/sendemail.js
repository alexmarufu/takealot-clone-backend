const nodemailer = require('nodemailer');

function sendEmail(to, text, name, totalItems, totalPrice, status, orderId ) {
    

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account');
        console.error(err);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    
    let transporter = nodemailer.createTransport(
        {
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            },
            logger: true,
            transactionLog: true // include SMTP traffic in the logs
        },
        {
            // default message fields

            // sender info
            from: 'alexmarufu08@gmail.com',
            headers: {
                'X-Laziness-level': 1000 
            }
        }
    );

    // Message object
    let message = {
        // Comma separated list of recipients
        to: to,

        // Subject of the message
        subject: 'order confirmation',

        // plaintext body
        text: text,

        // HTML body
        html: `<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>
        <p>Here's a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>`,

        // AMP4EMAIL
        amp: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
            <p><b>Hello</b> ${name} </p>
            <br>
            <h4>order Number: ${orderId}</h4>
            <br>
            <h4>order summary: </h4>
            <p><b>total items</b> ${totalItems} </p>
            <p><b>total price: </b> ${totalPrice} </p>
            <p><b>order status:</b> ${status} </p>
          </body>
        </html>`
      
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
        }

        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));

        // only needed when using pooled connections
        transporter.close();
    });
});
}
module.exports = sendEmail;