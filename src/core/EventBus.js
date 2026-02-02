let instance = null;

export class EventBus {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._listeners = {};
  }

  static getInstance() {
    if (!instance) new EventBus();
    return instance;
  }

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this._listeners[event]) return;
    for (const cb of this._listeners[event]) {
      cb(data);
    }
  }
}
