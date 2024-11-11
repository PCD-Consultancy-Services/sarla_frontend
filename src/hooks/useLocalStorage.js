import { User } from "../constants"

export const useLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem(User))
    return data;
}