import { useNavigate } from "react-router-dom";

const WorkerCTA = () => {

  const navigate = useNavigate();
  const handleClick = () => {

 const user = sessionStorage.getItem("user");

 if(!user){

   navigate("/login");

 } else {

   navigate("/worker-register");

 }

};

  return (

    <div className="mx-6 mt-10 bg-[#1f2d3d] text-white rounded-3xl py-14 px-6 text-center shadow-lg">

      <h2 className="text-3xl font-bold mb-4">
        Are you a skilled worker?
      </h2>

      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
        Join Shram Setu today to find consistent work and grow your earnings.
        Registration is free and easy.
      </p>

      <button

        onClick={handleClick}

        className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"

      >

        Register as Worker

      </button>

    </div>

  );

};

export default WorkerCTA;