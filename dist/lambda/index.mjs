// Import only required AWS SDK v3 clients and commands
// This file must be zipped and uploaded to lambda if updated
// Perhaps later I will look into automatically packaging and deploying it

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.log('Received event:', event);

  console.log("event.name: ", event.name);
  
  const params = {
    Destination: {
      ToAddresses: ["someEmail@someEmail.com"],
    },
    Message: {
      Body: {
        Text: { 
          Data: 
            `name: ${event.name}\n` +
            `phone: ${event.phone}\n` + 
            `email: ${event.email}\n` +
            `desc: ${event.desc}`,
          Charset: 'UTF-8' },
      },
      Subject: { 
        Data: `Website Referral Form: ${event.name}`,
        Charset: 'UTF-8' },
    },
    Source: "someEmail@someEmail.com",
  };
 
  try {
    const result = await ses.send(new SendEmailCommand(params));
    console.log("Email sent:", result);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully", result }),
    };
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email", error: err }),
    };
  }
};