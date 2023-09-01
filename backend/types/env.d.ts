declare global {
  namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI:string
        PORT:number
        ADMINSECRET :string
        USERSECRET :string
      }
  }
}

export {}