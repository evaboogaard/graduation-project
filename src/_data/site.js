const productionUrl = "https://9elements.com";
const developmentUrl = "http://localhost:8080";

export default {
  name: "Graduation Project",
  authorName: "Eva Boogaard",
  url: process.env.NODE_ENV === "production" ? productionUrl : developmentUrl,
  authorEmail: "evaboogaard@hotmail.com",
  metaDesc: "An experiment for a visual design tool in the browser.",
};
