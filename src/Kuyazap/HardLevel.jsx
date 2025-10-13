import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WORDS = [
    { word: 'GALAXY', clue: 'A system of stars and planets' },
    { word: 'PYTHON', clue: 'A popular programming language' },
    { word: 'OXYGEN', clue: 'Essential for breathing' },
    { word: 'DIAMOND', clue: 'Hardest natural material' },
    { word: 'ROBOT', clue: 'A machine that performs tasks automatically' },
    { word: 'VOLCANO', clue: 'A mountain that erupts lava' },
    { word: 'SATURN', clue: 'A planet with beautiful rings' },
    { word: 'MICROSCOPE', clue: 'Used to view very small objects' },
    { word: 'ELECTRICITY', clue: 'Powers most modern devices' },
    { word: 'TELESCOPE', clue: 'Used to observe stars and planets' },
]

const HardLevel = () => {
    const [usedIndexes, setUsedIndexes] = useState([])
    const [currentWord, setCurrentWord] = useState(getRandomWord())
    const [hiddenWord, setHiddenWord] = useState('_'.repeat(currentWord.word.length))
    const [selectedLetters, setSelectedLetters] = useState([])
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [message, setMessage] = useState('')
    const [gameOver, setGameOver] = useState(false)

    function getRandomWord() {
        const availableIndexes = WORDS.map((_, i) => i).filter(i => !usedIndexes.includes(i))
        if (availableIndexes.length === 0) return null
        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]
        setUsedIndexes([...usedIndexes, randomIndex])
        return WORDS[randomIndex]
    }

    useEffect(() => {
        if (!currentWord) return
        if (timeLeft <= 0) {
            setMessage('⏰ Time’s up! You lost this round!')
            setTimeout(nextWord, 2000)
            return
        }

        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft, currentWord])

    useEffect(() => {
        if (!currentWord) return

        const revealed = currentWord.word
            .split('')
            .map((letter) => (selectedLetters.includes(letter) ? letter : '_'))
            .join('')

        setHiddenWord(revealed)

        if (revealed === currentWord.word) {
            setMessage('🎉 Correct!')
            setScore((s) => s + 3)
            setTimeout(nextWord, 2000)
        }
    }, [selectedLetters])

    const handleLetterClick = (letter) => {
        if (selectedLetters.includes(letter) || gameOver) return
        setSelectedLetters([...selectedLetters, letter])

        if (!currentWord.word.includes(letter)) {
            setScore((s) => Math.max(0, s - 1))
        }
    }

    const nextWord = () => {
        if (usedIndexes.length >= WORDS.length) {
            setGameOver(true)
            setMessage('🏁 Game Over! You completed all 10 questions!')
            return
        }

        const newWord = getRandomWord()
        setCurrentWord(newWord)
        setHiddenWord('_'.repeat(newWord.word.length))
        setSelectedLetters([])
        setTimeLeft(30)
        setMessage('')
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h1>🧩 Hard Level Guessing Game</h1>
            <p>⏰ Time Left: {timeLeft}s | ⭐ Score: {score}</p>

            {!gameOver && (
                <>
                    <p>💡 Clue: {currentWord?.clue}</p>
                    <h2>{hiddenWord.split('').join(' ')}</h2>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '400px',
                        margin: '20px auto'
                    }}>
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                            <button
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                disabled={selectedLetters.includes(letter)}
                                style={{
                                    margin: '5px',
                                    padding: '10px',
                                    backgroundColor: selectedLetters.includes(letter) ? 'gray' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <p>{message}</p>

            {gameOver && (
                <div style={{ marginTop: '20px' }}>
                    <h2>🎯 Final Score: {score}</h2>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px 20px' }}>
                        🔁 Play Again
                    </button>
                </div>
            )}

            <Link to="/">
                <button style={{ marginTop: '20px', padding: '10px 20px' }}>🏠 Back Home</button>
            </Link>
        </div>
    )
}

export default HardLevel
