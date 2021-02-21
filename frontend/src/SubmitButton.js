import React from 'react'

class SubmitButton extends React.Component {
    render() {
        return (
            <div>
                
                <button
                    disabled={this.props.disabled}
                    onClick={ () => this.props.onClick() }
                    class={this.props.class}
                >
                    {this.props.text}
                </button>
            </div>
        );
    }
}

export default SubmitButton;
