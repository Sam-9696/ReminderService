const cron = require('node-cron');
const emailService = require('../services/email-service');
const sender = require('../config/emailConfig');

/**
 * 10:00 am
 * Every 5 minutes
 * We will check, if there are any pending emails which were expected to be 
 * sent by now and is pending.
 */

const setupJobs = () => {
    cron.schedule('*/2 * * * *', async () => {
        const response = await emailService.fetchPendingEmails();
        response.forEach((email) => {
            // emailService.sendBasicEmail(
            //     "ReminderrService@airline.com",
            //     email.recipientEmail,
            //     email.subject,
            //     email.content
            // );

            sender.sendMail({  
                to: email.recipientEmail,
                subject: email.subject,
                text: email.content
            }, async (err, data) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(data);
                    await emailService.updateTicket(email.id, {status: "SUCCESS"});
                }
            });
        });
        console.log(response);
    });
}

module.exports = setupJobs;