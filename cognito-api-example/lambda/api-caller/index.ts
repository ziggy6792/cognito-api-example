import AWS = require('aws-sdk');
import buildApiClient from './build-client/buildApiClient';
import Connection from './build-client/Connection';
import axios from 'axios';
import { aws4Interceptor } from 'aws4-axios';

const interceptor = aws4Interceptor(
  {
    region: 'ap-southeast-1',
    service: 'execute-api',
  },
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  }
);
axios.interceptors.request.use(interceptor);

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
  try {
    const response = await axios.get('https://paa3brg4jk.execute-api.ap-southeast-1.amazonaws.com/dev/internal/hello');
    console.log('response', response.data);
  } catch (err) {
    console.log({ err });
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: 'Authenticated call!' }),
  };
};
