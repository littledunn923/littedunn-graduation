import { cn } from "@sglara/cn";
import InviteScreen from "./components/InviteScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Sparkle from "react-sparkle";

function App() {
  const [screen, setScreen] = useState("welcome");
  const [isLoading, setIsLoading] = useState(false);

  const handleScreenChange = (newScreen: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
      setScreen(newScreen);
    }, 2500);
  };

  useEffect(() => {
    document.addEventListener("click", () => {
      const music = document.getElementById("musicplayer") as HTMLAudioElement;
      music.muted = false;
      music.play();
    });
  }, []);

  return (
    <main
      className={cn("relative h-dvh w-dvw bg-cover bg-center overflow-hidden")}
      style={{
        backgroundImage: "var(--url-bg)",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-50">
          <Loading />
        </div>
      )}
      <Sparkle
        color="#8C3500"
        minSize={10}
        maxSize={20}
        fadeOutSpeed={10}
        flicker
        flickerSpeed="slowest"
      />
      {screen === "welcome" ? (
        <WelcomeScreen setScreen={handleScreenChange} />
      ) : (
        <InviteScreen setScreen={handleScreenChange} />
      )}
    </main>
  );
}

export default App;
