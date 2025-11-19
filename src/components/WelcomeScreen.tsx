import { Mail } from "lucide-react";
import React, { useEffect } from "react";

const WelcomeScreen = ({
  setScreen,
}: {
  setScreen: (screen: string) => void;
}) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--url-bg",
      "url('bg-desktop-welcome.png')"
    );
  }, []);
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <h1 className="text-7xl sm:text-8xl font-black text-[#8C3500] grenze-bold tracking-widest sm:leading-[96px] leading-[72px] animate-fade animate-once animate-duration-[2000ms]">
        YOU GET AN INVITATION
      </h1>
      <p className="text-white text-6xl mt-3 indie-flower-regular drop-shadow-lg drop-shadow-[#F6CA92]">
        from littedunn
      </p>
      <div className="relative w-fit h-fit mb-40 mt-9">
        <img className="absolute bottom-[-30%]" src="cloud.png" alt="cloud" />
        <img
          className="relative animate-[light-bounce_1s_infinite]"
          src="avatar-welcome.png"
          alt="avatar"
          width={583}
          height={371}
        />
      </div>
      <button
        onClick={() => setScreen("invite")}
        className="flex items-center justify-center bg-[#8C3500] hover:bg-[#6A2A00] cursor-pointer text-white px-6 h-[46px] sm:h-[62px] rounded-xl gap-2 text-base sm:text-2xl font-medium"
      >
        <Mail className="size-6" />
        <p className="mt-0.25">Mở Xem Lun!!!</p>
      </button>
    </div>
  );
};

export default WelcomeScreen;
