import{TypedUseSelectorHook,useDispatch,useSelector}from"react-redux";import type{RootState,makeStore}from"./index";
export const useAppDispatch:()=>ReturnType<typeof makeStore>["dispatch"]=useDispatch;export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector;
