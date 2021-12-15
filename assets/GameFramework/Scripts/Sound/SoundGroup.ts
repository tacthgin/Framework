import { GameFrameworkError } from "../Base/GameFrameworkError";
import { ISoundGroup } from "./ISoundGroup";
import { SoundAgent } from "./SoundAgent";

export class SoundGroup implements ISoundGroup {
    private _name: string = "";
    private _soundAgents: Array<SoundAgent> = null!;
    private _mute: boolean = false;
    private _volume: number = 1;

    constructor(name: string) {
        if (!name) {
            throw new GameFrameworkError("sound group name is invalid");
        }
        this._name = name;
        this._soundAgents = new Array<SoundAgent>();
    }

    get name(): string {
        return this._name;
    }

    get soundAgentCount(): number {
        return this._soundAgents.length;
    }

    set mute(value: boolean) {
        this._mute = value;
    }

    get mute(): boolean {
        return this._mute;
    }

    set volume(value: number) {
        this._volume = value;
    }

    get volume(): number {
        return this._volume;
    }

    stopAllLoadedSounds(): void {
        
    }
}
