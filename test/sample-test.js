const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const fs = require("fs");
const basePath = process.cwd();

describe("TEST", function() {
  //merkle tree
  const buf2hex = x => "0x" + x.toString("hex");
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshopt in every test.
  async function deployKatsuraOjisanFixture() {
    // Get the ContractFactory and Signers here.
    const factory = await ethers.getContractFactory("KatsuraOjisan");
    const [
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5
    ] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const contract = await factory.deploy();

    await contract.deployed();

    // Fixtures can return anything you consider useful for your tests
    return {
      factory,
      contract,
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5
    };
  }

  async function deployKatsuraExtraFixture() {
    // Get the ContractFactory and Signers here.
    const factory = await ethers.getContractFactory("KatsuraOjisanExtra");
    const [
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5
    ] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const contract = await factory.deploy();

    await contract.deployed();

    // Fixtures can return anything you consider useful for your tests
    return {
      factory,
      contract,
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5
    };
  }

  async function deployConditionFixture() {
    // Get the ContractFactory and Signers here.
    const factory = await ethers.getContractFactory(
      "KatsuraOjisanExtraCondition"
    );
    const [
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5
    ] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const contract = await factory.deploy();

    await contract.deployed();

    // Fixtures can return anything you consider useful for your tests
    return {
      factory,
      contract,
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5
    };
  }

  async function conditionAndMainFixture() {
    let conditionObj = {};
    let mainObj = {};
    {
      const factory = await ethers.getContractFactory("KatsuraOjisan");
      const [
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      ] = await ethers.getSigners();

      const contract = await factory.deploy();

      await contract.deployed();

      mainObj = {
        ...mainObj,
        factory,
        contract,
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      };
    }

    {
      const factory = await ethers.getContractFactory(
        "KatsuraOjisanExtraCondition"
      );
      const [
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      ] = await ethers.getSigners();

      const contract = await factory.deploy();

      await contract.deployed();

      conditionObj = {
        ...conditionObj,
        factory,
        contract,
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      };
    }

    return {
      mainObj,
      conditionObj
    };
  }

  async function allContractFixture() {
    let conditionObj = {};
    let mainObj = {};
    let extraObj = {};
    {
      const factory = await ethers.getContractFactory("KatsuraOjisan");
      const [
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      ] = await ethers.getSigners();

      const contract = await factory.deploy();

      await contract.deployed();

      mainObj = {
        ...mainObj,
        factory,
        contract,
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      };
    }

    {
      const factory = await ethers.getContractFactory(
        "KatsuraOjisanExtraCondition"
      );
      const [
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      ] = await ethers.getSigners();

      const contract = await factory.deploy();

      await contract.deployed();

      conditionObj = {
        ...conditionObj,
        factory,
        contract,
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      };
    }

    {
      const factory = await ethers.getContractFactory("KatsuraOjisanExtra");
      const [
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      ] = await ethers.getSigners();

      const contract = await factory.deploy();

      await contract.deployed();

      extraObj = {
        ...extraObj,
        factory,
        contract,
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      };
    }

    return {
      mainObj,
      conditionObj,
      extraObj
    };
  }

  describe("KatsuraOjisanExtraCondition contract", function() {
    it("Should set the right owner", async function() {
      const contractObj = await loadFixture(deployConditionFixture);
      expect(await contractObj.contract.owner()).to.equal(
        contractObj.owner.address
      );
    });

    it("Set Contract not owner", async function() {
      const { mainObj, conditionObj } = await loadFixture(conditionAndMainFixture);
      await expect(conditionObj.contract.connect(conditionObj.addr1).SetContract(mainObj.contract.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Set Contract", async function() {
      const { mainObj, conditionObj } = await loadFixture(conditionAndMainFixture);
      await conditionObj.contract.SetContract(mainObj.contract.address);
      expect(await conditionObj.contract.katsuraOjisanContract()).to.equal(
        mainObj.contract.address
      );
    });

    it("Event Condition false", async function() {
      const { mainObj, conditionObj } = await loadFixture(
        conditionAndMainFixture
      );
      await conditionObj.contract.SetContract(mainObj.contract.address);
      expect(
        await conditionObj.contract.EventCondition(mainObj.addr1.address)
      ).to.equal(false);
    });

    it("Event Condition true", async function() {
      const { mainObj, conditionObj } = await loadFixture(
        conditionAndMainFixture
      );
      await conditionObj.contract.SetContract(mainObj.contract.address);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      expect(
        await conditionObj.contract.EventCondition(mainObj.addr1.address)
      ).to.equal(true);
    });
  });

  describe("KatsuraOjisanExtra contract", function() {
    it("Should set the right owner", async function() {
      const contractObj = await loadFixture(deployKatsuraExtraFixture);
      expect(await contractObj.contract.owner()).to.equal(
        contractObj.owner.address
      );
    });

    it("AddCollection not owner", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 10,
        supply: 0,
        maxMintsPerAddress: 10,
        isActive: false,
        isSame: false,
        isRandom: true,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await expect(extraObj.contract.connect(extraObj.addr1).AddCollection(eventId,1,5)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("AddCollection success", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 10,
        supply: 0,
        maxMintsPerAddress: 10,
        isActive: false,
        isSame: false,
        isRandom: true,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,1,5);
      for(let i=0;i<5;i++)
      {
        expect(await extraObj.contract.collections(eventId,i)).to.equal(1);
      }
    });

    it("Remove Collection not owner", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 10,
        supply: 0,
        maxMintsPerAddress: 10,
        isActive: false,
        isSame: false,
        isRandom: true,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await expect(extraObj.contract.connect(extraObj.addr1).RemoveCollection(eventId)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Remove Collection", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 10,
        supply: 0,
        maxMintsPerAddress: 10,
        isActive: false,
        isSame: false,
        isRandom: true,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,1,5);
      await extraObj.contract.connect(extraObj.owner).RemoveCollection(eventId)
      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,2,5);
      for(let i=0;i<5;i++)
      {
        expect(await extraObj.contract.collections(eventId,i)).to.equal(2);
      }
    });

    it("Add Event not owner", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await expect(extraObj.contract
        .connect(extraObj.addr1)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        )).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Add Event", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      const data = await extraObj.contract.events(eventId);
      expect(data.maxSupply).to.equal(eventData.maxSupply);
      expect(data.maxMintsPerAddress).to.equal(eventData.maxMintsPerAddress);
      expect(data.isSame).to.equal(eventData.isSame);
      expect(data.uri).to.equal(eventData.uri);
      expect(data.conditionContract).to.equal(eventData.conditionContract);
    });

    it("Active Event not owner", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await expect(extraObj.contract.connect(extraObj.addr1).activeEvent(eventId, true)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Active Event true", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract.activeEvent(eventId, true);
      expect(
        await extraObj.contract.eventCheck(
          eventId,
          eventData.maxMintsPerAddress
        )
      ).to.equal(true);
    });

    it("Active Event false", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract.activeEvent(eventId, false);
      expect(
        await extraObj.contract.eventCheck(
          eventId,
          eventData.maxMintsPerAddress
        )
      ).to.equal(false);
    });

    it("Event check event not exist", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      expect(
        await extraObj.contract.eventCheck(
          eventId,
          eventData.maxMintsPerAddress
        )
      ).to.equal(false);
    });

    it("Event check active false", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventData = {
        eventId: 1,
        maxSupply: 50,
        maxMintsPerAddress: 1,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address,
        isSame: true,
        isRandom: false
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventData.eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      expect(
        await extraObj.contract.eventCheck(
          eventData.eventId,
          eventData.maxMintsPerAddress
        )
      ).to.equal(false);
    });

    it("Event check active true", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );

      expect(
        await extraObj.contract.eventCheck(
          eventId,
          eventData.maxMintsPerAddress
        )
      ).to.equal(false);
    });

    it("Event check maxSupply exceed", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 1,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      expect(
        await extraObj.contract.eventCheck(eventId, eventData.maxSupply + 1)
      ).to.equal(false);
    });

    it("Event check maxMintsPerAddress exceed", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      const eventId = 1;
      const eventData = {
        maxSupply: 1,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      expect(
        await extraObj.contract.eventCheck(
          eventId,
          eventData.maxMintsPerAddress + 1
        )
      ).to.equal(false);
    });

    it("Condition Check true", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      expect(
        await extraObj.contract.conditionCheck(eventId, mainObj.addr1.address)
      ).to.equal(true);
    });

    it("Condition Check false", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      expect(
        await extraObj.contract.conditionCheck(eventId, mainObj.addr1.address)
      ).to.equal(false);
    });

    it("Check balance 0", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      expect(
        await extraObj.contract.getEventBalance(eventId, mainObj.addr1.address)
      ).to.equal(0);
    });

    it("Check balance 1", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      expect(
        await extraObj.contract.getEventBalance(eventId, mainObj.addr1.address)
      ).to.equal(1);
    });

    it("mint event inactive", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      // await extraObj.contract.connect(extraObj.owner).activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await expect(
        extraObj.contract
          .connect(mainObj.addr1)
          .mintKatsuraOjisanExtra(eventId, 1)
      ).to.be.revertedWith("Event check failed");
    });

    it("mint maxsupply exceed", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 1,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr2.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      await expect(
        extraObj.contract
          .connect(mainObj.addr2)
          .mintKatsuraOjisanExtra(eventId, 1)
      ).to.be.revertedWith("Event check failed");
    });

    it("mint maxMintsPerAddress exceed", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      await expect(
        extraObj.contract
          .connect(mainObj.addr1)
          .mintKatsuraOjisanExtra(eventId, 1)
      ).to.be.revertedWith("Event check failed");
    });

    it("mint condition fail", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await expect(
        extraObj.contract
          .connect(mainObj.addr1)
          .mintKatsuraOjisanExtra(eventId, 1)
      ).to.be.revertedWith("Condition check failed");
    });

    it("mint not random success", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      expect(await extraObj.contract.ownerOf(1)).to.equal(
        mainObj.addr1.address
      );
    });

    it("mint random success", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 10,
        supply: 0,
        maxMintsPerAddress: 10,
        isActive: false,
        isSame: false,
        isRandom: true,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };

      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,1,5);
      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,2,5);
      
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);

      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);

      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);

      expect(await extraObj.contract.ownerOf(1)).to.equal(
        mainObj.addr1.address
      );

      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 5);

      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 4);
      
      const balance = await extraObj.contract.balanceOf(mainObj.addr1.address);
      expect(balance).to.equal(eventData.maxSupply);
      let listRealToken = [];
      for(let i=0;i<balance;i++)
      {
        const token = await extraObj.contract.tokenOfOwnerByIndex(mainObj.addr1.address, i);
        const realToken = await extraObj.contract.realTokens(token);
        listRealToken.push(realToken);
        expect(await extraObj.contract.ownerOf(token)).to.equal(
          mainObj.addr1.address
        );
      }
      let type1Count = 0;
      let type2Count = 0;
      for(let i=0;i<listRealToken.length;i++)
      {
        if(listRealToken[i] == 1)
        {
          type1Count++;
        }

         if(listRealToken[i] == 2)
        {
          type2Count++;
        }
      }
      expect(type1Count).to.equal(5);
      expect(type2Count).to.equal(5);
      
    });

    it("tokenURI shared", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: true,
        isRandom: false,
        uri: "ipfsuri",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      expect(await extraObj.contract.tokenURI(1)).to.equal(eventData.uri);
    });

    it("tokenURI not shared", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 50,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: false,
        isRandom: false,
        uri: "ipfs://pfsuri/",
        conditionContract: conditionObj.contract.address
      };
      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      expect(await extraObj.contract.tokenURI(1)).to.equal(
        eventData.uri.concat("1.json")
      );
    });
    
    it("tokenURI random", async function() {
      const { mainObj, conditionObj, extraObj } = await loadFixture(
        allContractFixture
      );
      await conditionObj.contract
        .connect(conditionObj.owner)
        .SetContract(mainObj.contract.address);
      const eventId = 1;
      const eventData = {
        maxSupply: 10,
        supply: 0,
        maxMintsPerAddress: 1,
        isActive: false,
        isSame: false,
        isRandom: true,
        uri: "ipfs://pfsuri/",
        conditionContract: conditionObj.contract.address
      };

      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,1,5);
      await extraObj.contract.connect(extraObj.owner).AddCollection(eventId,2,5);


      await extraObj.contract
        .connect(extraObj.owner)
        .addEvent(
          eventId,
          eventData.maxSupply,
          eventData.maxMintsPerAddress,
          eventData.uri,
          eventData.conditionContract,
          eventData.isSame,
          eventData.isRandom
        );
      await extraObj.contract
        .connect(extraObj.owner)
        .activeEvent(eventId, true);
      await mainObj.contract
        .connect(mainObj.owner)
        .ownerMint(1, mainObj.addr1.address);
      await extraObj.contract
        .connect(mainObj.addr1)
        .mintKatsuraOjisanExtra(eventId, 1);
      
      const realToken = await extraObj.contract.realTokens(1);
      expect(await extraObj.contract.tokenURI(1)).to.equal(
        eventData.uri.concat(realToken, ".json")
      );
    });

  });

  // describe("KatsuraOjisan contract", function() {
  //   describe("Deployment", function() {
  //     // `it` is another Mocha function. This is the one you use to define each
  //     // of your tests. It receives the test name, and a callback function.
  //     //
  //     // If the callback function is async, Mocha will `await` it.
  //     it("Should set the right owner", async function() {
  //       // We use loadFixture to setup our environment, and then assert that
  //       // things went well
  //       const { katsuraContract, owner } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );

  //       // `expect` receives a value and wraps it in an assertion object. These
  //       // objects have a lot of utility methods to assert values.

  //       // This test expects the owner variable stored in the contract to be
  //       // equal to our Signer's owner.
  //       expect(await katsuraContract.owner()).to.equal(owner.address);
  //     });
  //   });

  //   describe("Functions", function() {
  //     it("setPublicSale", async function() {
  //       const { katsuraContract, owner } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       await katsuraContract.connect(owner).setPublicSale(true);
  //       expect(await katsuraContract.isPublicSale()).to.equal(true);
  //       await katsuraContract.connect(owner).setPublicSale(false);
  //       expect(await katsuraContract.isPublicSale()).to.equal(false);
  //     });

  //     it("setWhitelistSale", async function() {
  //       const { katsuraContract, owner } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       await katsuraContract.connect(owner).setWhitelistSale(true);
  //       expect(await katsuraContract.isWhitelistSale()).to.equal(true);
  //       await katsuraContract.connect(owner).setWhitelistSale(false);
  //       expect(await katsuraContract.isWhitelistSale()).to.equal(false);
  //     });

  //     it("setMerkleRoot", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       const leaves = [addr1.address, addr2.address, addr3.address].map(x =>
  //         keccak256(x)
  //       );
  //       const tree = new MerkleTree(leaves, keccak256);
  //       const merkleRoot = tree.getRoot();
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       expect(await katsuraContract.merkleRoot()).to.equal(
  //         `0x${merkleRoot.toString("hex")}`
  //       );
  //     });

  //     it("isWhitelisted", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3,
  //         addr4
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       let leaves = [addr2.address, addr3.address, addr4.address].map(x =>
  //         keccak256(x)
  //       );
  //       let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  //       let merkleRoot = tree.getRoot();
  //       const leaf = keccak256(addr1.address);
  //       let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       expect(
  //         await katsuraContract.isWhitelisted(addr1.address, proof)
  //       ).to.equal(false);

  //       leaves = [
  //         addr1.address,
  //         addr2.address,
  //         addr3.address,
  //         addr4.address
  //       ].map(x => keccak256(x));
  //       tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       merkleRoot = tree.getRoot();
  //       proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       expect(
  //         await katsuraContract.isWhitelisted(addr1.address, proof)
  //       ).to.equal(true);
  //     });

  //     it("revealNFT", async function() {
  //       const { katsuraContract, owner } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       await katsuraContract.connect(owner).revealNFT();
  //       expect(await katsuraContract.revealed()).to.equal(true);
  //     });

  //     it("ownerMint success", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       const mintAmount = 2;
  //       await katsuraContract
  //         .connect(owner)
  //         .ownerMint(mintAmount, addr1.address);
  //       for (let i = 1; i <= mintAmount; i++) {
  //         expect(await katsuraContract.ownerOf(i)).to.equal(addr1.address);
  //       }
  //     });

  //     it("ownerMint invalid amount", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       let mintAmount = 0;
  //       await expect(
  //         katsuraContract.connect(owner).ownerMint(mintAmount, addr1.address)
  //       ).to.be.revertedWith("invalid amount");
  //       mintAmount = 6;
  //       await expect(
  //         katsuraContract.connect(owner).ownerMint(mintAmount, addr1.address)
  //       ).to.be.revertedWith("invalid amount");
  //     });

  //     it("whitelistMint not live", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       let leaves = [addr1.address, addr2.address, addr3.address].map(x =>
  //         keccak256(x)
  //       );
  //       let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       let merkleRoot = tree.getRoot();
  //       const leaf = keccak256(addr1.address);
  //       let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       let mintAmount = 2;
  //       await expect(
  //         katsuraContract.connect(addr1).publicSaleMint(mintAmount)
  //       ).to.be.revertedWith("not live");
  //     });

  //     it("whitelistMint invalid amount", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       let leaves = [addr1.address, addr2.address, addr3.address].map(x =>
  //         keccak256(x)
  //       );
  //       let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       let merkleRoot = tree.getRoot();
  //       const leaf = keccak256(addr1.address);
  //       let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       let mintAmount = 0;
  //       await expect(
  //         katsuraContract.connect(addr1).whitelistMint(mintAmount, proof)
  //       ).to.be.revertedWith("invalid amount");
  //       mintAmount = 6;
  //       await expect(
  //         katsuraContract.connect(addr1).whitelistMint(mintAmount, proof)
  //       ).to.be.revertedWith("invalid amount");
  //     });

  //     it("whitelistMint Not in whitelist", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3,
  //         addr4
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       let leaves = [addr2.address, addr3.address, addr4.address].map(x =>
  //         keccak256(x)
  //       );
  //       let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       let merkleRoot = tree.getRoot();
  //       const leaf = keccak256(addr1.address);
  //       let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setWhitelistSale(true);
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       let mintAmount = 2;
  //       await expect(
  //         katsuraContract.connect(addr1).whitelistMint(mintAmount, proof)
  //       ).to.be.revertedWith("Not in whitelist");
  //     });

  //     it("whitelistMint success", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       const mintAmount = 2;
  //       let leaves = [addr1.address, addr2.address, addr3.address].map(x =>
  //         keccak256(x)
  //       );
  //       let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       let merkleRoot = tree.getRoot();
  //       const leaf = keccak256(addr1.address);
  //       let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setWhitelistSale(true);
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       await katsuraContract.connect(addr1).whitelistMint(mintAmount, proof);
  //       for (let i = 1; i <= mintAmount; i++) {
  //         expect(await katsuraContract.ownerOf(i)).to.equal(addr1.address);
  //       }
  //     });

  //     it("whitelistMint limit exceeded", async function() {
  //       const {
  //         katsuraContract,
  //         owner,
  //         addr1,
  //         addr2,
  //         addr3
  //       } = await loadFixture(deployKatsuraOjisanFixture);
  //       let mintAmount = 2;
  //       let leaves = [addr1.address, addr2.address, addr3.address].map(x =>
  //         keccak256(x)
  //       );
  //       let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       let merkleRoot = tree.getRoot();
  //       const leaf = keccak256(addr1.address);
  //       let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  //       await katsuraContract.connect(owner).setWhitelistSale(true);
  //       await katsuraContract.connect(owner).setMerkleRoot(merkleRoot);
  //       await katsuraContract.connect(addr1).whitelistMint(mintAmount, proof);
  //       for (let i = 1; i <= mintAmount; i++) {
  //         expect(await katsuraContract.ownerOf(i)).to.equal(addr1.address);
  //       }

  //       mintAmount = 5;
  //       await expect(
  //         katsuraContract.connect(addr1).whitelistMint(mintAmount, proof)
  //       ).to.be.revertedWith("limit exceeded");
  //     });

  //     it("publicSaleMint invalid amount", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       let mintAmount = 0;
  //       await expect(
  //         katsuraContract.connect(addr1).publicSaleMint(mintAmount)
  //       ).to.be.revertedWith("invalid amount");
  //       mintAmount = 6;
  //       await expect(
  //         katsuraContract.connect(addr1).publicSaleMint(mintAmount)
  //       ).to.be.revertedWith("invalid amount");
  //     });

  //     it("publicSaleMint not live", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       let mintAmount = 2;
  //       await expect(
  //         katsuraContract.connect(addr1).publicSaleMint(mintAmount)
  //       ).to.be.revertedWith("not live");
  //     });

  //     it("publicSaleMint success", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       await katsuraContract.connect(owner).setPublicSale(true);
  //       let mintAmount = 2;
  //       await katsuraContract.connect(addr1).publicSaleMint(mintAmount);
  //       for (let i = 1; i <= mintAmount; i++) {
  //         expect(await katsuraContract.ownerOf(i)).to.equal(addr1.address);
  //       }
  //     });

  //     it("publicSaleMint limit exceeded", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       await katsuraContract.connect(owner).setPublicSale(true);
  //       let mintAmount = 2;
  //       await katsuraContract.connect(addr1).publicSaleMint(mintAmount);
  //       for (let i = 1; i <= mintAmount; i++) {
  //         expect(await katsuraContract.ownerOf(i)).to.equal(addr1.address);
  //       }

  //       mintAmount = 5;
  //       await expect(
  //         katsuraContract.connect(addr1).publicSaleMint(mintAmount)
  //       ).to.be.revertedWith("limit exceeded");
  //     });

  //     it("setRevealURI", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       const uri = "";
  //       await katsuraContract.connect(owner).setRevealURI(uri);
  //       expect(await katsuraContract.revealURI()).to.equal(uri);
  //     });

  //     it("setNotRevealURI", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       const uri = "";
  //       await katsuraContract.connect(owner).setNotRevealURI(uri);
  //       expect(await katsuraContract.notRevealURI()).to.equal(uri);
  //     });

  //     it("tokenURI not reveal", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );

  //       const sampleEncode =
  //         "eyJuYW1lIjoiS2F0c3VyYSBPamlzYW4gIzEiLCAiZGVzY3JpcHRpb24iOiJLYXRzdXJhIE9qaXNhbiAjMSIsICJpbWFnZSI6ICJpcGZzOi8vUW1lbXpCZWF0Rm94Rjl4WXRwejc0Zko5bVZyWjRQQWtHMUIzdDZHMWl0dnBnaSJ9";
  //       await katsuraContract.connect(owner).setPublicSale(true);
  //       let mintAmount = 1;
  //       await katsuraContract.connect(addr1).publicSaleMint(mintAmount);
  //       let tokenURIEncode = await katsuraContract.tokenURI(1);
  //       tokenURIEncode = tokenURIEncode.replace(
  //         "data:application/json;base64,",
  //         ""
  //       );
  //       expect(tokenURIEncode).to.equal(sampleEncode);
  //     });

  //     it("tokenURI revealed", async function() {
  //       const { katsuraContract, owner, addr1 } = await loadFixture(
  //         deployKatsuraOjisanFixture
  //       );
  //       const sample =
  //         "ipfs://QmQipCcSzP7QRxow5ueKdWw95dJgFxVe1SYQ4PL1tQyWQ4/1.json";
  //       await katsuraContract.connect(owner).setPublicSale(true);
  //       let mintAmount = 1;
  //       await katsuraContract.connect(addr1).publicSaleMint(mintAmount);
  //       await katsuraContract
  //         .connect(owner)
  //         .setRevealURI(
  //           "ipfs://QmQipCcSzP7QRxow5ueKdWw95dJgFxVe1SYQ4PL1tQyWQ4/"
  //         );
  //       await katsuraContract.connect(owner).revealNFT();
  //       let tokenUri = await katsuraContract.tokenURI(1);
  //       expect(tokenUri).to.equal(sample);
  //     });

  //   });
  // });
});
