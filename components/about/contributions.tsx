'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Users,
  Landmark,
  FileText,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dummy data with more detailed information
const contributionCategories = [
  {
    id: 'education',
    label: 'Education',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'policy',
    label: 'Policy',
    icon: Landmark,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'research',
    label: 'Research',
    icon: FileText,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'awards',
    label: 'Awards',
    icon: Award,
    color: 'bg-red-100 text-red-700',
  },
];

const contributionsData = {
  education: [
    {
      id: 'edu1',
      title: 'Education Reform Initiative',
      description:
        'Led a comprehensive education reform initiative that increased graduation rates by 15% across the district through curriculum modernization, teacher development programs, and technology integration.',
      year: 2022,
      impact: '15% increase in graduation rates',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Schools Impacted', value: '35+' },
        { label: 'Students Benefited', value: '12,000+' },
        { label: 'Graduation Rate Increase', value: '15%' },
      ],
    },
    {
      id: 'edu2',
      title: 'STEM Education Enhancement',
      description:
        'Developed and implemented a STEM education enhancement program that provided advanced resources and training to underserved schools, resulting in a 40% increase in students pursuing STEM fields.',
      year: 2021,
      impact: '40% increase in STEM pursuit',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Schools Participating', value: '18' },
        { label: 'Teachers Trained', value: '120+' },
        { label: 'New Labs Built', value: '12' },
      ],
    },
    {
      id: 'edu3',
      title: 'Scholarship Foundation',
      description:
        'Established a scholarship foundation that has provided financial assistance to over 500 underprivileged students, enabling them to pursue higher education and achieve their academic goals.',
      year: 2020,
      impact: '500+ students supported',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Scholarships Awarded', value: '500+' },
        { label: 'Total Funding', value: '$2.5M' },
        { label: 'College Completion Rate', value: '92%' },
      ],
    },
  ],
  community: [
    {
      id: 'com1',
      title: 'Community Development Project',
      description:
        'Spearheaded a community development project that revitalized urban areas, created green spaces, and established community centers, directly benefiting over 50,000 residents.',
      year: 2023,
      impact: '50,000+ residents benefited',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Areas Revitalized', value: '8' },
        { label: 'New Jobs Created', value: '1,200+' },
        { label: 'Community Centers', value: '5' },
      ],
    },
    {
      id: 'com2',
      title: 'Youth Mentorship Program',
      description:
        'Created a youth mentorship program that pairs at-risk youth with successful professionals, providing guidance, support, and opportunities for personal and professional growth.',
      year: 2022,
      impact: '1,000+ youth mentored',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Youth Participants', value: '1,000+' },
        { label: 'Professional Mentors', value: '250+' },
        { label: 'Program Locations', value: '15' },
      ],
    },
    {
      id: 'com3',
      title: 'Food Security Initiative',
      description:
        'Launched a food security initiative that established community gardens, food banks, and nutrition education programs, reducing food insecurity in the region by 25%.',
      year: 2021,
      impact: '25% reduction in food insecurity',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Community Gardens', value: '20' },
        { label: 'Food Banks', value: '12' },
        { label: 'Meals Provided', value: '500,000+' },
      ],
    },
  ],
  policy: [
    {
      id: 'pol1',
      title: 'Environmental Protection Act',
      description:
        'Authored and championed the Environmental Protection Act, which established stringent regulations for industrial emissions, protected natural resources, and promoted sustainable practices.',
      year: 2023,
      impact: '30% reduction in carbon emissions',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Carbon Reduction', value: '30%' },
        { label: 'Protected Land', value: '50,000 acres' },
        { label: 'Clean Energy Jobs', value: '2,500+' },
      ],
    },
    {
      id: 'pol2',
      title: 'Healthcare Accessibility Reform',
      description:
        'Led the Healthcare Accessibility Reform, which expanded healthcare coverage to underserved populations, reduced costs, and improved the quality of care for millions of citizens.',
      year: 2022,
      impact: '2M+ additional citizens covered',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'New Coverage', value: '2M+ citizens' },
        { label: 'Cost Reduction', value: '15%' },
        { label: 'New Clinics', value: '75' },
      ],
    },
    {
      id: 'pol3',
      title: 'Economic Development Plan',
      description:
        'Developed and implemented an economic development plan that attracted new businesses, created jobs, and stimulated economic growth in previously struggling regions.',
      year: 2021,
      impact: '15,000+ new jobs created',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'New Businesses', value: '350+' },
        { label: 'Jobs Created', value: '15,000+' },
        { label: 'Economic Growth', value: '8.5%' },
      ],
    },
  ],
  research: [
    {
      id: 'res1',
      title: 'Education Policy Research',
      description:
        'Conducted groundbreaking research on education policy that influenced national guidelines and was published in leading academic journals, establishing new best practices for educational institutions.',
      year: 2023,
      impact: 'Influenced national guidelines',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Publications', value: '12' },
        { label: 'Citations', value: '500+' },
        { label: 'Policy Changes', value: '8' },
      ],
    },
    {
      id: 'res2',
      title: 'Urban Development Study',
      description:
        'Led a comprehensive urban development study that analyzed patterns of growth, identified challenges, and proposed innovative solutions for sustainable urban expansion.',
      year: 2022,
      impact: 'Adopted by 15+ major cities',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Cities Studied', value: '25' },
        { label: 'Data Points', value: '1M+' },
        { label: 'Implementation Rate', value: '60%' },
      ],
    },
    {
      id: 'res3',
      title: 'Public Health Research',
      description:
        'Conducted extensive research on public health challenges and solutions, resulting in the development of effective intervention strategies that have been implemented nationwide.',
      year: 2021,
      impact: 'Nationwide implementation',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Research Subjects', value: '10,000+' },
        { label: 'Intervention Programs', value: '15' },
        { label: 'Health Improvement', value: '22%' },
      ],
    },
  ],
  awards: [
    {
      id: 'awd1',
      title: 'National Leadership Award',
      description:
        'Received the prestigious National Leadership Award for exceptional contributions to public service, innovative governance, and commitment to improving the lives of citizens.',
      year: 2023,
      impact: 'National recognition',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Award Category', value: 'Public Service' },
        { label: 'Selection Pool', value: '500+ nominees' },
        { label: 'Award History', value: '25 years' },
      ],
    },
    {
      id: 'awd2',
      title: 'Education Innovation Prize',
      description:
        'Awarded the Education Innovation Prize for pioneering approaches to education reform that have demonstrated measurable improvements in student outcomes and educational equity.',
      year: 2022,
      impact: 'International recognition',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Prize Value', value: '$250,000' },
        { label: 'International Nominees', value: '75' },
        { label: 'Media Coverage', value: 'Global' },
      ],
    },
    {
      id: 'awd3',
      title: 'Community Service Medal',
      description:
        'Honored with the Community Service Medal for outstanding dedication to community development, volunteer work, and creating positive change at the grassroots level.',
      year: 2021,
      impact: 'Regional honor',
      image: '/placeholder.svg?height=400&width=600',
      link: '#',
      stats: [
        { label: 'Service Hours', value: '5,000+' },
        { label: 'Projects Led', value: '25' },
        { label: 'Communities Served', value: '12' },
      ],
    },
  ],
};

