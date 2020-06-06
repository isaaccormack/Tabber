import NavigationStateInterface from "../components/common/navigation/reducers/NavigationStateInterface";
import UserStateInterface from "../components/common/user/reducers/UserStateInterface";

export default interface RootState {
    navigationState: NavigationStateInterface,
    userState: UserStateInterface
}