// export interface CommunityPost {
//   id: number;
//   user: {
//     name: string;
//     username: string;
//     avatar: string;
//     isTrainer?: boolean;
//   };
//   image: string;
//   caption: string;
//   category: "Workout" | "Tip" | "Transformation";
//   likes: number;
//   comments: number;
//   createdAt: string;
// }

// export const dummyPosts: CommunityPost[] = [
//   {
//     id: 1,
//     user: {
//       name: "Rahul Mehta",
//       username: "fit_rahul",
//       avatar: "https://i.pravatar.cc/150?img=12",
//       isTrainer: false,
//     },
//     image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
//     caption: "Leg day 🔥 No excuses.",
//     category: "Workout",
//     likes: 124,
//     comments: 18,
//     createdAt: "2h ago",
//   },
//   {
//     id: 2,
//     user: {
//       name: "Dr. Ananya",
//       username: "nutrition_with_ananya",
//       avatar: "https://i.pravatar.cc/150?img=32",
//       isTrainer: true,
//     },
//     image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
//     caption: "Protein timing matters more than you think 💪",
//     category: "Tip",
//     likes: 302,
//     comments: 45,
//     createdAt: "5h ago",
//   },
//     {
//     id: 1,
//     user: {
//       name: "Rahul Mehta",
//       username: "fit_rahul",
//       avatar: "https://i.pravatar.cc/150?img=12",
//       isTrainer: false,
//     },
//     image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
//     caption: "Leg day 🔥 No excuses.",
//     category: "Workout",
//     likes: 124,
//     comments: 18,
//     createdAt: "2h ago",
//   },
//   {
//     id: 2,
//     user: {
//       name: "Dr. Ananya",
//       username: "nutrition_with_ananya",
//       avatar: "https://i.pravatar.cc/150?img=32",
//       isTrainer: true,
//     },
//     image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
//     caption: "Protein timing matters more than you think 💪",
//     category: "Tip",
//     likes: 302,
//     comments: 45,
//     createdAt: "5h ago",
//   },
//     {
//     id: 1,
//     user: {
//       name: "Rahul Mehta",
//       username: "fit_rahul",
//       avatar: "https://i.pravatar.cc/150?img=12",
//       isTrainer: false,
//     },
//     image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
//     caption: "Leg day 🔥 No excuses.",
//     category: "Workout",
//     likes: 124,
//     comments: 18,
//     createdAt: "2h ago",
//   },
//   {
//     id: 2,
//     user: {
//       name: "Dr. Ananya",
//       username: "nutrition_with_ananya",
//       avatar: "https://i.pravatar.cc/150?img=32",
//       isTrainer: true,
//     },
//     image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
//     caption: "Protein timing matters more than you think 💪",
//     category: "Tip",
//     likes: 302,
//     comments: 45,
//     createdAt: "5h ago",
//   },
    



// ];



export interface CommunityPost {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    isTrainer?: boolean;
  };
  image: string;
  caption: string;
  category: "Workout" | "Tip" | "Transformation";
  likes: number;
  comments: number;
  createdAt: string;
}

export const dummyPosts: CommunityPost[] = [
  {
    id: 1,
    user: {
      name: "Rahul Mehta",
      username: "fit_rahul",
      avatar: "https://i.pravatar.cc/150?img=12",
      isTrainer: false,
    },
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    caption: "Leg day 🔥 No excuses. Focus on the depth of those squats!",
    category: "Workout",
    likes: 124,
    comments: 18,
    createdAt: "2h ago",
  },
  {
    id: 2,
    user: {
      name: "Dr. Ananya",
      username: "nutrition_with_ananya",
      avatar: "https://i.pravatar.cc/150?img=32",
      isTrainer: true,
    },
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    caption: "Protein timing matters more than you think. Aim for 20-30g post-workout. 💪",
    category: "Tip",
    likes: 302,
    comments: 45,
    createdAt: "5h ago",
  },
  {
    id: 3,
    user: {
      name: "Mark Stevens",
      username: "mark_shreds",
      avatar: "https://i.pravatar.cc/150?img=11",
      isTrainer: false,
    },
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    caption: "6 months of consistency. Trust the process, it works! 📈",
    category: "Transformation",
    likes: 856,
    comments: 92,
    createdAt: "1d ago",
  },
  {
    id: 4,
    user: {
      name: "Coach Sarah",
      username: "sarah_fit_pro",
      avatar: "https://i.pravatar.cc/150?img=47",
      isTrainer: true,
    },
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    caption: "Morning mobility routine to wake up those joints. 🧘‍♀️",
    category: "Workout",
    likes: 215,
    comments: 24,
    createdAt: "8h ago",
  },
  {
    id: 5,
    user: {
      name: "Priya Sharma",
      username: "priya_yoga",
      avatar: "https://i.pravatar.cc/150?img=26",
      isTrainer: false,
    },
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    caption: "Hydration is key. Drink your water, folks! 💧",
    category: "Tip",
    likes: 189,
    comments: 12,
    createdAt: "3h ago",
  },
  {
    id: 6,
    user: {
      name: "James Wilson",
      username: "iron_man_james",
      avatar: "https://i.pravatar.cc/150?img=68",
      isTrainer: true,
    },
    image: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f",
    caption: "Heavy deadlifts today. New PR: 220kg! 🏋️‍♂️",
    category: "Workout",
    likes: 540,
    comments: 67,
    createdAt: "12h ago",
  },
  {
    id: 7,
    user: {
      name: "Elena Rodriguez",
      username: "elena_fitlife",
      avatar: "https://i.pravatar.cc/150?img=45",
      isTrainer: false,
    },
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    caption: "Small steps every day lead to big results. Don't stop now.",
    category: "Transformation",
    likes: 423,
    comments: 31,
    createdAt: "1d ago",
  },
];