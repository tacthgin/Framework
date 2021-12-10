import { AssetManager } from "cc";

export type ResourceProgressCallback = (finished: number, total: number, item: AssetManager.RequestItem) => void;

export type ResourceCompleteCallback<T> = (err: Error, data: T) => void;
