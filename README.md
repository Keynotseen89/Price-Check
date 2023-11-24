# Price-Check
Small personal project that checks prices of an item and save them on a text file.  
This project is for educational purposes only.  Only use this as an example for automation.

# Whats needed for the project

1. Make sure to download the latest Node verison https://nodejs.org/en/
2. Make sure to install playwright in your repo using npm install playwright if not already installed
3. If you need to install nodemailer do so by using npm install nodemailer

# How to run project
1. To run the project just run this command 
npx playwright test --project='Google Chrome'  this should run all the test ones
2. To run just one project run this command
npx playwright test <name-of-test-to-run>.spec --project='Google Chrome'

# What needs to be changed 
1.  The account-config file needs to be updated with email credentials.
2.  The sendEmail file needs to get updated with emails and sender
3.  Locator for each page must be updated if not using provided links.
