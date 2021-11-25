import { IRerference } from "./IRerference";

export interface ReferenceType<T extends IRerference> {
    new (): T;
}
