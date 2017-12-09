# CS411 - Software Engineering: Scheduler

* Team 11: Ghada Abahussain, Tom Corcoran, Jesse Fimbres, Anthony Pasquariello

<!-- Description -->

# Main Files Changed
* 1) code/modules/core/client/controllers/home.client.controller.js (angular controller)
* 2) code/modules/core/client/views/home.client.view.html (html view)
* 3) code/modules/core/client/css/core.css (small style changes)
* 4) code/modules/core/server/routes/core.server.routes.js (Express routes)
* 5) code/modules/core/server/controllers/core.server.controller.js (functions for routes)
* 6) code/modules/core/server/views/layout.server.view.html (sign-in with Google)

# Features
Our website serves as an automated scheduler for groups and teams from Boston University and beyond
* 1) Students join a group/team on our website
* 2) Their BU calendar and Google Calendar are imported into our website
* 3) All of their calendars are cross referenced and overlapping free times for the group are displayed
* 4) Along with these free time slots, the weather at that time and day is displayed as well; this helps students decide on the best time
* 5) Students vote for one of the time slots; the time with the most votes will decide the time of the meeting

# Preview
![Alt text](/Documentation/teamtimes.jpg?raw=true "Team Times Screenshot")

# Requirements to Run
1)  NodeJS
2)  MongoDB
3)  Google Account and/or BU Student Link Account

# Prerequisites
 Make sure you have installed all of the following prerequisites on your development machine:
 * Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
 * Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
 * MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
 * Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

 ```bash
 $ npm install -g bower
 ```

# Running Your Application

  Run your application using npm:

  ```bash
  $ npm start
  ```
  
  Run MongoDB 
  
  * MacOS
 ```bash
  $ cd <Project Directory>/code
  $ mongo
 ```
  * Windows
  ```bash 
  $ cd C:\Program Files\MongoDB\Server\3.2\bin
  $ mongod
```

  Your application should run on port 3000: [http://localhost:3000](http://localhost:3000)




 
