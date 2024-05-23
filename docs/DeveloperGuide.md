---
layout: page
title: Developer Guide
---
* Table of Contents
{:toc}

--------------------------------------------------------------------------------------------------------------------

## **Acknowledgements**

* This project was started by [Bryan](https://github.com/BryanL2303), including this developer guide as well as the [user guide](UserGuide.md).

--------------------------------------------------------------------------------------------------------------------

## **Design**

<div markdown="span" class="alert alert-primary">

:bulb: **Tip:** The `.puml` files used to create diagrams in this document `docs/diagrams` folder. Refer to the [_PlantUML Tutorial_ at se-edu/guides](https://se-education.org/guides/tutorials/plantUml.html) to learn how to create and edit diagrams.
</div>

### Architecture

<img src="images/ArchitectureDiagram.png" width="280" />

The ***Architecture Diagram*** given above explains the high-level design of the App.

Given below is a quick overview of main components and how they interact with each other.

**Main components of the architecture**

**`App`** (accessible [`here`](https://github.com/se-edu/TaskMasterPro-level3/tree/master/src/main/java/seedu/address/Main.java)) contains the top level view of the page.

The bulk of the website's work is done by the following three components:

* [**`Javascript Packs`**](#ui-component): The UI of the Website which executes commands for the frontend.
* [**`Controller API`**](#api-component): The API to connect with the backend.
* [**`PGSQL Database`**](#database-component): Reads data from, and writes data to, the database hosted on Heroku through the Controller API.

**How the architecture components interact with each other**

The sections below give more details of each component.

### UI component

The **UI** of this website is composed of jsx files in [`app/javascript/packs`](https://github.com/se-edu/TaskMasterPro-level3/tree/master/src/main/java/seedu/address/ui/Ui.java)
**Provide Description**
The CSS files can be found in app/assets/stylesheets

### API component

**API** : [`app/controllers/api`](https://github.com/se-edu/TaskMasterPro-level3/tree/master/src/main/java/seedu/address/logic/Logic.java)
**Provide Description**

### Database component

**API** : [`db`](https://github.com/se-edu/TaskMasterPro-level3/tree/master/src/main/java/seedu/address/storage/Storage.java)
**Provide Description**
Update the database through migrations specified in db/migrations. Update/create seed data using seed file.

--------------------------------------------------------------------------------------------------------------------

## **Implementation**

This section describes some noteworthy details on how certain features are implemented.

### Add/Delete quizzes / questions

#### Current Implementation

The current quizzes and questions are all tied to existing awards. Awards are a separate set of features to keep track of the BB award curriculum. This means that there is strong coupling between the quizzes and questions and awards. This is justified as the BB awards system should not be changing drastically very frequently, majority of quizzes that will be administered to the Boys' are also usually due to certain awards / badgework. This allows us to maintain a question bank for each award so that we can compile quizzes much more easily in the long run.

Given below is an example usage scenario and how the add/delete quiz / question feature behaves at each step.

Step 1. The user enters the quizzes / question bank. Assume that there are no existing quizzes and questions.

![AddTask0](images/AddTask0.png)

Step 2. 

![AddTask1](images/AddTask1.png)

Step 3. 

![AddTask2](images/AddTask2.png)

Step 4. 

<div markdown="span" class="alert alert-info">:information_source: **Note:** If an invalid `TaskId` is entered instead, an error will appear informing the user and nothing else will happen.

![AddTask3](images/AddTask3.png)


The following sequence diagram shows how an add question operation goes through the `API` component:

![AddTaskSequence](images/AddTaskSequence.png)

<div markdown="span" class="alert alert-info">:information_source: **Note:** The lifeline for `AddTaskCommand` should end at the destroy marker (X) but due to a limitation of PlantUML, the lifeline reaches the end of diagram.

</div>

The following activity diagram summarizes what happens when a user executes a new command:

<img src="images/AddTaskActivityDiagram.png" width="250" />
<img src="images/DeleteTaskActivityDiagram.png" width="250" />

#### Design considerations:

This however introduces problems due to the coupling issues. 
1. How to incorporate a quiz with both questions from the databank and new questions?
2. What should happen to the new questions should a quiz be deleted?
3. Should the deletion of an award cascade to all quizzes and questions?
4. How to simply display all the information? This means that users have multiple ways of creating quizzes, creating questions, deciding what to do upon deletion of a quiz, ability to view both quizzes and questions.

**Aspect: How to uniquely identify `Task`:**

* **Alternative 1 (current choice):** Using of `taskId`.
    * Pros: Easy to implement. `TaskMasterPro` automatically assigns this value.
    * Cons: May be hard for users to keep track of.

* **Alternative 2:** Using of `taskName`.
    * Pros: An existing field, no additional implementations needed.
    * Cons: Impossible to uniquely identify tasks as there could be tasks with the same name.

--------------------------------------------------------------------------------------------------------------------

## **Documentation, dev-ops**

* [Documentation guide](Documentation.md)
* [DevOps guide](DevOps.md)

--------------------------------------------------------------------------------------------------------------------

## **Appendix: Requirements**

### Product scope

**Target user profile**: Officers / Primers of the Boys' Brigade 21st Singapore Company who

* prepares 32a results
* conducts uniform inspections
* conducts quizzes / tests for Boys
* manages awards for Boys

**Value proposition**:

1. Create 32a results into PDF version faster than using the traditional word document and then converting it to a PDF
2. Allows quick assessment for uniform inspection that is tabulated automatically and recorded for future reference as compared to the traditional pen and paper which requires printing of the document and physical storing of documents
3. A quiz platform that contains all the functions that a Google form would have and also tabulates and stores results
4. Create a list with checkboxes for key awards leading to important milestones, better if it could read in the awards tracker file and automatically update the information

### User stories

Priorities: High (must have) - `* * *`, Medium (nice to have) - `* *`, Low (unlikely to have) - `*`

| Priority | As a …​                                    | I want to …​                                 | So that I can…​                                                   |
|---------| ------------------------------------------ |----------------------------------------------|-------------------------------------------------------------------|
| `* * *` | new user                                   | see usage instructions                       | refer to instructions and examples to use the website            |
| `* * *` | user                                       | add a new account                           | keep someone on record                                         |
| `* * *` | user                                       | update an existing account                    | keep details updated                                     |
| `* * *` | user                                       | delete an account                            | remove accounts that are no longer needed                              |
| `* * *` | user                                       | list all accounts                  | locate details of all accounts in a list                         |
| `* * *` | user                                       | add a new award                               | keep an award on record                                     |
| `* * *` | user                                       | update an existing award                               | keep award details updated                                     |
| `* * *` | user                                       | delete an award                                | remove awards that are phased out                              |
| `* * *` | user                                       | list all awards                      | locate details of all awards in a list                             |
| `* * *` | user                                       | create 32a results for relevant awards                 |              |
| `* * *`  | user                                      | indicate Boys attainment of award  | keep track of what awards each Boy has attained  |
| `* * *`  | user                                      | unindicate Boys attainment of award  | undo wrong indication  |
| `* * *`  | user                                      | list all Boys and their attainment of awards  | view progression towards IPA/SPA and Founders Award |
| `* * *` | user                                       | conduct uniform inspection for Boys            |                              |
| `* * *` | user                                       | view results of uniform inspections             |                             |
| `* * *`  | user                                      | delete results of uniform inspections                 |                      |
| `* * *` | user                                       | create forms/assessments like Google Forms | conduct quizzes or gather feedback |
| `* * *` | user                                       | fill in forms/assessments              |                                      |
| `* * *` | user                                       | view results of forms/assessments      |                                      |
| `* * *` | user                                       | delete forms/assessments                            |            |
| `* *`  | user                                        | upload award tracker and update attainment of awards  | avoid reading the awards tracker and clicking manually |

### Use cases

(For all use cases below, the **System** is the `website` and the **Actor** is the `user`, unless specified otherwise)

**Use case: Creating awards results**

**MSS**

1.  

    Use case ends.

**Extensions**

* 2a. The list is empty.

  Use case ends.

* 3a. The given id is invalid.

    * 3a1. TaskMasterPro shows an error message.

      Use case resumes at step 2.

### Non-Functional Requirements

1.  Should work on any _mainstream web browsers_.
2.  Should be able to operate without a noticeable sluggishness in performance for typical usage.
3.  Should be able to handle a disconnected database without crashing.

### Glossary

* **Mainstream web browsers**: Google Chrome, Microsoft Edge, Safari, Firefox
* **Private contact detail**: A contact detail that is not meant to be shared with others

--------------------------------------------------------------------------------------------------------------------

## **Planned Enhancements**