# Setup Instrctuions

Step 1: Install Pacakges
`npm install`

Step 2: Setup .env

- Create .env in root directory
- add: VITE_AWS_ACCESS_KEY_ID & VITE_AWS_SECRET_ACCESS_KEY

Step 3: Run Website
`npm dev` or `npm build`

Step 4: Check for Errors
After you make changes run eslint using the command `npm run lint`
This will check for linting errors

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
