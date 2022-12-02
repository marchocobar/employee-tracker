INSERT INTO department (name)
VALUES ('Marketing'), 
       ('Editorial');     

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Manager', 80000, 1),
       ('Marketing Assistent', 50000, 1),
       ('Editor', 60000, 2),
       ('Editorial Assistant', 35000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Lisa', 'Brown', 1, NULL),
       ('Tim', 'Sanders', 2, 1),
       ('Sarah', 'Bell', 3, NULL),
       ('Michelle', 'Douglas', 4, 3);