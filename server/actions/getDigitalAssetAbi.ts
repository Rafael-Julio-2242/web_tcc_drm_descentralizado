"use server";

import digitalAssetAbi from "@/server/contracts/DigitalAsset.json";
import { AbiReturn } from "@/server/types/abiReturn";

export default async function GetDigitalAssetAbi(): Promise<AbiReturn> {
    return {
        abi: digitalAssetAbi.abi,
        bytecode: digitalAssetAbi.bytecode
    }
}