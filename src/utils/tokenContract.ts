import { ethers } from "ethers";
import { LOTTERY_CONTRACT, TOKEN_CONTRACT } from "../CA";
import Token_Abi from "../utils/token_abi.json";
import Lottery_Abi from "../utils/lottery_abi.json";

type Ethereum = any;

export const getTokenContract = (isSigner: boolean) => {
    const { ethereum } = window
    if (ethereum) {
        const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/uZGR55UymScIXoqPP4f3JQ0nix_Ry88e");

        const providerSigner = new ethers.providers.Web3Provider(ethereum as Ethereum | undefined)
        const signer = providerSigner.getSigner();

        const newProvider = isSigner ? signer : provider;

        return new ethers.Contract(TOKEN_CONTRACT, Token_Abi, newProvider);
    } else {
        return undefined
    }
}


export const getLotteryContract = (isSigner: boolean) => {
    const { ethereum } = window
    if (ethereum) {
        const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/uZGR55UymScIXoqPP4f3JQ0nix_Ry88e");

        const providerSigner = new ethers.providers.Web3Provider(ethereum as Ethereum | undefined)
        const signer = providerSigner.getSigner();

        const newProvider = isSigner ? signer : provider;

        return new ethers.Contract(LOTTERY_CONTRACT, Lottery_Abi, newProvider);
    } else {
        return undefined
    }
}
