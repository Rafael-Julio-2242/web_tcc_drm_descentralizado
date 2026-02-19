"use client"

import { useConnectWallet } from "@/hooks/use-connect-wallet"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { infoToast } from "@/lib/toast-utils"

export function WalletButton() {
    const { connected, address, connectWallet } = useConnectWallet()

    // Função para resumir o endereço: 0x1234...abcd
    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    }

    if (connected && address) {
        return (
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-medium text-muted-foreground">Conectado</span>
                    <span className="text-xs font-mono">{formatAddress(address)}</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 border-primary/20 hover:bg-primary/10"
                    onClick={() => {
                        // No hook atual não temos o disconnect explicitamente, 
                        // mas podemos resetar o estado se necessário ou apenas manter o endereço.
                        // Geralmente no MetaMask o 'disconnect' real é feito pelo usuário.
                        // Para efeitos de UI, chamamos de novo ou apenas exibimos o estado.
                        infoToast("MetaMask", "Para desconectar, utilize sua extensão MetaMask.")
                    }}
                >
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="hidden xs:inline">{formatAddress(address)}</span>
                </Button>
            </div>
        )
    }

    return (
        <Button
            onClick={connectWallet}
            size="sm"
            className="h-8 gap-2"
        >
            <Wallet className="h-4 w-4" />
            <span>Conectar Carteira</span>
        </Button>
    )
}
