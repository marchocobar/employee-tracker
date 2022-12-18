const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const employeeArr = [];
const departmentArr = [];
const roleArr = [];

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

const departmentChoices = () => {
    const sql = `SELECT id AS value, name FROM department;`;

    db.query(sql, (err, res) => {
        if (err){
            throw err;
        }

        for (var i = 0; i < res.length; i++) {

            if (!departmentArr.includes(res[i].name)) {
                departmentArr.push(res[i].name);
            }; 
        }
    });
     return departmentArr

};

const employeeChoices = () => {
    const sql = `SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee`;

    db.query(sql, (err, res) => {
        if (err){
            throw err;
        }

        
        for (var i = 0; i < res.length; i++) {

            if (!employeeArr.includes(res[i].name)) {
                employeeArr.push(res[i].name);
            };

        }
    });

    return employeeArr
};

const roleChoices = () => {
    const sql = `SELECT id AS value, title FROM role;`;

    db.query(sql, (err, res) => {
        if (err){
            throw err;
        }

        for (var i = 0; i < res.length; i++) {

            if (!roleArr.includes(res[i].title)) {
                roleArr.push(res[i].title);
            };

        }
    });

    return roleArr
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
    department.name AS Department,
    role.salary,
    CONCAT(Manager.first_name, ' ', Manager.last_name) AS manager
FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON role.department_id = department.id
    LEFT JOIN employee Manager
        ON employee.manager_id = Manager.id;`;

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
        if (err){
            return console.log(err)
        };

        console.table(rows);

        viewOptions();
    });
    });
};

const addRole = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'role',
            message: 'Enter name of role',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary for role',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department is this role in?',
            choices: departmentChoices(),
        }
    ])
    .then((answers) => {
        const mysql = `INSERT INTO role (title, salary, department_id)
        VALUES(?, ?, ?)`;
        const params = [answers.role, answers.salary, answers.department_id]
        
    db.query(mysql, params, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        console.log('Role Added')
        viewRoles()
        viewOptions();
    })
    })
};

const addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'firstname',
            message: 'First name of employee?',
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'Last name of employee?',
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is their role?',
            choices: roleChoices(),
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is their manager?',
            choices: employeeChoices(),

        }
    ])
};

const updateEmployee = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeeChoices(),
        },
        {
            type: 'list',
            name: 'newrole',
            message: 'What is their new role?',
            choices: roleChoices(),
        }
    ])
}

viewOptions()
