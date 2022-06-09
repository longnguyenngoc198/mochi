/*global chrome*/

import "../component.css";

function ButtonCustom({children, style, onClick }) {


  return (
    <div
      className={`mochi_btn_custom`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default ButtonCustom;
