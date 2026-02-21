"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Download, FileJson, Key, Loader2, Wallet } from "lucide-react"
import { ethers } from "ethers"
import { successToast, errorToast } from "@/lib/toast-utils"
import GetDigitalAssetAbi from "@/server/actions/getDigitalAssetAbi"
import { useConnectWallet } from "@/hooks/use-connect-wallet"
import { getApplicationDownloadUrl } from "@/server/actions/supabase/applications"
import { Tables } from "@/database.types"
import { EmitLicensesModal } from "./EmitLicensesModal"
import { TransferLicenseModal } from "./TransferLicenseModal"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Application = Tables<"application">

export function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function ApplicationCard({ app, onUpdate }: { app: Application; onUpdate: () => void }) {
    const { signer, address } = useConnectWallet()
    const [isDownloading, setIsDownloading] = useState(false)
    const [balance, setBalance] = useState<string>("0")

    useEffect(() => {
        async function fetchBalance() {
            if (!address || !app.contract_address || !signer) return;
            try {
                const { abi } = await GetDigitalAssetAbi()
                const contract = new ethers.Contract(app.contract_address, abi, signer)
                const bal = await contract.balanceOf(address)
                const decimals = await contract.decimals()
                setBalance(ethers.formatUnits(bal, decimals))
            } catch (err) {
                console.error("Erro ao buscar saldo:", err)
            }
        }
        fetchBalance()
    }, [address, app.contract_address, signer, app.licences_emited])

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const signedUrl = await getApplicationDownloadUrl(app.application_id)

            // Trigger download by creating a temporary link
            const a = document.createElement("a")
            a.href = signedUrl
            a.download = `${app.name}.zip`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)

            successToast("Download Iniciado", `Sua aplicação "${app.name}" está sendo baixada.`)
        } catch (error) {
            console.error("Erro ao gerar link de download:", error)
            errorToast("Erro no Download", "Não foi possível gerar o link de download.")
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Card className="overflow-hidden border-primary/10 bg-card/40 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-2xl group flex flex-col">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <Badge variant="secondary" className="font-mono text-[10px] tracking-widest uppercase bg-primary/5 text-primary border-primary/20">
                            Protected
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs opacity-70">
                            {app.symbol}
                        </Badge>
                    </div>
                </div>
                <div className="mt-4">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{app.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
                        Protegida em {new Date(app.created_at).toLocaleDateString()}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
                <Separator className="bg-primary/10" />

                <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            Licenças Emitidas
                        </span>
                        <span className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                            <Key className="h-3.5 w-3.5 text-primary" />
                            {app.licences_emited ?? 0}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            Licenças Possuídas
                        </span>
                        <span className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-primary" />
                            {balance}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            Tamanho
                        </span>
                        <span className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                            <FileJson className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatFileSize(app.app_size)}
                        </span>
                    </div>
                </div>

                <div className="rounded-lg bg-background/40 p-3 border border-border/50">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">
                        Entry Point do DRM
                    </span>
                    <code className="text-xs text-primary font-mono">{app.mainfile_name}</code>
                </div>

                <div className="pt-2 mt-auto space-y-2">
                    <Button
                        className="w-full group/dl"
                        variant="default"
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="mr-2 h-4 w-4 group-hover/dl:animate-bounce" />
                        )}
                        {isDownloading ? "Gerando Link..." : "Baixar Aplicação (.zip)"}
                    </Button>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <EmitLicensesModal app={app} onUpdate={onUpdate} />
                        <TransferLicenseModal app={app} onUpdate={onUpdate} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
