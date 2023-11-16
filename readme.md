Task Manager App  
  
Group: 62  
Name:  
Long Fung Eugene Wu (12781706)  
  
Application Link: https://s381f-taskmanager.onrender.com/  
  
********************************************  
  
User Authentication:  
To access the Task Manager App, users need to register before login by entering their username and password.  
  
Each user has a unique username and password:  
After a successful register, the username is stored in the session. Then the user can log in to their dashboard.  
  
Logout  
Users can log out of their accounts by clicking on the logout button on the dashboard page.  
  
CRUD Service  
Create  
A task document may contain the following attributes:  

Task Name  
Task Description  
Due Date  
Task Name and Task Description are mandatory, and Due Date is optional.  
  
The create operation is a POST request, and all information is in the body of the request.  
  
Read  
There are two options for reading and finding tasks: list all tasks or search by task names.  
  
List all Tasks:  
Display all tasks.  
  
Searching by task name:  
Input the task name or description of the task you want to find.  
  
Update  
Users can update task information through the details interface. The task name cannot be changed.  
  
Delete  
Users can delete task information through the details interface.  
  
# RESTful API  
This project features several successful API requests supporting user authentication, task creation, task searching, and delete functionality.  
  
- User Registration:  
Used for registering new users.  
Path URL: /register  
Test:  
curl -i -X POST -H "Content-Type: application/json" -d "{\"username\":\"your_username\",\"password\":\"your_password\"}" http://localhost:3000/register  
  
**Outcome:** Successfully registered a new user.  
  
- User Login:  
Used for authenticating users.  
Path URL: /login  
Test:  
curl -i -X POST -H "Content-Type: application/json" -d "{\"username\":\"your_username\",\"password\":\"your_password\"}" http://localhost:3000/login  
  
**Outcome:** Logged in successfully, receiving session tokens.  
  
- Task Creation:  
Used for creating new tasks.  
Path URL: /createTask  
Test:  
curl -i -X POST -H "Content-Type: application/json" -d "{\"name\":\"Your Task Name\", \"description\":\"Task Description\", \"dueDate\":\"2023-11-17\"}" -b "session=your_session_token; session.sig=session_significant" http://localhost:3000/createTask  
  
**Outcome:** Successfully created a new task.  
  
- Task Search:  
Used for searching tasks.  
Path URL: /searchTasks?q=Your%20Task%20Name  
Test:  
curl -i "http://localhost:3000/searchTasks?q=Your%20Task%20Name" -b "session=your_session_token; session.sig=session_significant"  
  
**Outcome:** Successfully retrieved tasks matching the search query.  
  
- Task Deletion:  
Used for deleting tasks.  
Path URL: /deleteTask/:taskId  
Test:  
curl -i -X POST -b "session=your_session_token; session.sig=session_significant" http://localhost:3000/deleteTask/your_task_id  
  
**Outcome:** Successfully deleted the specificied task.  
  
  
For all RESTful CRUD services, registration should be done first.  
*Replace "your_session_token" with "eyJhdXRoZW50aWNhdGVkIjp0cnVlLCJ1c2VyaWQiOiI2NTU2NTM4ZTU4NDIwZTczY2MzZGIzOTcifQ==" for testing.*  
*Replace "session_significant" with "gfHe0jbHhHfcpa8JlLtMwjhcBqk" for testing.*  
*Replace "your_task_id" with "655654f158420e73cc3db3a5" for testing.*  
*"your_session_token" "session_significant" can be found when login is successful.*  
*"your_task_id" can be found when successfully searching the task.*  
