import { toast } from "sonner"

/**
 * Exibe um toast de sucesso padronizado com fundo verde e texto branco.
 * @param title Título da mensagem
 * @param description Opcional: Descrição detalhada
 */
export const successToast = (title: string, description?: string) => {
    console.log('[SUCCESS]')
    toast.success(title, {
        description,
        style: {
            backgroundColor: "#22c55e",
            color: "#ffffff",
            borderColor: "#16a34a",
        },
        descriptionClassName: "text-white/90",
    })
}

/**
 * Exibe um toast de erro padronizado com fundo vermelho e texto branco.
 * @param title Título da mensagem
 * @param description Opcional: Descrição detalhada
 */
export const errorToast = (title: string, description?: string) => {
    console.log('[ERROR]')
    toast.error(title, {
        description,
        style: {
            backgroundColor: "#ef4444",
            color: "#ffffff",
            borderColor: "#dc2626",
        },
        descriptionClassName: "text-white/90",
    })
}

/**
 * Exibe um toast informativo padronizado com fundo roxo e texto branco.
 * @param title Título da mensagem
 * @param description Opcional: Descrição detalhada
 */
export const infoToast = (title: string, description?: string) => {
    console.log('[INFO]')
    toast.info(title, {
        description,
        style: {
            backgroundColor: "#9333ea",
            color: "#ffffff",
            borderColor: "#7e22ce",
        },
        descriptionClassName: "text-white/90",
    })
}
