import { Astar } from "./Astar";
import { CrossAstarHelp } from "./AstarHelp/CrossAstarHelp";
import { EightDirectionAstarHelp } from "./AstarHelp/EightDirectionAstarHelp";
import { IAstar } from "./IAstar";
import { IAstarMap } from "./IAstarMap";

/**
 * A*工厂
 */
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

    /**
     * 走八方向格子的astar
     * @param astarMap
     * @returns
     */
    static createEightDirectionAstar(astarMap: IAstarMap): IAstar {
        let astar = new Astar(astarMap);
        astar.setAstarHelp(new EightDirectionAstarHelp());
        return astar;
    }
}
