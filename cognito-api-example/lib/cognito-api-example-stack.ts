import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { CognitoToApiGatewayToLambda } from '@aws-solutions-constructs/aws-cognito-apigateway-lambda';

export class CognitoApiExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const construct = new CognitoToApiGatewayToLambda(this, generateConstructId('TodoHandler'), {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda'),
        functionName: generateConstructId('TodoHandler'),
        description: generateConstructId('TodoHandler'),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
      },
      // apiGatewayProps: {
      //   proxy: false,
      // },
    });

    // For first try I am just trying to bit the base url so I commented out this stuff (though I did try with it uncommented too)

    // const resource = construct.apiGateway.root.addResource('hello');
    // resource.addMethod('GET');
    // resource.addMethod('POST');

    // Mandatory to call this method to Apply the Cognito Authorizers on all API methods
    // construct.addAuthorizers();

    // The code that defines your stack goes here
  }
}
