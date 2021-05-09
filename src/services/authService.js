import configData from "../config/config.json";
import axios from 'axios';

export const login = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(body);
            const info = {
                method: "post",
                url: `${configData.BASEURL}signin`,
                data: body
            }
            let response = await axios(info);
            //console.log(response);
            resolve(response.data);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

export const logout = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(body);
            const info = {
                method: "get",
                url: `${configData.BASEURL}signout`
            }
            let response = await axios(info);
            console.log(response);
            resolve(response.data);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};