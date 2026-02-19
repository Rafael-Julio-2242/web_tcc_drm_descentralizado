"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Provider, Signer, BrowserProvider } from 'ethers'

interface WalletContextType {
    provider: Provider | undefined
    signer: Signer | undefined
    address: string | undefined
    connected: boolean
    connectWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
    const [provider, setProvider] = useState<Provider>()
    const [signer, setSigner] = useState<Signer>()
    const [address, setAddress] = useState<string>()
    const [connected, setConnected] = useState(false)

    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!

    const connectWallet = useCallback(async () => {
        try {
            if (!window.ethereum) {
                alert("Instale o Meta Mask!!")
                return
            }

            await window.ethereum.request({ method: "eth_requestAccounts" })

            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xAA36A7" }], // Chain ID Sepolia em hex
                })
            } catch (e: any) {
                console.log('[ERRO], BUSCANDO CONFIGURAÇÃO DA REDE SEPOLIA')
                if (e.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0xAA36A7",
                                chainName: "Sepolia Test Network",
                                rpcUrls: [rpcUrl],
                                nativeCurrency: {
                                    name: "SepoliaETH",
                                    symbol: "SEP",
                                    decimals: 18,
                                },
                                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                            },
                        ],
                    })
                }
            }

            const p = new BrowserProvider(window.ethereum)
            const s = await p.getSigner()
            const a = await s.getAddress()

            setAddress(a)
            setConnected(true)
            setProvider(p)
            setSigner(s)
        } catch (e: any) {
            console.error(e)
            alert("Não foi possível conectar a Wallet!")
        }
    }, [rpcUrl])

    return (
        <WalletContext.Provider
            value={{
                provider,
                signer,
                address,
                connected,
                connectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}
