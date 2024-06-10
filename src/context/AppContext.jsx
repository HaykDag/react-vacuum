import { createContext, useReducer } from "react";


export const AppContext = createContext();

export const appReducer = (state,action)=>{
    switch(action.type){
        case "SWITCH_TRAINING":
            console.log(state.training)
            return {
               ...state,
               training: !(state.training) 
            }
        case "SET_CONTROL":
            return{
                ...state,
                control:action.payload
            }
        case "SET_HEADERSTATUS":
            return {
              ...state, 
              headerStatus: state.headerStatus=== '' ? 'edit' : ''
             }
        case "SET_CURRROOM":
            return {
              ...state,
              currRoom: action.payload
             }
        case "ADD_ROOM":
            return { 
              ...state,
              rooms: [...state.rooms,action.payload],
             }
        case "ADD_ROOMS":
            return {
              ...state,
              rooms: [...state.rooms,...action.payload]
             }
        case "RESET_ROOMS":
            return {
              ...state,
              rooms:['room1','room2','room3']
             }
        case "DELETE_ROOM":
          const newRooms = state.rooms.filter((r)=>r!==action.payload);
            return {
              ...state,
              rooms: [...newRooms]
             }
        default:
            return state;
    }
}

const appState = {
  training: false,
  control: 'KEYS',
  headerStatus: '',
  rooms:['room1','room2','room3'],
  currRoom: 'room1',
}

export const AppContextProvider = ({Children})=>{

    const [state,dispatch] = useReducer(appReducer,appState);

    return(
        <AppContext.Provider value={{...state,dispatch}}>
            {Children}
        </AppContext.Provider>
    )
}