# Front-end components for AirView application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Required dependencies

### Detect Secrets

The project has a dependency on `detect-secrets` version 1.0.3 for a pre-commit hook. This specific version must be installed at present to prevent a known bug with version 1.1.0.

## Required configurtion

Environment variables should be set for the following:

| Key                            | Description                                       | Example                                        |
| ------------------------------ | ------------------------------------------------- | ---------------------------------------------- |
| REACT_APP_AUTH_AUTHORITY       | Oauth authority                                   | https://login.microsoftonline.com/xyz123/v2.0/ |
| REACT_APP_AUTH_CLIENT_ID       | Oauth client id                                   | abc-123                                        |
| REACT_APP_AUTH_REDIRECT_URI    | Oauth redirct page                                | https://mysite.com/signin-callback             |
| REACT_APP_AUTH_SCOPE           | Scope for Oauth token request                     | api://myapi/.default                           |
| REACT_APP_API_HOST             | API host                                          | https://myapi.com                              |
| REACT_APP_CONTENT_BACKEND      | Backend type (github or ado)                      | github                                         |
| REACT_APP_CONTENT_CLIENT_ID    | Oauth client id for content backend (github, ado) | xyz-789                                        |
| REACT_APP_CONTENT_CALLBACK_URL | Callback url for content backend token exchange   | https://mysite.com/github/authorizing          |
| REACT_APP_CONTENT_ORGANISATION | ADO organisation (ado only)                       | my org                                         |
| REACT_APP_CONTENT_PROJECT      | ADO project (ado only)                            | my project                                     |

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
