import configData from "../config/config.json";
import axios from 'axios';

export const getProductsBySellerid = async (key, value) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "get",
                url: `${configData.BASEURL}productBykey?field=${key}&value=${value}`
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