const express = require("express");
import {groups_key, election_current_key, validators_key} from "./lib/thecelo";
import {rewards} from "./routes";
import utils from './utils';


setInterval(utils.thecelo.sync_datas,5*1000);

utils.thecelo.setSubscribe();
utils.thecelo.getSubscribeData(groups_key);
utils.thecelo.getSubscribeData(election_current_key);
utils.thecelo.getSubscribeData(validators_key);


const app = express();
const port = 8481;

//Add Middleware
app.use(express.json()); // <==== parse request body as JSON

//Default Homepage
app.get("/", (_req: any, res: any) => {
  res.send("Celo API Root");
});

rewards.addRewardsHandlers(app);

//Serve
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});