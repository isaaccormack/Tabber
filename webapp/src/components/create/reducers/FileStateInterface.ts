export interface LickFormInterface {
    lickname: string
    lickdescription: string
    licktuning: string
    lickcapo: number
    lickpublic: boolean
}

export default interface FileStateInterface {
    file: File | undefined
    metadata: LickFormInterface | undefined
} 