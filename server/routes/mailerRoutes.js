import express from 'express';
import {
    sendContactMail,
    sendResetMail,
    sendwelcomeMail,
    sendPaymentMail,
    sendCustomMail,
    unsubscribeMail,
    sendMultiCustomMail,
    getEmailTemplates,
    updateEmailTemplate,
    createEmailTemplate,
    getEmailHistory,
} from '../controllers/mailerController.js';

const router = express.Router();

router.post('/send-contact-mail', sendContactMail);
router.post('/send-custom-mail', sendCustomMail);
router.post('/send-custom-multimail', sendMultiCustomMail);
router.post('/send-reset-mail', sendResetMail);
router.post('/send-welcome-mail', sendwelcomeMail);
router.post('/send-payment-mail', sendPaymentMail);
router.post('/unsubscribe/:email', unsubscribeMail);
router.get("/templates", getEmailTemplates);
router.put("/templates/:id", updateEmailTemplate);
router.post("/templates", createEmailTemplate);
router.get("/mailshistory", getEmailHistory);

export default router;
