export {};

declare module "./backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  }
  interface Backend {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  }
}
