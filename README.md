\# Library Management System



A web-based Library Management System developed as a practical mini-project and Agile Software Development \& DevOps case study.



The system helps librarians manage books, library members, book issue and return operations, transaction history, availability, and library statistics through a simple web interface.



\---



\## Problem Statement



Managing library records manually can make it difficult to track books, members, issued books, returns, due dates, and transaction history efficiently.



The Library Management System provides a centralized application for managing these common library activities while demonstrating modern software development and DevOps practices.



\---



\## Objective



The main objectives of this project are:



\* Develop a functional Library Management System.

\* Manage books and their availability.

\* Register and manage library members.

\* Issue and return books.

\* Track due dates and overdue information.

\* Maintain borrowing and transaction history.

\* Display useful library statistics.

\* Apply Agile software development practices.

\* Use Git and GitHub for version control.

\* Implement Continuous Integration using GitHub Actions.

\* Containerize the application using Docker.

\* Demonstrate Ansible-based deployment.



\---



\## Features



\### Dashboard



The dashboard provides useful library statistics such as:



\* Total books

\* Available books

\* Issued books

\* Total members

\* Overdue books

\* Recent transactions



\### Book Management



\* Add books

\* View books

\* Search books

\* Track book availability

\* Manage book information



\### Member Management



\* Register library members

\* View member information

\* Search members

\* Validate member information



\### Issue and Return



\* Issue books to members

\* Record issue dates

\* Track due dates

\* Return issued books

\* Calculate overdue/fine information where applicable

\* Update book availability automatically



\### Transaction History



\* View borrowing records

\* Filter transactions

\* Track issue and return activity



\### Validation and Feedback



\* Form validation

\* User-friendly success/error messages

\* Input checking



\---



\## Technologies Used



| Technology     | Purpose                               |

| -------------- | ------------------------------------- |

| HTML           | Frontend structure                    |

| CSS            | User interface and responsive styling |

| JavaScript     | Frontend functionality                |

| Node.js        | Backend runtime                       |

| Express.js     | Backend web framework                 |

| SQLite         | Database                              |

| Git            | Version control                       |

| GitHub         | Remote repository                     |

| Jira           | Agile project management              |

| GitHub Actions | Continuous Integration                |

| Docker         | Containerization                      |

| Docker Hub     | Container image registry              |

| Ansible        | Deployment automation                 |



\---



\## Project Structure



```text

library-management-system/

│

├── .github/

│   └── workflows/

│       └── build.yml

│

├── ansible/

│   ├── deploy.yml

│   ├── inventory

│   ├── handlers/

│   └── roles/

│

├── public/

│   ├── app.js

│   ├── index.html

│   └── style.css

│

├── server/

│   ├── db/

│   ├── books.js

│   ├── dashboard.js

│   ├── members.js

│   ├── server.js

│   └── transactions.js

│

├── screenshots/

│

├── Dockerfile

├── package.json

├── package-lock.json

├── test.js

└── README.md

```



\---



\## How the System Works



The Library Management System follows a simple client-server architecture.



```text

User

&#x20; │

&#x20; ▼

Web Browser

&#x20; │

&#x20; ▼

Frontend

HTML + CSS + JavaScript

&#x20; │

&#x20; ▼

Node.js + Express Backend

&#x20; │

&#x20; ▼

SQLite Database

```



The frontend sends requests to the Express backend. The backend processes library operations and stores or retrieves information from the SQLite database.



\---



\## Installation and Setup



\### 1. Clone the Repository



```bash

git clone https://github.com/manasvipatankar246/library-management-system.git

```



\### 2. Navigate to the Project



```bash

cd library-management-system

```



\### 3. Install Dependencies



```bash

npm install

```



\### 4. Run the Application



```bash

node server/server.js

```



\### 5. Open the Application



Open the following URL in a browser:



```text

http://localhost:3000

```



\---



\## Testing



The project includes a basic automated test script.



Run:



```bash

npm test

```



Expected result:



```text

Running Library Management System tests...

✓ package.json exists

✓ Backend server exists

✓ Frontend page exists

✓ Project name is correct

All tests passed successfully!

```



\---



\## Agile and Jira Workflow



