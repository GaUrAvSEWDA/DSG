import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
// for login authentication we will use auth-client 
import { AuthClient } from '@dfinity/auth-client';
// import { AuthClient } from '../../../node_modules/@dfinity/auth-client/lib/cjs/index';

const init = async () => {

  const authClient = await AuthClient.create();
  
  if(await authClient.isAuthenticated()){
    console.log("looged in already");
    ReactDOM.render(<App />, document.getElementById("root"));
  }
  else{
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        // on success we just render our app
        ReactDOM.render(<App />, document.getElementById("root"));
      }
    })
  }
}

init();


