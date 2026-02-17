"use server";

import digitalAssetFactoryAbi from "@/server/contracts/DigitalAssetFactory.json";
import { AbiReturn } from "@/server/types/abiReturn";

export default async function GetDigitalAssetFactoryAbi(): Promise<AbiReturn> {
    return {
        abi: digitalAssetFactoryAbi.abi,
        bytecode: digitalAssetFactoryAbi.bytecode
    }
}
