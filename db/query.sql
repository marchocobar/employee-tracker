SELECT * 
FROM department;

SELECT 
    role.id, 
    role.title,
    role.salary,
    department.name AS department 
FROM role
INNER JOIN department
    ON role.department_id = department.id;

SELECT
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
        ON employee.manager_id = Manager.id;