const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const none = {
    value: "null",
    title: "None"
};
const employeeArr = [none.title];
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
                'Update employee',
                'delete employee information'
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
                case "Update employee":
                    updateEmployee();
                    break;
                // case "delete employee information":
                //     deleteEmployee();
                //     break;
            }
        })
};

const departmentChoices = () => {
    const sql = `SELECT id AS value, name FROM department;`;

    db.query(sql, (err, res) => {
        if (err) {
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
        if (err) {
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
        if (err) {
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
        department.name AS Department 
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
    department.name AS department,
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
    inquirer.prompt([
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
                if (err) {
                    return console.log(err)
                };

                // console.table(rows);

                viewOptions();
            });
        });
};

const addRole = () => {
    inquirer.prompt([
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
            const departmentID = departmentChoices().indexOf(answers.department) + 1;
            const params = [answers.role, answers.salary, departmentID]

            db.query(mysql, params, (err, rows) => {
                if (err) {
                    return console.log(err)
                };
                // console.table(rows);

            })
        }).then(() => {
            const mysql = `SELECT 
            role.id, 
            role.title,
            role.salary,
            department.name AS Department 
            FROM role
            INNER JOIN department
            ON role.department_id = department.id`;

            db.promise().query(mysql).then(([rows,fields]) => {

                console.table(rows);
            }).catch(console.log);
}).then(() => {
    viewOptions();
});

};

const addEmployee = () => {
    inquirer.prompt([
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
        .then((answers) => {
            const mysql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES(?, ?, ?, ?)`;
            const roleID = roleChoices().indexOf(answers.role) + 1;
            // const managerID = employeeChoices().indexOf(answers.manager);
            const managerID = (answers) => {


                const manager = employeeChoices().indexOf(answers.manager);

                if (manager === 0) {
                    return null;
                }


                return manager;
            };

            const params = [answers.firstname, answers.lastname, roleID, managerID(answers)];

            db.query(mysql, params, (err, rows) => {
                if (err) {
                    return console.log(err)
                };
                // console.table(rows);


            });

        }).then(() => {
            const mysql = `SELECT
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name AS department,
                role.salary,
                CONCAT(Manager.first_name, ' ', Manager.last_name) AS manager
            FROM employee
                LEFT JOIN role
                    ON employee.role_id = role.id
                LEFT JOIN department
                    ON role.department_id = department.id
                LEFT JOIN employee Manager
                    ON employee.manager_id = Manager.id;`;

                    db.promise().query(mysql).then(([rows,fields]) => {

                        console.table(rows);
                    }).catch(console.log);
        }).then(() => {
            viewOptions();
        });


};

const updateEmployee = () => {
    inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Are you sure you want to update?",
        },

        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeeChoices(),
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is their new role?',
            choices: roleChoices(),
            when: (answers) => answers.employee !== "None"
        }
    ])

        .then((answers) => {
            const mysql = ` UPDATE employee 
                            SET role_id = ? 
                            WHERE id = ?`;
            const employeeID = employeeChoices().indexOf(answers.employee);
            const roleID = roleChoices().indexOf(answers.role) + 1;
            const params = [roleID, employeeID]

            db.query(mysql, params, (err, rows) => {
                if (err) {
                    return console.log(err)
                };
                // console.table(rows);

            })
        }).then(() => {
            const mysql = `SELECT
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name AS department,
                role.salary,
                CONCAT(Manager.first_name, ' ', Manager.last_name) AS manager
            FROM employee
                LEFT JOIN role
                    ON employee.role_id = role.id
                LEFT JOIN department
                    ON role.department_id = department.id
                LEFT JOIN employee Manager
                    ON employee.manager_id = Manager.id;`;
            
                    db.promise().query(mysql).then(([rows,fields]) => {

                        console.table(rows);
                    }).catch(console.log);
        }).then(() => {
            viewOptions();
        });


};


// const deleteEmployee = () => {
//     inquirer.prompt([
//         {
//             type: "confirm",
//             name: "confirm",
//             message: "Are you sure you want to delete?",
//         },
//         {
//             type: 'list',
//             name: 'employee',
//             message: 'Which employee would you like to delete?',
//             choices: employeeChoices(),
//         }
//     ])
//     .then((answers) => {
//         const mysql = `DELETE FROM employee WHERE id = ?`;
//         const params = employeeChoices().indexOf(answers.employee) + 1;


//         db.query(mysql, params, (err, rows) => {
//             if (err) return console.log(err);
//             console.table(rows);
//             viewEmployees()
//             viewOptions();
//         })
//     });
// }





viewOptions()
