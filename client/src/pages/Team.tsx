import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import rohanImage from "../../public/rohan.jpg"; 

// Team member interface for type safety
interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string;
  description: string;
}

// Team categories and members data
const teamData = {
  leadership: [
    {
      name: "Rohan Khanal",
      role: "AI / ML Lead",
      specialty: "Machine Learning",
      image: rohanImage,
      description: "Trained and developed the AI model for MASKISKHA",
    },
    {
      name: "Srijal Bhattarai",
      role: "Frontend Lead",
      specialty: "Frontend Development",
      image: "/placeholder.svg../../images/rohan.JPG",
      description:
        "Led the development of the user interface and user experience for MASKISKHA",
    },
    {
      name: "Darshan Dhakal",
      role: "Backend Lead",
      specialty: "Backend Development",
      image: "../../images/rohan.JPG",
      description:
        "Responsible for the backend architecture and database management of MASKISKHA",
    },
  ],
};

// Team member card component
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-border">
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
        <p className="text-primary font-medium">{member.role}</p>
        <p className="text-sm text-foreground mt-1">{member.specialty}</p>
        <p className="text-sm text-muted-foreground">{member.description}</p>
      </CardContent>
    </Card>
  );
};

// Team section component
const TeamSection = ({
  title,
  members,
}: {
  title: string;
  members: TeamMember[];
}) => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <TeamMemberCard key={`${title}-${index}`} member={member} />
        ))}
      </div>
    </section>
  );
};

const Team = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the multidisciplinary experts behind NeurAI Detect committed
              to revolutionizing brain tumor detection and diagnosis.
            </p>
          </div>

          <div className="mb-16">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 p-8 rounded-xl text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                Bringing together experts from medicine, AI research, and
                healthcare technology
              </h2>
              <p className="text-muted-foreground mb-6">
                Our team combines decades of experience in neurology, oncology,
                radiology, machine learning, and healthcare software development
                to create a solution that truly improves patient outcomes.
              </p>
              <Button>Join Our Team</Button>
            </div>
          </div>

          <TeamSection
            title="Medical Advisory Board"
            members={teamData.leadership}
          />

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Partner Institutions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border p-4 rounded-lg flex items-center justify-center h-32"
                >
                  <div className="text-muted-foreground font-medium text-center">
                    Partner Logo
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-8 text-center mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Interested in Collaborating?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for research partners, clinical
              collaborators, and talented individuals to join our mission.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button>Contact Us</Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
              >
                Research Opportunities
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
