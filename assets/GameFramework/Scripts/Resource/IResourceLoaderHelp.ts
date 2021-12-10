import { Asset } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./ResourceCallback";

export interface IResourceLoaderHelp {
    load<T extends Asset>(path: string, type?: Constructor<T> | null, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): void;
    loadDir<T extends Asset>(path: string, type?: Constructor<T> | null, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): void;
    get<T extends Asset>(path: string, type?: Constructor<T> | null): T | null;
}
