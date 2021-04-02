// Create a DocumentClient that represents the query to get all items
const dynamodb = require('aws-sdk/clients/dynamodb');

const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.DDB_TABLE;

exports.trackCourseClicksHandler = async (event) => {
    const { httpMethod, path, queryStringParameters} = event;
    if (httpMethod !== 'POST') {
        throw new Error(`${httpMethod} method not allowed.`);
    }
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log('received:', JSON.stringify(event));

    if (!queryStringParameters || queryStringParameters.id === undefined) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: "missing parameter 'id'"
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            "CourseId": Number(queryStringParameters.id)
        },
        UpdateExpression: "set Clicks = Clicks + :val",
        ExpressionAttributeValues:{
            ":val": 1
        },
        ReturnValues:"UPDATED_NEW"
      };

    console.log("DEBUG: Updating course click");
    console.log("Params: ", JSON.stringify(params));

    await docClient.update(params).promise()
      .then(function(data){
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      })
      .catch(function(err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        console.error(err);
        throw new Error("Failed to update");

      });

    const response = {
        statusCode: 204,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
