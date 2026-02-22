import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Telling Time Quiz | BrainyPulse',
    description: 'Learn to read analog clocks with this interactive telling time quiz for children!',
};

export default function TimeQuiz() {
    return (
        <QuizGame
            operation="time"
            label="Telling Time"
            emoji="🕐"
            color="from-teal-500 to-cyan-400"
        />
    );
}
