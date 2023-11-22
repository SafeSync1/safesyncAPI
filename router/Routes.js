//Dependencies
const App = require("express")();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const RegisterRoutes = require("./registerRoute");
const LoginRoutes = require("./loginRoute");
const ApprovalRoutes = require("./approvalRoute");
const dataManipulationRoutes = require("./dataManipulationRoute")

App.use(RegisterRoutes);
App.use(LoginRoutes);
App.use(ApprovalRoutes);
App.use(dataManipulationRoutes);

module.exports = App;