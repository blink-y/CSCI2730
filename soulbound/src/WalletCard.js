import React, { useState } from 'react'
import { ethers } from 'ethers'
import UserForm from './form';
import UserData from './UserData';
import './walletcard.css';


const WalletCard = () => {
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [userType, setUserType] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log('MetaMask Here!');

            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    console.log(result);
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                    getAccountBalance(result[0]);
                })
                .catch(error => {
                    console.log(error);
                    setConnButtonText('Connect Wallet');

                });

        } else {
            console.log('Need to install MetaMask');
        }
    }

    // update account, will cause component re-render
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        checkUserType(newAccount);
        getAccountBalance(newAccount.toString());
    }

    const getAccountBalance = (account) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
            .then(balance => {
                setUserBalance(ethers.utils.formatEther(balance));
            })
            .catch(error => {
                console.log(error);
            });
    };

    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload();
    }

    // listen for account changes
    window.ethereum.on('accountsChanged', accountChangedHandler);
    window.ethereum.on('chainChanged', chainChangedHandler);

    const checkUserType = async (walletAddress) => {
        try {
            const response = await fetch('http://localhost:8000/findUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAddress: walletAddress
                })
            });
            const data = await response.text();
            setUserType(data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className='containerHeader'>

                <button className="walletConnectBtn" onClick={connectWalletHandler}>{connButtonText}</button>
                <div className='accountDisplay'>
                    <h3>Address: {defaultAccount}</h3>
                </div>
                <div className='balanceDisplay'>
                    <h3>Balance: {userBalance}</h3>
                </div>
            </div>
            {userType === '0' ? <UserForm address={defaultAccount} /> : userType === '1' ? <UserData address={defaultAccount} /> : null}
        </div>
    );
}

export default WalletCard;