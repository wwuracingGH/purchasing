# Purchasing

## Who is WWU Racing?

WWU Racing is a club at Western Washington University that designs, manufactures, tests, and races a single–seater, formula style racecar every year. We compete in the Formula SAE California competition (formerly held in Lincoln, NE), along with over a hundred other universities from around the world. There are similar competitions all over the globe—Michigan, Canada, Brazil, the UK, Germany, Japan, and more.

## The new purchasing system

At WWU Racing, a purchase order is made by a team member, and the system lead and the directors look at it and sign it. Twice a week, someone goes through the signed purchase orders and orders them in the main office of the engineering building. From there, the purchases get put into the Master Budget, where the whole team can look at the purchases that have been made. This results in four main sections of the purchasing system:

* Creating and saving a purchase order, or PO
* Reviewing and signing the PO by system leads, directors
* Buying the products listed in the PO
* Storing and viewing past and current POs (the Master Budget)

We've decided to create a new purchasing system to replace the old system, which was bodged together between a few separate programs. The new system uses Node.js and Express.js for the backend, JQuery for the frontend, and Pug as a template engine. Were I to start again from scratch, I'd probably use a more modern front end like React or Vue or something.

## Getting Started

In order to work on this project, you'll need to install Git and Node.js. We'll use Git to get the files onto your computer and we'll use Node.js to host the website locally so that you can work on it from the comfort of your own home.

https://git-scm.com/downloads

https://nodejs.org/en/download/

### Clone the repository

Open a command line and navigate to whatever folder you want to store the purchasing repo in. Run this command to download the repository:
```
-> git clone https://github.com/wwuracingGH/purchasing
```

### Install node modules

Next, you'll need to install all the necessary node modules that this repository uses. Run this command to do so:
```
-> npm install
```

### Test the website

Now, you can work on the code to your heart's content. To test out the website, run this command:
```
-> npm start
```
Then go to http://localhost:3000/ in your browser to view the purchasing system.

### Downloading and uploading changes with Git

Using Git, you can download changes other people have made with this command:
```
-> git pull
```
You can upload your changes to GitHub with this:
```
-> git push origin master
```
