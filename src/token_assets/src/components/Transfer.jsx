import React, { useState } from "react";
import {Principal} from '@dfinity/principal';
import { token }  from "../../../declarations/token";
function Transfer() {
  const [recieverId,setId] =  useState("");
  const [transferAmount, setAmount] = useState("");
  const [returnStatement , setStatement] =  useState("Transfer");
  const[btnstate ,setbtnState] = useState(false);
  const [feedBack , setFeedBack] = useState("");
  const[isHidden , setHidden ] = useState(true);
  async function handleClick() {
    // here recieverId and transferAmount are in String but we need them to match
    // input datatype of the token.Transfer function
    setHidden(true);
    setbtnState(true);
    const recipient  =  Principal.fromText(recieverId);
    const amount =  Number(transferAmount);
    const result  =  await token.transfer(recipient,amount);
    setStatement(result);
    setFeedBack(result);
    setbtnState(false);
    setHidden(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recieverId}
                onChange={(e)=> setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={transferAmount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" 
          onClick={handleClick} 
          disabled={btnstate}
          >
            {returnStatement}
          </button>
        </p>
        <p hidden={isHidden}>{feedBack}</p>
      </div>
    </div>
  );
}

export default Transfer;
