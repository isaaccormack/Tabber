import {LickFormInterface} from "../../edit/component/EditForm";

export default interface FileStateInterface {
    file: File | undefined
    metadata: LickFormInterface | undefined
}