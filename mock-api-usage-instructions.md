# Mock API Usage Instructions

This document provides instructions on how to use and interact with the Mock API in our project. The Mock API allows us to simulate backend responses during development and testing.

## Table of Contents

1. [Setup](#setup)
2. [Usage](#usage)
3. [Adding New Endpoints](#adding-new-endpoints)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

## Setup

1. Ensure you have installed the necessary dependencies:

   ```
   npm install msw --save-dev
   ```

2. Verify that you have the following files in your project:

   - `src/mocks/handlers.js`: Contains the request handlers for your mock API
   - `src/mocks/browser.js`: Sets up the Service Worker for browser environments
   - `src/mocks/server.js`: Sets up the server for Node.js environments (used in testing)

3. Check that your `src/index.js` file includes the Mock Service Worker setup:

   ```javascript
   import { worker } from './mocks/browser';

   // At the end of the file
   if (process.env.NODE_ENV === 'development') {
     worker
       .start({
         onUnhandledRequest: 'bypass',
       })
       .catch(console.error);
   }
   ```

## Usage

Once set up, the Mock API will automatically intercept any requests to the specified endpoints during development. You don't need to change any of your API calls in your application code.

To make API calls, use your preferred method (fetch, axios, etc.) as if you were calling a real API. For example:

```javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Adding New Endpoints

To add a new endpoint to the Mock API:

1. Open `src/mocks/handlers.js`
2. Add a new request handler. For example:
   ```javascript
   rest.get('/api/new-endpoint', (req, res, ctx) => {
     return res(
       ctx.status(200),
       ctx.json({ message: 'This is a new endpoint' })
     );
   }),
   ```
3. The new endpoint will be immediately available for use in your application.

## Testing

The Mock API can be used in your tests to simulate API responses:

1. In your test setup file (e.g., `src/setupTests.js`), add:

   ```javascript
   import { server } from './mocks/server';

   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

2. In your tests, you can now make API calls as if they were hitting a real backend:
   ```javascript
   test('fetches data from API', async () => {
     const response = await fetch('/api/data');
     const data = await response.json();
     expect(data).toEqual(/* your expected data */);
   });
   ```

## Troubleshooting

1. **Requests not being intercepted**: Ensure that the Mock Service Worker is started in your `index.js` file and that you're running the app in development mode.

2. **Unexpected API responses**: Check the handler in `src/mocks/handlers.js` for the specific endpoint. Make sure the response matches what you expect.

3. **Error: "Failed to register a Service Worker"**: This can happen in development if you're using an unsecured HTTP connection. Try using HTTPS or localhost.

4. **Mock API not working in tests**: Verify that you've set up the server correctly in your test setup file as shown in the Testing section.

If you encounter any other issues or need to modify the Mock API behavior, please consult with the team lead or refer to the [MSW documentation](https://mswjs.io/docs/).
