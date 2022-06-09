/*global chrome*/

import "../component.css";
import cross from '../../assets/cross.png'
import {Modal} from 'react-bootstrap'
function MainModal(props) {
  return (
    <Modal
      {...props}
      // size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {props.mascot && (
        <img src={props.mascot} alt="mascot" className="modal-mascot" />
      )}

      <img
        src={cross}
        alt="mascot"
        className="modal-close-btn"
        onClick={props.handleClose}
      />

      <div className="modal-children">{props.children}</div>
    </Modal>
  );
}

export default MainModal;
