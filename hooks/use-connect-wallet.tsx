import { Provider } from 'ethers';
import { Signer } from 'ethers';
import { BrowserProvider } from 'ethers';
import { useState } from 'react';

export function useConnectWallet() {
  const [provider, setProvider] = useState<Provider>();
  const [signer, setSigner] = useState<Signer>();
  const [address, setAddress] = useState<string>();
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Instale o Meta Mask!!");
        return
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const p = new BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const a = await s.getAddress();
      console.log("Connected account:", a);

      setAddress(a);
      setConnected(true);
      setProvider(p);
      setSigner(s);
    } catch (e: any) {
      alert("Não foi possível conectar a Wallet!");
    }
  }

  return {
    signer,
    provider,
    connected,
    address,
    connectWallet
  }

}
