export interface Reel {
  id: string;
  videoUrl: string;
  userAvatar: string;
  caption: string;
  username: string;
  likes: number;
  comments: number;
}

export const dummyReels: Reel[] = [
  {
    id: "1",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-knuckle-push-ups-in-a-gym-23154-large.mp4",
    userAvatar: "https://i.pravatar.cc/150?img=11",
    username: "iron_man_james",
    caption: "Push-ups are the foundation of strength. No equipment needed! 💪 #homeworkout",
    likes: 1240,
    comments: 45,
  },
  {
    id: "2",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-sunny-day-24023-large.mp4",
    userAvatar: "https://i.pravatar.cc/150?img=32",
    username: "priya_yoga",
    caption: "Finding balance in the chaos. Morning mobility flow. 🧘‍♀️✨",
    likes: 890,
    comments: 22,
  },
  {
    id: "3",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-training-hard-in-the-gym-23143-large.mp4",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    username: "fit_rahul",
    caption: "The grind doesn't stop. Heavy sets to start the week. 🏋️‍♂️🔥",
    likes: 2105,
    comments: 89,
  },
  {
    id: "4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-boxer-training-with-a-punching-bag-23141-large.mp4",
    userAvatar: "https://i.pravatar.cc/150?img=53",
    username: "coach_mike",
    caption: "Speed and precision. Boxing drills for cardio. 🥊 #fitnessmotivation",
    likes: 1530,
    comments: 67,
  },
  {
    id: "5",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-athletic-woman-running-on-a-treadmill-23134-large.mp4",
    userAvatar: "https://i.pravatar.cc/150?img=47",
    username: "sarah_fit_pro",
    caption: "HIIT treadmill intervals. 30 seconds sprint, 30 seconds rest. Let's go! 🏃‍♀️",
    likes: 942,
    comments: 31,
  },
  {
    id: "6",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-man-doing-crunches-23151-large.mp4",
    userAvatar: "https://i.pravatar.cc/150?img=68",
    username: "mark_shreds",
    caption: "Abs are made in the kitchen, but built in the gym. 🍫 #coreworkout",
    likes: 3200,
    comments: 112,
  }
];