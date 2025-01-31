const productionUrl = "https://9elements.com";
const developmentUrl = "http://localhost:8080";

export default {
  name: "11ty Boilerplate",
  authorName: "9elements",
  url: process.env.NODE_ENV === "production" ? productionUrl : developmentUrl,
  authorEmail: "contact@9elements.com",
  metaDesc: "A simple boilerplate for 11ty",
};
