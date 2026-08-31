import { Link } from "react-router-dom";
import logoMark from "../../assets/Spot-N-FindBlack.svg";

export default function Brand({ onClick }) {
  return (
    <Link className="brand" to="/" onClick={onClick} aria-label="SongSeekr home">
      <span className="brand-mark" aria-hidden="true">
        <img src={logoMark} alt="" />
      </span>
      <span>songseekr</span>
    </Link>
  );
}
