const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
                'Update employee infomation',
            ]
        }
    ])
        .then((answers) => {
            switch (answers.options) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Update employee information":
                    updateEmployee();
                    break;
            }
        })
};

const viewDepartments = () => {
    const mysql = `SELECT * FROM department`;
    db.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        viewOptions();

    });
};

const viewRoles = () => {
    const mysql = `SELECT 
        role.id, 
        role.title,
        role.salary,
        department.name AS department 
        FROM role
        INNER JOIN department
        ON role.department_id = department.id`;

    db.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        viewOptions();
    });
};

const viewEmployees = () => {
    const mysql = `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name,
        role.salary,
        CONCAT(employee.first_name, ' ', employee.last_name) AS manager
    FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department_id
        LEFT JOIN employee Manager
        ON employee.manager_id = Manager.id`;

    db.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        viewOptions();
    });
};

const addDepartment = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'department',
            message: 'Enter new department',
        }
    ])
    .then((answers) => {
        const mysql = `INSERT INTO department (name)
        VALUES (?)`;
        const params = answers.department;
        
    db.query(mysql, params, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        viewOptions();
    });
    });
};

// const addRole = () => {
//     inquirer.prompt ([
//         {
//             type: 'input',
//             name: 'role',
//             message: 'Enter name of role',
//         },
//         {
//             type: 'input',
//             name: 'salary',
//             message: 'Enter salary for role',
//         },
//         {
//             type: 'list',
//             name: 'departments',
//             message: 'Which department is this role in?',
//             choices: ['Marketing', 'Editorial', 'Sales']
//         }
//     ])
//     .then((answers) => {
//         const mysql = `INSERT INTO role (title, salary, department_id)
//         VALUES(?, ?, ?)`;
//         const params = [answers.role, answers.salary, answers.department]
        
//     db.query(mysql, params, (err, rows) => {
//         if (err) return console.log(err);
//         console.table(rows);
//         console.log('Role Added')
//         viewRoles()
//         viewOptions();
//     })
//     })
// }

viewOptions()
