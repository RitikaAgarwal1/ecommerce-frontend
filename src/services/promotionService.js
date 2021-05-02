import configData from "../config/config.json";
import axios from 'axios';

export const getBanner = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "get",
                url: `${configData.BASEURL}bannerDetails`
            }

            let response = await axios(info);
            if (response.data.message) {
                resolve(response.data)
            } else {
                resolve(response.data[0]);
            }
            console.log(response.data[0]);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

export const deleteAdBanner = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "delete",
                url: `${configData.BASEURL}deleteBanner`
            }

            let response = await axios(info);
            console.log(response.data);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}