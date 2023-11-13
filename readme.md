Task Manager App

Group: 11
Name: 
Long Fung Eugene Wu (12781706)

Application Link: https://s381f-taskmanager.onrender.com/

********************************************

User Authentication
To access the Task Manager App, users need to register before log in by entering their username and password.

Each user has a userID and password:
[
	{ "userid": "user1", "password": "cs381" },
	{ "userid": "user2", "password": "cs381" },
	{ "userid": "user3", "password": "cs381" }
]
After a successful login, the userid is stored in the session.

Logout
Users can log out of their accounts by clicking on the logout button on the dashboard page.

CRUD Service - 
Create
A task document may contain the following attributes:

Task Name
Task Description
Due Date
Task Name and Task Description are mandatory, and Due Date is optional.

The create operation is a POST request, and all information is in the body of the request.

Read
There are two options for reading and finding tasks: list all information or searching by task names.

List all information:
Display all tasks.

Searching by task name:
Input the task name of the task you want to find.

Update
Users can update task information through the details interface. Task name cannot be changed.

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
Path URL: /api/tasks
Test: curl -X POST -H "Content-Type: application/json" --data '{"name": "New Task", "description": "Task description", "dueDate": "2023-12-31"}' https://s381f-taskmanager.onrender.com/api/tasks
GET:

Used for finding.
Path URL: /api/tasks/:taskId
Test: curl -X GET https://s381f-taskmanager.onrender.com/api/tasks/00000001
DELETE:

Used for deletion.
Path URL: /api/tasks/:taskId
Test: curl -X DELETE https://s381f-taskmanager.onrender.com/api/tasks/00000001
For all RESTful CRUD services, login should be done first.