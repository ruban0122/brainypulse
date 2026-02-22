import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Addition Quiz | BrainyPulse',
    description: 'Practice addition online with instant feedback, timer, and scores. Race against the clock and beat your best!',
};

export default function AdditionQuiz() {
    return (
        <QuizGame
            operation="addition"
            label="Addition"
            emoji="➕"
            color="from-blue-500 to-cyan-400"
        />
    );
}
