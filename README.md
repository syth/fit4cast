# Setup Instructions
These are the setup instructions to get Fit4Cast running on your local machine, to see how to get setup within AWS Amplify, see our User Guide in our team repository.

## Prerequisites
 > [!IMPORTANT] 
 > In order to properly setup the web application with AWS services, you **WILL** need your AWS Access Key and Secret access key so permissions can properly be setup for interactions with services like DynamoDB and Lex.

 > [!NOTE]
 > Please also note that this site **NEEDS** the Terraform configuration to be setup **BEFORE** running, otherwise it will not work.

## Step 1: Install Packages
Run `npm install` to install all of the required packages

## Step 2: Setup .env

Create .env in the root directory, copy and fill in the following variables
```
VITE_AWS_ACCESS_KEY_ID=
VITE_AWS_SECRET_ACCESS_KEY=
VITE_API_GATEWAY_LINK=
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_USER_POOL_CLIENT_ID=
```

## Step 3: Run Website
Run `npm run dev` or `npm run build` to get a live development server that you can access a live updating site in your web browser or create a build folder where you can access a non-live updating site.

## Step 4: Use The Website!
Visit the website and utilize Fit4Cast to help you plan out activities for your day!