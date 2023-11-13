import React, { useState } from "react";
import { token , canisterId, createActor }  from "../../../declarations/token";
import { AuthClient } from "../../../../node_modules/@dfinity/auth-client/lib/cjs/index";
function Faucet() {
  const [isDisabled,setDisable] = useState(false);
  const [buttonText, setText] = useState("Gimme gimme");
  async function handleClick(event) {
    // once the user clicks the button we need to disable it 
    // so that user doesnot click and gain more coins again
       setDisable(true);

       const result =  await token.payOut();

      //  now calling payOut on the local cannister (token ) was good 
      // but we need to call it on the authClient or authenticated user id 
      
      // const authClient = await AuthClient.create();
      // now we get id of the authClient
      // const identity =  await authClient.getIdentity();
      // now we will create a "actor" with this identity  - {built in method is provided for this }
      // const authenticatedCanister =  createActor(canisterId,{
      //   agentOptions:{
      //     identity,
      //   },
      // });
      // now we will call the payout method on this authenticated canister
      // const result =  await authenticatedCanister.payOut();
      //  we use await keyword becuase the function payOut runs on ICP
      // chain and as it is a updating function it will take 2-3 sec to return the output
      // and next lines should only be executed if it had completed 

      //  set the button text to success or already claimed 
      // depending on the result of payOut function
       setText(result);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DAngela tokens here! Claim 10,000 DANG coins to your account.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick}
           disabled={isDisabled}
        >
        {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
