import AsyncStorage from "@react-native-community/async-storage"
import Axios from "axios"
import { GET_DIALOGS, GET_MY_INFO, GET_POSTS_URL, SIGN_IN_URL } from "../constants/Common"
import AuthData from "../models/AuthData"
import Dialog from "../models/Dialog"
import Message from "../models/Message"
import Post from "../models/Post"
import User from "../models/User"

type BoxType = {
  SENTBOX: "sentbox";
  INBOX:"inbox",
  STARRED:'starred'
};
export default class REST{
    static signIn (username:string,password:string):Promise<AuthData> {
        return Axios
        .request<AuthData>({
          url: SIGN_IN_URL,
          method: "POST",
          data: {
            username,
            password
          },
        })
        .then((response) => {
          return response.data
        })
    }
    static getPosts (authorId?:string):Promise<Array<Post>> {
      const url = `${GET_POSTS_URL}${authorId?`&author=${authorId!}`:''}`
      return Axios.request<Array<Post>>({
        url: url,
        method: "GET",
      }).then((response) => {
        return response.data;
      });
    }
    static async getMyInfo():Promise<User> {
      const token = await REST.getToken();
      console.log('Token',token);
      
      return Axios.request<User>({
        url: GET_MY_INFO,
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {        
        return response.data;
      });
    }
    

    static async getDialogs():Promise<Array<Dialog>> {
      const token = await REST.getToken();
      const response = await Axios.request<Array<Dialog>>({
        url: GET_DIALOGS,
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data;
    }
    
    static async getMessages(user_id:number):Promise<Array<Message>> {
      const token = await REST.getToken();
      const response = await Axios.request<Array<Message>>({
        url: `${GET_DIALOGS}/${user_id}`,
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      return response.data;
    }
    static async sendMessage(user_id:number,message:string) {
      const token = await REST.getToken();
      const response = await Axios.request({
        url: GET_DIALOGS,
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data:{
          to: user_id,
          message
        }
      })
      return response.data;
    }

    private static getToken():Promise<string|null>{
      return AsyncStorage.getItem('token')
    }
    
}