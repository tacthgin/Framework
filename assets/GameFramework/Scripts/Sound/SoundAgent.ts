import { ISoundAgent } from "./ISoundAgent";
import { ISoundAgentHelp } from "./ISoundAgentHelp";
import { ISoundGroup } from "./ISoundGroup";

export class SoundAgent implements ISoundAgent {
    private _soundGroup: ISoundGroup = null!;
    private _soundAgentHelp: ISoundAgentHelp = null!;
    private _soundId: number = 0;
    private _soundAsset: object | null = null;
    private _muteInSoundGroup: boolean = false;
    private _volumeInSoundGroup: number = 1;

    constructor(soundGroup: ISoundGroup, soundAgentHelp: ISoundAgentHelp) {
        this._soundGroup = soundGroup;
        this._soundAgentHelp = soundAgentHelp;
    }

    get soundGroup(): ISoundGroup {
        return this._soundGroup;
    }

    get soundId(): number {
        return this._soundId;
    }

    get isPlaying(): boolean {
        return this._soundAgentHelp.isPlaying;
    }

    get length(): number {
        return this._soundAgentHelp.length;
    }

    set time(value: number) {
        this._soundAgentHelp.time = value;
    }

    get time(): number {
        return this._soundAgentHelp.time;
    }

    get mute(): boolean {
        return this._soundAgentHelp.mute;
    }

    set muteInSoundGroup(value: boolean) {
        this._muteInSoundGroup = value;
        this.refreshMute();
    }

    get muteInSoundGroup(): boolean {
        return this._muteInSoundGroup;
    }

    set loop(value: boolean) {
        this._soundAgentHelp.loop = value;
    }

    get loop(): boolean {
        return this._soundAgentHelp.loop;
    }

    get volume(): number {
        return this._soundAgentHelp.volume;
    }

    set volumeInSoundGroup(value: number) {
        this._volumeInSoundGroup = value;
        this.refreshVolume();
    }

    get volumeInSoundGroup(): number {
        return this._volumeInSoundGroup;
    }

    play(): void {
        throw new Error("Method not implemented.");
    }

    stop(): void {
        throw new Error("Method not implemented.");
    }

    resume(): void {
        throw new Error("Method not implemented.");
    }

    pause(): void {
        throw new Error("Method not implemented.");
    }

    refreshMute() {
        this._soundAgentHelp.mute = this._soundGroup.mute || this._muteInSoundGroup;
    }

    refreshVolume() {
        this._soundAgentHelp.volume = this._soundGroup.volume * this._volumeInSoundGroup;
    }
}
