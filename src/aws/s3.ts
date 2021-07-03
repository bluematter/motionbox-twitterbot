import AWS from "aws-sdk";

const Bucket = "storycreator.v2.rendered";
const IdentityPoolId = process.env.IDENTITY_POOL_ID
  ? process.env.IDENTITY_POOL_ID
  : "";

AWS.config.update({
  region: "us-west-2",
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket },
});

export default s3;
