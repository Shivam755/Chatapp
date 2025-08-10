const { app } = require("./app");
require('dotenv').config();

port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
    console.log("Express server is running on port: "+port)
    return "Express is running";
})