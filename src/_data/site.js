const productionUrl = "https://9elements.com";
const developmentUrl = "http://localhost:8080";

export default {
  name: "Design System Tool",
  authorName: "Eva Boogaard",
  url: process.env.NODE_ENV === "production" ? productionUrl : developmentUrl,
  authorEmail: "evaboogaard@hotmail.com",
  metaDesc: "A simple and responsive design system tool in the browser",
};
