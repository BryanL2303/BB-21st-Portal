---
layout: page
title: User Guide
---

Welcome to the user guide for BB 21st Portal. <br>

BB 21st Portal is a website designed for **Officers and Primers** to facilitate administrative workflow. <br> 
It currently supports the following features: <br>
1. tracking of key awards for Boys <br>
2. generating 32a results in PDF format and provides a form to <br>
3. conducting uniform inspections <br>
4. creating feedback forms/quizzes (functions like Google Forms) <br>

Refer to the `Features` section on the features that are available for use and how to use them. <br>

If you run into any issues using the website try checking through the `FAQ` or `Known Issues` sections to see if the issues has already been brought up and there are any known solutions. <br>

<div style="page-break-after: always;"></div>
# Table of Contents
1. [Features](#features)
   2. [help](#viewing-help--help)
   3. [list](#listing-all-employees-list)
   4. [add](#adding-an-employee-add)
   5. [edit](#editing-an-employee-edit)
   6. [delete](#deleting-an-employee-delete)
   7. [find](#locating-employees-by-employee-names--find)
   8. [task](#adding-a-task-task)
   9. [listtasks](#listing-all-tasks--listtasks)
   10. [deletetask](#deleting-a-task--deletetask-task_id)
   11. [findtasks](#locating-tasks-by-task-names--findtasks)
   12. [assigntask](#assign-a-task-to-employee--assigntask)
   13. [unassigntask](#unassign-a-task-to-employee--unassigntask)
   14. [mark](#mark-a-task--mark)
   15. [unmark](#unmark-a-task--unmark)
   16. [clear](#clearing-all-entries--clear)
   17. [exit](#exiting-the-program--exit)
   18. [Saving the data](#saving-the-data)
   19. [Editing the data file](#editing-the-data-file)
20. [FAQ](#faq)
21. [Known Issues](#known-issues)

--------------------------------------------------------------------------------------------------------------------

<div style="page-break-after: always;"></div>
## Features

<div markdown="block" class="alert alert-info">

**:information_source: Notes about the command format:**<br>

* Words in `UPPER_CASE` are the parameters to be supplied by the user.<br>
  e.g. in `add n/NAME`, `NAME` is a parameter which can be used as `add n/John Doe`.

* Items in square brackets are optional.<br>
  e.g `n/NAME [t/TAG]` can be used as `n/John Doe t/friend` or as `n/John Doe`.

* Items with `…`​ after them can be used multiple times including zero times.<br>
  e.g. `[t/TAG]…​` can be used as ` ` (i.e. 0 times), `t/friend`, `t/friend t/family` etc.

* Parameters can be in any order.<br>
  e.g. if the command specifies `n/NAME p/PHONE_NUMBER`, `p/PHONE_NUMBER n/NAME` is also acceptable.

* Extraneous parameters for commands that do not take in parameters (such as `help`, `list`, `exit` and `clear`) will be ignored.<br>
  e.g. if the command specifies `help 123`, it will be interpreted as `help`.

* If you are using a PDF version of this document, be careful when copying and pasting commands that span multiple lines as space characters surrounding line-breaks may be omitted when copied over to the application.

* Any command that requires `EMPLOYEE_ID` or `TASK_ID` as a parameter does not refer to the nominal number in the list but rather specifically the id as indicated below:
![id position](images/indicateIdPosition.png)
![id position_2](images/indicateIdPosition2.png)
</div>

### Viewing help : `help`

Shows a message explaining how to access the help page.

![help message](images/helpMessage.png)

Format: `help`
### Listing all employees: `list`

Shows a list of all employees in TaskMasterPro.

Format: `list`

<div style="page-break-after: always;"></div>
### Adding an employee: `add`

Adds an employee to TaskMasterPro.

Format: `add n/NAME p/PHONE_NUMBER e/EMAIL a/ADDRESS [t/TAG]…​`

<div markdown="span" class="alert alert-primary">:bulb: **Tip:**
Make sure that your parameter's formats are valid!<br/>

NAME : Only alphanumeric characters and spaces<br/>

PHONE_NUMBER : An 8 digit number beginning with either 6, 8 or 9<br/>

EMAIL : Should be of the format local-part@domain and, <br/>
1. The local-part should only contain alphanumeric characters and these special characters, excluding the parentheses, (+_.-). The local-part may not start or end with any special characters.<br/>
2. This is followed by a '@' and then a domain name. The domain name is made up of domain labels separated by periods.<br/>

   The domain name must:<br/>
   * end with a domain label at least 2 characters long<br/>
   * have each domain label start and end with alphanumeric characters
</div>
<div markdown="span" class="alert alert-warning">:exclamation: **Caution:**

As of now you cannot create multiple employees with the same name.

There are also certain problems that could occur if you are not careful with some parameters!

NAME : This is case-sensitive and whitespace sensitive, you could accidentally add multiple of the same employee with different capitalizations.
</div>

Examples:
* `add n/AikenDueet p/82311231 e/aiken@example.com a/Dueet street, block 123, #01-01`
* `add n/Ben Diddle t/friend e/bendiddle@example.com a/Newgate Prison p/81092109 t/criminal`

<div style="page-break-after: always;"></div>
### Editing an employee: `edit`

Edits an employee's details in TaskMasterPro.

Format: `edit EMPLOYEE_ID [n/NAME] [p/PHONE_NUMBER] [e/EMAIL] [a/ADDRESS] [t/TAG]…​`

<div markdown="span" class="alert alert-primary">:bulb: **Tip:**
You can specify `t/` multiple times to add more tags
</div>
<br/>
<div markdown="span" class="alert alert-warning">:exclamation: **Caution:**
When you run this function with `t/` all the existing tags will be removed if not specified again.
</div>

Examples:
* `edit 1 n/AikenDueet p/82311231 e/aiken@example.com`
* `edit 2 a/Newgate Prison p/81092109 t/criminal`

### Deleting an employee: `delete`

Deletes the specified employee from TaskMasterPro.

Format: `delete EMPLOYEE_ID`

* Deletes the employee with the specified `EMPLOYEE_ID`.
* The employee id refers to the number shown in the displayed employee list.
* The id **should be a positive integer** 1, 2, 3, …​

Examples:
* `list` followed by `delete 3` deletes the employee with id 3 in TaskMasterPro.

### Locating employees by employee names : `find`

Finds employees whose names contain any of the given keyword.

Format: `find KEYWORD [MORE_KEYWORDS]`

* The search is case-insensitive. e.g. `alex` will match `Alex`.
* The order of the keywords does not matter. e.g. `Yeoh Alex` will match `Alex Yeoh`.
* Only full words will be matched. e.g. `Ale` will not match `Alex`.
* Employees matching at least 1 keyword will be returned. e.g. `Alex Yu` will return employees with
`Alex` or `Yu` in their names.

Examples:
* `find alex` returns employees with `alex` in their names.

### Adding a task: `task`

Adds a task to TaskMasterPro.

Format: `task TASK_DESCRIPTION`

<div markdown="span" class="alert alert-primary">:bulb: **Tip:**
The description for the task is required and can be any length with spaces in between
</div>
<div markdown="span" class="alert alert-warning">:exclamation: **Caution:**
Avoid naming 2 tasks with the same name as TaskMasterPro will not differentiate them! It could make things complicated!
</div>

Examples:
* `task Weekly meeting`
* `task Submitting report`

### Listing all tasks : `listtasks`

Shows a list of all tasks in TaskMasterPro.

Format: `listtasks`

### Deleting a task : `deletetask TASK_ID`

Deletes the specified task from TaskMasterPro.

Format: `deletetask TASK_ID`

* Deletes the task with the specified `TASK_ID`.
* The task id refers to the number shown in the displayed task list.
* The id **should be a positive integer** 1, 2, 3, …​

Examples:
* `listtasks` followed by `deletetask 2` deletes the task with id 2 in TaskMasterPro.

<div style="page-break-after: always;"></div>

### Locating tasks by task names : `findtasks`

Finds tasks whose names contain any of the given keyword.

Format: `findtasks KEYWORD [MORE_KEYWORDS]`

* The search is case-insensitive. e.g. `report` will match `Report`.
* The order of the keywords does not matter. e.g. `report meeting` will match `meeting report`.
* Only full words will be matched. e.g. `report` will not match `reports`.
* Tasks matching at least 1 keyword will be returned. e.g. `report meeting` will return tasks with
`report` or `meeting` in their names.

Examples:
* `findtasks report` returns tasks with `report` in their names.

<div style="page-break-after: always;"></div>

### Assign a task to employee : `assigntask`

Assigns a task object to employee.

Format: `assigntask TASK_ID EMPLOYEE_ID`

* Assigns a task object with id `TASK_ID` to an employee with id `EMPLOYEE_ID`.

Examples:
* `assigntask` followed by `1 5` assigns task object with id 1 to an employee with id 5, Irfan.

![AssignUI](images/AssignUI.png)

<div style="page-break-after: always;"></div>

### Unassign a task to employee : `unassigntask`

Unassigns a task object from an employee.

Format: `unassigntask TASK_ID EMPLOYEE_ID`

* Unassigns a task object with id `TASK_ID` from an employee with id `EMPLOYEE_ID`.

Examples:
* `unassigntask` followed by `1 5` unassigns task object with id 1 from an employee with id 5.

<div style="page-break-after: always;"></div>

### Mark a task : `mark`

Marks a task as done.

Format: `mark TASK_ID`

* Marks a specified task with id `TASK_ID`. The task will be labeled as "Completed".

Examples:
* `mark` followed by a valid integer `TASK_ID` which corresponds to a real task in the database.
* `mark 1`

![MarkUI](images/MarkUI.png)

<div style="page-break-after: always;"></div>

### Unmark a task : `unmark`

Unmarks a task.

Format: `unmark TASK_ID`

* Unmarks a specified task with id `TASK_ID`. The task will be labeled as "In Progress".

Examples:
* `unmark` followed by a valid integer `TASK_ID` which corresponds to a real task in the database.
* `unmark 1`

### Clearing all entries : `clear`

Clears all entries from TaskMasterPro.

Format: `clear`

### Exiting the program : `exit`

Exits the program.

Format: `exit`

<div style="page-break-after: always;"></div>
### Saving the data

TaskMasterPro data are saved in the hard disk automatically after any command that changes the data.

There is no need to save manually.

<div markdown="block" class="alert alert-info">
Note that saves are only made after running a command, not on app startup!
</div>

### Editing the data file

TaskMasterPro data are saved automatically as a JSON file [JAR file location]/data/taskmasterpro.json . Advanced users are welcome to update data directly by editing that data file.

<div markdown="span" class="alert alert-warning">:exclamation: **Caution:**
If your changes to the data file makes its format invalid, TaskMasterPro will discard all data and start with the original sample data file at the next run. Hence, it is recommended to take a backup of the file before editing it.<br>
Furthermore, certain edits can cause TaskMasterPro to behave in unexpected ways (e.g., if a value entered is outside of the acceptable range). Therefore, edit the data file only if you are confident that you can update it correctly.
</div>



--------------------------------------------------------------------------------------------------------------------

<div style="page-break-after: always;"></div>
## FAQ

--------------------------------------------------------------------------------------------------------------------

## Known Issues

1. **When trying to delete existing accounts**, you are unable to do so and there is no existing solution.
2. **When trying to generate results for certain awards such as sportsman**, the website will crash and you would need to close the window.
