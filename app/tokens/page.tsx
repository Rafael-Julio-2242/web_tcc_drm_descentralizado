"use client"

import { Plus, ShieldAlert, Loader2 } from "lucide-react"
import { errorToast } from "@/lib/toast-utils"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { useConnectWallet } from "@/hooks/use-connect-wallet"
import { getApplications } from "@/server/actions/supabase/applications"
import { Tables } from "@/database.types"
import { ApplicationCard } from "./(components)/ApplicationCard"

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
                        <ApplicationCard key={app.id} app={app} onUpdate={() => fetchApps(address!)} />
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


