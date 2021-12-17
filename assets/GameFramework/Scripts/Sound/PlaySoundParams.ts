import { IRerference } from "../Base/ReferencePool/IRerference";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";

export class PlaySoundParams implements IRerference {
    private _volume: number = 1;
    private _loop: boolean = false;
    private _time: number = 0;

    static create(volume: number = 1, loop: boolean = false, time: number = 0): PlaySoundParams {
        let playSoundParams = ReferencePool.acquire(PlaySoundParams);
        playSoundParams._volume = volume;
        playSoundParams._loop = loop;
        playSoundParams._time = time;
        return playSoundParams;
    }

    clear(): void {
        this._volume = 1;
        this._loop = false;
        this._time = 0;
    }
}
