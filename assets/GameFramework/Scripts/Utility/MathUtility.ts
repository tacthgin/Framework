
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MathUtility
 * DateTime = Fri Nov 05 2021 17:06:16 GMT+0800 (中国标准时间)
 * Author = xiaobaitiancai
 * FileBasename = MathUtility.ts
 * FileBasenameNoExtension = MathUtility
 * URL = db://assets/GameFramework/Scripts/Utility/MathUtility.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('MathUtility')
export class MathUtility extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
