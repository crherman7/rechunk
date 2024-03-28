declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RECHUNK_USERNAME: string;
      RECHUNK_PASSWORD: string;
    }
  }
}

export {};
