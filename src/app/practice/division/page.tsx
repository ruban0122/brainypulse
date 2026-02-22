import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Division Quiz | BrainyPulse',
    description: 'Practice division online with instant scoring, streaks, and timer challenges. Perfect for kids!',
};

export default function DivisionQuiz() {
    return (
        <QuizGame
            operation="division"
            label="Division"
            emoji="➗"
            color="from-orange-500 to-amber-400"
        />
    );
}
