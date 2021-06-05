import configData from "../config/config.json";
import axios from 'axios';

export const login = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log(body);
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
            //console.log(response);
            resolve(response.data);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

export const registration = async (body) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "post",
                url: `${configData.BASEURL}register`
            }
            let response = await axios(info, body);
            //console.log(response.data);
            resolve(response.data);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

export const getUserDetailsByKey = async (key, value, order_by, direction, limit, offset) => {
    return new Promise(async (resolve, reject) => {
        try {
            let info = {};
            if (order_by == undefined && direction == undefined && limit == undefined && offset == undefined) {
                info = {
                    method: "get",
                    url: `${configData.BASEURL}userDetails?field=${key}&value=${value}`
                }
            } else {
                info = {
                    method: "get",
                    url: `${configData.BASEURL}userDetails?field=${key}&value=${value}&order_by=${order_by}&order=${direction}&limit=${limit}&offset=${offset}`
                }
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

export const deleteUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "delete",
                url: `${configData.BASEURL}deleteUser?id=${id}`
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

export const deleteUsersBySelection = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "delete",
                url: `${configData.BASEURL}deleteBulkUsers`,
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