import React, { useContext, useEffect, useState } from "react";
import { FaConnectdevelop, FaHammer } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { shortenAddress } from "../utils/ShortAdress";
import { getDatabase, ref, onValue, get, set, child } from "firebase/database";
import Loader from "./Loader";
import { chainlist } from "../utils/chain-contants";
import NFTCard from "./NFTCard";
import { FormatIPFS } from "../utils/formatIPFS";
import hl from "../assets/optimism.png";

const MyNFT = () => {
  const { tokenData, currentAccount, tokens, exist, connectWallet } =
    useContext(AppContext);
  //const [nfts, setNfts] = useState([]);

  useEffect(() => {
    console.log("okjklh");
    const interval = setInterval(async () => {
      await tokenData(chainlist[0].address, chainlist[0].abi);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-wrap justify-center">
      {currentAccount ? (
          <div className=" w-full text-white text-center py-3 font-bold">
            <p className=" text-4xl"> Your nfts</p>  <br></br> <br />
            {!exist ? (
              "Vous n'avez pas de nft"
            ) : (
              tokens.length == 0  ? (
                <Loader />
              ):(
              <div className="flex justify-center items-start ">
                {tokens.map((nft, i) => (
                  <NFTCard key={i} nft={nft} />
                ))}
              </div>
              )
            )}
        </div>
      ) : (
        <button
          type="button"
          onClick={connectWallet}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-lg cursor-pointer hover:bg-[#2546bd]"
        >
          <FaConnectdevelop fontSize={25} className="text-white mr-0" />
          <p className="text-white mx-2">Connect wallet to see your nfts</p>
        </button>
      )}
    </div>
  );
};

export default MyNFT;
