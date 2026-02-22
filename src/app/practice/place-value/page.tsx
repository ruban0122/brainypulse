import QuizGame from '../components/QuizGame';

export const metadata = {
    title: 'Place Value Quiz | BrainyPulse',
    description: 'Practice place value concepts online: tens, ones, hundreds. Interactive quiz with instant scoring!',
};

export default function PlaceValueQuiz() {
    return (
        <QuizGame
            operation="place-value"
            label="Place Value"
            emoji="🏗️"
            color="from-indigo-500 to-blue-400"
        />
    );
}
