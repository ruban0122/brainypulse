export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'fractions' | 'time' | 'place-value';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
    id: number;
    text: string;
    answer: number | string;
    choices: (number | string)[];
    hint?: string;
    visual?: string; // optional emoji visual
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

function uniqueWrongChoices(correct: number, count: number, min: number, max: number): number[] {
    const wrongs = new Set<number>();
    while (wrongs.size < count) {
        const w = rand(min, max);
        if (w !== correct) wrongs.add(w);
    }
    return [...wrongs];
}

export function generateQuestions(op: Operation, difficulty: Difficulty = 'medium', count = 10): Question[] {
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
        questions.push(makeQuestion(op, difficulty, i));
    }
    return questions;
}

function makeQuestion(op: Operation, difficulty: Difficulty, id: number): Question {
    switch (op) {
        case 'addition':
            return makeAddition(difficulty, id);
        case 'subtraction':
            return makeSubtraction(difficulty, id);
        case 'multiplication':
            return makeMultiplication(difficulty, id);
        case 'division':
            return makeDivision(difficulty, id);
        case 'mixed':
            return makeMixed(difficulty, id);
        case 'fractions':
            return makeFractions(difficulty, id);
        case 'time':
            return makeTime(difficulty, id);
        case 'place-value':
            return makePlaceValue(difficulty, id);
        default:
            return makeAddition(difficulty, id);
    }
}

function makeAddition(d: Difficulty, id: number): Question {
    const max = d === 'easy' ? 10 : d === 'medium' ? 50 : 200;
    const a = rand(1, max);
    const b = rand(1, max);
    const answer = a + b;
    return {
        id,
        text: `${a} + ${b} = ?`,
        answer,
        choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, Math.max(0, answer - 15), answer + 15)]),
        hint: `Count up from ${a} by ${b}`,
        visual: '➕',
    };
}

function makeSubtraction(d: Difficulty, id: number): Question {
    const max = d === 'easy' ? 10 : d === 'medium' ? 50 : 200;
    const b = rand(1, max);
    const a = rand(b, max + b);
    const answer = a - b;
    return {
        id,
        text: `${a} − ${b} = ?`,
        answer,
        choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, Math.max(0, answer - 15), answer + 15)]),
        hint: `Start at ${a} and count back ${b}`,
        visual: '➖',
    };
}

function makeMultiplication(d: Difficulty, id: number): Question {
    const maxA = d === 'easy' ? 5 : d === 'medium' ? 10 : 12;
    const maxB = d === 'easy' ? 5 : d === 'medium' ? 10 : 12;
    const a = rand(1, maxA);
    const b = rand(1, maxB);
    const answer = a * b;
    return {
        id,
        text: `${a} × ${b} = ?`,
        answer,
        choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, Math.max(0, answer - 20), answer + 20)]),
        hint: `${a} groups of ${b}`,
        visual: '✖️',
    };
}

function makeDivision(d: Difficulty, id: number): Question {
    const maxDiv = d === 'easy' ? 5 : d === 'medium' ? 10 : 12;
    const b = rand(2, maxDiv);
    const answer = rand(1, maxDiv);
    const a = b * answer;
    return {
        id,
        text: `${a} ÷ ${b} = ?`,
        answer,
        choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, Math.max(1, answer - 10), answer + 10)]),
        hint: `How many groups of ${b} in ${a}?`,
        visual: '➗',
    };
}

function makeMixed(d: Difficulty, id: number): Question {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'] as const;
    const op = ops[rand(0, 3)];
    return makeQuestion(op, d, id);
}

function makeFractions(d: Difficulty, id: number): Question {
    const denominators = d === 'easy' ? [2, 4] : d === 'medium' ? [2, 3, 4, 6] : [2, 3, 4, 5, 6, 8, 10];
    const denom = denominators[rand(0, denominators.length - 1)];
    const numer = rand(1, denom - 1);

    const fractionStr = `${numer}/${denom}`;
    const percentage = Math.round((numer / denom) * 100);

    // Q: what is this fraction as a percentage?
    const answer = percentage;
    const wrongs = uniqueWrongChoices(answer, 3, Math.max(0, answer - 30), Math.min(100, answer + 30));

    return {
        id,
        text: `What percentage is ${fractionStr}?`,
        answer,
        choices: shuffle([answer, ...wrongs]).map((v) => `${v}%`),
        hint: `Divide ${numer} by ${denom}, then multiply by 100`,
        visual: '🍕',
    };
}

function makeTime(d: Difficulty, id: number): Question {
    const hours = rand(1, 12);
    const minuteOptions = d === 'easy' ? [0, 30] : d === 'medium' ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const minutes = minuteOptions[rand(0, minuteOptions.length - 1)];
    const minStr = minutes.toString().padStart(2, '0');
    const answer = `${hours}:${minStr}`;

    const makeWrong = () => {
        const wH = rand(1, 12);
        const wM = minuteOptions[rand(0, minuteOptions.length - 1)];
        const s = `${wH}:${wM.toString().padStart(2, '0')}`;
        return s;
    };

    const wrongs: string[] = [];
    while (wrongs.length < 3) {
        const w = makeWrong();
        if (w !== answer && !wrongs.includes(w)) wrongs.push(w);
    }

    return {
        id,
        text: `The clock shows ${hours}:${minStr}. What time is it?`,
        answer,
        choices: shuffle([answer, ...wrongs]),
        hint: `The hour hand points to ${hours}, the minute hand to ${minutes === 0 ? 12 : minutes / 5}`,
        visual: '🕐',
    };
}

function makePlaceValue(d: Difficulty, id: number): Question {
    if (d === 'easy') {
        const tens = rand(1, 9);
        const ones = rand(0, 9);
        const answer = tens * 10 + ones;
        const q = `${tens} tens and ${ones} ones = ?`;
        return {
            id,
            text: q,
            answer,
            choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, Math.max(0, answer - 20), answer + 20)]),
            hint: `${tens} × 10 + ${ones}`,
            visual: '🏗️',
        };
    } else if (d === 'medium') {
        const hundreds = rand(1, 9);
        const tens = rand(0, 9);
        const ones = rand(0, 9);
        const answer = hundreds * 100 + tens * 10 + ones;
        return {
            id,
            text: `${hundreds} hundreds, ${tens} tens, ${ones} ones = ?`,
            answer,
            choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, Math.max(0, answer - 50), answer + 50)]),
            hint: `${hundreds} × 100 + ${tens} × 10 + ${ones}`,
            visual: '🏗️',
        };
    } else {
        const num = rand(1000, 9999);
        const place = ['thousands', 'hundreds', 'tens', 'ones'][rand(0, 3)];
        let answer: number;
        if (place === 'thousands') answer = Math.floor(num / 1000);
        else if (place === 'hundreds') answer = Math.floor((num % 1000) / 100);
        else if (place === 'tens') answer = Math.floor((num % 100) / 10);
        else answer = num % 10;
        return {
            id,
            text: `What digit is in the ${place} place of ${num}?`,
            answer,
            choices: shuffle([answer, ...uniqueWrongChoices(answer, 3, 0, 9)]),
            visual: '🏗️',
        };
    }
}