The project follows an Agile development approach using Jira.



\### Project



\*\*Library Management System\*\*



\### Epic



\*\*Library Management Module\*\*



\### Main Story



\*\*Develop Library Management System\*\*



\### Major Tasks



\* Design Library Dashboard

\* Develop Book Management

\* Develop Member Management

\* Develop Issue and Return Module

\* Configure GitHub Actions

\* Testing

\* Configure Docker

\* Configure Ansible Deployment



Git branches and commits use meaningful Jira issue references such as:



```text

LIB-3: Improve book management module

LIB-5: Improve issue and return validation

LIB-6: Add transaction history filters

```



\---



\## Git and GitHub Workflow



The project uses Git and GitHub for version control.



The general workflow is:



```text

Create / Modify Code

&#x20;      │

&#x20;      ▼

Git Branch

&#x20;      │

&#x20;      ▼

Git Add

&#x20;      │

&#x20;      ▼

Git Commit

&#x20;      │

&#x20;      ▼

Git Push

&#x20;      │

&#x20;      ▼

GitHub

&#x20;      │

&#x20;      ▼

Pull Request

&#x20;      │

&#x20;      ▼

Merge

```



The project uses meaningful branches and commit messages to keep development organized.



\---



\## Continuous Integration



GitHub Actions is used to automatically test the project.



The workflow:



1\. Checks out the repository.

2\. Sets up Node.js.

3\. Installs project dependencies.

4\. Runs the project tests.



The workflow file is located at:



```text

.github/workflows/build.yml

```



Successful workflow execution verifies that the project can pass its automated checks in the CI environment.



\---



\## Docker Containerization



The Library Management System is containerized using Docker to provide a consistent and portable runtime environment.



\### Docker Technologies



\* Docker Engine

\* Dockerfile

\* Docker Images

\* Docker Containers

\* Docker Hub



\### Build Docker Image



```bash

docker build -t library-management-system:1.0 .

```



\### Run Docker Container



```bash

docker run -d --name library-management-container -p 3001:3000 library-management-system:1.0

```



\### Access the Application



```text

http://localhost:3001

```



\### Docker Hub Image



```text

mqnasvii/library-management-system:1.0

```



\### Verify Running Container



```bash

docker ps

```



Docker provides:



\* Portable deployment

\* Dependency isolation

\* Consistent environments

\* Faster application deployment

\* Easy distribution of the application



\---



\## Ansible Deployment



Ansible is used to demonstrate automated application deployment.



The project contains:



```text

ansible/

├── deploy.yml

├── inventory

├── handlers/

└── roles/

```



The Ansible configuration demonstrates concepts including:



\* Inventory

\* Playbooks

\* Tasks

\* Handlers

\* Jinja templates

\* Roles

\* Idempotent configuration



\---



\## Screenshots



\### Library Management System



Screenshots demonstrating the application's dashboard and major modules can be added here.



\### Docker Container



!\[Library Management System Docker Application](screenshots/docker-application.png)



\---



\## DevOps Workflow



The project demonstrates an integrated development and DevOps workflow:



```text

Jira Agile Planning

&#x20;       │

&#x20;       ▼

Git Branching

&#x20;       │

&#x20;       ▼

Application Development

&#x20;       │

&#x20;       ▼

Git Commit \& Push

&#x20;       │

&#x20;       ▼

GitHub

&#x20;       │

&#x20;       ▼

GitHub Actions CI

&#x20;       │

&#x20;       ▼

Docker Containerization

&#x20;       │

&#x20;       ▼

Docker Hub

&#x20;       │

&#x20;       ▼

Ansible Deployment

```



\---



\## Future Improvements



Possible future improvements include:



\* Authentication and role-based access

\* Email notifications for due dates

\* Advanced reporting

\* Cloud database integration

\* Cloud deployment

\* Automated Docker image publishing

\* Additional automated tests

\* Monitoring and logging



\---



\## Author



\*\*Manasvi Patankar\*\*



B.E. Artificial Intelligence and Data Science



New Horizon Institute of Technology and Management, Thane



\---



\## Repository



GitHub Repository:



`https://github.com/manasvipatankar246/library-management-system`

