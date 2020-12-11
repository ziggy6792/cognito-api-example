import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import MultiAuthApiGatewayLambda from '../constructs/multi-auth-apigateway-lambda';
import * as iam from '@aws-cdk/aws-iam';

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
      },
    });

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
