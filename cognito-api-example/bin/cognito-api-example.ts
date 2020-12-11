#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CognitoApiExampleStack } from '../lib/cognito-api-example-stack';

const app = new cdk.App();
new CognitoApiExampleStack(app, 'CognitoApiExampleStack2');
