# TODO App

## Project Spec

    This project will be a simple TODO app, with the ability to retrieve/filter tasks from the backend AWS table(s). There will also be a page that displays all tasks and allows deletion of the tasks once they are completed.  In total, there should be 4 html files: index.html, add-task.html, view-tasks.html, and manage-tasks.html. The index.html file will contain the landing page with an overview and the form to submit tasks to AWS. The add-task.html file will contain the page dedicated to categorizing the already created tasks, and will allow for addition of more tasks. The view-tasks.html file will conditionally retrieve filter tasks from AWS by category, day, priority, etc. Finally, the manage-tasks.html page will display all tasks and will have deletion functionality. There will be the ability to navigate between each page as well. 

    The target audience for this task is a general audience, but will particularly be useful for students, as the filters can allow tagging for tasks, assignments due, or events in their schedule. The data involved with this project will be the tasks, and the tags for each individual one that will allow the functionality in filtering and displaying the intended tasks. Once I have all of my intended functionality and front-end basics on the app, I hope to implement the ability to display tasks by the day of the week, whether that is a separate page, or I modify the original deletion page to do so. Another functionality that I would like to implement would be the ability for the user to create their own tags, and to have multiple tags on each task instead of just one in one of the three categories (tasks, assignments due, or events). Lastly, an addition that could be really useful is identifying the priority of tasks, and organizing them, when retrieved, by the order of their priority. On the backend, I'm not fully certain how many tables I will require through AWS, but there will definitely need to be GET, PUT, and DELETE actions.

## Project Wireframe

TODO: Wireframes for each page
