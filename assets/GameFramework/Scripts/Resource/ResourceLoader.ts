import { Asset, AssetManager } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { IResourceLoaderHelp } from "./IResourceLoaderHelp";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./ResourceCallback";

export class ResourceLoader {
    private _resourceLoaderHelp: IResourceLoaderHelp = null!;
    private _cachedAssets: Map<Constructor<Asset>, Map<string, Asset>> = null!;

    constructor(resourceLoaderHelp: IResourceLoaderHelp) {
        this._resourceLoaderHelp = resourceLoaderHelp;
        this._cachedAssets = new Map<Constructor<Asset>, Map<string, Asset>>();
    }

    loadAsset<T extends Asset>(path: string, assetType?: Constructor<T>): Promise<T | null> {
        return new Promise<T | null>((resolve) => {
            this._resourceLoaderHelp.load(path, assetType, null, (err: Error, data: T) => {
                if (err) {
                    GameFrameworkLog.error(err.message);
                    resolve(null);
                    return;
                }
                resolve(data);
            });
        });
    }

    loadAssetWithCallback<T extends Asset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback, onComplete?: ResourceCompleteCallback<T>): Promise<T | null> {
        return new Promise<T | null>((resolve) => {
            this._resourceLoaderHelp.load(
                path,
                assetType,
                (finished: number, total: number, item: AssetManager.RequestItem) => {
                    onProgress && onProgress(finished, total, item);
                },
                (err: Error, data: T) => {
                    if (err) {
                        GameFrameworkLog.error(err.message);
                        resolve(null);
                    }
                    resolve(data);
                    onComplete && onComplete(err, data);
                }
            );
        });
    }

    loadDir<T>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback, onComplete?: ResourceCompleteCallback<T>) {}

    private getAssetMap(assetConstructor: Constructor<Asset>): Map<string, Asset> {
        if (!assetConstructor) {
            throw new GameFrameworkError("assetConstructor is invalid");
        }
        let assetMap = this._cachedAssets.get(assetConstructor);
        if (!assetMap) {
            assetMap = new Map<string, Asset>();
            this._cachedAssets.set(assetConstructor, assetMap);
        }
        return assetMap;
    }

    private defaultCompleteCallback<T>(err: Error, data: T) {}
}
