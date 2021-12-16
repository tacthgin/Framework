import { IModel } from "./IModel";

export abstract class ModelBase implements IModel {
    get priority(): number {
        return 0;
    }

    update(elapseSeconds: number) {}

    shutDown() {}
}
