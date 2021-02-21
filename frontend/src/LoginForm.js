/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import InputField from './InputField';
import SubmitButton from './SubmitButton'
import UserStore from './stores/UserStore'
import 'bootstrap/dist/css/bootstrap.css';

class LoginForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false
        }
    }

    SetInputValue(property, val){
        val = val.trim();
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin() {

        if (!this.state.username) {
            return;
        }

        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {

            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
                UserStore.data = result.data;
            }

            else if (result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
            this.resetForm();
        }

    }

    render() {
        return (
            <div className='w-100' style={{maxWidth: "450px"}}>
                
                <h2 className='text-center'>Login</h2>

                <div className='pb-2'>
                    <InputField
                        type='text'
                        placeholder='Username'
                        value={this.state.username ? this.state.username : ''}
                        onChange={ (val) => this.SetInputValue('username', val) }
                    />
                </div>
                
                <div className='pb-2'>
                    <InputField
                        type='password'
                        placeholder='Password'
                        value={this.state.password ? this.state.password : ''}
                        onChange={ (val) => this.SetInputValue('password', val) }
                    />
                </div>

                <div>
                    <SubmitButton
                        text='Sign in'
                        disabled={this.state.buttonDisabled}
                        onClick={() => this.doLogin()}
                        class='btn btn-primary btn-lg btn-block'
                    />
                </div>

                <div>
                    Or press <a href='#' onClick={ () => UserStore.signUp = true} >Sign up</a> if new
                </div>
            
            </div>
        )
    }
}

export default LoginForm;
