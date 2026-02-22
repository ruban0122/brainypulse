import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Mixed Operations Quiz | BrainyPulse',
    description: 'Challenge yourself with all four operations: addition, subtraction, multiplication, and division in one quiz!',
};

export default function MixedQuiz() {
    return (
        <QuizGame
            operation="mixed"
            label="Mixed Operations"
            emoji="🌀"
            color="from-purple-500 to-violet-400"
        />
    );
}
