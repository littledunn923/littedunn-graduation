import { ArrowBigDown, ArrowBigLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Custom hook for typewriter effect on scroll into view
const useTypewriterOnScroll = (
  text: string,
  speed: number = 30
): [string, React.RefObject<HTMLDivElement | null>, boolean] => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const hasStartedRef = useRef(false);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasStartedRef.current) return;

    const startTyping = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setIsTyping(true);
      setDisplayedText("");

      let currentIndex = 0;
      typeIntervalRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
            typeIntervalRef.current = null;
          }
        }
      }, speed);
    };

    // Check if element is already visible
    const rect = element.getBoundingClientRect();
    const isVisible =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;

    if (isVisible) {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        startTyping();
      }, 100);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            startTyping();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
    };
  }, [text, speed]);

  return [displayedText, elementRef, isTyping];
};

const InviteScreen = ({
  setScreen,
}: {
  setScreen: (screen: string) => void;
}) => {
  const thankYouText =
    "Trải qua 4 năm đại học, em/mình cảm thấy thật sự may mắn vì xung quanh luôn có những người bạn, những anh chị đã xuất hiện, giúp đỡ và đồng hành trong những cột mốc quan trọng nhất. Nhờ có mọi người, 4 năm đại học của em/mình trở nên rất vui vẻ, thật rực rỡ và đầy ắp những kỷ niệm mà chắc chắn sau này nhớ lại sẽ vẫn mỉm cười. Sự hiện diện của mọi người làm cho hành trình này ấm áp và ý nghĩa hơn rất nhiều.\nEm/Mình biết ơn lắm — và luôn trân trọng tất cả.";

  const timeText = "10:30 - 12:30";
  const dateText = "Thứ Bảy, 29/11/2025";
  const locationText = "Trường Đại học Kinh tế - Luật";
  const locationText2 = "669 QL1A, khu phố 6, Thủ Đức, Thành phố Hồ Chí Minh";
  const phoneText = "0868011923";
  const messageText = "Gọi em/mình để tìm thấy nhao nha!!!";

  const [displayedThankYouText, thankYouTextRef, isTypingThankYou] =
    useTypewriterOnScroll(thankYouText, 20);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--url-bg",
      "url('bg-desktop-invite.png')"
    );
  }, []);
  return (
    <div className="h-full w-full text-[#8C3500] overflow-y-auto scroll-smooth snap-y snap-mandatory">
      <button
        className="absolute top-5 left-5 z-20"
        onClick={() => setScreen("welcome")}
      >
        <ArrowBigLeft className="size-6" fill="#8C3500" />
      </button>
      <div className="relative min-h-full w-full flex flex-col items-center justify-center px-[5%] sm:px-[10%] snap-start">
        <h1 className="text-7xl sm:text-8xl font-black grenze-bold tracking-widest animate-fade animate-once animate-duration-[2000ms]">
          GRADUATION
        </h1>
        <p className="text-white text-5xl mt-3 indie-flower-regular drop-shadow-lg drop-shadow-[#F6CA92]">
          ceremony
        </p>
        <div className="text-base sm:text-2xl font-medium mt-9 text-center">
          <div className="flex items-baseline justify-center gap-3">
            Thân mời:{" "}
            <div className="h-[40px] bonheur-royale-regular text-[40px] border-dashed border-b-2 border-[#8C3500] mb-[-2px]">
              Quý anh chị em bạn dì gần xa
            </div>
          </div>
          <p className="mt-2 sm:mt-4">
            Cùng đến chung vui và chụp hình lưu niệm cùng em/mình nhân ngày tốt
            nghiệp
          </p>
        </div>
        <div className="relative w-fit h-fit mb-15  mt-9">
          <img className="absolute" src="degree.png" alt="degree" />
          <img
            className="relative animate-[super-light-bounce_1s_infinite]"
            src="avatar-run.png"
            alt="avatar"
            width={703}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
          <div className="space-y-3 text-center py-3 sm:py-0 animate-fade animate-once animate-duration-[2000ms]">
            <p className="font-semibold text-2xl">{timeText}</p>
            <p className="text-base font-medium">{dateText}</p>
          </div>
          <div className="h-px w-full border-b-2 border-dashed border-[#8C3500] sm:hidden" />
          <div className="space-y-3 text-center py-3 sm:py-0 animate-fade animate-once animate-duration-[2000ms]">
            <p className="font-semibold text-2xl">{locationText}</p>
            <p className="text-base font-medium">{locationText2}</p>
          </div>
          <div className="h-px w-full border-b-2 border-dashed border-[#8C3500] sm:hidden" />
          <div className="space-y-3 text-center py-3 sm:py-0 animate-fade animate-once animate-duration-[2000ms]">
            <p className="font-semibold text-2xl">{phoneText}</p>
            <p className="text-base font-medium">{messageText}</p>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce text-[#8C3500]">
          <ArrowBigDown className="size-6" fill="#8C3500" />
        </div>
      </div>

      <div className="relative min-h-full w-full flex flex-col items-center justify-center snap-start text-center px-[5%] sm:px-[10%]">
        <h1 className="text-7xl sm:text-8xl font-black grenze-bold tracking-widest z-10 animate-fade animate-once animate-duration-[2000ms]">
          LỜI CẢM ƠN
        </h1>
        <div
          ref={thankYouTextRef}
          className="text-base sm:text-2xl font-medium text-center mt-16 leading-[48px] z-10 whitespace-pre-line"
        >
          {displayedThankYouText}
          {isTypingThankYou && (
            <span className="inline-block w-0.5 h-[1.2em] bg-[#8C3500] ml-1 animate-pulse" />
          )}
        </div>
        <img
          src="cloud-thankyou.png"
          alt="cloud"
          className="absolute left-1/2 top-0 -translate-x-1/2 z-0"
        />
        {!isTypingThankYou && (
          <>
            <div className="relative w-fit h-fit mb-15 mt-9 animate-fade animate-once animate-duration-[2000ms]">
              <img
                className="relative"
                src="avatar-thankyou.png"
                alt="avatar"
                width={532}
              />
            </div>
            <div className="text-center font-semibold text-2xl animate-fade animate-once animate-duration-[2000ms]">
              Thanks a lot!!!
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteScreen;
