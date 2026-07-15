import * as React from "react";

export default function GooeyValue({ value, morphTime = 0.5, className = "", textClassName = "" }) {
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
        text2Ref.current.style.opacity = String(Math.pow(nextFraction, 0.4));

        // Current text blurs out and fades out
        const currFraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / currFraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = String(Math.pow(currFraction, 0.4));
      }

      if (fraction < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsMorphing(false);
        if (text1Ref.current && text2Ref.current) {
          text1Ref.current.style.filter = "";
          text1Ref.current.style.opacity = "0";
          text2Ref.current.style.filter = "";
          text2Ref.current.style.opacity = "1";
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
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '1.2em', 
        verticalAlign: 'middle',
        overflow: 'visible'
      }} 
      className={className}
    >
      <div
        style={{
          filter: "url(#gooey-threshold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
          height: "100%"
        }}
      >
        {/* Invisible sizing placeholder to match bounds and avoid page reflow shifts */}
        <span 
          className={textClassName} 
          style={{ 
            visibility: 'hidden', 
            userSelect: 'none', 
            pointerEvents: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}
        >
          {nextText.length > currentText.length ? nextText : currentText}
        </span>

        {/* Text 1: Absolute center positioning */}
        <span
          ref={text1Ref}
          className={textClassName}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            userSelect: "none",
            display: "inline-block",
            whiteSpace: "nowrap",
            opacity: isMorphing ? 1 : 0
          }}
        >
          {currentText}
        </span>

        {/* Text 2: Absolute center positioning */}
        <span
          ref={text2Ref}
          className={textClassName}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            userSelect: "none",
            display: "inline-block",
            whiteSpace: "nowrap",
            opacity: isMorphing ? 0 : 1
          }}
        >
          {nextText}
        </span>
      </div>
    </div>
  );
}
