import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';

class InputField extends React.Component {
    render() {
        return (
            <div>
                
                <input className="d-block w-100"
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChange={ (e) => this.props.onChange(e.target.value)}
                />
                
            </div>
        )
    }
}

export default InputField;
