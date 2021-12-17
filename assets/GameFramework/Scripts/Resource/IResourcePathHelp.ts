import { Asset } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";

export interface IResourcePathHelp {
    getPath<T extends Asset>(path: string, assetType?: Constructor<T>): string;
}
