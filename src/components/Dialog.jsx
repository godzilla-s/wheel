/* eslint-disable no-undef */

import "./Dialog.css"
import { createPortal } from "react-dom";

export function Dialog(props) {
    if (!props.isOpen) return null;
    
    // console.log(props)
    return createPortal(
        <div className="model-overlay">
            <div className="model-content">
                <h2>{props.content}</h2>
                <button onClick={props.onClose}>OK</button>
            </div>
        </div>,
        document.getElementById('wheel-game')
    )
}
