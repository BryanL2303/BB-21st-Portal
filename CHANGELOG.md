Version 0
25 July 2023
First commit, website uploaded with functions for creating quizzes and attempting quizzes, fixed dependencies and website is up

26 July 2023
Bug fix for Form submissions

27 - 29 July 2023
Updated CSS for visual bugs

6 August 2023
Results generation function added to view cumulative results from quiz attempts as well as grading quizzes

Version 0.1
11 August 2023
Awards system recreated and results generation functions added to the website, functional but not fully complete.
Requires more frontend work to edit backend for awards informations

19 August 2023
Bug fix - text wrap not working for pdf documents

22 August 2023
Uniform Inspection form added to the website
Seed added with Uniform Inspection Components
Bug fixs:
 - Officers cannot create new officer accounts
 - Officers/Primers will no longer see Quiz Page meant for Boys'

26 August 2023
Updated UI for Uniform Inspection form to easily switch between a group of Boys' when conducting uniform inspection

3 October 2023
Testing to remove unnecessary components from the folder

10 November 2023
Updating UI for mobile use, created CSS for mobile devices
Increased sizes for certain components for ease of users.
Changed website title from Quiz Website to BB 21st Portal

9 May 2024
1. Added files to the docs folder
    1. DeveloperGuide.md
    2. index.md
    3. UserGuide.md
    4. DevOps.md
2. DeveloperGuide.md has been updated
    1. Includes target users and user stories.
    2. Design considerations for quizzes and questions.
    3. PUML diagrams have not been added yet.
    4. Have not updated use cases.
3. The other files added to docs has not been updated.

7 August 2024
1. Updated from Ruby version 3.1.2 to 3.3.4
2. Updated Browserslist: caniuse-lite with npx update-browserslist-db@latest

13 August 2024
1. Updated seedRecords to change Total Defense mastery names from basic ... mastery to bronze ... gold
2. Fixed bug where the delete account button does nothing. But interaction after button press needs to be reconsidered
3. Fixed bug where the custom fields header will appear for awards that does not have any custom fields
4. Fixed bug where the results generation form will be stuck in an infinite loop for certain awards
5. Fixed bug where the user creation form will show a default selected value for rank and level but it does not register when form is submitted
6. Fixed bug where the uniform inspection form will not update itself when switching between boys
7. Fixed bug where the custom description and fields on the frontend remains when switching between awards
8. Updated known issues section to reflect fixed bugs

14 August 2024
1. Fixed issue with package.json script/build not pointing to the correct path
2. Resolved missing npm modules @hotwired/turbo-rails and @hotwired/stimulus
3. Missing npm module @hotwired/stimulus-loading which does not exist, commented out the line and the build is working
4. Fixed wrong path to controller files in application.js and controller/index.js
5. Update scripts in package.json
6. Removed package-lock.json file
7. Uodate dependencies using yarn

16 August 2024
1. Fixed bug where non-Administrators are unable to update the credentials of Officers/Primers
2. Updated known issues
3. Updated ResultsGenerationPage to partially work with no existing primers, bugs are not fully fixed and cannot be redeployed

21 August 2024
1. Fixed bug where ResultsGenerationPage does not account for case where there are no Primers and/or Officers
2. Added improvements for the UserManagementPage to reload the userlist whenever there are any writes to the database

28 August 2024
1. Added image files in docs/image folder for User Guide
2. Updated UserGuide.md to provide clear step by step guide for each existing feature
3. Removed template paragraph from DeveloperGuide.md
4. Removed the quiz and question tabs from the navigation bar
5. Updated libraries used in index.md

29 August 2024
1. Created help page with link to user guide and scss for help page in desktop view
2. Fixed incorrect comments in user guide
3. Added route to help page from main app
4. Resized images in user guide

3 September 2024
1. Create AdminPage to view all tables and data
2. Create css for desktop version of administrator page
3. Create controller for administrator page with CRUD functions
4. Add route to administrator controller api
5. Add link to administrator page from navigation menu
6. Create DatabaseTable to display in AdminPage with functions to CRUD database entries

11 September 2024
1. Create AwardTracker in awardsManagementPage with CRUD functions for boys awards attainment
2. Create migrations for new table attained_awards
3. Create AwardTrackerController in api to provide CRUD functions for attained_awards
4. Create route to backend api
5. Create model for new migrated table
6. Added way to view AwardTracker in AwardsManagementPage
7. Create css file for AwardTracker
8. Updated seedRecords to include remaining elective awards

