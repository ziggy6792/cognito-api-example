import AWS = require('aws-sdk');
import { v4 as uuid } from 'uuid';

const tableName = process.env.TABLE_NAME || '';
const dynamo = new AWS.DynamoDB.DocumentClient();

const createResponse = (body: string | AWS.DynamoDB.DocumentClient.ItemList, statusCode = 200) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE',
    },
    statusCode,
    body: JSON.stringify(body, null, 2),
  };
};

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
  const { httpMethod, body: requestBody } = event;

  return createResponse('OKAY');
};
