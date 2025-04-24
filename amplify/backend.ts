import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

// Set up the HTTP data source for Amazon Bedrock in us-east-2
const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-2.amazonaws.com", // Region changed to us-east-2
  {
    authorizationConfig: {
      signingRegion: "us-east-2", // Region changed to us-east-2
      signingServiceName: "bedrock",
    },
  }
);

// Grant permissions to invoke the Claude model via Bedrock in us-east-2
bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0", // us-east-2
    ],
    actions: ["bedrock:InvokeModel"],
  })
);
