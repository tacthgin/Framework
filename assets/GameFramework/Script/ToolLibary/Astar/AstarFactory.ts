import { Astar } from "./Astar";
import { CrossAstarHelper } from "./AstarHelper/CrossAstarHelper";
import { EightDirectionAstarHelper } from "./AstarHelper/EightDirectionAstarHelper";
import { IAstar } from "./IAstar";
import { IAstarHelper } from "./IAstarHelper";
import { IAstarMap } from "./IAstarMap";

/**
 * A*工厂
 */
export class AstarFactory {
    /**
     * 走十字格子的A*
     * @param astarMap 地图
     * @returns
     */
    static createCrossAstar(astarMap: IAstarMap): IAstar {
        return this.createCustomAstar(astarMap, new CrossAstarHelper());
    }

    /**
     * 走八方向格子的A*
     * @param astarMap 地图
     * @returns
     */
    static createEightDirectionAstar(astarMap: IAstarMap): IAstar {
        return this.createCustomAstar(astarMap, new EightDirectionAstarHelper());
    }

    /**
     * 自定义的A*
     * @param astarMap 地图
     * @param astarHelper A*辅助器
     * @returns
     */
    static createCustomAstar(astarMap: IAstarMap, astarHelper: IAstarHelper): IAstar {
        let astar = new Astar(astarMap);
        astar.setAstarHelper(astarHelper);
        return astar;
    }
}
