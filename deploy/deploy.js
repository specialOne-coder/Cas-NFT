const { ethers, upgrades } = require("hardhat");

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log(`>>> your address: ${deployer}`)
    console.log(`On [${hre.network.name}] `)

    const casNFT = await deploy("CasNFT", { // Put your contract name here
        from: deployer,
        args: ["ipfs://QmQo7SkSkzHjypPuukFVfEaodSjcW5g44KmqD5EeUDk5uD/"],
        log: true,
        waitConfirmations: 1,
    })

    // const owner =  await casNFT.owner()
    // console.log(`[owner] Contract.address: ${owner}`);

    // const CasNFT = await ethers.getContractFactory("CasNFT");

    // const cn = await upgrades.deployProxy(CasNFT);
  
    // await cn.deployed();
    // console.log("CasNFT deployed to:", cn.address);

}

module.exports.tags = ["CasNFT"]; // Tags are used to filter tags
