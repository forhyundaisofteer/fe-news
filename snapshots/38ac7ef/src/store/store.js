export class Store {
  constructor(initialState, reducer) {
    this.state = { ...initialState };
    this.reducer = reducer;
    this.subscribers = [];
  }

  getState() {
    return { ...this.state };
  }

  dispatch(actionType, payload) {
    const newState = this.reducer(this.state, actionType, payload);
    this.state = newState;
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => {
      callback(this.getState());
    });
  }
}

