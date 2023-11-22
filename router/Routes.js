//Dependencies
const App = require("express")();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const RegisterRoutes = require("./registerRoute");
const LoginRoutes = require("./loginRoute");
const ApprovalRoutes = require("./approvalRoute");

App.use(RegisterRoutes);
App.use(LoginRoutes);
App.use(ApprovalRoutes);

module.exports = App;