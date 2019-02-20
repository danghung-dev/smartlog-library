## Publish
1. Change code
2. Change version in package.json
3. npm publish

### Usage
```bash
export JWT_KEY=<secret_key>
```
```javascript
const {permitRole, permitAction} = require('jwt-permit')
// JWT in headers : -H 'authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFjY291bnRJZCI6IjM1NTIwMGU...'
// Permit by Roles
app.post('/',
  permitRole('admin_location','viewer_location'),
  handler
)
// Permit by Actions
app.post('/',
  permitAction('read_location','update_location'),
  handler
)
```

# simple-kafka-node
An simple interface to work with kafka in nodejs
# Usage
npm install simple-kafka-node

## Message format
```
{
    "type" :"anEventType",
    "data" :"A data object"
}
```

## Configuration
Environment variables
```
MESSAGING_HOST: kafka host, default "locahost:2181"
MESSAGING_CLIENT_ID: client id, default: "bidding"
MESSAGING_GROUP : message group, default: "bidding"
```

## Consumer
```
const {consumer} = require('simple-kafka-node');

await consumer.subscribe('topic1', 'anEventOnTopic1', (eventData) => {
    logger.info(`New event ${eventData}`);
});
await consumer.connect();
```


## Producer
const {producer} = require('simple-kafka-node');
await producer.sendMessage('topic1', data, key);

## Generic consumer handler (a utility that handle event and report error to errorLog if error occurs)

```
const { genericHandler } = require('simple-kafka-node');

const handleFunction = async (data) => {
    // handle data
}
await consumer.subscribe('topic1', 'anEventOnTopic1', (eventData) => {
    return genericHandler(handleFunction, (err) => { logger.error(`${err}`); }, eventData);
  });

 ```
if "handleFunction" has error, a message will be send to "errorLog" topic, else an message is sent to "activityLog" topic


# Resopnse json formatter

API response json format

## Usage

### init formatter

formatter/index.js
```
const formatter = require('response-json-formatter');
module.exports = formatter;
```

### errorHandler middleware

index.js
```
const {
    errorHandler,
} = require('../formatter');
const express = require('express');

const app = express()
...
app.use(errorHandler(logOptions));
```

### validate middleware
route.js
```
const { Router } = require('express');
const router = new Router();
const Joi = require('joi');
const {
    validate
} = require('../formatter');

const pathSchema = Joi.object().keys({
    locationIdClient: Joi.string().required(),
});

router.post('/',
    validate(createSchema, 'body'),
    createController)
``` 

### response format modules
controller.js
```
const {
    okData,
    okDataList,
    okCreated,
} = require('../formatter');

const getItem = async (req, res, next) => {
    ...
    okData(res, item);
};

const getList = async (req, res, next) => {
    ...
    okDataList(res, list, { total: list.length });
};

const create = async (req, res, next) => {
    ...
    okCreated(res, data);
};
```
### error instances
```
const {
    ApiError,
    ApiValidateError,
    ConflictedModificationError,
    ForbiddenAccessError,
    InternalTechnicalError,
    InvalidAuthenticationError,
    NotFoundError
} = require('../formatter');
```
