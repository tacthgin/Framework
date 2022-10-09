import { _decorator, Component, Sprite, SpriteFrame } from "cc";
import { GameApp } from "../GameFramework/Application/Base/GameApp";
import { GameFrameworkError } from "../GameFramework/Script/Base/GameFrameworkError";
import { IRerference } from "../GameFramework/Script/Base/ReferencePool/IRerference";
import { ReferencePool } from "../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { Bindable } from "../GameFramework/Script/Base/Variable/Bindable";
import { ObjectBase } from "../GameFramework/Script/ObjectPool/ObjectBase";
import { ScheduleBase } from "../GameFramework/Script/Time/Schedule/ScheduleBase";
import { Utility } from "../GameFramework/Script/Utility/Utility";
import { AstarFactory } from "../GameFramework/ToolLibary/Astar/AstarFactory";
import { IAstarMap } from "../GameFramework/ToolLibary/Astar/IAstarMap";

const { ccclass, property } = _decorator;

class B extends ObjectBase {
    constructor() {
        super();
    }
    clear(): void {}
}

class HelloWorldClass<T> implements IRerference {
    public value: T | null = null;

    clear(): void {}
}

class HelloWorldClass1<T> implements IRerference {
    public value: T | null = null;

    clear(): void {}
}

interface A {}

class C<T> {}

interface IAstarVec2 {
    x: number;
    y: number;
}

class AstarMapTest implements IAstarMap {
    private map: Array<Array<number>> = new Array<Array<number>>(
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 0, 1, 1, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 1, 1],
        [0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 0, 0, 0, 1, 0, 0, 0]
    );

    get width(): number {
        return this.map[0].length;
    }

    get height(): number {
        return this.map.length;
    }

    check(position: IAstarVec2): boolean {
        return this.map[position.y][position.x] == 0;
    }

    drawPath(path: IAstarVec2[]) {
        let copymap = Utility.System.clone(this.map) as Array<Array<number>>;
        path.forEach((position) => {
            copymap[position.y][position.x] = 2;
        });
        this.print(copymap);
    }

    print(map?: Array<Array<number>>) {
        map = map || this.map;
        map.forEach((value) => {
            console.log(value);
        });
    }
}

class ScheduleText extends ScheduleBase {
    async test1() {
        while (1) {
            console.log("ScheduleText", Date.now());
            await this.sleep(2);
        }
    }
}

class BindableTest {
    public a: Bindable<number> = Bindable.create(0);
}

class BindableTest1 {
    registerEvent(bindableTest: BindableTest) {
        bindableTest.a.subscribe(this.onBindTest1, this);
        bindableTest.a.subscribe(this.onBindTest2, this);
    }

    unregisterEvent(bindableTest: BindableTest) {
        bindableTest.a.unsubscribeTarget(this);
    }

    onBindTest1(value: number) {
        console.log("BindableTest1 onBindTest1", value);
    }

    onBindTest2(value: number) {
        console.log("BindableTest1 onBindTest2", value);
    }
}

class BindableTest2 {
    registerEvent(bindableTest: BindableTest) {
        bindableTest.a.subscribe(this.onBindTest1);
        bindableTest.a.subscribe(this.onBindTest2, this);
    }

    unregisterEvent(bindableTest: BindableTest) {
        bindableTest.a.unsubscribeTarget(this);
    }

    onBindTest1(value: number) {
        console.log("BindableTest2 onBindTest1", value);
    }

    onBindTest2(value: number) {
        console.log("BindableTest2 onBindTest2", value);
    }
}

@ccclass("Test")
export class Test extends Component {
    private a: number = 1;
    @property(Sprite)
    private testSp: Sprite = null!;

