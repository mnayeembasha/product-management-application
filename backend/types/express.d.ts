import { UserType } from "./models/User";
declare global{
    namespace Express{
        interface Request{
            user?:Omit<UserType,"password">
        }
    }
}