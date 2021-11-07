const main = async () => {
    // owner is the wallet address of the contract owner.
    // randomPerson is a random wallet address.
    const [owner, randomPerson] = await hre.ethers.getSigners();

    // This will compile the contract and generate the necessary files
    // needed to work with the contract under the artifacts directory.
    // The Hardhat Runtime Environment, or HRE, 
    // is an object containing all the functionality that Hardhat exposes when running a task, test or script.
    // hre is provided automatically when running 'npx hardhat...'
    const waveContractFactory = await hre.ethers.getContractFactory(
        'WavePortal',
    );

    // Hardhat will create a local Ethereum network, but just for this contract.
    // Then, after the script completes it'll destroy that local network.
    const waveContract = await waveContractFactory.deploy();

    // Wait until the contract is deployed to the local blockchain.
    await waveContract.deployed();

    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveContract.wait();

    waveCount = await waveContract.getTotalWaves();
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();