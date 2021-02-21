import { extendObservable } from 'mobx';

class UserStore{
    constructor() {
        extendObservable(this, {

            loading: true,
            isLoggedIn: false,
            username: '',
            signUp: false,
            data: []

        })
    }
}

export default new UserStore();