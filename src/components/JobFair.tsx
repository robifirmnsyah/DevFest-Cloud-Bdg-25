import { Briefcase, Users, TrendingUp, Target, Zap, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JobFair = () => {
  const benefits = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Meet hiring companies",
      description: "Connect directly with tech companies ready to hire",
      color: "text-[#4285F4]",
      bg: "bg-[#E8F4FF]"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Find real job opportunities",
      description: "Discover open positions in Cloud, AI, and IT",
      color: "text-[#EA4335]",
      bg: "bg-[#FFEAEA]"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Live networking",
      description: "Build connections with industry professionals",
      color: "text-[#34A853]",
      bg: "bg-[#E8F5E9]"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Explore career paths in Cloud, AI, and IT",
      description: "Learn about cutting-edge tech roles",
      color: "text-[#FBBC05]",
      bg: "bg-[#FFF9E6]"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Get guidance straight from recruiters",
      description: "Direct insights from hiring managers",
      color: "text-[#8B5CF6]",
      bg: "bg-[#EDE9FE]"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Explore exciting tech careers",
      description: "Discover new opportunities in tech industry",
      color: "text-[#FF6B6B]",
      bg: "bg-[#FFE8E8]"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background" id="jobfair">
      <div className="container mx-auto px-6 md:px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg mb-4 md:mb-6">
            <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-[#4285F4]" />
            <h2 className="text-xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent">
              IT Jobfair Exhibition
            </h2>
          </div>

          <div className="max-w-3xl mx-auto px-2">
            <h3 className="text-lg md:text-3xl font-bold text-[#34A853] mb-3 md:mb-4">
              To all tech enthusiasts
            </h3>
            <p className="text-sm md:text-xl text-[#222] font-medium mb-2">
              Coders, engineers, or product minds
            </p>
            <p className="text-xs md:text-lg text-[#666] font-semibold">
              Don't miss your chance to meet companies ready to recruit.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto mb-8 md:mb-12 px-2 md:px-0">
          {/* Call All Tech Talent Badge - positioned above card */}
          <div className="flex justify-start mb-0 -mb-4 md:-mb-6 ml-2 md:ml-8 relative z-10">
            <div className="inline-block bg-gradient-to-r from-[#EA4335] to-[#C71610] text-white px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-xl transform -rotate-3">
              <p className="text-sm md:text-2xl font-black tracking-wide">
                Call All Tech Talent! 📢
              </p>
            </div>
          </div>
          
          <Card className="bg-white border-3 md:border-4 border-[#4285F4] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-5 md:p-12">
              <h3 className="text-lg md:text-3xl font-black text-center mb-6 md:mb-8 text-[#222]">
                Discover What's Waiting for You at the Job Fair 🚀
              </h3>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 md:gap-4 p-3 md:p-6 rounded-xl md:rounded-2xl ${benefit.bg} border-2 border-transparent hover:border-current transition-all hover:scale-105 cursor-pointer`}
                  >
                    <div className={`${benefit.color} flex-shrink-0 w-5 h-5 md:w-6 md:h-6`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm md:text-lg mb-1 md:mb-2 ${benefit.color}`}>
                        {benefit.title}
                      </h4>
                      <p className="text-xs md:text-sm text-[#666]">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto border-3 md:border-4 border-[#FBBC05] mx-2 md:mx-auto">
            <h3 className="text-xl md:text-4xl font-black text-[#222] mb-4 md:mb-6">
              Ready to Launch Your Tech Career? 🎯
            </h3>
            <p className="text-sm md:text-xl text-[#666] mb-6 md:mb-8 max-w-2xl mx-auto">
              Join us at the IT Job Fair and connect with top tech companies looking for talent like you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="text-sm md:text-xl px-6 md:px-10 py-4 md:py-6 rounded-full bg-gradient-to-r from-[#4285F4] to-[#1a73e8] hover:from-[#1a73e8] hover:to-[#4285F4] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-black"
                >
                  Register for Job Fair
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobFair;
