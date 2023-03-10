import { ethers } from "ethers";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  erc20ABI,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { LOTTERY_CONTRACT, TOKEN_CONTRACT } from "../CA";
import { getLotteryContract, getTokenContract } from "../utils/tokenContract";

import Token_Abi from "../utils/token_abi.json";

const EnterLottery = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<string>("");
  const [userAllowance, setUserAllowance] = useState<string>("");




  async function checkAllowance() {

    try {

      const tokenContract: any = getTokenContract(false)
      const allowance = await tokenContract.allowance(address, LOTTERY_CONTRACT);
      const decimal = await tokenContract.decimals();
      let allawee = ethers.utils.formatUnits(allowance, decimal)
      setUserAllowance(allawee)
      console.log("ALLOWANCE: ", allawee)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkAllowance()
  }, [])


  async function handleApprove() {
    try {
      const tokenContract: any = getTokenContract(true)
      const txApproval = await tokenContract.approve(LOTTERY_CONTRACT, ethers.utils.parseEther(amount));

      const approval = await txApproval.wait()
      console.log("APPROVAL: ", approval)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    try {
      if (userAllowance >= amount) {
        const tokenContract: any = getLotteryContract(true)
        const txGamble = await tokenContract.enterLottery(ethers.utils.parseEther(amount));

        const gamble = await txGamble.wait()
        console.log("GAMBLE: ", gamble)
      } else {
        handleApprove()
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleWinner = async () => {
    try {

      const lotteryContract: any = getLotteryContract(true)
      const lottery = await lotteryContract.pickWinner();

      const gamble = await lottery.wait()

      if (gamble) {
        alert("SUCCESSFUL")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <label className="block">Amount</label>
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
          {Number(userAllowance) === 0 ? "Approve" : userAllowance >= amount ? "Gamble" : "Approve"}
        </button>
      </form>

      <div className="bg-red-500 inline mt-5">
        <button onClick={handleWinner} className="py-5 px-7" type="button">Pick Winner</button>
      </div>
    </div>
  );
};

export default EnterLottery;
