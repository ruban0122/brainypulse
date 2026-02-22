import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Subtraction Quiz | BrainyPulse',
    description: 'Interactive subtraction quiz for kids. Instant feedback, lives, streaks and high scores!',
};

export default function SubtractionQuiz() {
    return (
        <QuizGame
            operation="subtraction"
            label="Subtraction"
            emoji="➖"
            color="from-rose-500 to-pink-400"
        />
    );
}
