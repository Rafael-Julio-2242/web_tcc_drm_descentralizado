
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DigitalAssetFactoryDeployment", (m) => {
    const factory = m.contract("DigitalAssetFactory", []);
    return { factory };
})