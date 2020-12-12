import AWS = require('aws-sdk');
import * as serverless from 'aws-serverless-express';
import Express from 'express';
import * as util from 'util';

// const createResponse = (body: string | AWS.DynamoDB.DocumentClient.ItemList, statusCode = 200) => {
//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//     body: JSON.stringify({ message: 'Authenticated call!' }),
//   };
// };

const app = Express();

const helloHandler = async function (req: any, res: any) {
  console.log('Recieved', util.inspect(req));

  res.header('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify({ message: 'Authenticated call!' }));
  // return {
  //   statusCode: 200,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   },
  //   body: JSON.stringify({ message: 'Authenticated call!' }),
  // };
};

app.get('/unprotected/hello', helloHandler);
app.get('/internal/hello', helloHandler);
app.get('/external/hello', helloHandler);
const server = serverless.createServer(app);

export const handler = (event: any, context: any) => {
  return serverless.proxy(server, event, context);
};
