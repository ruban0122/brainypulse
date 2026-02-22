import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Fractions Quiz | BrainyPulse',
    description: 'Practice identifying and converting fractions online. Fun, fast, and educational for kids!',
};

export default function FractionsQuiz() {
    return (
        <QuizGame
            operation="fractions"
            label="Fractions"
            emoji="🍕"
            color="from-yellow-500 to-amber-400"
        />
    );
}
