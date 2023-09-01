import { atom } from "recoil";

// type chapter = {
//   name: string
//   description: string
//   html: string
//   _id: object
// }
// type allcontent = {
//   __id:object
//   id:string
//   chapters:chapter[]
// }
// let content: null|allcontent = null
export const contentState = atom({
  key:"contentState",
  default: {
    isLoading:true,
    content: null
  }
})