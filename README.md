Mydos
Introduction
Mydos is a web application that helps users manage their to-do lists. Users can register, log in, and create, edit, or delete tasks linked to their accounts. The application uses Express.js for the server, EJS templates for rendering views, PostgreSQL for the database, and bcrypt for password hashing.

Deployed Site: Mydos

Project Blog Article: Mydos: https://www.linkedin.com/pulse/mydos-comprehensive-to-do-list-application-michael-a-m-a-g-hlvbf

Authors
Michael Adeyemi Gnaho (MAG) - LinkedIn


Installation
To run this project locally, follow these steps:

Clone the repository:

bash
Copy code
git clone https://github.com/your-username/mydos.git
cd mydos
Install the dependencies:

bash
Copy code
npm install
Set up the PostgreSQL database:

Create a PostgreSQL database named World.
Create the necessary tables by running the SQL queries in queries.sql.
Create a .env file in the root directory and add your environment variables:

plaintext
Copy code
DATABASE_USER=your_postgres_user
DATABASE_HOST=localhost
DATABASE_NAME=World
DATABASE_PASSWORD=your_postgres_password
DATABASE_PORT=5432
SESSION_SECRET=your_secret_key
Start the server:

bash
Copy code
nodemon app.js
Open your browser and navigate to:

plaintext
Copy code
http://localhost:3000
Usage
Register a new account:

Navigate to the Register page.
Fill in the registration form and submit.
Log in to your account:

Navigate to the Login page.
Enter your credentials and submit.
Manage your to-do list:

Usage:
Add new tasks using the input field and the "+" button.
Edit tasks by clicking the pencil icon, modifying the text, and clicking the check icon.
Delete tasks by checking the checkbox next to the task.
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository:

bash
Copy code
git fork https://github.com/your-username/mydos.git
Create a new branch:

bash
Copy code
git checkout -b feature/your-feature-name
Make your changes and commit them:

bash
Copy code
git commit -m "Add feature: your feature name"
Push to your branch:

bash
Copy code
git push origin feature/your-feature-name
Open a pull request with a detailed description of your changes.

Related Projects
Here are some related projects that might interest you:

Todoist - A powerful task manager app.
TaskApp - Another example of a to-do list application.
Licensing
This project is licensed under the MIT License. See the LICENSE file for details.
