import React, { useContext, useEffect } from 'react'
import { FaConnectdevelop, FaHammer } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { shortenAddress } from '../utils/ShortAdress'
import { getDatabase, ref, onValue, get, set, child } from 'firebase/database'
import Loader from './Loader'
import { chainlist } from '../utils/chain-contants'

const Airdrop = () => {
  const {
    airdrop,
    writeUserNonce,
    loading,
    db,
    verifyNetwork,
    currentAccount,
    connectWallet,
  } = useContext(AppContext)

  // async function sendTx() {
  //   const unonces = ref(db, 'nonces')
  //   console.log('sendTx')
  //   get(unonces).then(async (snapshot) => {
  //     const data = snapshot.val()
  //     const userNonce = data.userNonce
  //     const nonce = data.nonce
  //     let txLength = userNonce - nonce
  //     for (let i = 0; i < txLength; i++) {
  //       console.log({ i: i, txLength: txLength })
  //       await airdrop(
  //         currentAccount,
  //         chainlist[0].address,
  //         chainlist[0].abi,
  //         chainlist[0].explorer,
  //       )
  //     }
  //   })
  // }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     sendTx()
  //     console.log('=> interval')
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <div className="welcome flex max-w-[1500px] m-auto justify-center items-center p-[100px] ">
      {currentAccount ? (
        <div className="welcome-div-text md:flex-[0.5] flex justify-center px-20 flex-wrap items-center self-center">
          <div className=" w-full text-white text-center text-4xl py-3 font-bold">
            Airdrop Test
          </div>
          <div className="welcome-button flex items-center cursor-pointer">
            <button
              type="button"
              onClick={async () => {
                //await writeUserNonce()
                await airdrop(
                  currentAccount,
                  chainlist[0].address,
                  chainlist[0].abi,
                  chainlist[0].explorer,
                )
              }}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-lg cursor-pointer hover:bg-[#2546bd]"
            >
              <FaHammer fontSize={25} className="text-white mr-0" />
              {loading ? (
                <Loader taille={5} />
              ) : (
                <p className="text-white ml-2">Airdrop </p>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={connectWallet}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-lg cursor-pointer hover:bg-[#2546bd]"
        >
          <FaConnectdevelop fontSize={25} className="text-white mr-0" />
          <p className="text-white mx-2">Connect wallet before airdrop</p>
        </button>
      )}
    </div>
  )
}

export default Airdrop
