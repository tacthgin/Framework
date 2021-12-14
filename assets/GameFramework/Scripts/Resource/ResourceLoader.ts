import { Asset, assetManager, AssetManager } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { IResourceLoader } from "./IResourceLoader";
import { IResourceLoaderHelp } from "./IResourceLoaderHelp";
import { IResourceManager } from "./IResourceManager";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./ResourceCallback";

export class ResourceLoader implements IResourceLoader {
    private _resourceLoaderHelp: IResourceLoaderHelp = null!;
    private _cachedDirs: Map<string, Array<Asset>> = null!;
    private _resourceManger: IResourceManager = null!;

    constructor(resourceLoaderHelp: IResourceLoaderHelp, resourceManager: IResourceManager) {
        this._resourceLoaderHelp = resourceLoaderHelp;
        this._resourceManger = resourceManager;
        this._cachedDirs = new Map<string, Array<Asset>>();
    }

    shutDown(): void {
        this._cachedDirs.clear();
    }

    loadAsset<T extends Asset>(path: string, assetType: Constructor<T>): Promise<T | null> {
        return new Promise<T | null>((resolve) => {
            let asset = this._resourceLoaderHelp.get(path, assetType);
            if (asset) {
                resolve(asset);
            } else {
                this._resourceLoaderHelp.load(path, assetType, null, (err: Error | null, data: T) => {
                    if (err) {
                        GameFrameworkLog.error(err.message);
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    loadAssetWithCallback<T extends Asset>(path: string, assetType: Constructor<T>, onProgress?: ResourceProgressCallback, onComplete?: ResourceCompleteCallback<T>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let asset = this._resourceLoaderHelp.get(path, assetType);
            if (asset) {
                onComplete && onComplete(null, asset);
                resolve(true);
            } else {
                this._resourceLoaderHelp.load(
                    path,
                    assetType,
                    (finished: number, total: number, item: AssetManager.RequestItem) => {
                        onProgress && onProgress(finished, total, item);
                    },
                    (err: Error | null, data: T) => {
                        onComplete && onComplete(err, data);
                        resolve(true);
                    }
                );
            }
        });
    }

    loadDir<T extends Asset>(path: string, assetType: Constructor<T>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let result = this._cachedDirs.get(path);
            if (result) {
                resolve(true);
            } else {
                this._resourceLoaderHelp.loadDir(path, assetType, null, (err: Error | null, data: T[]) => {
                    if (err) {
                        GameFrameworkLog.error(err.message);
                        resolve(false);
                    } else {
                        this._cachedDirs.set(path, data);
                        resolve(true);
                    }
                });
            }
        });
    }

    loadDirWithCallback<T extends Asset>(path: string, assetType: Constructor<T>, onProgress?: ResourceProgressCallback, onComplete?: ResourceCompleteCallback<T[]>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let result = this._cachedDirs.get(path);
            if (result) {
                resolve(true);
            } else {
                this._resourceLoaderHelp.loadDir(
                    path,
                    assetType,
                    (finished: number, total: number, item: AssetManager.RequestItem) => {
                        onProgress && onProgress(finished, total, item);
                    },
                    (err: Error | null, data: T[]) => {
                        if (!err) {
                            this._cachedDirs.set(path, data);
                        }
                        onComplete && onComplete(err, data);
                        resolve(!!err);
                    }
                );
            }
        });
    }

    getAsset<T extends Asset>(path: string, assetType?: Constructor<T>): T | null {
        return this._resourceLoaderHelp.get(path, assetType);
    }

    releaseDir(path: string): void {
        let assets = this._cachedDirs.get(path);
        if (assets) {
            assets.forEach((asset) => {
                this._resourceManger.releaseAsset(asset);
            });
            this._cachedDirs.delete(path);
        }
    }
}
