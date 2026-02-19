'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";


export default function Page() {

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-6 text-center">
            <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Bem-vindo ao <span className="text-primary">DeDRM</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Sistema descentralizado de gerenciamento de direitos digitais.
                    Gerencie seus ativos de forma segura e transparente na blockchain.
                </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8">
                    <Link href="/tokens/criar">
                        Começar a Criar Token
                        <MoveRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>

                <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                    <Link href="/tokens">
                        Ver Meus Ativos
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Segurança</h3>
                    <p className="text-sm text-muted-foreground">Protocolos robustos para garantir a integridade dos seus ativos digitais.</p>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Transparência</h3>
                    <p className="text-sm text-muted-foreground">Todas as transações e licenças são registradas on-chain e auditáveis.</p>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Descentralização</h3>
                    <p className="text-sm text-muted-foreground">Sem intermediários. Você tem o controle total sobre o seu conteúdo.</p>
                </div>
            </div>
        </div>
    );
}