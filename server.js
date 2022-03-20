const inquirer = require('inquirer');
// inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
const mysql = require('mysql2');
const cTable = require('console.table');
const { NONAME } = require('dns');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employees_db'
    });

db.connect(err => {
    if (err) throw err;
    console.log(`Connected to the employees_db database.`);
    postConnectionMessage();
})

postConnectionMessage = () => {
    console.log(`Connected to the employees_db database.`);
    console.log("***********************************");
    console.log("*                                 *");
    console.log("*        EMPLOYEE MANAGER         *");
    console.log("*                                 *");
    console.log("***********************************");
    promptUser();
}

//Inquirer loop question example
const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', //done
                'Add Employee', //done
                'Update Employee Role',//done
                'View All Roles', //done
                'Add Role', //done
                'View All Departments', //done
                'Add Department', //done
                'Update Employee Manager',
                'View Employees by Manager',
                "View Employees by Department",
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'View Department Budgets',
                'No Action']
        }
    ])
        .then((answers) => {
            const { choices } = answers;


            if (choices === "View All Departments") {
                viewDepartments();
            }

            if (choices === "View All Roles") {
                viewRoles();
            }

            if (choices === "View All Employees") {
                viewEmployees();
            }

            if (choices === "Add Department") {
                addDepartment();
            }

            if (choices === "Add Role") {
                addRole();
            }

            if (choices === "Add Employee") {
                addEmployee();
            }

            if (choices === "Update Employee Role") {
                updateEmployee();
            }

            if (choices === "Update Employee Manager") {
                updateManager();
            }

            if (choices === "View Employees by Manager") {
                viewEmployeesByManager();
            }

            if (choices === "View Employees by Department") {
                viewEmployeesByDepartment();
            }

            if (choices === "Delete Department") {
                deleteDepartment();
            }

            if (choices === "Delete Role") {
                deleteRole();
            }

            if (choices === "Delete Employee") {
                deleteEmployee();
            }

            if (choices === "View Department Budgets") {
                viewBudget();
            }

            if (choices === "No Action") {
                db.end();
                console.log('DB connection closed, thank you for using the CMS software');
            };
        });
};


// View All Employees
viewEmployees = () => {
    const sqlStatement = `SELECT e.id,e.first_name,e.last_name,r.title,d.name department,r.salary, CONCAT (m.first_name, " ", m.last_name) manager
    FROM employee e
    LEFT JOIN role r ON e.role_id=r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id=m.id`;
    db.query(sqlStatement, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

viewDepartments = () => {
    const sqlStatement = `SELECT * FROM department`;
    db.query(sqlStatement, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

viewRoles = () => {
    const sqlStatement = `SELECT * FROM role`;
    db.query(sqlStatement, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: "What is the name of the department?",
            validate: deptartmentInput => {
                if (deptartmentInput) {
                    return true;
                } else {
                    console.log('Please enter a department name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sqlStatement = `INSERT INTO department (name)
                      VALUES (?)`;
            db.query(sqlStatement, answer.department, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.department + " to the database!");

                viewDepartments();
            });
        });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What is the name of the role?",
            validate: roleInput => {
                if (roleInput) {
                    return true;
                } else {
                    console.log('Please enter a role name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of this role?",
            //Too much trouble, it takes numbers only with commas and then to pass on to DB, there needs to be a conversion
            // validate: salaryInput => {
            //     //How to check if a value is number https://stackabuse.com/javascript-check-if-variable-is-a-number/
            //     if (Number.isFinite(salaryInput) ) {
            //         return true;
            //     } else {
            //         console.log('Please enter a salary');
            //         return false;
            //     }
            // }
        },
    ])
        .then(answer => {
            let queryParams = [answer.role, answer.salary];
            // get all departments
            const departmentStatement = `SELECT * FROM department`;
            db.query(departmentStatement, (err, results) => {
                if (err) throw err;
                const department = results.map(({ id, name }) => ({ name: name, value: id, }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: "What department does the role belong to?",
                        choices: department
                    }
                ])
                    .then(departmentChoice => {
                        const department = departmentChoice.department;
                        queryParams.push(department);
                        console.log(queryParams);

                        const sqlStatement = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;
                        db.query(sqlStatement, queryParams, (err, result) => {
                            if (err) throw err;
                            console.log('Added' + answer.role + " to roles!");
                            viewRoles();
                        })
                    });
            });
        })
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const queryParams = [answer.fistName, answer.lastName]

            // get available roles
            const roleStatement = `SELECT role.id, role.title FROM role`;

            db.query(roleStatement, (err, results) => {
                if (err) throw err;

                const roles = results.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        queryParams.push(role);

                        const managerStatement = `SELECT * FROM employee`;

                        db.query(managerStatement, (err, results) => {
                            if (err) throw err;
                            const managers = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            managers.push({ name: "None", value: null });

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    queryParams.push(manager);

                                    const sqlStatement = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;

                                    db.query(sqlStatement, queryParams, (err, result) => {
                                        if (err) throw err;
                                        console.log(`${answer.fistName} ${answer.lastName} added to the database!`)

                                        viewEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

updateEmployee = () => {
    //get all employees
    const employeeStatement = `SELECT * FROM employee`;
    db.query(employeeStatement, (err, results) => {
        if (err) throw err;
        const employees = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's role do you want to update?",
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.employee;
                const queryParams = [];
                queryParams.push(employee);
                //get available roles
                const roleStatement = `SELECT * FROM role`;
                db.query(roleStatement, (err, results) => {
                    if (err) throw err;
                    const roles = results.map(({ id, title }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "Which role do you want to assign to the selected employee?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            queryParams.unshift(role);
                            const sqlStatement = `UPDATE employee SET role_id=? WHERE id=?`;
                            db.query(sqlStatement, queryParams, (err, results) => {
                                if (err) throw err;
                                console.log("Updated Employee's role");
                                viewEmployees();
                            })
                        })
                })
            })
    })
}

updateManager = () => {
    //get all employees
    const employeeStatement = `SELECT * FROM employee`;
    db.query(employeeStatement, (err, results) => {
        if (err) throw err;
        const employees = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's manager do you want to update?",
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.employee;
                const queryParams = [];
                queryParams.push(employee);
                //No need to get employees one more time

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is going to be this employee's new manager?",
                        choices: employees
                    }
                ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        queryParams.unshift(manager);
                        const sqlStatement = `UPDATE employee SET manager_id=? WHERE id=?`;
                        db.query(sqlStatement, queryParams, (err, results) => {
                            if (err) throw err;
                            console.log("Updated Employee's manager");
                            viewEmployees();
                        })
                    })
            })
    })
};
