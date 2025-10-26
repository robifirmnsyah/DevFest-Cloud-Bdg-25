import { Calendar, Users, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Conference Talks",
      description: "Gain insights from thought leaders and GDEs on cutting-edge topics related to AI, Cloud, security, and scalability."
    },
    {
      icon: Wrench,
      title: "Workshops",
      description: "Participate in hands-on, intensive sessions to acquire practical skills with Google technologies and tools."
    },
    {
      icon: Users,
      title: "Exhibition",
      description: "Explore the future of technology, connect with leading companies, and discover new products."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-[hsl(271,76%,53%)] to-secondary bg-clip-text text-transparent">
            About DevFest Cloud
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            DevFest Cloud 2025 is the world's largest community-driven tech conference, bringing together passionate developers from around the globe. Hosted annually by Google Developer Groups, DevFest offers a unique opportunity to explore developer tools, learn from Google and Google Developer Experts, and connect with fellow developers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="gradient-card border-primary/20 hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About GDG */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Google Developer Groups</h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            When you join a Google Developer Group Cloud, you'll have the opportunity to learn new skills in a variety of formats. You'll also meet local developers virtually or in-person with similar interests in technology. The community prides itself on being an inclusive environment where everyone and anyone interested in tech - from beginner developers to experienced professionals are welcome to join.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
