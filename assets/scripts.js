document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-btn');
    const questionContainer = document.getElementById('question-container');
    const answerButtons = document.getElementById('answer-buttons');
    const resultContainer = document.getElementById('result-container');
    const scoreContainer = document.getElementById('score-container');
    const initialsForm = document.getElementById('initials-form');
    const initialsInput = document.getElementById('initials-input');
    const submitButton = document.getElementById('submit-btn');
    const restartButton = document.getElementById('restart-after-initials-btn');
    const viewScoresButton = document.getElementById('view-scores-btn');
    const scoresList = document.getElementById('scores-list');
    const timerElement = document.getElementById('time-left');

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 60;

    startButton.addEventListener('click', startQuiz);
    submitButton.addEventListener('click', saveScore);
    restartButton.addEventListener('click', restartQuiz);
    viewScoresButton.addEventListener('click', showHighScores);

    const questions = [
        {
            question: 'Commonly used data types DO NOT include:',
            answers: ['strings', 'booleans', 'alerts', 'numbers'],
            correctAnswer: 'alerts',
        },
        {
            question: 'The condition in an if / else statement is enclosed within _____.',
            answers: ['quotes', 'curly brackets', 'parentheses', 'square brackets'],
            correctAnswer: 'parentheses',
        },
        {
            question: 'Arrays in JavaScript can be used to store _____.',
            answers: ['numbers and strings','other arrays','booleans','all of the above',
            ],
            correctAnswer: 'all of the above',
        },
        {
            question:
                'String values must be enclosed within _____ when being assigned to variables.',
            answers: ['commas', 'curly brackets', 'quotes', 'parentheses'],
            correctAnswer: 'quotes',
        },
        {
            question:
                'A very useful tool used during development and debugging for printing content to the debugger is:',
            answers: ['JavaScript', 'terminal / bash', 'for loops', 'console.log'],
            correctAnswer: 'console.log',
        },
    ];

    function startQuiz() {
        startButton.classList.add('hide');
        restartButton.classList.add('hide'); // Hide restart button at the beginning
        score = 0;
        timeLeft = 60;
        setNextQuestion();
        startTimer();
    }

    function startTimer() {
        const timerInterval = setInterval(function () {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0 || currentQuestionIndex === questions.length) {
                clearInterval(timerInterval);
                endQuiz();
            }
        }, 1000);
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            endQuiz();
        }
    }

    function showQuestion(question) {
        questionContainer.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(answer, question.correctAnswer));
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
        resultContainer.innerText = '';
    }

    function selectAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            score++;
        } else {
            timeLeft -= 10;
            if (timeLeft < 0) {
                timeLeft = 0;
            }
        }

        currentQuestionIndex++;
        setNextQuestion();
    }

    function endQuiz() {
        scoreContainer.innerText = `Your score: ${score}`;
        initialsForm.classList.remove('hide');
        questionContainer.innerHTML = '';
        restartButton.classList.remove('hide'); // Show restart button when the quiz ends
        submitButton.classList.remove('hide'); // Show submit button after completing the quiz
    }

    function saveScore(event) {
        event.preventDefault();
        const initials = initialsInput.value.trim();

        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        const newScore = { initials, score };
        highScores.push(newScore);
        localStorage.setItem('highScores', JSON.stringify(highScores));

        restartButton.classList.remove('hide');
        initialsForm.classList.add('hide');
        submitButton.classList.add('hide'); // Hide submit button after saving score
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 60;

        timerElement.textContent = timeLeft;

        initialsForm.classList.add('hide');
        scoreContainer.classList.add('hide');
        showStartScreen();
    }
    

    function showHighScores() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        let highScoresHTML = '<h2>High Scores</h2>';
        highScores.forEach((score, index) => {
            highScoresHTML += `<li>${index + 1}. ${score.initials} - ${score.score}</li>`;
        });

        highScoresHTML += '<button id="go-back-btn" class="btn">Go Back</button>';

        highScoresHTML += '<button id="clear-scores-btn" class="btn">Clear High Scores</button>';

        questionContainer.innerHTML = highScoresHTML;

        const goBackButton = document.getElementById('go-back-btn');
        const clearScoresButton = document.getElementById('clear-scores-btn');

        goBackButton.addEventListener('click', showStartScreen);
        clearScoresButton.addEventListener('click', clearHighScores);

        scoresList.classList.remove('hide');
    }

    function clearHighScores() {
        localStorage.removeItem('highScores');
        scoresList.innerHTML = '';

        showHighScores();
    }

    function showStartScreen() {
        startButton.classList.remove('hide');
        questionContainer.innerHTML = '';
        restartButton.classList.add('hide'); // Hide restart button when going back to start screen
        submitButton.classList.remove('hide'); // Show submit button when going back to start screen
    }
});
