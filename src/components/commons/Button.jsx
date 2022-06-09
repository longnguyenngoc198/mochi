/*global chrome*/

import "../component.css";

function Button({children, style, className, onClick }) {


  return (
    <div
      className={`mochi_main_btn ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Button;
