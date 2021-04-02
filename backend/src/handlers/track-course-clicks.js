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

    var response;

    await docClient.update(params).promise()
      .then(function(data){
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: JSON.stringify(data)
        };
      })
      .catch(function(err) {
        response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: JSON.stringify(err)
        };
      });

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
