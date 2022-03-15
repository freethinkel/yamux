type Type = string | number;
type Callback<T extends unknown = unknown> = (payload?: T) => void;

export class EventEmitter {
  private _listeners: Record<string, Callback> = {};

  destroy() {
    this._listeners = {};
  }

  emit<T extends unknown>(type: Type, payload: T) {
    const cb = this._listeners[type];
    if (cb) {
      cb(payload);
    }
  }

  on(type: Type, cb: Callback) {
    this._listeners[type] = cb;
  }
}
