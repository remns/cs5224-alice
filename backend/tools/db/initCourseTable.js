const AWS = require("aws-sdk");
const dynamodb = require('aws-sdk/clients/dynamodb');
const dataFile = require("./../../data/course-data.json");

endpointArg = "https://dynamodb.ap-southeast-1.amazonaws.com"
if (process.argv.length > 2) {
    endpointArg = process.argv[2]
}

const docClient = new dynamodb.DocumentClient({
    region: "ap-southeast-1",
    endpoint: endpointArg
});

const tableName = "AliceCourseTable2"

dataFile.forEach(course => {
    var params = {
        TableName: tableName,
        Item: course
    };

    console.log("Adding a new item...");
    docClient.put(params).promise()
        .then(function(data){
            console.log(`created id: ${course.Id}`);
        })
        .catch(function(err){
            console.log(`failed id: ${course.Id}`);
            console.log(err)
        })
    });