import { ContractKit, newKitFromWeb3 } from "@celo/contractkit";

import Web3 from "@celo/contractkit/node_modules/web3";
import { TheCelo } from "./lib/thecelo";

class utilities {
  private _web3: Web3 | null = null;
  private _kit: ContractKit | null = null;
  private _nodeUrl: string;
  private _thecelo: any;

  get web3(): Web3 {
    if (!this._web3) {
      this._web3 = new Web3(this._nodeUrl);
    }
    return this._web3;
  }

  get kit() {
    if (!this._kit) {
      this._kit = newKitFromWeb3(this.web3);
    }
    return this._kit;
  }

  get thecelo() {
    if (!this._thecelo) {
      this._thecelo = new TheCelo();
    }
    return this._thecelo;
  }

  constructor(nodeUrl: string = "https://rc1-forno.celo-testnet.org") {
    this._nodeUrl = nodeUrl;
  }
}

export default new utilities(
  "https://JUAPY5MSYKXDY6433EGE:MGZ6AL5GVOKZ45PS3V6DBFPCOTQYXR47LJLCY4CK@2ea0e024-760a-4ca1-ae27-999a0c2242ca.celo.bison.run/rpc"
);
