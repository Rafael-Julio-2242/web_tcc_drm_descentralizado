"use client"

import { createApplication } from "@/server/actions/supabase/applications"
import { useConnectWallet } from "@/hooks/use-connect-wallet"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { successToast, errorToast } from "@/lib/toast-utils"
import Link from "next/link"
import { ArrowLeft, Upload, FileArchive, ShieldCheck, Info } from "lucide-react"
import { useState } from "react"
import { ethers } from "ethers"
import GetDigitalAssetFactoryAbi from "@/server/actions/getFactoryAbi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const criarTokenSchema = z.object({
    name: z.string().min(1, "Nome da aplicação é obrigatório"),
    symbol: z
        .string()
        .min(1, "Símbolo é obrigatório")
        .max(8, "Símbolo deve ter no máximo 8 caracteres"),
    appFileName: z.string().min(1, "Nome do arquivo principal é obrigatório").regex(/.*\..*/, "Deve conter a extensão (ex: app.exe)"),
    initialSupply: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val.trim() === "") return 0
            const num = Number(val)
            return isNaN(num) ? 0 : num
        })
        .pipe(
            z
                .number()
                .min(0, "O supply inicial não pode ser negativo")
        ),
    file: z.any().refine((file) => file && file.length > 0, "O arquivo .zip é obrigatório"),
})

type CriarTokenInput = z.input<typeof criarTokenSchema>
type CriarTokenOutput = z.output<typeof criarTokenSchema>

