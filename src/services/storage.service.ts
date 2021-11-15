export class StorageService {
  static setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {}
  }

  static getItem(key: string): any | null {
    try {
      const data = localStorage.getItem(key);
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }
}
