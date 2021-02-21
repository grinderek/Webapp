import React from 'react'
import InputField from './InputField';
import SubmitButton from './SubmitButton'
import UserStore from './stores/UserStore'
import validator from 'validator'
import 'bootstrap/dist/css/bootstrap.css';

class SignUpForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
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
            email: '',
            buttonDisabled: false
        })
    }

    async doSignUp() {

        if (!this.state.username) {
            return;
        }

        if (!this.state.password) {
            return;
        }

        if (!this.state.email) {
            return;
        }

        if (validator.isEmail(this.state.email) === false) {
            alert("Email is not valid");
            this.resetForm();
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            
            let res = await fetch('/signUp', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email
                })
            });

            
            let result = await res.json();
            if (result && result.success) {
                UserStore.signUp = false;
                alert(result.msg);
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
                
                <h2 className='text-center'>Registration</h2>

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
                        type='email'
                        placeholder='Email'
                        value={this.state.email ? this.state.email : ''}
                        onChange={ (val) => this.SetInputValue('email', val) }
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
                        text='Sign up'
                        disabled={this.state.buttonDisabled}
                        onClick={ () => this.doSignUp() }
                        class='btn btn-primary btn-lg btn-block'
                    />
                </div>

                <div>
                    Or press <a href={"#"} onClick={ () => UserStore.signUp = false } >Sign in</a> if you have an account
                </div>
            
            </div>
        )
    }
}

export default SignUpForm;