import React from 'react';
import image1 from '../../../../public/Images/expert_team_1.png'; // Dr. Sarah Mitchell (Left big image)
import image2 from '../../../../public/Images/expert_team_2.png'; // You can use this if needed, or import all 6 individually
import type { AboutTeamMember } from '../../../lib/aboutApi';

// Better approach: Import all 7 images separately for clarity

const fallbackMembers = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    role: "CEO & Founder",
    image: image1,
    order: 1,
  },
  {
    id: 2,
    name: "Dr. Sophia Martinez",
    role: "Chief Medical Officer",
    image: image2,
    order: 2,
  },
  {
    id: 3,
    name: "Dr. Aisha Rahman",
    role: "Senior Consultant",
    image: image2,
    order: 3,
  },
  {
    id: 4,
    name: "Chloe Bennett",
    role: "International Booking Coordinator",
    image: image2,
    order: 4,
  },
  {
    id: 5,
    name: "Emily Parker",
    role: "Patient Support Manager",
    image: image2,
    order: 5,
  },
  {
    id: 6,
    name: "Ryan Carter",
    role: "Medical Travel Advisor",
    image: image2,
    order: 6,
  },
  {
    id: 7,
    name: "Sofia Ibrahim",
    role: "Marketing Manager",
    image: image2,
    order: 7,
  },
];

type ExpertTeamProps = {
  members?: AboutTeamMember[];
};

const ExpertTeam: React.FC<ExpertTeamProps> = ({ members }) => {
  const displayMembers =
    members && members.length > 0
      ? members.slice().sort((a, b) => a.order - b.order)
      : fallbackMembers;
  const [leadMember, ...teamMembers] = displayMembers;

  return (
    <div className="max-w-7xl mx-auto px-6 ">
      {/* Title */}
      <h2 className="text-4xl font-semibold text-[#00A3FF] mb-12 text-center md:text-left">
        Our Expert Team
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 items-center">
        {/* Left - Big CEO Card */}
        <div className="lg:w-1/3 flex-shrink-0">
          <div className="bg-gray-100 p-2 rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-5/5 relative">
              <img
                src={leadMember.image}
                alt={leadMember.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800">{leadMember.name}</h3>
              <p className="text-gray-600 mt-1">{leadMember.role}</p>
            </div>
          </div>
        </div>

        {/* Right - 2x3 Grid */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center bg-gray-100 p-2 rounded-xl">
                <div className=" rounded-md  overflow-hidden aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertTeam;
