import { expect } from "chai";
import { ethers } from "hardhat";
import { CrossChainDataBridge } from "../typechain-types";

describe("CrossChainDataBridge", function () {
  let bridge: CrossChainDataBridge;

  beforeEach(async function () {
    const Bridge = await ethers.getContractFactory("CrossChainDataBridge");
    bridge = await Bridge.deploy();
    await bridge.waitForDeployment();
  });

  it("Should deploy successfully", async function () {
    expect(await bridge.getAddress()).to.be.properAddress;
  });

  it("Should create a data stream", async function () {
    const streamId = "stream-1";
    const source = "near";
    const target = "filecoin";
    const ipfsHash = "QmTest";
    const encryptedData = "0x1234";
    const epoch = 100;

    await expect(bridge.createDataStream(streamId, source, target, ipfsHash, encryptedData, epoch))
      .to.emit(bridge, "StreamCreated")
      .withArgs(streamId, await ethers.provider.getSigner(0).then(s => s.getAddress()), source, target, ipfsHash, await ethers.provider.getBlock("latest").then(b => b?.timestamp));
      
    const stream = await bridge.getStreamData(streamId);
    expect(stream.sourceChain).to.equal(source);
    expect(stream.targetChain).to.equal(target);
    expect(stream.active).to.be.true;
  });

  it("Should prevent duplicate stream IDs", async function () {
    const streamId = "stream-duplicate";
    const source = "near";
    const target = "filecoin";
    const ipfsHash = "QmTest";
    const encryptedData = "0x1234";
    const epoch = 100;

    await bridge.createDataStream(streamId, source, target, ipfsHash, encryptedData, epoch);

    await expect(bridge.createDataStream(streamId, source, target, ipfsHash, encryptedData, epoch))
      .to.be.revertedWith("Stream ID already exists");
  });

  it("Should process AI data packets", async function () {
    // Create stream first
    const streamId = "stream-ai";
    await bridge.createDataStream(streamId, "near", "filecoin", "QmTest", "0x", 100);

    const packetId = "packet-1";
    const dataType = "inference";
    const aiData = ethers.toUtf8Bytes("result:0.95");
    const signature = "0x";
    const confidence = 95;
    const modelVersion = "v1.0";

    await expect(bridge.processAIData(packetId, streamId, dataType, aiData, signature, confidence, modelVersion))
      .to.emit(bridge, "AIDataProcessed");
      
    const packet = await bridge.getAIDataPacket(packetId);
    expect(packet.confidence).to.equal(confidence);
  });
});
