import { Astar } from "./Astar";
import { CrossAstarHelp } from "./AstarHelp/CrossAstarHelp";
import { IAstar } from "./IAstar";
import { IAstarMap } from "./IAstarMap";

export class AstarFactory {
    /**
     * 走十字格子的astar
     * @param astarMap
     * @returns
     */
    static createCrossAstar(astarMap: IAstarMap): IAstar {
        let astar = new Astar(astarMap);
        astar.setAstarHelp(new CrossAstarHelp());
        return astar;
    }
}
