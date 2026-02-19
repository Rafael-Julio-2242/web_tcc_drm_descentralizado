"use client"

import { Plus, ShieldCheck, Download, FileJson, Key, ShieldAlert, Loader2 } from "lucide-react"
import { successToast, errorToast } from "@/lib/toast-utils"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"

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
import { useConnectWallet } from "@/hooks/use-connect-wallet"
import { getApplications, getApplicationDownloadUrl } from "@/server/actions/supabase/applications"
import { Tables } from "@/database.types"

type Application = Tables<"application">

export default function TokensPage() {
    const { address, connected, connectWallet } = useConnectWallet()
    const [applications, setApplications] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchApps = useCallback(async (walletAddress: string) => {
        setIsLoading(true)
        try {
            const data = await getApplications(walletAddress)
            setApplications(data)
        } catch (error) {
            console.error("Erro ao buscar aplicações:", error)
            errorToast("Erro", "Não foi possível carregar suas aplicações.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (connected && address) {
            fetchApps(address)
        } else {
            setApplications([])
        }
    }, [connected, address, fetchApps])

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Minhas Aplicações</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Gerencie suas aplicações protegidas por DRM e licenciamento on-chain.
                    </p>
                </div>
                <Button asChild className="shrink-0 shadow-lg shadow-primary/20">
                    <Link href="/tokens/criar">
                        <Plus className="mr-2 h-4 w-4" />
                        Proteger Nova App
                    </Link>
                </Button>
            </div>

            {!connected ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
                    <ShieldAlert className="h-16 w-16 text-primary/20 mb-4" />
                    <h3 className="text-xl font-bold">Wallet não conectada</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">
                        Conecte sua wallet para visualizar e gerenciar suas aplicações protegidas.
                    </p>
                    <Button className="mt-8" onClick={connectWallet}>
                        Conectar Wallet
                    </Button>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/40 mb-4" />
                    <p className="text-muted-foreground">Buscando suas aplicações...</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} app={app} />
                    ))}

                    {applications.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
                            <ShieldAlert className="h-16 w-16 text-primary/20 mb-4" />
                            <h3 className="text-xl font-bold">Nenhuma aplicação protegida</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">
                                Você ainda não protegeu nenhuma aplicação com esta wallet.
                            </p>
                            <Button className="mt-8" asChild>
                                <Link href="/tokens/criar">Proteger minha primeira App</Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function ApplicationCard({ app }: { app: Application }) {
    const [isDownloading, setIsDownloading] = useState(false)

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

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            Licenças
                        </span>
                        <span className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                            <Key className="h-3.5 w-3.5 text-primary" />
                            {app.licences_emited ?? 0}
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
                    <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary" disabled>
                        Emitir licenças
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
