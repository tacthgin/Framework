import { IResourceLoader } from "./IResourceLoader";
import { ResourceLoader } from "./ResourceLoader";

export interface IResourceManager {
    /**
     * 内置的动态resources加载
     */
    readonly internalResourceLoader: IResourceLoader;

    getResourceLoader(name: string): IResourceLoader | null;
}
