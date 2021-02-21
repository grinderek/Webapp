import React from 'react'
import { observer } from 'mobx-react'
import LoginForm from './LoginForm'
import UserStore from './stores/UserStore'
import SignUpForm from './SignUpForm'
import LoggedInForm from './LoggedInForm'
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {

    async componentDidMount() {
        try {
            let res = await fetch('/isLoggedIn', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let result = await res.json();

            if (result && result.success) {
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
                UserStore.data = result.data;
            }

            else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }

        catch(e) {
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
        }
    }

    render() {

        if (UserStore.loading){
            return (
                <div className="w-100 h-100">
                    Loading, sorry...
                </div>
            )
        }
        
        else{
            
            if (UserStore.isLoggedIn) {
                return (
                    <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center m-0">
                        <LoggedInForm 
                            user={UserStore.username}
                            data={UserStore.data}
                        />
                    </div>   
                )
            }

            if (UserStore.signUp) {
                return (
                    <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center m-0">
                        <SignUpForm />
                    </div>
                )
            }

            return (
                <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center m-0">
                    <LoginForm />
                </div>
            );
        }
    }
}

export default observer(App);
