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


const tableName = "AliceClicksTable2"

dataFile.forEach(course => {
    var params = {
        TableName: tableName,
        Item:{
            "CourseId": course.Id,
            "University": course.University,
            "Programme": course.Programme,
            "GsiPk": 1,
            "Clicks": 0
        }
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
