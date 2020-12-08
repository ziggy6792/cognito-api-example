import AWS = require('aws-sdk');
import { v4 as uuid } from 'uuid';

const tableName = process.env.TABLE_NAME || '';
const dynamo = new AWS.DynamoDB.DocumentClient();

// const createResponse = (body: string | AWS.DynamoDB.DocumentClient.ItemList, statusCode = 200) => {
//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//     body: JSON.stringify({ message: 'Authenticated call!' }),
//   };
// };

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
  const { httpMethod, body: requestBody } = event;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: 'Authenticated call!' }),
  };
};
