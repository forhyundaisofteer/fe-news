import { store } from './index.js';

/* 
  React-Redux의 useSelector 역할
  selector에 등록한 state가 바뀌었을 때만 onChange 호출
*/
export const observeStore = (selector, onChange, equalityFn) => {
  let lastSelectedState;

  function handleChange() {
    const nextState = selector(store.getState());
    
    const isEqual = equalityFn 
      ? equalityFn(lastSelectedState, nextState)
      : lastSelectedState === nextState;
    
    if (!isEqual) {
      lastSelectedState = nextState;
      onChange(lastSelectedState, store.getState());
    }
  }
  
  const unsubscribe = store.subscribe(handleChange);
  handleChange(); 

  return unsubscribe;
};

