export interface Reader<T> {
  read: () => Promise<T | null>;
}
