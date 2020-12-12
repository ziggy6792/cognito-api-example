import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import MultiAuthApiGatewayLambda from '../constructs/multi-auth-apigateway-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as defaults from '@aws-solutions-constructs/core';
export class CognitoApiExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const REGION = 'ap-southeast-1';

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const apiConstruct = new MultiAuthApiGatewayLambda(this, generateConstructId('api'), {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda/api-resolver'),
        functionName: generateConstructId('api-resolver'),
        description: generateConstructId('api-resolver'),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
      },
      apiGatewayProps: {
        restApiName: generateConstructId('api'),
        description: generateConstructId('api'),
        proxy: false,
        deployOptions: { stageName: 'dev' },
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowHeaders: ['*'],
          allowMethods: ['*'],
        },
      },
      cognitoUserPoolProps: {
        userPoolName: generateConstructId('user-pool'),
        selfSignUpEnabled: true,
        signInAliases: {
          email: true,
        },
        autoVerify: {
          email: true,
        },
        standardAttributes: {
          email: {
            required: true,
            mutable: false,
          },
        },
        customAttributes: {
          signUpAttributes: new cognito.StringAttribute({ minLen: 1, maxLen: 2048, mutable: true }),
        },
        passwordPolicy: {
          tempPasswordValidity: cdk.Duration.days(2),
          minLength: 6,
          requireDigits: false,
          requireLowercase: false,
          requireUppercase: false,
          requireSymbols: false,
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      },
    });

    const client = apiConstruct.userPool.addClient(generateConstructId('client'), {
      userPoolClientName: generateConstructId('client'),
      oAuth: {
        flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE, cognito.OAuthScope.COGNITO_ADMIN],
        callbackUrls: ['http://localhost:3000/'],
        logoutUrls: ['http://localhost:3000/'],
      },
      // supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.AMAZON, cognito.UserPoolClientIdentityProvider.COGNITO],
    });
    const domainPrefix = apiConstruct.apiGateway.restApiId;

    apiConstruct.userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix,
      },
    });

    // defaults.printWarning(construct.apiGateway.restApiId);

    const externalProxy = apiConstruct.externalResource.addProxy();
    externalProxy.addMethod('GET');
    externalProxy.addMethod('POST');

    const internalProxy = apiConstruct.internalResource.addProxy();
    internalProxy.addMethod('GET');
    internalProxy.addMethod('POST');

    const unprotectedProxy = apiConstruct.unprotectedResource.addProxy();
    unprotectedProxy.addMethod('GET');
    unprotectedProxy.addMethod('POST');

    const apiCallerHandler = new lambda.Function(this, generateConstructId('api-caller'), {
      code: lambda.Code.fromAsset('lambda/api-caller'),
      functionName: generateConstructId('api-caller'),
      description: generateConstructId('api-caller'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    apiCallerHandler!.role!.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));

    apiConstruct.addAuthorizers();

    const removeTralingSlash = (url: string) => url.replace(/\/$/, '');

    const clientConfig = {
      apiGateway: {
        REGION: REGION,
        URL: `${removeTralingSlash(apiConstruct.apiGateway.url)}${removeTralingSlash(apiConstruct.externalResource.path)}`,
      },
      cognito: {
        REGION: REGION,
        USER_POOL_ID: apiConstruct.userPool.userPoolId,
        APP_CLIENT_ID: client.userPoolClientId,
        DOMAIN: ` ${domainPrefix}.auth.ap-southeast-1.amazoncognito.com`,
        SCOPE: ['email', 'openid'],
        REDIRECT_SIGN_IN: 'http://localhost:3000/',
        REDIRECT_SIGN_OUT: 'http://localhost:3000/',
        RESPONSE_TYPE: 'code',
      },
    };

    const clientConfigOutput = new cdk.CfnOutput(this, 'client-config', {
      description: 'client-config',
      value: JSON.stringify(clientConfig),
    });
  }
}
