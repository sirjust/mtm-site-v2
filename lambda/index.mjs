// Import only required AWS SDK v3 clients and commands
// This file must be zipped and uploaded to lambda if updated
// Perhaps later I will look into automatically packaging and deploying it

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.log('Received event:', event);
  console.log(`Type of body: ${typeof event.body}`)

  const body = JSON.parse(event.body);
  console.log(body);
  console.log("body.name: ", body.name);
  
  const params = {
    Destination: {
      ToAddresses: ["someEmail@gmail.com"],
    },
    Message: {
      Body: {
        Text: { 
          Data: 
            `name: ${body.name}\n` +
            `phone: ${body.phone}\n` + 
            `email: ${body.email}\n` +
            `desc: ${body.desc}`,
          Charset: 'UTF-8' },
      },
      Subject: { 
        Data: `Website Referral Form: ${body.name}`,
        Charset: 'UTF-8' },
    },
    Source: "someEmail@gmail.com",
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