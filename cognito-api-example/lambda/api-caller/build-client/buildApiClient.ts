import * as AWS from 'aws-sdk';
import AWSAppSyncClient, { AWSAppSyncClientOptions, createAppSyncLink } from 'aws-appsync';

require('es6-promise').polyfill();
require('isomorphic-fetch');
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { Auth } from 'aws-amplify';
// import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import Connection from './Connection';

const buildApiClient = (connection: Connection, customHeaders: any) => {
  AWS.config.update({
    region: connection.REGION,
    credentials: new AWS.Credentials(connection.AWS_ACCESS_KEY_ID, connection.AWS_SECRET_ACCESS_KEY, connection.AWS_SESSION_TOKEN),
  });
  const { credentials } = AWS.config;

  const AppSyncConfig = {
    url: connection.URL,
    region: connection.REGION,
    auth: {
      type: 'AWS_IAM',
      credentials,
    },
    disableOffline: true,
  } as AWSAppSyncClientOptions;

  const awsLink = createAppSyncLink({
    ...AppSyncConfig,
    complexObjectsCredentials: () => Auth.currentCredentials(),
    resultsFetcherLink: ApolloLink.from([
      setContext((request, previousContext) => ({
        headers: {
          ...previousContext.headers,
          ...customHeaders,
        },
      })),
      createHttpLink({
        uri: AppSyncConfig.url,
      }),
    ]),
  });

  const appsyncClient: AWSAppSyncClient<any> = new AWSAppSyncClient(AppSyncConfig, {
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
    link: awsLink,
  });

  return appsyncClient;
};

export default buildApiClient;
