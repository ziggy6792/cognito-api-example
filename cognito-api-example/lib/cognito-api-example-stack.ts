import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { CognitoToApiGatewayToLambda } from '@aws-solutions-constructs/aws-cognito-apigateway-lambda';
import addCorsOptions from './add-cors-options';
import * as apigw from '@aws-cdk/aws-apigateway';

export class CognitoApiExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const construct = new CognitoToApiGatewayToLambda(this, generateConstructId('api'), {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda/api-resolver'),
        functionName: generateConstructId('api-resolver'),
        description: generateConstructId('api-resolver'),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
      },
      apiGatewayProps: {
        proxy: false,
      },
    });

    const apiCallerHandler = new lambda.Function(this, generateConstructId('api-caller'), {
      code: lambda.Code.fromAsset('lambda/api-caller'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    // const stageDeployment = { id: generateConstructId('deployment'), description: generateConstructId('deployment') };

    // const deployment = new apigw.Deployment(this, stageDeployment.id, { api: construct.apiGateway, description: stageDeployment.description });

    // const deployedStage = new apigw.Stage(this, generateConstructId('stage-dev'), {
    //   deployment,
    //   stageName: 'dev',
    //   description: generateConstructId('stage-dev'),
    // });

    // construct.apiGateway.latestDeployment.

    const external = construct.apiGateway.root.addResource('external');

    const externalProxy = external.addProxy();
    externalProxy.addMethod('GET');
    externalProxy.addMethod('POST');
    addCorsOptions(externalProxy);

    const internal = construct.apiGateway.root.addResource('internal');
    const internaProxy = internal.addProxy();
    internaProxy.addMethod('GET');
    internaProxy.addMethod('POST');
    addCorsOptions(internaProxy);

    // construct.apiGateway.

    construct.addAuthorizers();
  }
}
