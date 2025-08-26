import Accenture from "@/components/Pages/Landing/Sections/OurPartners/Logos/Accenture";
import AmityUni from "@/components/Pages/Landing/Sections/OurPartners/Logos/AmityUni";
import Boat from "@/components/Pages/Landing/Sections/OurPartners/Logos/Boat";
import Capgemini from "@/components/Pages/Landing/Sections/OurPartners/Logos/Capgemini";
import IBM from "@/components/Pages/Landing/Sections/OurPartners/Logos/IBM";
import KLUni from "@/components/Pages/Landing/Sections/OurPartners/Logos/KLUni";
import Phonepe from "@/components/Pages/Landing/Sections/OurPartners/Logos/Phonepe";
import PresidencyUni from "@/components/Pages/Landing/Sections/OurPartners/Logos/PresidencyUni";
import RangaswamyCollege from "@/components/Pages/Landing/Sections/OurPartners/Logos/RangaswamyCollege";
import Razorpay from "@/components/Pages/Landing/Sections/OurPartners/Logos/Razorpay";
import RevaUni from "@/components/Pages/Landing/Sections/OurPartners/Logos/RevaUni";
import Wipro from "@/components/Pages/Landing/Sections/OurPartners/Logos/Wipro";

export const landingPageData = {
  aboutSection: {
    heading: "About Us.",
    subheading: "Get to Know Us Better",
    para: `Innoknowvex is a cutting-edge EdTech platform designed to seamlessly connect students with internships, professional training, career development, and expert mentorship. Our mission is to bridge the gap between academic education and industry requirements by providing students with access to industry-relevant programs hands-on training, and specialized mentorship. Through a structured, expert-driven approach, we empower aspiring professionals with the practical skills and industry insights necessary to excel in their chosen fields.`,
    images: [
      "/assets/aboutUsSection/about_us_cell_1.jpg",
      "/assets/aboutUsSection/about_us_cell_3.jpg",
      "/assets/aboutUsSection/about_us_cell_4.jpg",
      "/assets/aboutUsSection/about_us_cell_7.jpg",
      "/assets/aboutUsSection/about_us_cell_9.jpg",
    ],
  },
  programsSection: {
    heading: "Programs",
    subheading: "Discover What we offer",
    para: `Get equipped with real-world skills, hands-on experience, and career-focused programs tailored to meet industry demands. Our expert-led courses are designed to help you build practical knowledge, boost your confidence, and launch a successful career in today’s fast-paced, tech-driven world.`,
    programs: [
      {
        title: "Artificial",
        subTitle: "Intelligence",
        description:
          "Dive into the world of Artificial Intelligence with a hands-on learning experience focused on machine learning, deep learning, and neural networks. Through interactive lessons, real-world projects, and expert guidance, you’ll move beyond theory into practical application. Whether you're starting out or upskilling, this course equips you for real-world challenges and success in an AI-driven future.",
        link: "/programs/artificial-intelligence",
        image: "/assets/programs/ai.jpg",
      },
      {
        title: "Data",
        subTitle: "Science",
        description:
          "Explore the field of Data Science through a structured program covering statistics, data visualization, and predictive modeling. With guided projects, step-by-step lessons, and mentorship, you’ll build the ability to transform raw data into actionable insights. This course ensures you develop industry-ready skills to solve real problems in analytics and data-driven decision-making.",
        link: "/programs/data-science",
        image: "/assets/programs/data_science.png",
      },
      {
        title: "Cyber",
        subTitle: "Security",
        description:
          "Master the fundamentals of Cyber Security with a practical curriculum emphasizing threat detection, ethical hacking, and network defense. Learn through labs, simulations, and expert-led instruction that mirror real-world security challenges. Gain the confidence and skills required to protect digital environments and build a successful career in one of today’s most critical domains.",
        link: "/programs/cyber-security",
        image: "/assets/programs/cyber_security.png",
      },
      {
        title: "Cloud",
        subTitle: "Computing",
        description:
          "Step into Cloud Computing with comprehensive training on infrastructure, virtualization, and service deployment across leading platforms. Through hands-on labs, guided exercises, and applied projects, you’ll understand the backbone of modern digital solutions. Whether aiming for certifications or career growth, this program equips you to architect, deploy, and manage scalable cloud systems.",
        link: "/programs/cloud-computing",
        image: "/assets/programs/python_programming.png",
      },
      {
        title: "Machine",
        subTitle: "Learning",
        description:
          "Gain mastery in Machine Learning through a project-based curriculum emphasizing supervised, unsupervised, and reinforcement learning techniques. With real-world case studies, coding exercises, and expert mentorship, you’ll develop the ability to build intelligent models and deploy them in practice. This program prepares you to innovate and excel in AI-powered applications across industries.",
        link: "/programs/machine-learning",
        image: "/assets/programs/machine_learning.png",
      },
    ],
  },
  whyChooseUsSection: {
    heading: "Why choose Us",
    subheading: "What makes our courses stand out.",
    para: `We’re more than just a platform — we’re a learning ecosystem designed to help you thrive. From live classes and hands-on projects to personalized support and a vibrant community, every feature we offer is built to make your learning journey engaging, effective, and future-ready.`,
    reasons: [
      {
        title: "Live",
        subTitle: "Classes",
        description:
          "Learn directly from industry experts in real-time through engaging classes that simplify difficult concepts, encourage active participation, and keep you motivated. With interactive guidance, you gain confidence, build knowledge, and remain consistently focused throughout your complete learning journey.",
      },
      {
        title: "Linkedin &",
        subTitle: "Resume Building",
        description:
          "Develop a professional resume and LinkedIn profile with tailored guidance that highlights your skills, emphasizes achievements, and increases visibility. With expert advice, you learn how to impress recruiters, showcase your strengths, and unlock meaningful career opportunities in today’s competitive job market.",
      },
      {
        title: "100% Job",
        subTitle: "Assistance",
        description:
          "Receive end-to-end career support from a dedicated team that assists with applications, prepares you for interviews, and offers mentorship. You are guided at every step until you confidently secure the right role and achieve ongoing professional success in your chosen path.",
      },
      {
        title: "Interview",
        subTitle: "Training",
        description:
          "Master the art of interviews through structured practice sessions, personalized coaching, and actionable feedback from experts. With confidence-building preparation, you enhance communication, present your skills effectively, and leave recruiters impressed with your professionalism, clarity, and readiness for success in every interview.",
      },
      {
        title: "Placement",
        subTitle: "Assistance",
        description:
          "Gain placement assistance with comprehensive career support from specialists who connect you with employers, guide your applications, and prepare you with effective strategies. Their expert help ensures you feel prepared, stay motivated, and confidently secure roles that match your career ambitions and goals.",
      },
      {
        title: "Lifetime Access",
        subTitle: "to Content",
        description:
          "Enjoy lifetime access to course content, including updated resources, added modules, and future enhancements. Revisit your learning anytime, stay current with industry trends, and continuously improve your skills—ensuring your knowledge grows steadily and remains valuable throughout your entire professional journey.",
      },
    ],
  },
  ourPartnerSection: {
    heading: "Our Partners",
    subheading: "SEE BRANDS THAT TRUSTS US",

    brands: [
      Razorpay,
      IBM,
      Capgemini,
      Boat,
      Accenture,
      Phonepe,
      Wipro,
      Razorpay,
      IBM,
      Capgemini,
    ],
    hiringPartners: [
      RangaswamyCollege,
      KLUni,
      AmityUni,
      RevaUni,
      PresidencyUni,
      RangaswamyCollege,
      KLUni,
      AmityUni,
    ],
  },
  testimonialsSection: {
    heading: "Testimonials",
    subheading: "Don't Just Take our word for it",
  rowTop: [
    {
      testimonial: "I'm happy to announce the successful completion of my Certificate of Training and Internship in Finance with InnoKnowvex. This program gave me valuable exposure to financial concepts, investment analysis, portfolio management, and risk management, while also strengthening my analytical and decision-making skills. I'm grateful to Innoknowex for providing such an enriching experience and look forward to applying this knowledge in my professional journey and exploring more opportunities in the field of finance and investment.",
      name: "Saniya Khanam",
      profession: "Finance",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "I recently took a web development course with innoknowvex technologies and it was a great experience! The content was perfect and easy to follow. The instructions were helpful, and the hands-on projects were very practical. I highly recommend it to anyone looking to learn web development. They are also providing certification.",
      name: "Vignesh Ram Kodeti",
      profession: "Web Development",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "I'm thrilled to announce the successful completion of my training and internship at InnoKnowex in the finance. This experience has been a game-changer, equipping me with a robust skill set that has deepened my expertise in financial analysis and modeling. I gained hands-on proficiency in financial statement analysis, integrated financial modeling in Excel and data visualization.",
      name: "Umme Uzma",
      profession: "Finance",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "I have taken a Data Science course with Innoknowvex and it was a great experience! The content was smooth and easy to follow. The instructors were helpful, and the hands-on projects were very practical. I highly recommend it to anyone looking to learn Data Science.",
      name: "Yashwant Reddy",
      profession: "Data Science",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "I'm excited to share that I've been given the opportunity to upskill in Java and Data Structures & Algorithms (DSA) through a Self-Paced Learning Program offered by Innoknowvex. This structured and flexible learning experience is helping me strengthen my foundation in core Java concepts, problem-solving techniques, and DSA, which are essential for building efficient and scalable applications.",
      name: "Nithin Sai",
      profession: "Java + DSA",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    }
  ],
  rowBottom: [
    {
      testimonial: "The Python course was beginner-friendly yet covered advanced concepts too. The teaching approach made coding easier to understand. Great course for learning Python from scratch! The mentors explained everything step by step and provided useful practice exercises.",
      name: "Vishnu Vardhan Settipalli",
      profession: "Python",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "I'm thrilled to announce that I've been offered an internship opportunity in the Data Science Program at innoKnowvex Edutech Pvt. Ltd. This opportunity will help me strengthen my skills, gain real-world experience, and grow in the field of data science. Looking forward to learning, contributing, and making the most out of this journey!",
      name: "Komal Kalyani",
      profession: "Data Science",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "The Al course provided in-depth knowledge of algorithms and techniques. The mentors were knowledgeable and always supportive. A great course that covered Al concepts with practical applications. The hands-on projects were very insightful.",
      name: "Sashank Verma",
      profession: "AI",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "The Web Development course was excellent! It covered both frontend and backend technologies in depth with great practical assignments. I learned HTML, CSS, JavaScript, and backend technologies effectively in this course. The mentors were always supportive and ready to clear doubts.",
      name: "Mansoor Ali",
      profession: "Web Development",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    },
    {
      testimonial: "I'm thrilled to announce that I've been offered an internship opportunity in the Data Science Program at innoKnowvex Edutech Pvt. Ltd. This opportunity will help me strengthen my skills, gain real-world experience, and grow in the field of data science. Looking forward to learning, contributing, and making the most out of this journey!",
      name: "Komal Kalyani",
      profession: "Data Science",
      avatar: "/assets/testimonialSection/testimonial_image.png",
    }
  ]
  },
  faqSection: {
    heading: "Frequently asked questions",
    subheading: "WHAT YOU SHOULD KNOW",
    para: `Got questions? You're not alone. We've gathered the most common (and most important) ones right here to help you get clarity, feel confident, and make the right choice. Whether you're curious, cautious, or just doing your homework — the answers you need are just below.`,
    faqs: [
      {
        question: "Who will be my mentor?",
        answer:
          "You'll be guided by industry professionals with years of hands-on experience in their respective domains. Our mentors focus on concept clarity, practical knowledge, and personalized support throughout your learning journey",
      },
      {
        question: "Can I pay in easy monthly installments?",
        answer:
          "Yes, we offer flexible EMI (Easy Monthly Installment) options to make learning more accessible for everyone.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit/debit cards, UPI, net banking, and EMI options through partnered banks and financial services.",
      },
      {
        question: "Will I receive a certificate after completing the program?",
        answer:
          "Yes, upon successful completion of your program, you’ll receive an industry-recognized certificate from Innoknowvex.",
      },
    ],
  },
  footerSection: {
    heading: "Contact Us.",
    subheading: "GET IN TOUCH",
    email: "innoknowvex@gmail.com",
    address:
      "Hustlehub SB01, WJ8G+XWP, 1st Cross Road, Santhosapuram, 1st Block Koramangala, HSR Layout 5th Sector, Bengaluru, Karnataka 560034",
    socialLinks: [
      {
        label: "facebook",
        href: "#",
        icon: "ic:baseline-facebook",
      },
      {
        label: "instagram",
        href: "#",
        icon: "ri:instagram-fill",
      },
      {
        label: "linkedin",
        href: "#",
        icon: "basil:linkedin-solid",
      },
      {
        label: "youtube",
        href: "#",
        icon: "entypo-social:youtube",
      },
    ],
    footerLinks: [
      {
        listLabel: "LINKS",
        links: [
          { label: "About Us", href: "#" },
          { label: "Programs", href: "#" },
          { label: "Blogs", href: "#" },
          { label: "Testimonials", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
          // { label: "", href: "#" },
        ],
      },
      {
        listLabel: "OUR PROGRAMS",
        links: [
          { label: "Web Development", href: "/programs/web-development" },
  { label: "Android Development", href: "/programs/android-development" },
  { label: "Python Programming", href: "/programs/python-programming" },
  { label: "Java & DSA", href: "/programs/java-dsa" },
  { label: "Machine Learning", href: "/programs/machine-learning" },
  { label: "Artificial Intelligence", href: "/programs/artificial-intelligence" },
  { label: "Cloud Computing", href: "/programs/cloud-computing" },
  { label: "Cyber Security", href: "/programs/cyber-security" },
  { label: "Data Science", href: "/programs/data-science" },
  { label: "Nanotechnology", href: "/programs/nanotechnology" },
  { label: "Embedded Systems", href: "/programs/embedded-systems" },
  { label: "Internet of Things (IoT)", href: "/programs/iot" },
  { label: "Hybrid Electric Vehicles", href: "/programs/hev" },
  { label: "VLSI", href: "/programs/vlsi" },
  { label: "Fashion Designing", href: "/programs/fashion-designing" },
  { label: "UI/UX Design", href: "/programs/ui-ux-design" },
  { label: "Psychology", href: "/programs/psychology" },
  { label: "Medical Coding", href: "/programs/medical-coding" },
  { label: "Digital Marketing", href: "/programs/digital-marketing" },
  { label: "Business Analytics", href: "/programs/business-analytics" },
  { label: "Finance", href: "/programs/finance" },
  { label: "Stock Trading", href: "/programs/stock-trading" },
  { label: "Human Resources", href: "/programs/human-resources" },
  { label: "Corporate Law", href: "/programs/corporate-law" },
  { label: "Java", href: "/programs/java" },
  { label: "MERN Stack Development", href: "/programs/mern-stack" },
  { label: "Business & Management", href: "/programs/business-management" },
  { label: "Advanced Data Science", href: "/programs/advanced-data-science" },
  { label: "Advanced Web Development", href: "/programs/advanced-web-development" },
  { label: "C & C++", href: "/programs/C-C++" },
  { label: "AutoCad", href: "/programs/AutoCad" },
  { label: "Automobile Design", href: "/programs/Automobile Design" },
  { label: "Data Structures & Algorithms", href: "/programs/DSA" }
        ],

        
      },
      {
        listLabel: "ADVANCED PROGRAMS",
        links: [
          { label: "Advanced Data Science", href: "#" },
          { label: "Advanced Web Development", href: "#" },
        ],
      },
      {
        listLabel: "LEGAL",
        links: [
          { label: "Privacy Policy", href: "#" },
          { label: "Payments & Refunds", href: "#" },
          { label: "Terms of Service", href: "#" },
        ],
      },
    ],
  },
};
