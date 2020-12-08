import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { CognitoToApiGatewayToLambda } from '@aws-solutions-constructs/aws-cognito-apigateway-lambda';

export class CognitoApiExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    // const handler = new lambda.Function(this, generateConstructId('TodoHandler'), {
    //   code: lambda.Code.fromAsset('lambda'),
    //   handler: 'todoHandler.handler',
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   environment: {},
    // });

    new CognitoToApiGatewayToLambda(this, generateConstructId('TodoHandler'), {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda'),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
      },
    });

    // The code that defines your stack goes here
  }
}
