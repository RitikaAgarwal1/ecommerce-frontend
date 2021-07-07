import configData from "../config/config.json";
import axios from 'axios';

export const deleteProductsBySelection = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "delete",
                url: `${configData.BASEURL}deleteBulkProducts`,
                data: {
                    "ids": body
                }
            }
            let response = await axios(info);
            //console.log(response.data);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

export const deleteProduct = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "delete",
                url: `${configData.BASEURL}deleteProduct?id=${id}`
            }
            let response = await axios(info);
            //console.log(response.data);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}