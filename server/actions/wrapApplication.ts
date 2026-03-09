"use server";

export type WrappApplicationResponse = {
    success: true,
    message: string,
    download_url: string,
} | {
    success: false,
    message: string,
}

type WrapApplicationParams = {
    file: File,
    contractId: string,
    chain: string,
    execPath: string
}

export async function WrappApplication(params: WrapApplicationParams): Promise<WrappApplicationResponse> {
    const url = process.env.WRAP_APPLICATION_API_URL!;

    const bodyData = new FormData();

    bodyData.set("contractId", params.contractId);
    bodyData.set("chain", params.chain);
    bodyData.set("execPath", params.execPath);

    bodyData.set("file", params.file);

    const res = await fetch(`${url}/wrap`, {
        method: "POST",
        body: bodyData,
    })

    let data = await res.json() as WrappApplicationResponse;

    if (!data.success) {
        throw new Error(data.message);
    }

    data.download_url = `${url}${data.download_url}`;

    console.log('[FULL DOWNLOAD URL]: ', data.download_url);

    return data;
}
