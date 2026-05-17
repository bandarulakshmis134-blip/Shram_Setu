import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

const Landing = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (

    <div className="relative h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center text-center px-4">

      {/* BACKGROUND BLOBS */}
      <div className="absolute -top-30 -left-30 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl" />

      <div className="absolute -bottom-30 -right-30 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />

      <div className="absolute top-[30%] right-[15%] w-55 h-55 bg-indigo-200/20 rounded-full blur-3xl" />

      {/* GLASS CARD */}
      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl px-10 py-14 max-w-2xl w-full flex flex-col items-center">

        {/* LOGO */}
        <div className="float-up">

          <Logo className="w-32 h-28 mb-6" />

        </div>

        {/* TITLE */}
        <h1
          className="text-6xl md:text-7xl font-bold text-gray-800 float-up"
          style={{ animationDelay: "0.2s" }}
        >

          Shram <span className="text-blue-600">Setu</span>

        </h1>

        {/* SUBTITLE */}
        <p
          className="text-gray-600 mt-5 text-lg float-up"
          style={{ animationDelay: "0.4s" }}
        >

          Connecting Skills to Opportunities

        </p>

        {/* BUTTON */}
        <button
          onClick={handleClick}
          className="mt-10 bg-blue-600 text-white px-12 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-300 float-up"
          style={{ animationDelay: "0.6s" }}
        >

          Find Workers

        </button>

        {/* LANGUAGES */}
        <p
          className="mt-6 text-gray-500 text-sm float-up"
          style={{ animationDelay: "0.8s" }}
        >

          Also available in Hindi, Telugu, Tamil, Kannada, Malayalam

        </p>

      </div>

    </div>

  );

};

export default Landing;