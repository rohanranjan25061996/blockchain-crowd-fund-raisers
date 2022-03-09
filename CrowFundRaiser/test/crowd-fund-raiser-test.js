const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
    let wallet;
    it("Should return Save & Help string, not expect error", async function () {
      const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
      wallet = await CrowdFunding.deploy("Save & Help");
      await wallet.deployed();
  
      expect(await wallet.CrowdFundRaiserName()).to.equal("Save & Help");
    });
    it("with empty string, expecting error, expect error", async function () {
      try {
        const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
        wallet = await CrowdFunding.deploy("");
        await wallet.deployed();
      } catch (error) {
        console.log("error1")
      }

    });
    it("add fundraiser, with blank time value, expect error", async function () {
      try {
        await wallet.addFundraiser("", 10, 0, ['111','111','111','111'], "abc", false, 
        "0xF8860080a2a7e4Fbfa28Be1364740981309f3bF0", "xuuxuxuuxuux")
      } catch (error) {
        console.log("error2")
      }

    });
    it("add fundraiser, with 0 total money value, expect error", async function () {
      try {
        await wallet.addFundraiser("12345678", 0, 0, ['111','111','111','111'], "abc", false, 
        "0xF8860080a2a7e4Fbfa28Be1364740981309f3bF0", "xuuxuxuuxuux")
      } catch (error) {
        console.log("error3")
      }

    });
    it("add fundraiser, with passing less than 4 images hash, expect error", async function () {
      try {
        await wallet.addFundraiser("12345678", 10, 0, ['111','111','111'], "abc", false, 
        "0xF8860080a2a7e4Fbfa28Be1364740981309f3bF0", "xuuxuxuuxuux")
      } catch (error) {
        console.log("error4")
      }

    });
    it("add fundraiser, with title with blank, expect error", async function () {
      try {
        await wallet.addFundraiser("12345678", 10, 0, ['111','111','111','111'], "", false, 
        "0xF8860080a2a7e4Fbfa28Be1364740981309f3bF0", "xuuxuxuuxuux")
      } catch (error) {
        console.log("error5")
      }

    });
    it("add fundraiser, with null payee address, expect error", async function () {
      try {
        await wallet.addFundraiser("12345678", 10, 0, ['111','111','111','111'], "abc", false, 
        "0x0000000000000000000000000000000000000000", "xuuxuxuuxuux")
      } catch (error) {
        console.log("error6")
      }

    });
    it("add fundraiser, passing file url hash as a blank, expect error", async function () {
      try {
        await wallet.addFundraiser("12345678", 10, 0, ['111','111','111','111'], "abc", false, 
        "0xF8860080a2a7e4Fbfa28Be1364740981309f3bF0", "")
      } catch (error) {
        console.log("error7")
      }

    });
    it("add fundraiser, all correct data, not expect error", async function () {
      try {
        await wallet.addFundraiser("12345678", 10, 0, ['111','111','111','111'], "abc", false, 
        "0xF8860080a2a7e4Fbfa28Be1364740981309f3bF0", "xxxxxx")
      } catch (error) {
        console.log("error8")
      }

    });
    it("add getSingleFundRaiser, with wrong id, expect error", async function () {
      try {
        await wallet.getSingleFundRaiser(2)
      } catch (error) {
        console.log("error9")
      }
    });
    it("add getSingleFundRaiser, passing right id, not expect error", async function () {
      try {
        await wallet.getSingleFundRaiser(1)
      } catch (error) {
        console.log("error10")
      }
    });
    it("add updateAbout, with wrong id, expect error", async function () {
      try {
        await wallet.updateAbout(2, "xxxxx")
      } catch (error) {
        console.log("error11")
      }
    });
    it("add updateAbout, with blank hash, expect error", async function () {
      try {
        await wallet.updateAbout(1, "")
      } catch (error) {
        console.log("error12")
      }
    });
    it("add updateMoney, with 0, expect error", async function () {
      try {
        await wallet.updateMoney(0, 1)
      } catch (error) {
        console.log("error13")
      }
    });
    it("add updateMoney, with wrong id , expect error", async function () {
      try {
        await wallet.updateMoney(1, 2)
      } catch (error) {
        console.log("error14")
      }
    });
    it("add updateMoney, with correct args , not expect error", async function () {
      try {
        await wallet.updateMoney(1, 1)
      } catch (error) {
        console.log("error15")
      }
    });
  });