import{configureStore,createSlice,PayloadAction}from"@reduxjs/toolkit";
const ui=createSlice({name:"ui",initialState:{openMenu:null as string|null,drawer:false},reducers:{setMenu:(s,a:PayloadAction<string|null>)=>{s.openMenu=a.payload},toggleDrawer:s=>{s.drawer=!s.drawer},closeAll:s=>{s.openMenu=null;s.drawer=false}}});
const hero=createSlice({name:"hero",initialState:{active:0,paused:false},reducers:{setActive:(s,a:PayloadAction<number>)=>{s.active=a.payload},setPaused:(s,a:PayloadAction<boolean>)=>{s.paused=a.payload}}});
const festival=createSlice({name:"festival",initialState:{ms:16*36e5+36*6e4},reducers:{tick:(s,a:PayloadAction<number>)=>{s.ms=Math.max(0,s.ms-a.payload)}}});
export const{setMenu,toggleDrawer,closeAll}=ui.actions;export const{setActive,setPaused}=hero.actions;export const{tick}=festival.actions;
export const makeStore=()=>configureStore({reducer:{ui:ui.reducer,hero:hero.reducer,festival:festival.reducer}});
export type RootState=ReturnType<ReturnType<typeof makeStore>["getState"]>;
