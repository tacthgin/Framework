import { IRerference } from "../Base/ReferencePool/IRerference";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";

export class PlaySoundParams implements IRerference {
    private _volumeInSoundGroup: number = 1;
    private _loop: boolean = false;
    private _time: number = 0;
    private _muteInSoundGroup: boolean = false;

    get volumeInSoundGroup(): number {
        return this._volumeInSoundGroup;
    }

    get muteInSoundGroup(): boolean {
        return this._muteInSoundGroup;
    }

    get loop(): boolean {
        return this._loop;
    }

    get time(): number {
        return this._time;
    }

    static create(loop: boolean = false, volumeInSoundGroup: number = 1, muteInSoundGroup: boolean = false, time: number = 0): PlaySoundParams {
        let playSoundParams = ReferencePool.acquire(PlaySoundParams);
        playSoundParams._volumeInSoundGroup = volumeInSoundGroup;
        playSoundParams._muteInSoundGroup = muteInSoundGroup;
        playSoundParams._loop = loop;
        playSoundParams._time = time;
        return playSoundParams;
    }

    clear(): void {
        this._volumeInSoundGroup = 1;
        this._loop = false;
        this._time = 0;
    }
}
