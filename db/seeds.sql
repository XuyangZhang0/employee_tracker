INSERT INTO department (name)
VALUES ("IT"),
       ("Sales"),
       ("Marketing"),
       ("Finances"),
       ("HR");

INSERT INTO `role` (title, salary, department_id)
VALUES ("IT Director",250000,1),
       ("Architect", 220000,1),
       ("IT Manager", 130000,1),
       ("Help Desk", 80000,1),
       ("Sales Director",250000,2),
       ("Sales Engineer", 220000,2),
       ("Account Executive", 130000,2),
       ("Marketing Director",250000,3),
       ("Content Producer", 160000,3),
       ("Social Media Manager", 130000,3),
       ("Finances Director",250000,4),
       ("HR Director",250000,5),
       ("HR Manager", 160000,5),
       ("Recruiter", 130000,5),
       ("Payroll", 120000,5);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Xuyang","Zhang",1,null),
       ("Sherlock","Zhang",2,1)