# Audit Logs Microservice

The **Audit Logs Microservice** is responsible for capturing, storing, and querying audit records for various operations across your platform. It is designed using **Fastify** for a fast and low-overhead Node.js web framework, with MongoDB as the backend database to store audit logs.

## Features

- **Create Audit Logs**: Create new audit records using RESTful API.
- **Query Audit Logs**: Fetch audit logs with support for filtering and pagination.
- **API Documentation**: Swagger UI for API documentation and testing.
- **Security**: Protect routes with API Key authentication.

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Microservice](#running-the-microservice)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [Swagger Documentation](#swagger-documentation)
8. [Testing](#testing)
9. [Contributing](#contributing)

## Requirements

- **Node.js**: v16.x or higher
- **MongoDB**: v4.x or higher
- **Fastify**: v4.x or higher

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/audit-logs-ms.git
   cd audit-logs-ms
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and set the environment variables as described in the **Configuration** section.

## Configuration

The microservice uses environment variables for configuration. Create a `.env` file and set the following:

```bash
# Server
PORT=8030

# MongoDB
DATABASE_URI=mongodb://localhost:27017/audit-logs

# Security
API_KEY=your-api-key
```


## Running the Microservice

To run the service in development:

```
npm run dev
```

To run in production (e.g., using PM2):

```
pm2 start dist/app.js --name audit-ms --env production
```

## Environment Variables

| Variable         | Description                            | Default                                  |
| ---------------- | -------------------------------------- | ---------------------------------------- |
| `PORT`         | Port on which the application will run | `8030`                                 |
| `DATABASE_URI` | MongoDB connection string              | `mongodb://localhost:27017/audit-logs` |
| `API_KEY`      | API Key for securing endpoints         | *None*                                 |

## API Endpoints

### 1. **Get Audit Logs**

* **Endpoint** : `/api/audits`
* **Method** : `GET`
* **Query Parameters** :
* `page`: (Optional) Page number, defaults to 1
* `limit`: (Optional) Records per page, defaults to 100
* `clientId`, `userId`, `recordId`, `domain`, `operation`, `scope`, `startDate`, `endDate`: (Optional) Various filters
* **Response** :


```json
{
"result": [
    {
"_id": "671acbc64fdc5af767a676eb",
"clientId": "client-123",
"userId": "user-456",
"recordId": "record-789",
"domain": "example.com",
"scope": "444",
"operation": "PUT",
"message": "Audit log created",
"date": "2024-10-24T22:35:50.689Z"
    }
  ],
"currentPage": 1,
"maxPages": 4,
"totalRecords": 4
}
```


### 2. **Create Audit Log**

* **Endpoint** : `/api/audits`
* **Method** : `POST`
* **Headers** :
* `x-api-key`: (Required) API key for authentication
* **Body** :


```json
{
"clientId": "client-123",
"userId": "user-456",
"recordId": "record-789",
"domain": "example.com",
"operation": "PUT",
"scope": "444",
"date": "2024-10-24T22:47:28.507Z"
}
```


* **Response** : `201 Created`

### 3. **Generate API Key**

* **Endpoint** : `/api/api-key`
* **Method** : `POST`
* **Response** :

```
{
  "apiKey": "your-new-api-key"
}
```

## Swagger Documentation

Swagger UI is available for testing and documentation at:

* **Local** : `http://localhost:8030/docs`
* **Production** : `https://bozinoski.com/api/docs`

## Testing

You can test the microservice using **Postman** or  **Curl** . Below is an example of how to get audit logs using Curl:

```
curl -X GET 'https://bozinoski.com/api/audits'
    -H 'accept: application/json'
    -H 'x-api-key: your-api-key'
```

## Contributing

Feel free to contribute to this project by submitting a pull request or raising an issue.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

---

### License

This project is licensed under the MIT License.

Make sure to replace placeholders like `"your-repo"`, `"your-api-key"`, etc., with your actual values, and adjust the `curl` commands to match your production settings.