16 September 2024
1. Added Adventure and Drill Advanced into electives table for AwardsTracker with 2 elective points each instead of 1

18 September 2024
1. Edited awards tracker controller to combine add and delete functions into one function which processes more than one change at once
2. Edited awards tracker tables to only rerender when the user saves the changes made, users can now check/uncheck multiple checkboxes at once before saving all changes at once
3. Updated the routes due to the function changes in awards tracker controller

19 September 2024
1. Created function for users to upload award tracker
2. Installed xlsx with yarn to read excel files
3. Added functions in AwardsTracker to process data from excel file and toggle the attainments.

Version 1.0
22 September 2024
1. Update ApplicationController JWT to implement secret key hidden in ENV as well as tokens that will expire
2. New function and action added to relevant controllers to authenticate JWT before any action
3. Using HTTP-Only Cookies when user logs in
4. Added new function to authorize cookies from backend
5. Updated config development and application file to allow cookie transfer
6. Updated all axios post request to be sent with credentials and removed all tokens
7. Removed the used of params[:token] from all controller functions
8. Added new function in application controller with route to check for existing session
9. Update all pages redirect to change token to jwt
10. Added new function in application controller with route to log out and delete jwt
11. Update function in NavigationBar for logging out to call controller function
12. Create new session store file in config/initializers to manage cookie transfers

25 September 2024
1. Fixing eslint caught errors, removing unused variables and adding keys to mapped elements

26 September 2024
1. Run rubocop safe autocorrect to fix codestyle errors with ruby components
2. Refactored most codestyle related warnings for backend with rubocop
3. Added config file for rubocop to ignore set up related files and change certain conditions
4. Added descriptions for all controller classes
5. Added PropTypes to all relevant jsx files

27 September 2024
1. Update devDependencies for jest testing
2. Create unit tests for 2 elements for testing
3. Enabled CI to run jest tests
4. Added jest settings file
5. Refactored code for navigation bar and created test files

30 September 2024
1. Refactored code for log in page and created test file
2. Update user management page to not load list with a delay. Use effect to properly rerender
3. Rename API get_accounts to get_accounts_by_type
4. Refactored code for boy account list for user management and created test file
5. Refactored code for primer account list for user management and created test file
6. Refactored code for officer account list for user management and created test file
7. Refactored code for reset password page and created test file
8. Refactored code for user information for user management and created test file
9. Refactored code for account creation form for user management and created test file
10. Refactored code for database table for admin page and created test file

1 October 2024
1. Refactored code for award information for awards management page and created test file

2 October 2024
1. Refactored code for awards tracker and split functions and components into more files

4 October 2024
1. Refactored code for user management page and created integrated tests for this page

29 October 2024
1. Added first playwright test, incomplete
2. Added status code to all api renders

30 October 2024
1. Added function to filter names from AwardsTracker
2. Added function to hide AwardsManagementPage left menu
3. Added icons for buttons

31 October 2024
1. Fixed bug with user information not rerendering components when reloading

4 November 2024
1. Added migration for new table Appointments
2. Added column appointment to Accounts
3. Added new segment AppointmentHolders to UserManagementPage
4. Added new segment AppointmentInformation for AppointmentHolders
5. Added model and controller for Appointments table
6. Added CRUD functions for Appointments
7. When logging in, set cookies for Appointment if it exists
8. Added more conditionals to rendering in UserManagementPage since Boys have access to it

5 November 2024
1. Added css to manage overflow for AppointmentHoldersList
2. Added css to limit height for account-name-popup-content
3. Update frontend to replace console logs from axios catches with handleServerError
4. Added more status codes to catch with handleServerError
5. Update home link for logging in to not show QuizListPage
6. Updated admin page table to use textarea instead of input for more space

6 November 2024
1. Added migration for new tables Parades, ParadeCompanyAnnouncements, ParadePlatoonPrograms, ParadePlatoonAnnouncements, ParadeAttendances
2. Added models for all new tables
3. Added new page AttendanceManagementPage
4. Added new segment NewParadeForm, ParadeList, ParadeInformation for AttendanceManagementPage
5. Added CRUD functions for all new tables in new controllers ParadeController

19 November 2024
1. Added new segment ParadeEditor, ParadeNoticePDF, ParadeAttendance for ParadeInformation
2. Completed editParade function in ParadeController
3. Updated css for attendanceManagementPage to include new components

