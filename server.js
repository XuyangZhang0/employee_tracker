const inquirer = require('inquirer');
// inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
const mysql = require('mysql2');
const cTable = require('console.table');

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
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
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
    let sqlStatement = `SELECT e.id,e.first_name,e.last_name,r.title,d.name department,r.salary, CONCAT (m.first_name, " ", m.last_name) manager
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
    let sqlStatement = `SELECT * FROM department`;
    db.query(sqlStatement, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}