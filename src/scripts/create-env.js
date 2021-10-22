const fs = require("fs");
fs.writeFileSync("./.env", `CONTENTFUL_SPACE_ID=${process.env.CONTENTFUL_SPACE_ID}\n CONTENTFUL_ACCESS_KEY=${process.env.CONTENTFUL_ACCESS_KEY}\n `);
