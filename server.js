const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'selinakyle',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );

  const viewOptions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update all departments',
                'Update employee infomation',
                'Exit'
            ]
        }
    ])
    .then(answers)
};

const viewDepartments = () => {
    inquirer.prompt([
        {
            type
        }
    ])
}
  