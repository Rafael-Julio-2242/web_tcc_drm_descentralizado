'use client';

import { useConnectWallet } from "@/hooks/use-connect-wallet";
import { useEffect } from 'react';


export default function Page() {

 const {
  signer,
  provider,
  connected,
  address,
  connectWallet
 } = useConnectWallet();


 useEffect(() => {
  connectWallet();
 }, [])



 return (
  <>
   {connected && <>Está conectado!!!</>}
   {!connected && <>Não Está conectado!!!</>}
  </>
 );
}