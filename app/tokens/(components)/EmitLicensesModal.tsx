"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { ethers } from "ethers"
import { successToast, errorToast } from "@/lib/toast-utils"
import GetDigitalAssetAbi from "@/server/actions/getDigitalAssetAbi"
import { emitLicenses } from "@/server/actions/supabase/applications"
import { Tables } from "@/database.types"
import { useConnectWallet } from "@/hooks/use-connect-wallet"

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

export function EmitLicensesModal({ app, onUpdate }: { app: Application; onUpdate: () => void }) {
    const { signer, address } = useConnectWallet()
    const [isEmitting, setIsEmitting] = useState(false)
    const [amountStr, setAmountStr] = useState("")
    const [isAlertOpen, setIsAlertOpen] = useState(false)

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={(open) => {
            if (!open && !isEmitting) {
                setIsAlertOpen(false)
                setAmountStr("")
            } else if (open) {
                setIsAlertOpen(true)
            }
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                    Emitir licenças
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Emitir Novas Licenças</AlertDialogTitle>
                    <AlertDialogDescription>
                        Informe a quantidade de licenças adicionais que deseja gerar para a aplicação <strong>{app.name}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Input
                        type="number"
                        min="1"
                        placeholder="Quantidade (ex: 100)"
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                const amount = parseInt(amountStr)
                                if (!isNaN(amount) && amount > 0 && amountStr.trim() !== "") {
                                    const btn = document.getElementById(`emit-btn-${app.id}`)
                                    if (btn) btn.click()
                                }
                            }
                        }}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isEmitting}>Cancelar</AlertDialogCancel>
                    <Button
                        id={`emit-btn-${app.id}`}
                        onClick={async (e) => {
                            e.preventDefault()
                            const amount = parseInt(amountStr)
                            if (isNaN(amount) || amount <= 0 || amountStr.trim() === "") {
                                errorToast("Valor inválido", "A quantidade deve ser maior que zero e o campo não pode estar vazio.")
                                return
                            }

                            setIsEmitting(true)
                            try {
                                if (!signer || !address) {
                                    throw new Error("Carteira não conectada!")
                                }
                                if (!app.contract_address) {
                                    throw new Error("Endereço do contrato não encontrado!")
                                }

                                // Integração com blockchain para assinar `mint`
                                const { abi } = await GetDigitalAssetAbi()
                                const contract = new ethers.Contract(app.contract_address, abi, signer)

                                const tx = await contract.mint(address, amount)
                                await tx.wait()

                                // Incremento no Supabase
                                await emitLicenses(app.id, amount)

                                successToast("Licenças Emitidas", `${amount} novas licenças foram geradas com sucesso.`)
                                setIsAlertOpen(false)
                                setAmountStr("")
                                onUpdate()
                            } catch (error: any) {
                                console.error("Erro no Mint:", error)
                                errorToast("Erro", error.message || "Não foi possível emitir as licenças na blockchain.")
                            } finally {
                                setIsEmitting(false)
                            }
                        }}
                        disabled={amountStr.trim() === "" || parseInt(amountStr) <= 0 || isEmitting}
                    >
                        {isEmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Confirmar Criação
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
