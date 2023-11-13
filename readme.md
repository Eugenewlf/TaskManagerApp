# Task Manager App

## Group: [Your Group Number]
### Members:
- XX (00000000)
- YY (00000100)

Application Link: [Your Application Link](https://your-app-render-url.com/)

---

## Login
To access the Task Manager App, users need to log in by entering their username and password.

Each user has a userID and password:

```json
[
	{ "userid": "user1", "password": "cs381" },
	{ "userid": "user2", "password": "cs381" },
	{ "userid": "user3", "password": "cs381" }
]
After a successful login, the userid is stored in the session.

Logout
Users can log out of their accounts by clicking on the logout button on the home page.

CRUD Service
Create
A task document may contain the following attributes:

Task Name
Task Description
Due Date
Task Name and Task Description are mandatory, and Due Date is optional.

The create operation is a POST request, and all information is in the body of the request.

Read
There are two options for reading and finding tasks: list all information or searching by task id.

List all information:

Display all task IDs.
Clicking on a task ID will show the details.
Searching by task id:

Input the task id of the task you want to find.
Clicking on the task ID in the display will show the details.
Update
Users can update task information through the details interface. Task ID cannot be changed.

A task document may contain the following attributes:

Task Name
Task Description
Due Date
In the example, we updated the Task Name, Task Description, and Due Date.

Delete
Users can delete task information through the details interface.

RESTful API
This project supports three HTTP request types: POST, GET, and DELETE.

POST:

Used for insertion.
Path URL: /api/task/taskID/:taskID
Test: curl -X POST -H "Content-Type: application/json" --data '{"name": "New Task", "taskID":"00000001"}' http://localhost:3000/api/task/taskID/00000001
GET:

Used for finding.
Path URL: /api/task/taskID/:taskID
Test: curl -X GET http://localhost:3000/api/task/taskID/00000001
DELETE:

Used for deletion.
Path URL: /api/task/taskID/:taskID
Test: curl -X DELETE http://localhost:3000/api/task/taskID/00000001
For all RESTful CRUD services, login should be done first.