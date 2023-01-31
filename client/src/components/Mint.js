import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Loader from './Loader'
import { chainlist } from '../utils/chain-contants'
import { FaConnectdevelop } from 'react-icons/fa'

const Mint = () => {
  const {
    mintNFT,
    loading,
    currentAccount,
    connectWallet,
  } = useContext(AppContext)
  const [disable, setDisable] = useState(false)

  function mintNumber(event) {
    let value = event.target.value
    if (value > 5 ) {
      event.target.value = 5
    }
  }

  return (
    <div className="mint flex w-full justify-center items-center mb-[14rem] mt-20 flex-wrap">
      {currentAccount ? (
        <div className="bg-transparent border-4 border-blue-600 h-[26rem] w-[36rem] rounded-3xl pt-2.5 pl-3 pr-3">
          <span className="flex justify-center text-xl text-white font-bold">
            Mint
          </span>
          <div className="border-b-2 border-blue-600 mt-1"></div>
          <div className="flex flex-col justify-center items-center w-full">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-bold text-white mt-[2rem]"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1"
                placeholder="0"
                min="1"
                required
                onChange={mintNumber}
              />
              <button
                type="submit"
                className="text-white w-[15rem] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                onClick={async () => {
                  const number = document.getElementById('quantity').value

                  // await verifyNetwork(
                  //   chainlist[0].chainid,
                  //   chainlist[0].chain_name,
                  //   chainlist[0].rpc,
                  // )
                  await mintNFT(
                    chainlist[0].address,
                    chainlist[0].abi,
                    number,
                    chainlist[0].explorer,
                  )
                }}
              >
                {loading ? <Loader taille={5} /> : `Mint`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={connectWallet}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-lg cursor-pointer hover:bg-[#2546bd]"
        >
          <FaConnectdevelop fontSize={25} className="text-white mr-0" />
          <p className="text-white mx-2">Connect Wallet before mint</p>
        </button>
      )}
    </div>
  )
}

export default Mint
