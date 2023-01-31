module.exports = async function (taskArgs, hre) {
  const allowlistedAddresses = [
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    // "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    // "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    // "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    // "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
  ];

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log(signer.address);
  const CasNFT = await ethers.getContract("CasNFT");

  for (let i = 0; i < allowlistedAddresses.length; i++) {
    let message = allowlistedAddresses[i];
    // Compute hash of the address
    let messageHash = ethers.utils.id(message);
    console.log("Message Hash: ", messageHash);

    // Sign the hashed address
    let messageBytes = ethers.utils.arrayify(messageHash);
    let signature = await signer.signMessage(messageBytes);
    console.log("Signature: ", signature);

    console.log(`[source] Contract.address: ${CasNFT.address}`);
    let recover = await CasNFT.recoverSigner(messageHash, signature);
    console.log("Message was signed by: ", recover.toString());
  }
};
