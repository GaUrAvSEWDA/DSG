import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Prelude "mo:base/Prelude";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

// Principal is a (type) way of uniquely identifying users/cannisters on ICP

// for Principal id - dfx identity get-principal

actor Token {
    // Debug.print("hello");
    var owner : Principal = Principal.fromText("5gjxy-yinyv-vahzm-7cho7-3ai73-4v7xj-i7o6c-woa66-edivv-cleyq-nqe");
    var totalSupply : Nat = 1000000000;
    var symbol : Text = "DSG";

    // Now we need to store user with there totalSupply
    // so best way will be to map every user (with the help of there id) to totalSupply
    // we can use "Map" here for this
    // check documentation for hashMap implementation
    // import first
    // class HashMap<K, V>(initCapacity : Nat, keyEq : (K, K) -> Bool, keyHash : K -> Hash.Hash)

    // there are three inputs required for HashMap
    // 1- initial size -> here we will take it as 1
    // 2- type of equality between the keys
    // 3- how it will hash the keys

    // Now as we cannot make a hashmap stable datatype in motoko we need to store the entries somewhere
    // lets use an array

    private stable var balanceEntries : [(Principal, Nat)] = [];

    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    // we provide the owner some inital supply if its size is zero (i.e first time)
    if (balances.size() < 1) {
        balances.put(owner, totalSupply);
    };
    // put intial amount with the owner

    // balances.put(owner, totalSupply);

    // but as everytime we redeploy it will reassign owner the same totalSupply
    // so we shift it in the postUpgraded function

    system func preupgrade() {
        // now we use Iter to iterate over hashmap and toArray function
        // to collect entries in an array
        // we are using standard functions from Motoko here
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade() {
        // .vals() is used to iter over the array
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
        if (balances.size() < 1) {
            balances.put(owner, totalSupply);
        };
        // now only the first time when there is nothing in the hashmap
        // its size is zero it will assign owner some money
    };

    public query func balanceOf(who : Principal) : async Nat {

        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };

        return balance;

    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public shared (msg) func payOut() : async Text {
        Debug.print(debug_show(msg.caller));
        // first we should check if the id is present or not in the hashmap

        if (balances.get(msg.caller) == null) {
            // instead of just putting some value in the recievers id
            // we will transfer this amount from the "token" canister id to the receiver
            // balances.put(msg.caller, 10000);
            // we need to add some money in the token id first
            // check readme.md ( charge the canister section)
            let result = await transfer(msg.caller, 10000);
            return result;
        } else {
            return "Already Claimed";
        };
        // Debug.print(debug_show (balances));

    };
    // when we call a shared function from another functionn
    // then it is the cannister who calls the function
    // so when we do console log of msg.caller we get cannister id

    public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
        //  we dont need the id of sender here
        // because it will be the one who initiates the transer
        // i.e we will fetch it fromo msg.caller
        let fromBalance = await balanceOf(msg.caller);
        if (fromBalance > amount) {
            // calculate new balance for the sender
            let newFromBalance : Nat = fromBalance - amount;
            // update the hashmap
            balances.put(msg.caller, newFromBalance);
            // now update balance of the reciever
            // and update the hashmap again
            let newToBalance = (await balanceOf(to)) + amount;
            balances.put(to, newToBalance);

            return "Success";
        } else {
            return "Insufficient funds";
        };
    };
};
