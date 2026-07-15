import * as React from "react";

export default function GooeyValue({ value, morphTime = 0.6, className = "", textClassName = "" }) {
  const [currentText, setCurrentText] = React.useState(String(value));
  const [nextText, setNextText] = React.useState(String(value));
  const [isMorphing, setIsMorphing] = React.useState(false);
  const text1Ref = React.useRef(null);
  const text2Ref = React.useRef(null);
  const animationRef = React.useRef(null);

  // Track changes to the value prop
  React.useEffect(() => {
    const valStr = String(value);
    if (valStr === nextText) return;

    setCurrentText(nextText);
    setNextText(valStr);
    setIsMorphing(true);
  }, [value, nextText]);

  React.useEffect(() => {
    if (!isMorphing) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // in seconds
      let fraction = elapsed / morphTime;

      if (fraction > 1) {
        fraction = 1;
      }

      if (text1Ref.current && text2Ref.current) {
        // Next text blurs in and fades in
        const nextFraction = fraction;
        text2Ref.current.style.filter = `blur(${Math.min(8 / nextFraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(nextFraction, 0.4) * 100}%`;

        // Current text blurs out and fades out
        const currFraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / currFraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(currFraction, 0.4) * 100}%`;
      }

      if (fraction < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsMorphing(false);
        if (text1Ref.current && text2Ref.current) {
          text1Ref.current.style.filter = "";
          text1Ref.current.style.opacity = "0%";
          text2Ref.current.style.filter = "";
          text2Ref.current.style.opacity = "100%";
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMorphing, currentText, nextText, morphTime]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', minHeight: '1.2em', verticalAlign: 'middle' }} className={className}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -8"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          filter: "url(#gooey-threshold)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "100%"
        }}
      >
        <span
          ref={text1Ref}
          className={textClassName}
          style={{
            position: "absolute",
            userSelect: "none",
            opacity: isMorphing ? "100%" : "0%",
            display: "inline-block",
            left: 0
          }}
        >
          {currentText}
        </span>
        <span
          ref={text2Ref}
          className={textClassName}
          style={{
            position: "relative",
            userSelect: "none",
            opacity: isMorphing ? "0%" : "100%",
            display: "inline-block"
          }}
        >
          {nextText}
        </span>
      </div>
    </div>
  );
}
