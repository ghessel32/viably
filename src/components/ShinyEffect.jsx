const ShinyText = ({ text, disabled = false, speed = 2, className = "" }) => {
  return (
    <>
      <style>{`
        @keyframes shine {
          0% { background-position: 100% center; }
          100% { background-position: -100% center; }
        }
      `}</style>
      <div
        className={`${className} w-1/2 mt-2`}
        style={{
          backgroundImage:
            "linear-gradient(120deg, #6b7280 40%, #ffffff 50%, #6b7280 60%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: disabled ? "none" : `shine ${speed}s linear infinite`,
        }}
      >
        <p>{text}</p>
      </div>
    </>
  );
};
export default ShinyText;
