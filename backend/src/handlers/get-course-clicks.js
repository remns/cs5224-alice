// Create a DocumentClient that represents the query to get all items
const dynamodb = require('aws-sdk/clients/dynamodb');

const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.DDB_TABLE;

exports.getCourseClicksHandler = async (event) => {
    const { httpMethod, path, queryStringParameters} = event;
    if (httpMethod !== 'GET') {
        throw new Error(`${httpMethod} method not allowed.`);
    }
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log('received:', JSON.stringify(event));


    const params = {
        TableName: tableName,
        IndexName: "ClicksIndex2",
        KeyConditionExpression: "GsiPk = :id",
        ExpressionAttributeValues: {
            ":id": 1
        },
        ProjectionExpression: "CourseId, Clicks",
        ScanIndexForward: false,
      };

    if (queryStringParameters && queryStringParameters.limit !== undefined) {
        params["Limit"] = queryStringParameters.limit;
    }

    console.log("Params: ", JSON.stringify(params));

    var response;

    await docClient.query(params).promise()
      .then(function(data){
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: JSON.stringify(data["Items"])
        };
      })
      .catch(function(err) {
        response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: JSON.stringify(err)
        }

      });

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
