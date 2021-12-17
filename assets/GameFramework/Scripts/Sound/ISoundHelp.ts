import { ISoundAgentHelp } from "./ISoundAgentHelp";

export interface ISoundHelp {
    acquireSoundAgentHelp(): ISoundAgentHelp;
    getBackgroundAgentHelp(): ISoundAgentHelp;
}
