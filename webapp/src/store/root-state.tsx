import NavigationStateInterface from "../components/common/navigation/reducers/NavigationStateInterface";
import UserStateInterface from "../components/common/user/reducers/UserStateInterface";
import FileStateInterface from "../components/create/reducers/FileStateInterface";

export default interface RootState {
    navigationState: NavigationStateInterface,
    userState: UserStateInterface,
    fileState: FileStateInterface,
}  