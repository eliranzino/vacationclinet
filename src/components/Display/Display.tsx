import React from 'react';
import "./Display.css"
import { State } from '../../store';
import { connect } from 'react-redux';


interface DisplayProps {
    message: string;
}

class _Display extends React.Component<DisplayProps> {
    render() {
        const {message} = this.props;
        return (
            <div className="Messages"> Messages:
            <div className="display">{message}</div>
            </div>
        )
    }
}
const mapStateToProps = (state: State) => ({
    message: state.message,
});

export const Display = connect(mapStateToProps)(_Display);