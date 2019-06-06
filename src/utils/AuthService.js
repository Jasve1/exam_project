const jwtDecode = require('jwt-decode');
class AuthService {

    constructor(auth_api_url) {
        this.auth_api_url = auth_api_url;
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
    }

    login(username, password) {
        return this.fetch(this.auth_api_url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            if(res.msg === "Wrong password"){
                return Promise.reject('wrong password')
            }else{
                this.setToken(res.token, res.user._id);
                console.log(res.msg);
                return Promise.resolve(res);
            }
            
        })
    }

    loggedIn() {
        const token = this.getToken();

        if(token){
            if (jwtDecode(token).exp < Date.now() / 1000) {
                this.logout()
            }
        }

        return (token !== null);
    }

    setToken(token, userId) {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
    }

    getToken() {
        return localStorage.getItem('token')
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }

    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
        .then(response => response.json());
    }
}

export default AuthService;
