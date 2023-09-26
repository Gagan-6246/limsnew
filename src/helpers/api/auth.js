// @flow
import { APICore } from './apiCore';
import config from '../../config';

const api = new APICore();

// account
function login(params) {
    const baseUrl = config.LIMS_API_URLS + '/user/login';
    console.log(baseUrl, 'login url');
    console.log(params, 'login params');

    return api.create(`${baseUrl}`, params);
}

function logout() {
    const baseUrl = '/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params) {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params) {
    const baseUrl = '/forget-password/';
    return api.create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params) {
    const baseUrl = '/password/reset/confirm/';
    return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword, forgotPasswordConfirm };
