import { instantiate, Node } from "cc";
import { INodeHelper } from "../../NodePool/INodeHelper";

export class CNodeHelper implements INodeHelper {
    instantiateNode(asset: object): object {
        return instantiate(asset);
    }

    releaseNode(node: object): void {
        let ccNode = node as Node;
        if (ccNode.parent) {
            ccNode.removeFromParent();
        }
    }
}
