const AWS = require("aws-sdk");
const dynamodb = require('aws-sdk/clients/dynamodb');
const dataFile = require("./../../data/course-data.json");

AWS.config.update({
  region: "ap-southeast-1",
  endpoint: "https://dynamodb.ap-southeast-1.amazonaws.com"
});
const docClient = new dynamodb.DocumentClient();

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

// const params = {
//     TableName: tableName,
//     Key: {
//         "CourseId": "1"
//     }
// }

// docClient.update(params).promise()
//     .then(function(data){
//         console.log("Retrieved data:", JSON.stringify(data, null, 2));
//         })
//     .catch(function(err) {
//         console.error("Failed to retrieve item. Error JSON:", JSON.stringify(err, null, 2));
//         console.error(err);
//         throw new Error("Failed to update");
//     });
