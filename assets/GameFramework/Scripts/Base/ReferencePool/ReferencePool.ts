import { IRerference } from "./IRerference";
import { ReferenceCollection } from "./ReferenceCollection";
import { ReferencePoolInfo } from "./ReferencePoolInfo";
import { ReferenceType } from "./ReferenceType";

export class ReferencePool {
    private static s_referenceCollections = new Map<ReferenceType<IRerference>, ReferenceCollection>();

    static get count() {
        return this.s_referenceCollections.size;
    }

    static getAllReferencePoolInfos(): ReferencePoolInfo[] {
        let referencePoolInfos: ReferencePoolInfo[] = [];
        this.s_referenceCollections.forEach((refererenceCollection: ReferenceCollection, referenceType: ReferenceType<IRerference>) => {
            referencePoolInfos.push(
                new ReferencePoolInfo(
                    referenceType,
                    refererenceCollection.addReferenceCount,
                    refererenceCollection.removeReferenceCount,
                    refererenceCollection.acquireReferenceCount,
                    refererenceCollection.usingRerferenceCount,
                    refererenceCollection.releaseRerferenceCount
                )
            );
        });

        return referencePoolInfos;
    }

    static acquire<T extends IRerference>(referenceType: ReferenceType<T>): T {
        let referenceCollection = this.getReferenceCollection(referenceType);
        return referenceCollection.acquire(referenceType);
    }

    static release(reference: IRerference): void {
        this.getReferenceCollection(reference.constructor as ReferenceType<IRerference>).release(reference);
    }

    static add(referenceType: ReferenceType<IRerference>, count: number): void {
        this.getReferenceCollection(referenceType).add(count);
    }

    static remove(referenceType: ReferenceType<IRerference>, count: number): void {
        this.getReferenceCollection(referenceType).remove(count);
    }

    private static getReferenceCollection(referenceType: ReferenceType<IRerference>): ReferenceCollection {
        let referenceCollection: ReferenceCollection | undefined = this.s_referenceCollections.get(referenceType);
        if (!referenceCollection) {
            referenceCollection = new ReferenceCollection(referenceType);
            this.s_referenceCollections.set(referenceType, referenceCollection);
        }
        return referenceCollection;
    }
}