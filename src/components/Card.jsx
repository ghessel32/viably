import React from "react";
import { Lightbulb } from "lucide-react";

const Card = ({ onClick, ideas }) => {
  return ideas.map((idea) => (
    <div className="" onClick={() => onClick(idea.id)} key={idea.id}>
      <div className="w-[320px] h-[340px] flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden">
        {/* Gradient background overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-[#47e5d0]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

        <div className="h-1/2 flex items-center justify-center relative z-10">
          {/* Animated ripple waves */}
          <div className="relative">
            <div className="absolute inset-0 -m-2 animate-ripple-1">
              <div className="w-full h-full bg-[#47e5d0]/30 rounded-full"></div>
            </div>

            <div className="absolute inset-0 -m-6 animate-ripple-2">
              <div className="w-full h-full bg-[#47e5d0]/20 rounded-full"></div>
            </div>

            <div className="absolute inset-0 -m-10 animate-ripple-3">
              <div className="w-full h-full bg-[#47e5d0]/10 rounded-full"></div>
            </div>

            {/* Icon */}
            <div className="relative">
              <Lightbulb className="w-12 h-12 bg-linear-to-br from-[#47e5d0] to-[#2dd4bf] p-3 rounded-full text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center mt-4">
          <h1 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-[#47e5d0] transition-colors duration-300 line-clamp-2 capitalize">
            {idea.idea}
          </h1>

          {/* Decorative line */}
          <div className="mt-4 h-1 w-0 group-hover:w-full bg-linear-to-r from-[#47e5d0] to-[#0fd6d6] rounded-full transition-all duration-500 mx-auto"></div>
        </div>
      </div>
    </div>
  ));
};

export default Card;