20 November 2024
1. Added migration to add columns user_name, abbrieviated_name, honorifics to Accounts
2. Updated logInPage to use user_name rather than account_name
3. Added new rank to Officer account type 'Teacher'
4. Updated ParadeNoticePDF to use honorifics and abbreviated_name for Teachers and VALs
5. Updated AccountController to incorporate use of new columns
6. Updated new account form and account information editor to incorporate new columns
7. Added css for parade list and annual attendance list

2 December 2024
1. Added backup yaml file to github workflow for testing to backup database weekly
2. Added function to update attendance to parade controller and route
3. Added popup to table in frontend to modify attendance
4. Added migration to add column roll_call to Accounts
5. Updated AccountController to incorporate use of new columns
6. Updated new account form and account information editor to incorporate new column

3 December 2024
1. Added migration to add columns to Parades for attendance finalization by cos, csm, do and captain
2. Added frontend for each appointment holder to finalize the attendance
3. Updated controllers for updating attendance finalization and updating attendance to check if user still has permission

4 December 2024
1. Added announcements and programs portion to create_parade function in parade_controller
2. Swapped to using state with global variables to prevent rerendering from affecting them
3. Added VAL to Officers table title in attendance taking
4. Fix logical error with authorisation when attendance is finalized

6 December 2024
1. Add AnnualAttendanceExcel to generate excel sheet with attendance sheets
2. Updated ParadeNoticePDF to use date of parade rather than template fixed date
3. Updated ParadeInformation so that we can load parades by clicking on the ParadeList

9 December 2024
1. Added repository checkout to database back up script
2. Made the database backup daily for testing purposes

10 December 2024
1. Update node version in CI script
2. Update database backup script for testing

11 December 2024
1. Update database backup script for testing
2. Removed AttendanceExcelSheet which is no longer necessary

13 December 2024
1. Complete formatting for AttendanceExcel Sheet
2. Give permission for Admin Sergeant to create and edit parades
3. Update attendance excel component to provide all years starting from 2024

15 December 2024
1. Add migration to record past year ranks and classes for past year attendance excel, add levels to parade attendance to order Boys levels for past year excels
2. Update frontend of userInformation to include past level classes and ranks for Boys
3. Updated account_controller to incorporate new columns with edit_account
4. Completed testing for backend, revert back to weekly backups

16 December 2024
1. Update AnnualAttendanceExcel to use new backend function
2. Update parade_controller with new function to retrieve excel data which works with past years
3. Add migration to indicate if Boys have graduated
4. Updated UserInformation to include graduated as a checkbox
5. Updated account_controller edit_account function to include graduated
6. Add Graduated Boys List to display graduated Boys seperately from current Boys in UsersManagementPage

17 December 2024
1. Update UserInformation for Officers, use class_1 to classify Officers
2. Removed Teacher rank and added it to class under STAFF
3. Filter by staff for parade editor for duty teacher
4. Use class_1 for Officers and Volunteers sheet in annual attendance excel

23 December 2024
1. Update test cases for user information and account creation and user management page to include the new columns migrated
2. Update controllers based on rubocop detected offenses
3. Add proptypes and remove unused variables from new attendance management files

7 January 2025
1. Add migration to add member id to accounts for Boys
2. Edited the user information frontend for Boys to include member id
3. Edited the function for generating attendance excel to include member id and class and formatting
4. Edited function for generating attendance excel to not create irrelevant sheets
4. Fixed bug with backend not fetching Boys by the correct levels for that year
5. Update test cases to include member id
6. Fixed bug with uniform inspection form not using correct route to get Boys accounts

20 January 2025
1. Fixed bug with fetching annual parade attendance to split sec 4s and 5s
2. Fixed annualattendanceexcel to display Sec 5s after Sec 4s with the correct class and rank
3. Edited user information to allow null values for Primers ranks, officers class
4. Added class for Primers with no ranks
5. Remove 2024 from annual attendance list
6. Fix bug where certain user information gets overwritten with null when editing accounts

14 February 2025
1. Overhaul NavigationBar to Header. This header has 2 versions, one for mobile and one for desktop
2. Removed outdated files/images which are no longer used
3. Linked stylesheet fontawesome
4. Added empty component footer to be completed
5. Shifted images away from general folder into assets/images folder

22 February 2025
1. Added files for footer and home page
2. Home page is not displayed yet since its filled with dummy data
3. Update footer to remove credits to flaticon
4. Fixed bug with parade controller not creating platoon announcements due to typo
5. Fixed visual bug with parade form and editor not displaying the correct announcements/programs after deletion due to the key of each row not being a unique key
