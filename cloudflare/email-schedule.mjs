import {WorkerMailer,LogLevel,SmtpAuthError,SmtpTimeoutError,SmtpConnectionError,SmtpRecipientError} from '@workermailer/smtp';
import {deliverTransactionEmails} from './transaction-email.mjs';
export function emailScheduled(env){
 return deliverTransactionEmails(env,{
  async send(config,message){
   try {
    const mailer=await WorkerMailer.connect({...config,authType:'plain',logLevel:LogLevel.NONE,socketTimeoutMs:15000,responseTimeoutMs:15000});
    try{await mailer.send(message);}finally{await mailer.close().catch(()=>{});}
   } catch(error) {
    throw new Error(error instanceof SmtpAuthError?'SMTP_AUTH':error instanceof SmtpTimeoutError?'SMTP_TIMEOUT':error instanceof SmtpConnectionError?'SMTP_CONNECTION':error instanceof SmtpRecipientError?'SMTP_RECIPIENT':'SMTP_SEND_FAILED');
   }
  },
  log:result=>console.info('commerce.email.delivery',result),
 });
}
