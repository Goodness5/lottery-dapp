import { Contract, ethers } from "ethers";
import { type } from "os";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  erc20ABI,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { TOKEN_CONTRACT } from "../CA";
import { getTokenContract } from "../utils/tokenContract";
import Token_Abi from "../utils/token_abi.json";

type Ethereum = /*unresolved*/ any

const MintToken = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<string>("");

  const { config } = usePrepareContractWrite({
    address: TOKEN_CONTRACT,
    abi: Token_Abi,
    functionName: "mint",
    args: [amount ? ethers.utils.parseEther(amount.toString()) : "0"],
  });

  // -> USE CONTRACT WRITE
  const { data: mintData, write: mint } = useContractWrite(config);

  // USE WAIT FOR TXN
  const { data: mintWaitData } = useWaitForTransaction({
    hash: mintData?.hash,

    onSuccess(result) {
      console.log("DATA: ", result);
      console.log("mintWaitData: ", mintWaitData);
    },

    onError(error) {
      console.log("Error: ", error);
    },
  });

  console.log("mintData: ", mintData);
  console.log("mintWaitData: ", mintWaitData);

  useEffect(() => {
    if (mintWaitData) {
      console.log("MINT WAIT DATA: ", mintWaitData);
    }
  }, [mintWaitData]);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    mint?.();
  }



  const [userBalance, setUserBalance] = useState("")

  const fetchBalance = async () => {

    try {

      const tokenContract: any = getTokenContract(false)

      const decimal = await tokenContract.decimals();
      const balance = await tokenContract.balanceOf(address);

      let bal_ = ethers.utils.formatUnits(balance, decimal)

      setUserBalance(bal_)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchBalance();
  }, [])

  return (
    <div>
      <div className="">YOUR BALANCE IS {userBalance}</div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <label className="block">Amount To Mint</label>
          <input
            type={"text"}
            placeholder="AMount"
            className="p-3 border border-blue-300"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="py-3 px-8 bg-green-600 border border-green-100 font-semibold"
        >
          Mint
        </button>
      </form>
    </div>
  );
};

export default MintToken;
