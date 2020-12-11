import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import MultiAuthApiGatewayLambda from '../constructs/multi-auth-apigateway-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as defaults from '@aws-solutions-constructs/core';
export class CognitoApiExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const construct = new MultiAuthApiGatewayLambda(this, generateConstructId('api'), {
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

    // const cognitoDomain = construct.userPool.addDomain(generateConstructId('api'),{})

    // const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
    //   userPool: construct.userPool,
    //   customDomain: {
    //     domainName: construct.apiGateway.restApiId,
    //     cognitoDomain,
    //     // certificate,
    //   },
    // });

    // const client = construct.userPool.addClient('stackoverflow-userpool-localhost-client', {
    //   userPoolClientName: 'stackoverflow-localhost-client',
    //   oAuth: {
    //     flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
    //     scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE, cognito.OAuthScope.COGNITO_ADMIN],
    //     callbackUrls: ['http://localhost:3000/'],
    //     logoutUrls: ['http://localhost:3000/'],
    //   },
    //   // supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.AMAZON, cognito.UserPoolClientIdentityProvider.COGNITO],
    // });

    construct.userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: construct.apiGateway.restApiId,
      },
    });

    // defaults.printWarning(construct.apiGateway.restApiId);

    const externalProxy = construct.externalResource.addProxy();
    externalProxy.addMethod('GET');
    externalProxy.addMethod('POST');

    const internalProxy = construct.internalResource.addProxy();
    internalProxy.addMethod('GET');
    internalProxy.addMethod('POST');

    const unprotectedProxy = construct.unprotectedResource.addProxy();
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

    construct.addAuthorizers();
  }
}
