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

export const verificationEmail = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "get",
                url: `${configData.BASEURL}verify-email?token=${token}`
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

export const usersDataByApproval = async (order, user_role, approval_status, limit, offset) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "get",
                url: `${configData.BASEURL}userByApproval?order=${order}&user_role=${user_role}&approval_status=${approval_status}&limit=${limit}&offset=${offset}`
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

export const filterAdmins = async (value, approval_status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "get",
                url: `${configData.BASEURL}filterAdminData?value=${value}&approval_status=${approval_status}`
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

export const deleteUsersAndProducts = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = {
                method: "delete",
                url: `${configData.BASEURL}deleteUserWithProducts?id=${id}`
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