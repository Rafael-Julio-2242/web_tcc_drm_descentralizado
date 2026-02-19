"use client"

import { Plus, Coins, ExternalLink } from "lucide-react"
import Link from "next/link"

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

const MOCK_TOKENS = [
    {
        id: "1",
        name: "Governance Token",
        symbol: "GVT",
        totalSupply: "1,000,000",
        createdAt: "2024-02-10",
    },
    {
        id: "2",
        name: "Utility Token",
        symbol: "UTL",
        totalSupply: "500,000",
        createdAt: "2024-02-15",
    },
    {
        id: "3",
        name: "Reward Coin",
        symbol: "RWD",
        totalSupply: "2,500,000",
        createdAt: "2024-02-18",
    },
]

export default function TokensPage() {
    return (
        <div className="flex flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meus Tokens</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie e visualize todos os seus tokens emitidos na rede.
                    </p>
                </div>
                <Button asChild className="shrink-0">
                    <Link href="/tokens/criar">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Novo Token
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_TOKENS.map((token) => (
                    <Card key={token.id} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg group">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Coins className="h-6 w-6" />
                                </div>
                                <Badge variant="outline" className="font-mono">
                                    {token.symbol}
                                </Badge>
                            </div>
                            <div className="mt-4">
                                <CardTitle className="text-xl">{token.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                    Criado em {token.createdAt}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator className="bg-border/50" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                    Quantidade Emitida
                                </span>
                                <span className="text-2xl font-bold tracking-tight">
                                    {token.totalSupply} <span className="text-sm font-medium text-muted-foreground">{token.symbol}</span>
                                </span>
                            </div>
                            <div className="pt-2">
                                <Button variant="secondary" className="w-full group/btn" disabled>
                                    Emitir Tokens
                                    <ExternalLink className="ml-2 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-2">
                                    Funcionalidade será habilitada em breve
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Empty State placeholder if there were no tokens */}
                {MOCK_TOKENS.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
                        <Coins className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">Nenhum token encontrado</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                            Você ainda não criou nenhum token fungível nesta rede.
                        </p>
                        <Button variant="outline" className="mt-6" asChild>
                            <Link href="/tokens/criar">Criar meu primeiro token</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
