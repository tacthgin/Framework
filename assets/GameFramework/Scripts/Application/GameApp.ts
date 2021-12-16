import { _decorator, Component, Node } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { IModel } from "./Model/IModel";
const { ccclass, property } = _decorator;

@ccclass("GameApp")
export class GameApp extends Component {
    static _instance: GameApp | null = null;

    onLoad() {}
}
