import { IResourceLoader } from "./IResourceLoader";

export interface IResourceManager {
    /**
     * 内置的动态resources加载
     */
    readonly internalResourceLoader: IResourceLoader;

    /**
     * 获取资源加载器
     * @param name
     */
    getResourceLoader(name: string): IResourceLoader | null;
}
