import { create } from "zustand"; 
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"
import {AppwriteException,ID} from "appwrite"
import { account } from "@/models/client/config";

export const useAuthStore = create()(
  //* Persist will store data in localstorage(Rehydration is part of persist)
  persist(
    immer(
    //* Initial state and functions resides here
      (set) => ({
        session: null,
        jwt: null,
        user: null,
        hydrated: false,
        
        setHydrated() {
          set({ hydrated: true })
        },
        async verifySession() {
          try {
            //* Gets current session
            const session = await account.getSession("current")
            set({ session })
          } catch (error) {
            console.log(error);
          }
        },
        async login(email,password) { 
          try {

            //* Logging in with email and password
            const session = await account.createEmailPasswordSession(email, password);
            const [user, { jwt }] = await Promise.all([
              //* Gets current user  
              account.get(),
              //* Creates JWT
              account.createJWT()
              
            ])

            //* Prefs are user metaData(data abt data) not stored in database eg. theme, language, reputation etc.
            if (!user.prefs?.reputation) await account.updatePrefs({ reputation: 0 })
            set({ session, user, jwt })
            return { success: true };
          } catch (error) {
            console.log(error);
            return {
              success: false,
              error:
                error instanceof AppwriteException
                  ? error.message
                  : "Something went wrong while logging in",
            };
          }
        },
        async createAccount(name,email,password) { 
          try {

            //* Creating account (ID creates a unique id for each doc)
            await account.create(ID.unique(),email,password,name)
            return { success: true };

          } catch (error) {
            return {
              success: false,
              error:
                error instanceof AppwriteException
                  ? error.message
                  : "Something went wrong while creating account",
            };
          } 
        },
        async logout() { 
          try {
            //* Deletes all sessions
            await account.deleteSessions()
            set({ session: null, user: null, jwt: null })
            return { success: true };

          } catch (error) {
            console.log(error)
            return {
              success: false,
              error: error instanceof AppwriteException ? error.message : "Something went wrong", 
              
            }
          }
        },
      })
    ),
    //* This is used to fetch data from localstorage
    {
      name: "auth",
      onRehydrateStorage ( ){
        return (state, error) => {
          //* If data successfully fetched set hydrated = true (state)
          if(!error) state?.setHydrated()
        }
      }
    }
  )
)