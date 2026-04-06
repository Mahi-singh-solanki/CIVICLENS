import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Apiclient from "../api/Api";
import { Slab } from "react-loading-indicators";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("Token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await Apiclient.get("/user/me", {
          headers: {
            Authorization: token,
          },
        });

        setUser(res.data);
      } catch (err) {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
         <Slab color="#006e39" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;