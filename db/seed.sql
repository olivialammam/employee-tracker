USE DATABASE employee_tracker_db;
INSERT INTO department (
name
) VALUES ('finance');
INSERT INTO department (
name
) VALUES ('sales');
INSERT INTO department (
name
) VALUES ('marketing');
INSERT INTO department (
name
) VALUES ('hr');

INSERT INTO role (
    title, salary, department_id
) VALUES ('manager', '10000.00', '1' );
INSERT INTO role (
    title, salary, department_id
) VALUES ('sales representative', '9000.00', '2' );
INSERT INTO role (
    title, salary, department_id
) VALUES ('secretary', '8000.00', '3' );
INSERT INTO role (
    title, salary, department_id
) VALUES ('accountant', '7000.00', '4' );

INSERT INTO employee (
    first_name, last_name, role_id, manager_id
) VALUES ('Mary', 'Pink', '1', '1');
INSERT INTO employee (
    first_name, last_name, role_id, manager_id
) VALUES ('Bob', 'Green', '2', '2');
INSERT INTO employee (
    first_name, last_name, role_id, manager_id
) VALUES ('Caroline', 'Simpson', '3', '3');
INSERT INTO employee (
    first_name, last_name, role_id, manager_id
) VALUES ('Anna', 'Lam', '4', '4');




