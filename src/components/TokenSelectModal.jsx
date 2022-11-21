import React from 'react';
import { listenerCount } from 'stream';
import './modal.css';

export default function TokenSelectModal(props) {
  return (
    <div id="myModal" class="modal" style={props.toggle ? { display: 'block' } : { display: 'none' }}>
        <div class="modal-content">
            <div>
                <div class="modal-header">
                    <div class="">Select a token</div>
                    <svg onClick={() => props.setToggle(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="close-button">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
                <div class="modal-body">
                    {/* {props?.filterList.map(token => <div className={token === 'ETH'? 'token-option selected' : 'token-option'}><div><img /><span><span></span><span></span></span></div>{token === 'ETH' ? <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="tick"><polyline points="20 6 9 17 4 12"></polyline></svg></div> : null}</div>)} */}
                </div>
            </div>
        </div>
    </div>
  )
}
