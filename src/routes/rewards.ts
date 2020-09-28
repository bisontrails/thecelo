import { ValidatorReward } from "@celo/contractkit/lib/wrappers/Validators";
import { redis_client,  votes_key } from "../lib/thecelo";
import utils from "../utils";

export function addRewardsHandlers(app: any) {
  app.get("/rewards", async (req: any, res: any) => {
    let out: any;
    out =
      "epoch" in req.query
        ? await getRewardsForEpoch(req.query.epoch)
        : res.status(400).send("Epoch must be specified");
    res.send(out);
  });

  app.get("/voted", async (req: any, res: any) => {
    let out: any;
    out =
      "address" in req.query
        ? await getVotedForEpoch(req.query.address)
        : res.status(400).send("Epoch must be specified");
    res.send(out);
  });
}

async function getRewardsForEpoch(era: number) {
  const validators = await utils.kit.contracts.getValidators();
  const epochValidatorRewards: ValidatorReward[] = await validators.getValidatorRewards(
    era
  );
  const era_block = await utils.kit.getLastBlockNumberForEpoch(era);
  const block = await utils.web3.eth.getBlock(era_block);
  let rewards = [];

  for (let reward of epochValidatorRewards) {
    let payment = { reward: reward, timestamp: block.timestamp as number };
    rewards.push(payment);
  }

  return rewards;
}

async function getVotedForEpoch(address: string) {
  redis_client.get(votes_key, function (err:any, data:any) {
    var votes = JSON.parse(data);
    var voteds: any[] = [];
    votes.forEach((vote: any[], i: any) => {
      if (vote[1].toLowerCase() == address.toLowerCase()) {
        voteds.push([vote[0], vote[2], vote[3], vote[4], vote[5], vote[6]]);
      }
    });
    //
    var blockNumber = 0;
    if (
      utils.thecelo.eth_blockdata &&
      utils.thecelo.eth_blockdata.eth_blockNumber
    )
      blockNumber = utils.thecelo.eth_blockdata.eth_blockNumber;
    //
    return JSON.stringify({ blockNumber, voteds });
  });
}
