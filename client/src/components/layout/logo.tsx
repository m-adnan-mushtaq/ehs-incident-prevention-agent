import { SelmtLogo } from "@/assets";
import { Link } from "react-router";

const SelmtNavLogo = () => {
  return (
    <Link to={"/"} className="py-4 text-center">
      <img
        className="w-36 mx-auto object-contain"
        src={SelmtLogo}
        alt="Selmt"
      />
    </Link>
  );
};

export default SelmtNavLogo;
