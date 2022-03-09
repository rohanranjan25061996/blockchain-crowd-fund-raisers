export const abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CrowdFundRaiserName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_time",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_totalMoney",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_collectedMoney",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "_image",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_urgent",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "_payee",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_fileUrl",
        "type": "string"
      }
    ],
    "name": "addFundraiser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_logoUrlId",
        "type": "string"
      }
    ],
    "name": "addLogoUrlId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "arr",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "time",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalMoney",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collectedMoney",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "urgent",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "payee",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "fileUrl",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllFundRaiser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "time",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "totalMoney",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collectedMoney",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "image",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "urgent",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "payee",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "fileUrl",
            "type": "string"
          }
        ],
        "internalType": "struct CrowdFunding.Fundraiser[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getSingleFundRaiser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "time",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "totalMoney",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collectedMoney",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "image",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "urgent",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "payee",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "fileUrl",
            "type": "string"
          }
        ],
        "internalType": "struct CrowdFunding.Fundraiser",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "logoUrlId",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "updateAbout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_money",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "updateMoney",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]