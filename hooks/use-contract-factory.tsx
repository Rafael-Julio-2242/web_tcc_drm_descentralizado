import { useState } from "react";
import { Contract, ethers } from "ethers";
import { Signer } from "ethers";
import GetDigitalAssetFactoryAbi from "@/server/actions/getFactoryAbi";

export function useContractFactory() {

    const [factoryInstance, setFactoryInstance] = useState<Contract>();
    const [startingFactory, setStartingFactory] = useState(false);

    const startFactory = async (signer: Signer) => {
        setFactoryInstance((_) => undefined);
        setStartingFactory(true);
        const factoryAddres = process.env.NEXT_PUBLIC_FACTORY_ADDRESS!;
        const factoryData = await GetDigitalAssetFactoryAbi();

        const instance = new ethers.Contract(
            factoryAddres,
            factoryData.abi,
            signer
        );
        setFactoryInstance((_) => instance);
        setStartingFactory(false);
    }

    return {
        factoryInstance,
        startingFactory,
        startFactory
    }
}
