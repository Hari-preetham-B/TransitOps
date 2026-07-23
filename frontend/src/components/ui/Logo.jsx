function Logo({ size = "md", showTagline = false, dark = false }) {
  const sizes = {
    sm: {
      box: "h-9 w-9 text-lg",
      title: "text-xl",
      subtitle: "text-xs",
    },
    md: {
      box: "h-11 w-11 text-xl",
      title: "text-2xl",
      subtitle: "text-sm",
    },
    lg: {
      box: "h-14 w-14 text-2xl",
      title: "text-3xl",
      subtitle: "text-base",
    },
  };

  const current = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center rounded-xl bg-blue-600 font-bold text-white ${current.box}`}
      >
        T
      </div>

      <div>
        <h1
          className={`font-bold ${
            dark ? "text-white" : "text-slate-900"
          } ${current.title}`}
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          TransitOps
        </h1>

        {showTagline && (
          <p
            className={`${
              dark ? "text-slate-400" : "text-slate-500"
            } ${current.subtitle}`}
          >
            Smart Fleet Management
          </p>
        )}
      </div>
    </div>
  );
}

export default Logo;
