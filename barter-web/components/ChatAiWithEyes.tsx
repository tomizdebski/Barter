"use client";

import { useEffect, useRef } from "react";

const ChatAiWithEyes = () => {
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moveEye = (eye: SVGCircleElement | null, originX: number, originY: number) => {
        if (!eye) return;
        const rect = eye.ownerSVGElement?.getBoundingClientRect();
        if (!rect) return;

        const dx = e.clientX - (rect.left + originX);
        const dy = e.clientY - (rect.top + originY);
        const angle = Math.atan2(dy, dx);
        const radius = 2;

        const x = originX + radius * Math.cos(angle);
        const y = originY + radius * Math.sin(angle);

        eye.setAttribute("cx", x.toFixed(2));
        eye.setAttribute("cy", y.toFixed(2));
      };

      moveEye(leftPupilRef.current, 14.8773, 44.0494);
      moveEye(rightPupilRef.current, 30.7465, 44.0494);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-[72px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg
        viewBox="0 0 61 73"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <path
          d="M28.7098 11.9636C29.3493 11.5582 30.1637 11.5523 30.8091 11.9482L57.7788 28.4938C59.0325 29.2629 59.0425 31.081 57.7974 31.8639L29.379 49.733C28.6963 50.1623 27.8215 50.1355 27.1663 49.6652L2.38715 31.8772C1.24528 31.0575 1.29468 29.343 2.48186 28.5904L28.7098 11.9636Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.8201 27.1885C14.1513 27.1885 7.9346 33.4052 7.9346 41.074V50.9922C7.9346 58.6609 14.1513 64.8777 21.8201 64.8777H35.0918L37.872 70.8969C38.5813 72.4328 40.7642 72.4328 41.4736 70.8969L44.6842 63.9458C49.8764 61.9358 53.5584 56.894 53.5584 50.9922V41.074C53.5584 33.4052 47.3416 27.1885 39.6729 27.1885H21.8201Z"
          fill="#4AB699"
        />
        {/* Prawe oko */}
        <circle cx="34.7137" cy="44.0494" r="6.94275" fill="white" />
        <mask id="rightEyeMask" maskUnits="userSpaceOnUse" x="27" y="37" width="15" height="14">
          <circle cx="34.7137" cy="44.0494" r="6.94275" fill="white" />
        </mask>
        <g mask="url(#rightEyeMask)">
          <circle
            ref={rightPupilRef}
            cx="30.7465"
            cy="44.0494"
            r="4.9591"
            fill="black"
          />
        </g>

        {/* Lewe oko */}
        <circle cx="18.8446" cy="44.0494" r="6.94275" fill="white" />
        <mask id="leftEyeMask" maskUnits="userSpaceOnUse" x="11" y="37" width="15" height="14">
          <circle cx="18.8446" cy="44.0494" r="6.94275" fill="white" />
        </mask>
        <g mask="url(#leftEyeMask)">
          <circle
            ref={leftPupilRef}
            cx="14.8773"
            cy="44.0494"
            r="4.9591"
            fill="black"
          />
        </g>

        {/* Uśmiech */}
        <circle cx="28.7628" cy="55.9513" r="2.97546" fill="#5DE3C0" />
        <circle cx="36.6973" cy="55.9513" r="2.97546" fill="#5DE3C0" />
        <circle cx="20.8282" cy="55.9513" r="2.97546" fill="#5DE3C0" />

        {/* Ogon czapki */}
        <path
          d="M4.95914 32.6434V31.1557H1.98367V32.6434H4.95914ZM1.98367 49.5044C1.98367 50.326 2.64975 50.9921 3.47141 50.9921C4.29306 50.9921 4.95914 50.326 4.95914 49.5044H1.98367ZM1.98367 32.6434L1.98367 49.5044H4.95914L4.95914 32.6434H1.98367Z"
          fill="black"
        />
      </svg>
    </div>
  );
};

export default ChatAiWithEyes;
