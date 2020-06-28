import {UserInterface} from "../../user/interface/UserInterface";

export interface LickInterface {
    id: number
    name: string
    description: string
    dateUploaded: string
    audioFileLocation: string
    audioLength: number
    tab: string,
    tuning: string
    isPublic: boolean,
    sharedWith: UserInterface[]
    owner: any
}