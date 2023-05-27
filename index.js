const app = require("./app.js");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server is Running at PORT ${port}`);
});