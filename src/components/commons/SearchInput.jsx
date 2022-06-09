/*global chrome*/
import searchIcon from "../../assets/search.png"
import "../component.css";
function SearchInput({
  children,
  style,
  className,
  onChange,
  onClick,
  onFocus,
  onKeyPress,
  placeholder,
  value,
  ref,
  id,
  styleInput
}) {
  return (
    <div className={`search-field ${className}`} style={style}>
      <input
        onChange={onChange}
        onKeyPress={onKeyPress}
        onClick={onFocus}
        placeholder={placeholder}
        className="search-input"
        value={value}
        ref={ref}
        id={id}
        style={styleInput}
      />
      <img
        src={searchIcon}
        alt="search-icon"
        className="search-icon"
        onClick={onClick}
      />
    </div>
  );
}

export default SearchInput;
