import { IResourceManager } from "../Resource/IResourceManager";

export interface IUIManager {
    setResourceManager(resourceManager: IResourceManager): void;
}
