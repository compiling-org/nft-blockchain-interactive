import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CrossChainDataBridge...");

  const Bridge = await ethers.getContractFactory("CrossChainDataBridge");
  const bridge = await Bridge.deploy();

  await bridge.waitForDeployment();

  console.log(`CrossChainDataBridge deployed to: ${await bridge.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
