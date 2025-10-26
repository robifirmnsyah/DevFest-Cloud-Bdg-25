import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Wrench, Users } from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Conference Talks",
    description: "Gain insights from thought leaders and GDEs on cutting-edge topics related to AI, Cloud, security, and scalability.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Workshops",
    description: "Participate in hands-on, intensive sessions to acquire practical skills with Google technologies and tools.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Exhibition",
    description: "Explore the future of technology, connect with leading companies, and discover new products.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            About DevFest Cloud
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            DevFest Cloud 2025 is the world's largest community-driven tech conference, bringing
            together passionate developers from around the globe. Hosted annually by Google
            Developer Groups, DevFest offers a unique opportunity to explore developer tools, learn
            from Google and Google Developer Experts, and connect with fellow developers.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-8 bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center items-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
        
        <div className="mt-24 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Google Developer Groups
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            When you join a Google Developer Group Cloud, you'll have the opportunity to learn new skills in a variety of
            formats. You'll also meet local developers virtually or in-person with similar interests in technology. The
            community prides itself on being an inclusive environment where everyone and anyone interested in tech - from
            beginner developers to experienced professionals are welcome to join.
          </p>
        </div>
      </div>
    </section>
  );
}