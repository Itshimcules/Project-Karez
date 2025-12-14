import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.18",
    networks: {
        hardhat: {
            chainId: 1337
        },
        // Add configuration for custom POA network here
        // localPOA: {
        //   url: "http://127.0.0.1:8545",
        //   accounts: [...]
        // }
    }
};

export default config;