    start() {
        //GameFrameworkEntry.getModule<IEventManager>("EventManager").subscribe(1, this.onCallback, this);
        //this.testC();
        this.testSound();
        this.testD();
        this.testE();
        //this.testAstar();
        Utility.Date.format(Date.now(), "hh:mm:ss");
        let h1 = ReferencePool.acquire<HelloWorldClass<number>>(HelloWorldClass);
        h1.value = 111;
        ReferencePool.release(h1);
        let h4 = ReferencePool.acquire<HelloWorldClass<number>>(HelloWorldClass);
        console.log(h4.value);
        let h2 = ReferencePool.acquire<HelloWorldClass<string>>(HelloWorldClass);
        h2.value = "333";
        let h3 = ReferencePool.acquire(HelloWorldClass);
        let h5 = ReferencePool.acquire<HelloWorldClass<number>>(HelloWorldClass1);
        h5.value = 1;
        console.log(ReferencePool.getAllReferencePoolInfos());

        let scheduleText = new ScheduleText();
        //scheduleText.test1();

        let bindableTest = new BindableTest();
        let bindableTest1 = new BindableTest1();
        let bindableTest2 = new BindableTest2();
        bindableTest1.registerEvent(bindableTest);
        bindableTest2.registerEvent(bindableTest);
        bindableTest.a.value = 5;
        bindableTest1.unregisterEvent(bindableTest);
        bindableTest.a.value = 6;
        bindableTest2.unregisterEvent(bindableTest);
        bindableTest.a.value = 7;
    }

    onCallback(sender: object, e: any) {
        console.log("receive sender", sender, e);
    }

    testSound() {
        //GameApp.SoundManager.playBackgroundSound("Sound/background");
        // this.scheduleOnce(() => {
        //     GameApp.SoundManager.pauseSound(GameApp.SoundManager.backgroundSoundId);
        // }, 20);
        // this.scheduleOnce(() => {
        //     GameApp.SoundManager.resumeSound(GameApp.SoundManager.backgroundSoundId);
        // }, 30);
    }

    async testa() {
        //let id = await GameApp.SoundManager.playSound("Sound/attack");
        //console.log(id, GameApp.SoundManager.getSoundGroup("Sound/attack")?.soundAgentCount);
    }

    async testC() {
        console.log(Date.now());
        let sp = await GameApp.ResourceManager.loadAssetWithCallback("1/player_down_0", SpriteFrame, null, (err, data) => {
            console.log(GameApp.ResourceManager.getAsset("1/player_down_0", SpriteFrame), data);
        });
        console.log(Date.now());
    }

    testD() {
        let newValue = null;
        try {
            newValue = JSON.stringify(1111);
        } catch (error) {
            console.log(error);
            throw new GameFrameworkError("json parse failed, value is invalid");
        }
        console.log(newValue, typeof newValue);
        return newValue;
    }

    testE() {
        GameApp.SaveManager.setString("hello", "world");
        console.log(GameApp.SaveManager.getString("hello", "world"));

        GameApp.SaveManager.setObject("hello1", {
            a: 1,
            b: "dssss",
            c: { a: 1 },
        });

        console.log(GameApp.SaveManager.getObject("hello1"));

        GameApp.SaveManager.setNumber("hello2", 1);
        console.log(GameApp.SaveManager.getNumber("hello2"));
        console.log(GameApp.SaveManager.count);
    }

    testAstar() {
        let map = new AstarMapTest();
        map.print();

        let astar = AstarFactory.createEightDirectionAstar(map);
        let path = astar.makePath({ x: 0, y: 0 }, { x: 9, y: 9 });
        console.log(astar.astarNodeCount);
        console.log("********************");
        map.drawPath(path);
        path = astar.makePath({ x: 0, y: 2 }, { x: 9, y: 9 });
        console.log(astar.astarNodeCount);
        console.log("********************");
        map.drawPath(path);
        astar = AstarFactory.createCrossAstar(map);
        path = astar.makePath({ x: 0, y: 0 }, { x: 9, y: 9 });
        console.log("********************");
        map.drawPath(path);
    }
}
