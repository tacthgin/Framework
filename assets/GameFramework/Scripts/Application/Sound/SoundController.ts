import { AudioSource, Component, Node, _decorator } from "cc";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ISoundAgentHelp } from "../../Sound/ISoundAgentHelp";
import { ISoundHelp } from "../../Sound/ISoundHelp";
import { CSoundAgentHelp } from "./CSoundAgentHelp";

const { ccclass, property, executionOrder } = _decorator;

@ccclass("SoundController")
@executionOrder(0)
export class SoundController extends Component implements ISoundHelp {
    @property(AudioSource)
    private backgroundAudioSource: AudioSource = null!;
    @property(Node)
    private audioSourceNode: Node = null!;

    private _backgroundSoundAgentHelp: ISoundAgentHelp | null = null;

    onLoad() {
        if (!this.backgroundAudioSource) {
            throw new GameFrameworkError("backgroundAudioSource is null");
        }

        if (!this.audioSourceNode) {
            throw new GameFrameworkError("audio source node is null");
        }
        this._backgroundSoundAgentHelp = new CSoundAgentHelp(this.backgroundAudioSource);
    }

    acquireSoundAgentHelp(): ISoundAgentHelp {
        let audioSource = this.audioSourceNode.addComponent(AudioSource);
        return new CSoundAgentHelp(audioSource);
    }

    getBackgroundAgentHelp(): ISoundAgentHelp {
        return this._backgroundSoundAgentHelp!;
    }
}
