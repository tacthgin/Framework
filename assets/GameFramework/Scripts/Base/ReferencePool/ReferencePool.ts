import { ReferenceCollection } from "./ReferenceCollection";

export class ReferencePool {
    private static s_referenceCollections = new Map<{ new (): any }, ReferenceCollection>();

    static get count() {
        return this.s_referenceCollections.size;
    }

    
}
