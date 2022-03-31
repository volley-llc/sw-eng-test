# Volley Senior Software Developer Candidate Assessment

In order to assess your technical skills, we ask that you complete the problem described below. The solution will involve writing code as well as answering a series of prompts in this document, listed below. When you are done, you should bundle up your solution and submit it to the Google Form link you received in our initial email.

## Instructions

 * The task should take no more than 2 hours to complete and we ask that you submit your results within the next 7 days. If there are things you thought to implement but you didn't have time, use the prompts below to describe additional changes you might make.
 * We have added a few initial libraries to get the sample code running; Feel free to use whatever additional libraries you need to get the task done.
 * We expect that you may need to use Google, Stack Overflow, etc. as you work on the assessment, but we ask that you don't ask your friends, family, or anyone on the internet for specific help to complete the task: we want to know how **you** would solve this problem.
 * When you have finished the task, ZIP up your work into a ZIP file (solution.zip) with all of the code in the `src/` folder, along with this `README.md` (which you should update to answer the questions below). Upload the ZIP generated ZIP file to the Google Form link provided via email.
    * In Linux, you should be able to run: `zip -9 -r --exclude='*.git' --exclude='*node_modules*' --exclude='*.vscode*' solution.zip ./`

### Windows Considerations

This test is optimized for Linux or Mac workstations, but running it in Windows will require a few minor changes:

- If you don't already have Node installed on your system, you can find the installer [here](https://nodejs.org/en/download/).
- Adjust paths in package.json from forward slashes to back slashes as necessary.
- Zip the test results using the Windows zip utility.

## Questions

Please answer the following prompts inline in this document:

1. Describe your solution at a high level. How well does it solve the problem?

2. What changes would you make if you had 2 days instead of 2 hours to solve this problem?

3. Do you see any improvements that could be made to the sign up process?

## Problem Description

In order to use our Volley trainers, players must first sign up for an account on our web platform. When a player creates an account, our system must call into our CRM to convert the user from a prospective customer (prospect) into a customer. Once they are no longer a prospect, they will stop receiving marketing emails sent from our CRM; as a customer, they will start receiving customer communication emails.

For this assessment, we ask that you implement a function in TypeScript that is called when a customer signs up as a user in our system. The function should call into our provided CRM API server over HTTP to create a customer record for the new user if one does not exist. If the user exists as a prospect in the CRM, include their prospect ID when creating the customer record. The function should return the ID of the user's customer record so that the system can add that to the user record in the database.

We have provided a stub of the function in service.ts, which you should update with your implementation. We have also provided an index.ts, which serves as the entry point of the test and will call your function multiple times with different user records.

We have also provided an express server under src/api that listens for incoming HTTP requests on port 8000 and implements the CRM’s HTTP endpoints documented below.

We have also written some npm scripts to start the API server and run the index.ts script. Note: these scripts are written to run on Linux.

### API

### Get prospects

```GET /prospects```

Get the list of prospects.

**Parameters**

Optionally, pass in query parameter `email=<search email>` to filter by email address.

**Responses**

**200** - Success

```json
[
  {
    "id": 1,
    "customerId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com"
  },
  {
    "id": 2,
    "customerId": null,
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@gmail.com"
  }
]
```

### Get customers

```GET /customers```

Get the list of customers.

**Parameters**
Pass in query parameter `email=<search email>` to filter by email address (optional).
Pass in query parameter `prospectId=<id>` to filter by prospect ID number (optional).

**Responses**

**200** - Success

```json
[
  {
    "id": 1,
    "prospectId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com"
  },
  {
    "id": 2,
    "prospectId": null,
    "firstName": "Jim",
    "lastName": "Smith",
    "email": "jsmith@hotmail.com"
  }
]
```

### Create customer

```POST /customers```

Create a customer record.

**Parameters**

Post a new user record in JSON:

```json
{
  "firstName": "Mary",
  "lastName": "Jones",
  "email": "mjones@comcast.net",
  "prospectId": null
}
```

**Responses**

**201** - Success

```json
{
  "id": 3,
  "firstName": "Mary",
  "lastName": "Jones",
  "email": "mjones@comcast.net",
  "prospectId": null
}
```

**400** - Invalid Input

```json
  {
    "error": "Validation Error Message"
  }
```

**409** - Email Exists

```json
  {
    "error": "A customer with that email already exists"
  }
```

### Create prospect

```POST /prospects```

Create a prospect record.

**Parameters**

Post a new prospect record in JSON:

```json
{
  "firstName": "Mary",
  "lastName": "Jones",
  "email": "mjones@comcast.net",
  "prospectId": null
}
```

**Responses**

**201** - Success

```json
{
  "id": 3,
  "firstName": "Mary",
  "lastName": "Jones",
  "email": "mjones@comcast.net",
  "prospectId": null
}
```

**400** - Invalid Input

```json
  {
    "error": "Validation Error Message"
  }
```

**409** - Email Exists

```json
  {
    "error": "A prospect with that email already exists"
  }
```

### Update prospect

```PUT /prospects```

Update a prospect record.

**Parameters**

**Responses**

**200** - Success

```json
{
  "id": 3,
  "firstName": "Mary",
  "lastName": "Jones",
  "email": "mjones@comcast.net",
  "prospectId": null
}
```

**400** - Invalid Input

```json
  {
    "error": "Validation Error Message"
  }
```

**404** - Unable to locate prospect

```json
  {
    "error": "No prospect with that id exists"
  }
```

