import NavigationStateInterface from "../components/common/navigation/reducers/NavigationStateInterface";
import UserStateInterface from "../components/common/user/reducers/UserStateInterface";
import FileStateInterface from "../components/create/reducers/FileStateInterface";
import RecordStateInterface from "../components/create/reducers/RecordStateInterface";

export default interface RootState {
    navigationState: NavigationStateInterface,
    userState: UserStateInterface,
    fileState: FileStateInterface,
    recordState: RecordStateInterface
}