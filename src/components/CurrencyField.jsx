import React,{ useState,useEffect } from 'react';
import TokenDropdown from './TokenDropdown';
import { GetFirstToken } from '../TokenSelectService';
import { GetSecondToken } from '../TokenSelectService';

const CurrencyField = props => {
  const getPrice = (value) => {
    props.getSwapPrice(value)
  }

  // console.log(props.tokenList);

  //const filterList = props.tokenList.filter(token => token.logo.length > 0);
  //const isBottom = props.value !== undefined;

  const [token1, setToken1] = useState(undefined)
  const [token2, setToken2] = useState(undefined)

  useEffect(() => {
    const token1 = GetFirstToken() ? GetFirstToken() : "";
    const token2 = GetSecondToken() ? GetSecondToken() : "";

    setToken1(token1)
    setToken2(token2)

  }, [])

  function normalize(num) {
    return num ? (parseInt(num)/10**18).toFixed(2) : 0
  }

  

  return (
    <div className="row currencyInput">
      <div className="col-md-6 numberContainer">
        {props.loading ? (
          <div className="spinnerContainer">
            <props.spinner />
          </div>
        ) : (
          <input
            className="currencyInputField"
            placeholder="0.0"
            value={props.value}
            onBlur={e => (props.field === 'input' ? getPrice(e.target.value) : null)}
          />
        )}
      </div>
      <div className="col-md-6 tokenContainer">
          <span className="tokenName">{props.spinning ? <div className="spinnerContainer">
            <props.spinner />
          </div> : <TokenDropdown filterList={props.tokenList} isBottom={props.isBottom} firstToken={props.firstToken} setFirstToken={props.setFirstToken} token1={token1} secondToken={props.secondToken} setSecondToken={props.setSecondToken} />}</span>
        <div className="balanceContainer">
          <span className="balanceAmount">Balance: {props.isBottom ? (token2 !== "" ? normalize(token2?.balance) : normalize(props.secondToken?.balance)) : (token1 !== "" ? normalize(token1?.balance) : normalize(props.firstToken?.balance))}</span>
        </div>
      </div>
    </div>
  )
}

export default CurrencyField
