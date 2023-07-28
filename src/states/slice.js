import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    role: null,
    token: null
}
const userList = [
    {fullName: "josue iradukunda", role: "admin"},
    {fullName: "Jane Smith", role: "storekeeper"},
    {fullName: "Alex Johnson", role: "tracessability"},
    // Add more users with their respective roles
];
export const globalSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.userData = action.payload;
            const {fullName} = action.payload;
            const matchedUser = userList.find((user) => user.fullName === fullName);
            state.role = matchedUser ? matchedUser.role : null;
        },
        setAuthToken: (state, action) => {
            state.token = action.payload
        },
        setUserData: (state, action) => {
            state.userData = action.payload
            state.role = state.userData.role
        },
    }
})
export const {setName, setUserData, setAuthToken} = globalSlice.actions;
export default globalSlice.reducer;