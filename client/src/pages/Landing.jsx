import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

const Landing = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-linear-to-br from-blue-100/40 via-white/60 to-gray-100/40 backdrop-blur-sm">

  <div className="float-up">
    <Logo className="w-30 h-25 mb-6" />
  </div>

  <h1 className="text-7xl font-bold text-gray-800 float-up" style={{ animationDelay: "0.2s" }}>
    Shram <span className="text-blue-600">Setu</span>
  </h1>

  <p className="text-gray-500 mt-4 text-lg float-up" style={{ animationDelay: "0.4s" }}>
    Connecting Skills to Opportunities
  </p>

  <button
    onClick={handleClick}
    className="mt-10 bg-blue-600 text-white px-12 py-5 rounded-lg shadow-md hover:bg-blue-700 transition float-up"
    style={{ animationDelay: "0.6s" }}
  >
    Find Workers
  </button>

  <p className="mt-6 text-gray-400 text-sm float-up" style={{ animationDelay: "0.8s" }}>
    Also available in Hindi, Telugu, Tamil, Kannada, Malayalam
  </p>

</div>
  );
};

export default Landing;