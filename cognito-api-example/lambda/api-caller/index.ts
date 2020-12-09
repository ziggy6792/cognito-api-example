import AWS = require('aws-sdk');
import buildApiClient from './build-client/buildApiClient';
import Connection from './build-client/Connection';
import gql from 'graphql-tag';
import * as aws4 from 'aws4';
import Axios from 'axios';
// import * as request from 'request';

// const createResponse = (body: string | AWS.DynamoDB.DocumentClient.ItemList, statusCode = 200) => {
//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//     body: JSON.stringify({ message: 'Authenticated call!' }),
//   };
// };

const env = {
  AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
  AWS_SESSION_TOKEN:
    'IQoJb3JpZ2luX2VjELT//////////wEaDmFwLXNvdXRoZWFzdC0xIkcwRQIgHGNmSxu1Z7PbwjoKFDfbcbroKj9C4Y5jqpFKWNmV3KcCIQCc3OLTBwOOj8jG4wTDYZlKUqm7BxDhGPh5mLeEFaQX+CrgAQhNEAAaDDY5NDcxMDQzMjkxMiIMINVimq7ROQHLtEvxKr0Bsz8iDZ79BNidH+NnOWMEa3r06e6czi1t1MtJRrLStwam4pCpVvshY2lk6ZRAbMLJx+Dkv/FwFGTGBP3DRyhGpP4fg98yLgZhlPJiJc+Z1NEzVP85+p6+SZo712uqzPbiv3sq/c0J5qAwU4TEeZrK4aOVJTidEIAhCsuXK1oH3gU9933gRIvsDhZjCHEUTybKLb0KvRl3qPSmkslI9eG85zIPJYFL8/tUOfmGesVvKgOD3UNr+FBA5yIpZLj4MOi1v/4FOuABbkEDtCw5WVEJaVuENdqueZSUi86bSGCJd6XzvCAYB+MMoMOB8r14sRYZMWKuZM9jJQHtfWNWwX4sGcWU7UKmIxclxEOaDVBw4yGWsydqWCgRnXQCDWN0QmKd6+FRBaTt1bCInVOnKTnDmkTA2kfA1zYyijtd1crlWZTvdRw3m3XyBLjiZftEBQC0ovh6EGyiI+02KpAKwHh00EzZZ2ll2oJkS1TqBczzT5ZhE2MLHLGhV7d8Et9bAjPQQy5oqUbiukfCsgg57AV+jyqht6uyprfZ42M/nL8EVw4rBETrWxY=',
  LD_LIBRARY_PATH: '/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib',
  AWS_LAMBDA_LOG_GROUP_NAME: '/aws/lambda/CognitoApiExampleStack-api-caller',
  LAMBDA_TASK_ROOT: '/var/task',
  AWS_LAMBDA_LOG_STREAM_NAME: '2020/12/08/[$LATEST]6422518d9119411180c086c6ad6dcaae',
  AWS_LAMBDA_RUNTIME_API: '127.0.0.1:9001',
  AWS_EXECUTION_ENV: 'AWS_Lambda_nodejs12.x',
  AWS_XRAY_DAEMON_ADDRESS: '169.254.79.2:2000',
  AWS_LAMBDA_FUNCTION_NAME: 'CognitoApiExampleStack-api-caller',
  PATH: '/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin',
  AWS_DEFAULT_REGION: 'ap-southeast-1',
  PWD: '/var/task',
  AWS_SECRET_ACCESS_KEY: '8TO03XWRRHGsFtzlyUrxhBrdEBwrEXaQZRYMKflS',
  LANG: 'en_US.UTF-8',
  LAMBDA_RUNTIME_DIR: '/var/runtime',
  AWS_LAMBDA_INITIALIZATION_TYPE: 'on-demand',
  NODE_PATH: '/opt/nodejs/node12/node_modules:/opt/nodejs/node_modules:/var/runtime/node_modules:/var/runtime:/var/task',
  AWS_REGION: 'ap-southeast-1',
  TZ: ':UTC',
  AWS_ACCESS_KEY_ID: 'ASIA2DP7X6SIK3RLL3PR',
  SHLVL: '0',
  _AWS_XRAY_DAEMON_ADDRESS: '169.254.79.2',
  _AWS_XRAY_DAEMON_PORT: '2000',
  AWS_XRAY_CONTEXT_MISSING: 'LOG_ERROR',
  _HANDLER: 'index.handler',
  AWS_LAMBDA_FUNCTION_MEMORY_SIZE: '128',
  _X_AMZN_TRACE_ID: 'Root=1-5fcfdae8-1705803e6fc8c557651b3125;Parent=55c1eed804e21974;Sampled=0',
};

const partialConnection: Partial<Connection> = {};

// partialConnection.URL = process.env.API_COMPAPI_GRAPHQLAPIENDPOINTOUTPUT;
partialConnection.URL = `https://4rjawoou71.execute-api.ap-southeast-1.amazonaws.com/prod/internal/hello`;
partialConnection.REGION = 'ap-southeast-1';
// Connaction Auth
partialConnection.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
partialConnection.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
partialConnection.AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;

const connection: Connection = partialConnection as Connection;

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
  const { httpMethod, body: requestBody } = event;

  console.log('Env vars');
  console.log(process.env);

  const client = buildApiClient(connection, {});

  const HELLO = gql`
    {
      hello
    }
  `;

  let response: any;

  const signedRequest = aws4.sign(
    {
      host: `https://4rjawoou71.execute-api.ap-southeast-1.amazonaws.com/`,
    },
    {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      sessionToken: process.env.AWS_SESSION_TOKEN,
      region: 'ap-southeast-1',
    }
  );

  const axiosInstance = Axios.create({
    baseURL: `https://4rjawoou71.execute-api.ap-southeast-1.amazonaws.com/prod/internal/hello`,
    timeout: 30000,
    headers: signedRequest.headers,
  });

  console.log('signedRequest', signedRequest);
  console.log('Client', client);

  try {
    // response = await client.query({ query: HELLO });
    // const response = await request(signedRequest);
    const response = await axiosInstance.get('/');
    console.log({ response });
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
