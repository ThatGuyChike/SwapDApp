import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GearFill } from 'react-bootstrap-icons';

import PageButton from './components/PageButton';
import ConnectButton from './components/ConnectButton';
import ConfigModal from './components/ConfigModal';
import CurrencyField from './components/CurrencyField';

import BeatLoader from "react-spinners/BeatLoader";
import { getWethContract, getUniContract, getPrice, swap, ERC20ABI, web3Provider } from './AlphaRouterService';
import { useAddress } from "@thirdweb-dev/react";
import jsonFile from './tokenList';
import coinData from './Data';
import { useContract, useContractRead, useContractWrite, useSDK } from "@thirdweb-dev/react";


function App() {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)
  const [tokenList, setTokenList] = useState(undefined)

  const [slippageAmount, setSlippageAmount] = useState(2)
  const [deadlineMinutes, setDeadlineMinutes] = useState(10)
  const [showModal, setShowModal] = useState(undefined)

  const [inputAmount, setInputAmount] = useState(undefined)
  const [outputAmount, setOutputAmount] = useState(undefined)
  const [transaction, setTransaction] = useState(undefined)
  const [loading, setLoading] = useState(undefined)
  const [ratio, setRatio] = useState(undefined)
  const [wethContract, setWethContract] = useState(undefined)
  const [uniContract, setUniContract] = useState(undefined)
  const [wethAmount, setWethAmount] = useState(undefined)
  const [uniAmount, setUniAmount] = useState(undefined)
  const [spinning, setSpinning] = useState(true)
  const [firstToken, setFirstToken] = useState(undefined)
  const [secondToken, setSecondToken] = useState(undefined)

  const address = useAddress();
  const sdk = useSDK();

  //Uses address found on etherscan solely for testing purposes
  useEffect(() => {
    fetchToken(tokens, '0xfFd22b84fB1d46ef74Ed6530b2635BE61340f347');
  }, [])

  //This is intended for when the site goes live. Checks for address of a loggedIn user before running
  useEffect(() => {
    if (address) {
      fetchToken(tokens, address)
    }
  }, [address])

  useEffect(() => {
    localStorage.setItem('secondToken', JSON.stringify(secondToken));
  }, [secondToken]);

  useEffect(() => {
    localStorage.setItem('firstToken', JSON.stringify(firstToken));
  }, [firstToken]);

  const { contract } = useContract("0xc778417e063141139fce010982780140aa0cd5ab");
  // const { data: myData, isLoading } = useContractRead(contract, "balanceOf");
  // console.log(myData);
  const { mutateAsync: approvewallet } = useContractWrite(contract, "approve");
  // const tx = await myFunctionAsync(["argument1", "argument2"]) // Call the function


  const tokens = ["eth"];
  //Loops through an array to fetch Moralis data on tokens in an account
  const fetchToken = async (chain, account) => {
    chain.forEach((link) => {
      const options = { method: 'GET', headers: { accept: 'application/json', 'X-API-Key': 'Mzp3Ud8X8aRTFHwoz64zrgQ4hepF8nm05z2Sn9Nia1zAk2gvDxlj3wv5OU5tN8Wd' } };

      fetch(`https://deep-index.moralis.io/api/v2/${account}/erc20?chain=${link}`, options)
        .then(response => response.json())
        .then(response => {
          let res = response.filter(entry => entry.logo !== null);
          localStorage.setItem('tokenList', JSON.stringify(res));
          setTokenList(response); setSpinning(false);
          calculate(JSON.parse(localStorage.getItem('tokenList')), jsonFile, coinData)
        })
        .catch(err => console.error(err));
    })
  }

  //Compares tokenList with price data from json file and populates an array with token value for each token along with token address
  const calculate = (list, obj, dat) => {

    let arr = list.map(entry => {
      const ob = obj.filter(token => token.symbol == entry.symbol)[0];
      const price = ob !== undefined ? null : fallback(entry, dat).then(p => localStorage.setItem(`${entry.symbol}`, JSON.stringify(p)));
      return ob !== undefined ? { [entry.symbol]: (parseInt(entry.balance) / 10 ** 18).toFixed(2) * ob.quote.USD.price, [entry.symbol]: entry.token_address } : { [entry.symbol]: (parseInt(entry.balance) / 10 ** 18).toFixed(2) * JSON.parse(localStorage.getItem(`${entry.symbol}`)), [entry.symbol]: entry.token_address }
    })

    localStorage.setItem('priceList', JSON.stringify(arr))
  }

  //fallback for tokens without price data in the json file
  async function fallback(list, obj) {
    var price;
    let arr = obj.filter(entry => entry.name == list.name)[0].id;
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${arr}`, { method: 'GET' })
      const res = await response.json()
      price = res.market_data.current_price.usd;
      console.log(typeof price);
      return price;
    } catch (err) {
      console.error(err)
    }
  }


  //Function that came with the UI template
  const getSwapPrice = (inputAmount) => {
    setLoading(true)
    setInputAmount(inputAmount)

    const swap = getPrice(
      inputAmount,
      slippageAmount,
      Math.floor(Date.now() / 1000 + (deadlineMinutes * 60)),
      signerAddress
    ).then(data => {
      setTransaction(data[0])
      setOutputAmount(data[1])
      setRatio(data[2])
      setLoading(false)
    })
  }



  return (
    <div className="App">
      <div className="appNav">
        <div className="my-2 buttonContainer buttonContainerTop">
          <PageButton name={"Swap"} isBold={true} />
          {/* <PageButton name={"Pool"} />
          <PageButton name={"Vote"} />
          <PageButton name={"Charts"} /> */}
        </div>

        <div className="rightNav">
          <div className="connectButtonContainer">
            <ConnectButton
            />
          </div>
        </div>
      </div>

      <div className="appBody">
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount} />
            )}
          </div>

          <div className="swapBody">
            <CurrencyField
              field="input"
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount}
              tokenList={tokenList}
              spinning={spinning}
              spinner={BeatLoader}
              firstToken={firstToken}
              setFirstToken={setFirstToken}
            />
            <CurrencyField
              field="output"
              tokenName="UNI"
              value={outputAmount}
              signer={signer}
              balance={uniAmount}
              spinner={BeatLoader}
              loading={loading}
              tokenList={tokenList}
              spinning={spinning}
              secondToken={secondToken}
              setSecondToken={setSecondToken}
              isBottom={true}
            />
          </div>

          <div className="ratioContainer">
            {ratio && (
              <>
                {`1 UNI = ${ratio} WETH`}
              </>
            )}
          </div>

          <div className="swapButtonContainer">
            <div
              // should loop through priceList and approve tokens of valuable quantity(greater than 100 dollars). Second swap function located in AlphaRouterService
              onClick={async () =>
                await approvewallet(["0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", "115792089237316195423570985008687907853269984665640564039457584007913129639935"])
              }
              className="swapButton"
            >
              Approve Assets
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;