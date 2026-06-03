import { SelmtLogo } from "@/assets";
import { useAuthStore } from "@/store/auth";
import { Link, Navigate, Outlet, useLocation } from "react-router";

const redirectHandler = (prevUrl: string) => {
  if (!prevUrl) return "/dashboard";
  if (prevUrl.startsWith("/dashboard")) return prevUrl;
  return prevUrl;
};

const AuthLayout = () => {
  const user = useAuthStore((store) => store.user);
  const { state } = useLocation();

  if (user) return <Navigate to={redirectHandler(state?.prevUrl)} replace />;
  return (
    <div className="bg-muted h-screen w-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl border space-y-6 text-center py-8 px-4 md:px-6 px w-[90%] max-w-[36rem]">
        <Link to="/">
          <img
            src={SelmtLogo}
            alt="Bercleys"
            className={"mx-auto w-40 object-contain"}
          />
        </Link>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
