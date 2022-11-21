import React from 'react';
import "./dropdown.css";
import { GetFirstToken } from '../TokenSelectService';
import { useEffect, useState } from 'react';


export default function TokenDropdown(props) {

    const [tok1, setTok1] = useState("")
    
    useEffect(() => {
        const token1 = GetFirstToken() ? GetFirstToken() : "";

        setTok1(token1)
    },[])
    

    let top = (
        props.filterList.filter(entry => entry.logo !== null).filter(entry => entry.symbol == "ETH" || entry.symbol == "QWC").map(entry => 
            <li><button className='dropdown-item' onClick={() => props.setFirstToken(entry)}><img className="active-token-icon" src={entry.thumbnail} /> {entry.symbol}</button></li>
        )
    )

    let bottom = (
        props.filterList.filter(entry => entry.logo !== null).map(entry => 
            <li><button className={entry.symbol !== tok1?.symbol ? 'dropdown-item' : 'dropdown-item disabled'} onClick={() => props.setSecondToken(entry)}><img className="active-token-icon" src={entry.thumbnail} /> {entry.symbol}</button></li>
        )
    )
  return (
    <>
        <div className="dropdown" name="" id="">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{props.firstToken === undefined && props.secondToken === undefined ? "Select a token" : (props.isBottom ? <><img className="active-token-icon" src={props.secondToken.thumbnail} /> {props.secondToken.symbol}</> : <><img className="active-token-icon" src={props.firstToken.thumbnail} /> {props.firstToken.symbol}</>)}</button>
            <ul class="dropdown-menu">
                {props.isBottom ? bottom : top}
            </ul>
        </div>
    </>
  )
}
