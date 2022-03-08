
# Overview

## Save & Help
(https://blockchain-crowd-fund-raisers.netlify.app/)

Save & Help is a web application which is basically inspired with Ketto.org (https://www.ketto.org/)
As we know that there is so many people in this world who is suffering from different different
reason but the most common is full of hungry people and also people suffering from illness. So many NGO and individual people 
is working for helping them, this is just one step for those people who can help them 
with digital money like ethereum etc. This web application is deployed on ethereum test n/w
rinkeby.

# Technologies
Here is name of technologies is used to build Save & Help application.

#### Frontend
1. React Js
2. AntD (used for creating UI)

#### Backend
1. Solidity (v: 0.8.4) used for creating smart contract.

# Libraries
1. ethers
2. react-moralis
3. hardhat
4. axios
5. react-router
6. react-router-dom
7. infura (it is a webiste which provides the tools and infrastructure that allow developers to easily take their blockchain application from testing to scaled deployment  https://infura.io/)

# Specification & Features

### Steps..

1. In landing page of Save & Help, first we have to sign with wallet like metamask (metamask is blockchain wallet)
   when we successfully sign in with wallet, we will move to home page of application.
   Note: without sign in with wallet we will not able move to home page, for avoid such scenario
   you can add any wallet extension in your favourite browser.

2. When we are at home page of application, all created Fundraisers will appear, here you can donate any of the Fundraisers and there is also feature to create new Fundraisers, there is add button when you click on that and a modal will appear with form
   in form there is filed. When we filled all the info and hit the submit, all the images are upload in IPFS(InterPlanetary File System, more about (https://en.wikipedia.org/wiki/InterPlanetary_File_System) and for about section converting that one with .json file and also upload this one in IPFS and save that hash data of image and file in contract.
   There is option to donate, when we are clicking on that we are able to donate amount(ETH) to that particular Fundraisers. There is also timer which basically time for collect fund for that particular Fundraisers.
   There is option to see more details about Fundraisers and it will redirect you to detail page of Fundraisers, here you will able to see more details and also you can chat or comment on the same.

   In top (navbar) we are able to see option of sign off, on clicking that we are successfully sign off form application and again move to login page.

#### Important:
 At every transaction internaly we are calculating transaction fees and checking with current user
 balance is enough to make transaction or not. If current user doesn't have fund which required to do transaction, then user will get error.
 We are also showing total amount and collected amount in the form of indian rupess for better understanding for the user.

Also write unit test, which is covering all the valid and invalid scenario.

open for the suggestions..
#### -------------------------- Thank you so much --------------------------------------






