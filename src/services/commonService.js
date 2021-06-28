import configData from "../config/config.json";
import axios from 'axios';

export const filterFromData = async (tableName, key, value) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "get",
                url: `${configData.BASEURL}filterData?tableName=${tableName}&key=${key}&value=${value}`
            }
            let response = await axios(info);
            //console.log(response);
            resolve(response.data);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export const sendEmail = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "post",
                url: `${configData.BASEURL}sendMail`,
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
}

export const updateData = async (body) => {
    return new Promise(async(resolve, reject) => {
        try{
            const info = {
                method: "put",
                url: `${configData.BASEURL}updateByColName`,
                data: body
            }
            let response = await axios(info);
            //console.log(response);
            resolve(response.data);
        } catch (err){
            console.log(err);
            reject(err);
        }
    })
}