export default function CriarTokenPage() {
    const [fileName, setFileName] = useState<string | null>(null)
    const { address, connected, connectWallet, signer } = useConnectWallet()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting: formIsSubmitting },
    } = useForm<CriarTokenInput, any, CriarTokenOutput>({
        resolver: zodResolver(criarTokenSchema),
        defaultValues: {
            name: "",
            symbol: "",
            appFileName: "",
            initialSupply: "",
        },
    })

    const isSubmitting = formIsSubmitting

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            if (file.name.endsWith(".zip")) {
                setFileName(file.name)
            } else {
                errorToast("Arquivo Inválido", "Por favor, selecione um arquivo no formato .zip")
                e.target.value = ""
                setFileName(null)
            }
        }
    }

    async function onSubmit(data: CriarTokenOutput) {
        if (!connected || !address) {
            errorToast("Wallet não conectada", "Por favor, conecte sua wallet antes de prosseguir.")
            await connectWallet()
            return
        }

        try {
            // we catch the first file from the FileList
            const fileToUpload = data.file[0] as File

            if (!fileToUpload) {
                errorToast("Arquivo ausente", "Por favor, selecione um arquivo .zip")
                return
            }

            // TODO Implementar criação do Token

            if (!signer) {
                throw new Error("Wallet não conectada ou signer indisponível.")
            }

            const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS
            if (!factoryAddress) {
                throw new Error("Endereço do Factory não configurado (.env).")
            }

            const factoryData = await GetDigitalAssetFactoryAbi()
            const factoryContract = new ethers.Contract(
                factoryAddress,
                factoryData.abi,
                signer
            )

            // Chamada do contrato para criar o token (createToken no Factory)
            const tx = await factoryContract.createToken(
                data.name,
                data.symbol,
                data.initialSupply ?? 0
            )

            const receipt = await tx.wait()

            let contractAddress = ""
            if (receipt && receipt.logs) {
                for (const log of receipt.logs) {
                    try {
                        const parsedLog = factoryContract.interface.parseLog(log)
                        if (parsedLog && parsedLog.name === 'TokenCreated') {
                            contractAddress = parsedLog.args[0]
                            break
                        }
                    } catch (e) {
                        // Ignora logs que não pertencem ao nosso contrato/Factory
                    }
                }
            }

            if (!contractAddress) {
                throw new Error("Não foi possível identificar o endereço do contrato recém-criado nos logs.")
            }

            console.log("[DEBUG] Endereço do contrato recém-criado:", contractAddress);

            await createApplication(
                {
                    name: data.name,
                    symbol: data.symbol,
                    owner_wallet: address,
                    licences_emited: data.initialSupply ?? 0,
                    mainfile_name: data.appFileName,
                    contract_address: contractAddress
                },
                fileToUpload
            )

            successToast(
                "Aplicação Criada",
                `A aplicação "${data.name}" foi enviada com sucesso e o registro foi criado.`
            )

            // Resetar estado
            reset()
            setFileName(null)
        } catch (error: any) {
            console.error("Erro no onSubmit:", error)
            errorToast("Erro ao processar", error.message || "Ocorreu um erro inesperado.")
        }
    }

    return (
        <div className="flex items-start justify-center p-6 md:p-10">
            <Card className="w-full max-w-2xl border-primary/20 bg-card/50 backdrop-blur-md shadow-2xl">
                <CardHeader className="relative pb-8">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="absolute left-6 top-6 rounded-full hover:bg-primary/10"
                    >
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="pt-10 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl">Proteger Nova Aplicação</CardTitle>
                        <CardDescription className="max-w-md mx-auto mt-2">
                            Submeta sua aplicação (.zip) para ser protegida pelo sistema de DRM descentralizado e criar o token de acesso.
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome da Aplicação */}
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="app-name">Nome da Aplicação</FieldLabel>
                                <Input
                                    id="app-name"
                                    placeholder="Ex: My Awesome App"
                                    aria-invalid={!!errors.name}
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <FieldError errors={[errors.name]} />
                                )}
                            </Field>

                            {/* Symbol */}
                            <Field data-invalid={!!errors.symbol}>
                                <FieldLabel htmlFor="token-symbol">Símbolo do Token</FieldLabel>
                                <Input
                                    id="token-symbol"
                                    placeholder="Ex: APP"
                                    aria-invalid={!!errors.symbol}
                                    {...register("symbol")}
                                />
                                {errors.symbol && (
                                    <FieldError errors={[errors.symbol]} />
                                )}
                            </Field>
                        </div>

                        {/* Nome do Arquivo Principal */}
                        <Field data-invalid={!!errors.appFileName}>
                            <FieldLabel htmlFor="app-filename">Nome do Arquivo Principal (com extensão)</FieldLabel>
                            <Input
                                id="app-filename"
                                placeholder="Ex: meujogo.exe, script.py, app.bin"
                                aria-invalid={!!errors.appFileName}
                                {...register("appFileName")}
                            />
                            <FieldDescription>
                                O nome exato do arquivo que receberá a proteção DRM dentro do .zip.
                            </FieldDescription>
                            {errors.appFileName && (
                                <FieldError errors={[errors.appFileName]} />
                            )}
                        </Field>

                        {/* File Upload Section */}
                        <Field data-invalid={!!errors.file}>
                            <FieldLabel>Arquivo da Aplicação (.zip)</FieldLabel>
                            <div
                                className={cn(
                                    "relative mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all hover:bg-primary/5",
                                    errors.file ? "border-destructive/50 bg-destructive/5" : "border-border/50 bg-background/30",
                                    fileName && "border-primary/50 bg-primary/5"
                                )}
                            >
                                <input
                                    type="file"
                                    accept=".zip"
                                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                    {...register("file", { onChange: handleFileChange })}
                                />
                                <div className="flex flex-col items-center gap-2 text-center">
                                    {fileName ? (
                                        <>
                                            <div className="rounded-full bg-primary/20 p-3 text-primary">
                                                <FileArchive className="h-8 w-8" />
                                            </div>
                                            <p className="font-semibold text-primary">{fileName}</p>
                                            <p className="text-xs text-muted-foreground">Clique ou arraste para trocar o arquivo</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="rounded-full bg-muted p-3 text-muted-foreground">
                                                <Upload className="h-8 w-8" />
                                            </div>
                                            <p className="font-semibold">Clique para selecionar</p>
                                            <p className="text-xs text-muted-foreground">ou arraste seu arquivo .zip aqui</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <FieldDescription className="mt-2 flex items-center gap-1.5">
                                <Info className="h-3.5 w-3.5" />
                                O arquivo será processado e o DRM será injetado no executável.
                            </FieldDescription>
                            {errors.file && (
                                <FieldError errors={[errors.file]} />
                            )}
                        </Field>

                        <Separator className="bg-border/30" />

                        {/* Initial Supply (Opcional no contexto de DRM, pode ser o número de licenças iniciais) */}
                        <Field data-invalid={!!errors.initialSupply}>
                            <FieldLabel htmlFor="initial-licences">
                                Licenças Iniciais{" "}
                                <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
                            </FieldLabel>
                            <Input
                                id="initial-licences"
                                type="number"
                                min={0}
                                placeholder="0"
                                aria-invalid={!!errors.initialSupply}
                                {...register("initialSupply")}
                            />
                            <FieldDescription>
                                Quantidade de licenças que serão emitidas imediatamente.
                            </FieldDescription>
                            {errors.initialSupply && (
                                <FieldError errors={[errors.initialSupply]} />
                            )}
                        </Field>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-base py-6 shadow-lg shadow-primary/20"
                        >
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            {isSubmitting ? "Processando..." : "Proteger e Criar Token"}
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                            Secure DRM Encryption On-Chain
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

function Separator({ className }: { className?: string }) {
    return <div className={cn("h-[1px] w-full bg-border", className)} />
}
