'use client';

import { useConnectWallet } from "@/hooks/use-connect-wallet";
import { useContractFactory } from "@/hooks/use-contract-factory";
import { useEffect } from 'react';


export default function Page() {

 const {
  signer,
  provider,
  connected,
  address,
  connectWallet
 } = useConnectWallet();

 const { factoryInstance, startingFactory, startFactory } = useContractFactory();


 useEffect(() => {
  connectWallet();
 }, []);

 useEffect(() => {
    if (signer) {
        startFactory(signer);
    }
 }, [signer]);



 return (
  <>
   {connected && <>Está conectado!!!</>}
   {!connected && <>Não Está conectado!!!</>}

   {(startingFactory && !factoryInstance) && (
    <>Iniciando fábrica de Contratos...</>
   )}

    {(!startingFactory && factoryInstance) && (
        <>Fábrica de Contratos Iniciada!</>
    )}
    
    {(!startingFactory && !factoryInstance) && (
        <>Fábrica de Contratos Não Iniciada</>
    )}

  </>
 );
}