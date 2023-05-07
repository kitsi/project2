import { HelloWorld } from "../typechain-types";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("HelloWorld", () => {
  let helloWorldContract: HelloWorld;

  beforeEach(async () => {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
    helloWorldContract = await helloWorldFactory.deploy() as HelloWorld;
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-deployed
    await helloWorldContract.deployed();
  });
  it("Should give a Hello World", async () => {
    // const signers = await ethers.getSigners();
    // const balance = await signers[0].getBalance();
    // expect(balance).to.be.gt(0);
    // --------------------------
    // const lastBlock = await ethers.provider.getBlock("latest");
    // expect(lastBlock.number).to.be.eq(0);
    // --------------------------
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
    const helloWorldText = await helloWorldContract.helloWorld();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(helloWorldText).to.equal("Hello World!");
  });

  it("Should set owner to deployer account", async () => {
    const signers = await ethers.getSigners();
    const deployer = await signers[0].getAddress();
    const owner = await helloWorldContract.owner();
    expect(owner).to.eq(deployer);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-connect
    // https://docs.ethers.io/v5/api/contract/contract/#contract-functionsSend
    // https://hardhat.org/hardhat-chai-matchers/docs/overview#reverts
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should execute transferOwnership correctly", async () => {
    const signers = await ethers.getSigners();
    const newOwner = signers[1].address;
    await helloWorldContract
    .connect(signers[0])
    .transferOwnership(signers[1].address);
    const owner = await helloWorldContract.owner();
    expect(owner).to.eq(newOwner);
  });

  it("Should not allow anyone other than owner to change text", async function () {
    const accounts = await ethers.getSigners();
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .setText('Namaste!')
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should change text correctly", async function () {
    const signers = await ethers.getSigners();
    await helloWorldContract
    .connect(signers[0])
    .setText("Namaste!");
    const helloWorldText = await helloWorldContract.helloWorld();
    expect(helloWorldText).to.eq("Namaste!");
  });

});