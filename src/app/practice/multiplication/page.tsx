import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Multiplication Quiz | BrainyPulse',
    description: 'Master your times tables with this fun multiplication quiz. Beat the timer and earn stars!',
};

export default function MultiplicationQuiz() {
    return (
        <QuizGame
            operation="multiplication"
            label="Multiplication"
            emoji="✖️"
            color="from-green-500 to-emerald-400"
        />
    );
}
