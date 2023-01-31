import React, { useContext } from 'react'
import { FaConnectdevelop, FaHammer } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { shortenAddress } from '../utils/ShortAdress'

const Welcome = () => {
  const { currentAccount, connectWallet } = useContext(AppContext)

  return (
    <div className="welcome flex max-w-[1500px] m-auto justify-center items-center p-[100px] ">
      <div className="welcome-div-text md:flex-[0.5] flex justify-center px-20 flex-wrap items-center self-center">
        <div className=" w-full text-white text-center text-4xl py-3 font-bold">
          Cas NFT
        </div>
        <div className="welcome-button flex items-center cursor-pointer">
          {currentAccount ? (
            <button
              type="button"
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-lg cursor-pointer hover:bg-[#2546bd]"
            >
              <FaHammer fontSize={25} className="text-white mr-0" />
              <p className="text-white mx-2">
                <Link to="/mint"> Mint </Link>
              </p>
            </button>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-lg cursor-pointer hover:bg-[#2546bd]"
            >
              <FaConnectdevelop fontSize={25} className="text-white mr-0" />
              <p className="text-white mx-2">Connect Wallet</p>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Welcome