export default function Contributions() {
  const [activeCategory, setActiveCategory] = useState('education');
  const [selectedContribution, setSelectedContribution] = useState<
    string | null
  >(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-navy md:text-4xl">
            Key Contributions
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gold"></div>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Throughout my career, Ive been dedicated to making meaningful
            contributions across various sectors. Explore the categories below
            to learn more about my work and its impact.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs
          defaultValue="education"
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <div className="mb-8 flex justify-center">
            <TabsList className="bg-gray-100 p-1">
              {contributionCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          {Object.entries(contributionsData).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className={`group transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${selectedContribution === item.id ? 'ring-2 ring-navy' : ''} `}
                    onClick={() =>
                      setSelectedContribution(
                        selectedContribution === item.id ? null : item.id
                      )
                    }
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60"></div>

                      {/* Year badge */}
                      <div className="absolute left-4 top-4 rounded bg-navy/80 px-2 py-1 text-sm font-medium text-white">
                        {item.year}
                      </div>

                      {/* Impact badge */}
                      <div className="absolute bottom-4 right-4">
                        <Badge className="font-medium">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {item.impact}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-bold text-navy transition-colors group-hover:text-gold">
                        {item.title}
                      </h3>

                      <p
                        className={`mb-4 text-gray-600 ${selectedContribution === item.id ? '' : 'line-clamp-2'}`}
                      >
                        {item.description}
                      </p>

                      {/* Stats - only visible when selected */}
                      {selectedContribution === item.id && (
                        <div className="mb-4 mt-4 grid grid-cols-3 gap-2">
                          {item.stats.map((stat, index) => (
                            <div
                              key={index}
                              className="rounded bg-gray-50 p-2 text-center"
                            >
                              <div className="text-lg font-bold text-navy">
                                {stat.value}
                              </div>
                              <div className="text-xs text-gray-500">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Link - only visible when selected */}
                      {selectedContribution === item.id && (
                        <a
                          href={item.link}
                          className="mt-2 inline-flex items-center font-medium text-navy transition-colors hover:text-gold"
                        >
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      )}

                      {/* Toggle text - always visible */}
                      <button
                        className="mt-2 flex items-center text-sm text-navy/70 transition-colors hover:text-gold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContribution(
                            selectedContribution === item.id ? null : item.id
                          );
                        }}
                      >
                        {selectedContribution === item.id
                          ? 'Show less'
                          : 'Show more'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            Interested in learning more about my contributions or discussing
            potential collaborations?
          </p>
          <Button className="bg-navy text-white hover:bg-navy/90">
            Contact Me <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
