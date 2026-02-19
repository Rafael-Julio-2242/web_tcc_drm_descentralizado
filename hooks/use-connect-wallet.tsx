import { useWallet } from '@/context/wallet-context'

export function useConnectWallet() {
  const { signer, provider, connected, address, connectWallet } = useWallet()

  return {
    signer,
    provider,
    connected,
    address,
    connectWallet
  }
}
