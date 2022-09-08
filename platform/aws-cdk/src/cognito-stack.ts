import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
  AccountRecovery, CfnUserPoolUser,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolEmail
} from "aws-cdk-lib/aws-cognito";
import {AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId} from "aws-cdk-lib/custom-resources";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, 'userpoolExampleId', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      userPoolName: 'userpool-example',
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false
      },
      signInAliases: {
        email: false,
        username: true,
        phone: false,
        preferredUsername: true
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: false,
      autoVerify: undefined,
      email: UserPoolEmail.withCognito()
    })

    const userPoolClient = new UserPoolClient(this, 'userpoolClientExampleId', {
      userPool,
      userPoolClientName: 'client1',
      authFlows: {
        userPassword: true
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
      ],
      generateSecret: false
    });

    new AwsCustomResource(this, 'AwsCustomResource-CreateUser', {
      onCreate: {
        service: 'CognitoIdentityServiceProvider',
        action: 'adminCreateUser',
        parameters: {
          UserPoolId: userPool.userPoolId,
          Username: 'customer',
          MessageAction: 'SUPPRESS',
          TemporaryPassword: 'customer1',
        },
        physicalResourceId: PhysicalResourceId.of(`AwsCustomResource-CreateUser-customer`),
      },
      onDelete: {
        service: "CognitoIdentityServiceProvider",
        action: "adminDeleteUser",
        parameters: {
          UserPoolId: userPool.userPoolId,
          Username: 'customer',
        },
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
      installLatestAwsSdk: true,
    });

    new AwsCustomResource(this, 'AwsCustomResource-ForcePassword', {
      onCreate: {
        service: 'CognitoIdentityServiceProvider',
        action: 'adminSetUserPassword',
        parameters: {
          UserPoolId: userPool.userPoolId,
          Username: 'customer',
          Password: 'customer1',
          Permanent: true,
        },
        physicalResourceId: PhysicalResourceId.of(`AwsCustomResource-ForcePassword-customer1`),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
      installLatestAwsSdk: true,
    });


    new cdk.CfnOutput(this, 'userpoolExampleIdOut', {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, 'userpoolClientExampleIdOut', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
