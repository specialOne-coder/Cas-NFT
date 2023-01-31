import { MdSell } from "react-icons/md";
import hlogo from "../assets/ethereum.png";
import { FormatIPFS } from "../utils/formatIPFS";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { FaVoteYea } from "react-icons/fa";
import { shortenAddress } from "../utils/ShortAdress";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const convertTim = (currentTimestamp) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(currentTimestamp);

const NFTCard = ({ nft }) => {
  const { currentAccount } = useContext(AppContext);

  console.log({ nft });
  let imge = FormatIPFS(nft.image);
  return (
    <div>
      <main className="flex h-screen bg-vdbmain justify-center items-start">
        <section class="w-80 rounded-3xl p-6 pb-7 space-y-1 px-4 md:p-5 ml-4  eth-card">
          <div className="relative group rounded-xl overflow-hidden">
            {<img src={imge} alt="" />}
          </div>
          <h1 class="font-outfit font-semibold text-white text-2xl cursor-pointer hover:text-femcyan">
            {nft.name}
          </h1>
          <h2 class="font-outfit font-normal text-femsoftblue">
            {nft.description}
          </h2>
          <div className="flex font-outfit font-light justify-between">
            <div className="flex space-x-2 items-center text-femcyan">
              {/* icon ethereum */}
              <svg width="11" height="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 10.216 5.5 18 0 10.216l5.5 3.263 5.5-3.262ZM5.5 0l5.496 9.169L5.5 12.43 0 9.17 5.5 0Z"
                  fill="#4285F4"
                />
              </svg>
              <div className="font-bold">0.00 ETH</div>
            </div>
            <div className="flex space-x-2 items-center text-femsoftblue">
              <div>{shortenAddress(currentAccount)}</div>
            </div>
          </div>

          <hr className="border border-vdbline " />
          <a
            href={`https://testnets.opensea.io/assets/goerli/0xe38c569404181cdc7706fd33b4b44abffffb3207/${nft.edition}`}
            target="blank"
          >
            <div className="flex items-center space-x-3 text-femsoftblue mt-1.5">
              <button className="flex flex-row justify-center bg-[#2952e3] p-2 rounded-lg cursor-pointer hover:bg-[#2546bd] sp">
                <MdSell fontSize={25} className="text-white mr-2" />
                <p className="text-white text-base font-semibold">
                  List on opensea
                </p>
              </button>
            </div>
          </a>
        </section>
      </main>
    </div>
  );
};

export default NFTCard;
