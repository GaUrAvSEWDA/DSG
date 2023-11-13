import React, { useState } from "react";
import {Principal} from '@dfinity/principal';
import { token }  from "../../../declarations/token";
function Balance() {

   const [inputValue,setInput] = useState("");
  const [balanceResult , setBalance] = useState("");
  const  [cryptSymbol, setSymbol]  = useState("");
  const [isHidden,setHidden] =  useState("true");
  async function handleClick() {
    console.log(inputValue);
    const principal =  Principal.fromText(inputValue);
    const balance = await token.balanceOf(principal);
    setBalance(balance.toLocaleString());
    setSymbol(await token.getSymbol());
    setHidden(false);
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          // get hold of the input value 
          value={inputValue}
          // we will capture it using a useState const  (inputValue)
          onChange={(e) => setInput(e.target.value)}
          // whenever input is changed or user is typing call setInput 
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceResult} {cryptSymbol} .</p>
    </div>
  );
}

export default Balance;
