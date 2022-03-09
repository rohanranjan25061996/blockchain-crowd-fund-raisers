const {ethers} = require("hardhat")

// contract address 0xe449fe47726688C2081CE0cfd569B7Cedeb277d0

const main = async () => {

    const crowdFundRaiser = await ethers.getContractFactory("CrowdFunding");
    const crowdFundRaiserWallet = await crowdFundRaiser.deploy("Save & Help");

    await crowdFundRaiserWallet.deployed()
    console.log("crowdFundRaiser contract deployed successfully !", crowdFundRaiserWallet.address);
}

main().
then(() => process.exit(0))
.catch((error) => {
    console.log("Error in Main Function", error)
    process.exit(1);
})