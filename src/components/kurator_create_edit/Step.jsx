"use client";

const Step = ({ text, number, children }) => {
  return (
    <section className="grid gap-y-8">
      <div className="flex items-center">
        <div className="w-16 h-16 flex items-center justify-center border-2 border-text-clr rounded-full">
          <h1 className="text-text-clr">{number}</h1>
        </div>
        <h2 className="ml-4">{text}</h2>
      </div>
      {children}
    </section>
  );
};

export default Step;
