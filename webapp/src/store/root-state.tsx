import NavigationStateInterface from "../components/common/header/reducers/NavigationStateInterface";
import UserStateInterface from "../components/common/user/reducers/UserStateInterface";
import FileStateInterface from "../components/createOLD/reducers/FileStateInterface";

export default interface RootState {
    navigationState: NavigationStateInterface,
    userState: UserStateInterface,
    fileState: FileStateInterface
}  