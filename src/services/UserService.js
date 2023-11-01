import axios from 'axios';

const API_END_POINT = 'http://localhost:8080/api/auth'

class UserService {
    userSignIn(username, password) {
        axios.post(API_END_POINT + 'signin', {username, password}).then(response => {
            localStorage.setItem("session", JSON.stringify(response.data));
        }).catch(error => console.log(error));
    }

    userSignUp(username, email, password) {
        axios.post(API_END_POINT + 'signup', {username, email, password}).then(response => {
            console.log(JSON.stringify(response.data));
        }).catch(error => console.log(error));
    }

    retrieveCurrentUser() {
        return localStorage.getItem("session");
    }
}


export default new UserService();