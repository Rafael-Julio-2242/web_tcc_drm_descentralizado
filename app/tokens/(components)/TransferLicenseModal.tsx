"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import { successToast, errorToast } from "@/lib/toast-utils"
import { Tables } from "@/database.types"
import { useConnectWallet } from "@/hooks/use-connect-wallet"
import GetDigitalAssetAbi from "@/server/actions/getDigitalAssetAbi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/animate-ui/components/radix/alert-dialog"

type Application = Tables<"application">

export function TransferLicenseModal({ app, onUpdate }: { app: Application; onUpdate: () => void }) {
    const { signer, address } = useConnectWallet()
    const [isTransferring, setIsTransferring] = useState(false)
    const [walletAddress, setWalletAddress] = useState("")
    const [isAlertOpen, setIsAlertOpen] = useState(false)

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={(open) => {
            if (!open && !isTransferring) {
                setIsAlertOpen(false)
                setWalletAddress("")
            } else if (open) {
                setIsAlertOpen(true)
            }
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-xs">
                    <Send className="w-3 h-3 mr-1.5" /> Transferir
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Transferir Licença</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-3">
                            <span>
                                Informe a carteira de destino para transferir <strong>1 licença</strong> da aplicação <strong>{app.name}</strong>.
                            </span>
                            <div className="p-3 text-sm font-semibold rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
                                Aviso: Se for informada uma carteira inexistente e a transação for concluída, a licença será perdida para sempre.
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                        Endereço de Destino (0x...)
                    </label>
                    <Input
                        type="text"
                        placeholder="0x1234...abcd"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        autoFocus
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                const btn = document.getElementById(`transfer-btn-${app.id}`)
                                if (btn) btn.click()
                            }
                        }}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isTransferring}>Cancelar</AlertDialogCancel>
                    <Button
                        id={`transfer-btn-${app.id}`}
                        onClick={async (e) => {
                            e.preventDefault()
                            // basic length check / regex
                            if (walletAddress.trim() === "" || !ethers.isAddress(walletAddress)) {
                                errorToast("Endereço inválido", "Por favor, informe uma carteira válida (ex: 0x...).")
                                return
                            }

                            setIsTransferring(true)
                            try {
                                if (!signer || !address) {
                                    throw new Error("Carteira não conectada!")
                                }
                                if (!app.contract_address) {
                                    throw new Error("Endereço do contrato não encontrado na aplicação!")
                                }

                                if (walletAddress.toLowerCase() === address.toLowerCase()) {
                                    throw new Error("Você não pode transferir uma licença para sua própria carteira.")
                                }

                                const { abi } = await GetDigitalAssetAbi()
                                const contract = new ethers.Contract(app.contract_address, abi, signer)

                                // Precisamos descobrir quantas casas decimais o token tem
                                const decimals = await contract.decimals()
                                // Transferindo o equivalente a 1 token considerando os decimais
                                const amount = ethers.parseUnits("1", decimals)

                                // Chama a função transfer do ERC20
                                const tx = await contract.transfer(walletAddress, amount)
                                await tx.wait()

                                successToast("Licença Transferida", `1 licença transferida com sucesso!`)
                                setIsAlertOpen(false)
                                setWalletAddress("")
                                onUpdate()
                            } catch (error: any) {
                                console.error(error)
                                errorToast("Erro", error.message || "Não foi possível realizar a transferência.")
                            } finally {
                                setIsTransferring(false)
                            }
                        }}
                        disabled={walletAddress.trim() === "" || isTransferring}
                    >
                        {isTransferring ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processando...
                            </>
                        ) : "Confirmar Transferência"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
