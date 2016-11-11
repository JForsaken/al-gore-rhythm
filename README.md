# Al Gore Rhythm :saxophone::musical_note:::::

Al Gore's got something in mind, and it's not your average Do-Re-Mi.

## Install

### Environment

1. Install node and npm by installing `nvm`.
2. After this, navigate to the project folder then run `nvm use`, to use the node version specified by the project.
3. If this specific version is not installed, just run `nvm install X`, where 'X' is the version specified in the **.nvmrc** file.
4. Run `npm install`.

### Running the program

1. Run `npm start`, which will run a babel live watcher that will transpile your project into regular JavaScript, located in the **./dist** folder.
2. To exectute the program, simply run `node ./dist/bundle.js`.

### ESLint

Since this is JavaScript using the lastest **ES7** standard, I've installed **ESLint** that will lint your syntax errors, and prevent you from doing commits.

1. To see if you have some syntax errors, run `npm run lint`.
2. If not, well you will have to correct them in order to commit, or else if will be refused :wink:.
