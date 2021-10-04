export interface Writer<T> {
  write: (data: T) => Promise<void>;
}
