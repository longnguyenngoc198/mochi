/*global chrome*/

import "../component.css";

function PrimaryButton({
  children,
  style,
  className,
  onClick,
  disabled,
  id,
  reactRef,
}) {
  return (
    <div
      className={`mochi_primary_btn_nt ${className ? className : ""} ${
        disabled ? "disabled" : ""
      }`}
      style={style}
      onClick={onClick}
      id={id}
      ref={reactRef}
    >
      {children}
    </div>
  );
}

export default PrimaryButton;
