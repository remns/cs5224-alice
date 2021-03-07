# ALICE 

## URLs
Frontend: https://dutizh1sabqu4.cloudfront.net

API: https://3jqms9dxp6.execute-api.ap-southeast-1.amazonaws.com/Prod

## Local Debugging
Frontend (http://localhost:3000):
```
cd frontend
npm install
npm start
```

Backend:

Pre-requisites:

[Install AWS SAM CLI + Docker + AWS CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
Configure AWS CLI with credentials + default region 'ap-southeast-1'

NB: local calls will still access real DynamoDB table

Execute lambda function:
```
cd backend
sam local invoke --env-vars env.json getCoursesFunction -e events\event-get-courses.json
```

Run API Gateway (http://localhost:3001):
```
cd backend
sam local start-api --env-vars env.json -p 3001
```
