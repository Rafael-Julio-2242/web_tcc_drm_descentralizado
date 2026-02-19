"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { successToast, errorToast } from "@/lib/toast-utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

const criarTokenSchema = z.object({

    name: z.string("Nome é obrigatório").min(1, "Nome é obrigatório"),
    symbol: z
        .string("Símbolo é obrigatório")
        .min(1, "Símbolo é obrigatório")
        .max(8, "Símbolo deve ter no máximo 8 caracteres"),
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
})

type CriarTokenInput = z.input<typeof criarTokenSchema>
type CriarTokenOutput = z.output<typeof criarTokenSchema>

export default function CriarTokenPage() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CriarTokenInput, any, CriarTokenOutput>({
        resolver: zodResolver(criarTokenSchema),
        defaultValues: {
            name: "",
            symbol: "",
            initialSupply: "",
        },
    })

    function onSubmit(data: CriarTokenOutput) {
        // TODO: implementar chamada ao contrato inteligente
        console.log("Dados do Token:", data)

        successToast("Success Token", `Token "${data.name}" (${data.symbol}) registrado com sucesso.`)

        reset()
    }

    return (
        <div className="flex items-start justify-center p-6">
            <Card className="w-full max-w-lg">
                <CardHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="absolute left-4 top-4 rounded-full"
                    >
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="pt-6">
                        <CardTitle>Criar Token Fungível</CardTitle>
                        <CardDescription>
                            Preencha as informações abaixo para criar um novo token fungível
                            (ERC-20).
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <FieldGroup>
                            {/* Nome */}
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="token-name">Nome do Token</FieldLabel>
                                <Input
                                    id="token-name"
                                    placeholder="Ex: Meu Token"
                                    aria-invalid={!!errors.name}
                                    {...register("name")}
                                />
                                <FieldDescription>
                                    Nome completo do token.
                                </FieldDescription>
                                {errors.name && (
                                    <FieldError errors={[errors.name]} />
                                )}
                            </Field>

                            {/* Symbol */}
                            <Field data-invalid={!!errors.symbol}>
                                <FieldLabel htmlFor="token-symbol">Symbol</FieldLabel>
                                <Input
                                    id="token-symbol"
                                    placeholder="Ex: MTK"
                                    aria-invalid={!!errors.symbol}
                                    {...register("symbol")}
                                />
                                <FieldDescription>
                                    Abreviação do token (máx. 8 caracteres).
                                </FieldDescription>
                                {errors.symbol && (
                                    <FieldError errors={[errors.symbol]} />
                                )}
                            </Field>

                            {/* Initial Supply */}
                            <Field data-invalid={!!errors.initialSupply}>
                                <FieldLabel htmlFor="token-initial-supply">
                                    Initial Supply{" "}
                                    <span className="text-muted-foreground font-normal text-xs">
                                        (opcional)
                                    </span>
                                </FieldLabel>
                                <Input
                                    id="token-initial-supply"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    aria-invalid={!!errors.initialSupply}
                                    {...register("initialSupply")}
                                />
                                <FieldDescription>
                                    Quantidade inicial de tokens a ser emitida. Se não informado,
                                    será 0.
                                </FieldDescription>
                                {errors.initialSupply && (
                                    <FieldError errors={[errors.initialSupply]} />
                                )}
                            </Field>
                        </FieldGroup>
                    </CardContent>

                    <CardFooter className="justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Criando..." : "Criar Token"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
