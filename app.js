const db = require('./config/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');


const promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "whatToDo",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
        }
    ])
        .then(promptController)
        .catch(err => {
            console.log(err);
        });
};

const promptController = input => {
    let sql;
    let option;

    switch (input.whatToDo) {
        case "View all departments":
            sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    console.table(rows);
                }
                return promptUser();
            });
            break;
        case "View all roles":
            sql = `SELECT role.*, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    console.table(rows);
                }
                return promptUser();
            });
            break;
        case "View all employees":
            sql = `SELECT employee.*, role.title AS role FROM employee LEFT JOIN role ON employee.role_id = role.id`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.table(rows);
                }
                return promptUser();
            });
            break;
        case "Quit":
            db.end(err => {
                if (err) throw err;
            });
            break;
        case "Add a department":
            option = "department";
            addOptionPrompt(option);
            break;
        case "Add a role":
            option = "role";
            addOptionPrompt(option);
            break;
        case "Add an employee":
            option = "employee";
            addOptionPrompt(option);
            break;
        case "Update an employee role":
            updateEmployeePrompt();
            break;
    }
};

const addOptionPrompt = option => {
    if (option === "department") {
        return inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter a department name.")
                        return false;
                    }
                }
            }
        ]).then(addDepartment)
            .catch(err => {
                console.log(err);
            });
    } else if (option === "role") {
        return inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of the role?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter a role title.")
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this role?",
                validate: nameInput => {
                    if (nameInput) {
                        if (!isNaN(nameInput)) {
                            return true;
                        } else {
                            console.log("Please enter a salary.")
                            return false;
                        }
                    }
                }
            },
            {
                type: "input",
                name: "department",
                message: "Which department does this role belong to?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter a department.");
                        return false;
                    }
                }
            }
        ]).then(addRole)
            .catch(err => {
                console.log(err);
            });
    } else if (option === "employee") {
        return inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log(`Please enter a name.`);
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log(`Please enter a last name.`);
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "role",
                message: "What is the employee's role?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter a role.");
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "manager",
                message: "Who is the employee's manager?",
            }
        ]).then(addEmployee)
            .catch(err => {
                console.log(err);
            });
    }
};
const addDepartment = body => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [body.name];

    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err.message);
        } else {
            console.log("Added " + body.name + " to the database");
        }
        return promptUser();
    });
};

const addRole = body => {
    console.log("added a role");
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [body.title, body.salary, getId("department", "name", body.department)];
};

const addEmployee = body => {
    console.log("doesn't work");
    const sql = `INSERT INTO role (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
    const params = [body.first_name, body.last_name, getId("role", "title", body.role), null];
};

db.query(`SELECT COUNT(id) FROM employee`, (err, cell) => {
        if(err) {
            console.log(err.message);
        } else {
            loopCount = JSON.stringify(cell);
        }
    });

    // return inquirer.prompt([
    //     {
    //         type: "list",
    //         name: "employee",
    //         message: "Which employee's role do you want to update?",
    //         choices: choices
    //     },
    //     {
    //         type: "input",
    //         name: "role",
    //         message: "What is the employee's new role?",
    //         validate: nameInput => {
    //             if (nameInput) {
    //                 return true;
    //             } else {
    //                 console.log("If your employee doesn't have a role in your business, why did you hire them in the first place? Enter a role here please");
    //                 return false;
    //             }
    //         }
    //     }
    // ]);
    const getId = (table, rowName, searchTerm) => {
        let sql = `SELECT EXISTS(SELECT * FROM ${table} WHERE ${rowName} = "${searchTerm}")`
        db.query(sql, (err, row) => {
            if(err) {
                console.log(err.message);
                return promptUser();
            }
            if(JSON.stringify(row).split(":").includes("1}]") === true) {
                sql = `SELECT id FROM ${table} WHERE ${rowName} = "${searchTerm}"`;
                db.query(sql, (err, cell) => {
                    if(err) {
                        console.log(err.message);
                        return promptUser();
                    }
                    //return cell[0].id;
                    return promptUser();
                });
            } else {
            console.log("Error!")
            return promptUser();
            }
        });
    };


    db.connect(err => {
        if(err) throw err;
    });

    
    promptUser();

