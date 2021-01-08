import {UserInterface} from "../user/interface/UserInterface";

export interface LickInterface {
    id: number
    name: string
    description: string
    dateUploaded: string
    audioFileLocation: string
    audioLength: number
    tab: string
    tuning: string
    capo: number
    isPublic: boolean
    sharedWith: UserInterface[]
    owner: UserInterface
}