$(document).ready(function () {

    // Trivia data object =======================================================================================
    var triviaGame = {
        // Questions. All a1 answers are the correct answer.
        question1: {
            q: "Which planet is closest to Earth?",
            a1: "Venus",
            a2: "Uranus",
            a3: "Saturn",
            a4: "Jupiter",
        },
        question2: {
            q: "Which planet has the most moons?",
            a1: "Jupiter",
            a2: "Earth",
            a3: "Saturn",
            a4: "Uranus",
        },
        question3: {
            q: "This means Earth is spinning on its axis:",
            a1: "Rotation",
            a2: "Revolution",
            a3: "Spinning",
            a4: "Orbit",
        },
        question4: {
            q: "What causes our seasons?",
            a1: "Earth's tilt",
            a2: "Rotation and revolution",
            a3: "Rotation",
            a4: "Earth’s tilt and revolution",
        },
        question5: {
            q: "Which planet spins backwards relative to the others?",
            a1: "Venus",
            a2: "Mars",
            a3: "Earth",
            a4: "Jupiter",
            
        },
        questionTime: 10,
        currentTime: 10,
        answerTime: 5,
        questionCounter: 1,
        questionsRight: 0,
        questionsWrong: 0,
        answered: false,
        buttonTimeOut: null,
        answerTimeOut: null,
        timerRunning: false,
        intervalHolder: null,
        questionWriter: function (question) {
            // Shuffle button divs. Adapted from https://stackoverflow.com/questions/18508742/multiple-ids-in-a-single-javascript-click-event
            $("#answers-div").each(function () {
                var buttons = $(this).find('button');
                for (var i = 0; i < buttons.length; i++) {
                    $(buttons[i]).remove();
                }
                // Fisher-Yates shuffle algorithm
                var i = buttons.length;
                if (i == 0) {
                    return false;
                }
                while (--i) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var tempi = buttons[i];
                    var tempj = buttons[j];
                    buttons[i] = tempj;
                    buttons[j] = tempi;
                }
                for (var i = 0; i < buttons.length; i++) {
                    $(buttons[i]).appendTo(this);
                }
            });
            // Push question and answer text to the document
            $("#question").empty().text(question.q);
            $("#a1").empty().text(question.a1);
            $("#a2").empty().text(question.a2);
            $("#a3").empty().text(question.a3);
            $("#a4").text(question.a4);
            this.answered = false;
        },
        nextQuestion: function (number) {
            $(".btn").removeClass("btn-success btn-danger btn-warning");
            $("#message-area").empty();
            if (this.questionCounter <= 5) {
                var currentQuestion = triviaGame["question" + number];
                this.questionWriter(currentQuestion);
                this.timer();
                this.buttonTimeOut = setTimeout(this.wrong, (1000 * triviaGame.questionTime));
            } else {
                this.endGame();
            }
        },
        right: function () {
            clearInterval(triviaGame.intervalHolder);
            triviaGame.questionsRight++;
            triviaGame.questionCounter++;
            $("#message-area").html(
                `<p>Correct!</p>`
            )
            var tempNext = function () {
                triviaGame.nextQuestion(triviaGame.questionCounter);
            }
            this.answerTimeOut = setTimeout(tempNext, 1000 * 3);
        },
        wrong: function () {
            clearInterval(triviaGame.intervalHolder);
            $("#a1").addClass("btn-warning");
            triviaGame.questionCounter++;
            triviaGame.questionsWrong++;
            $("#message-area").html(
                `<p>Incorrect!</p>`
            )
            var tempNext = function () {
                triviaGame.nextQuestion(triviaGame.questionCounter);
            }
            this.answerTimeOut = setTimeout(tempNext, 1000 * 3);
        },
        gameStart: function () {
            // Clear the game variables (for restart) and display the game area (for start)
            this.questionCounter = 1;
            this.questionsRight = 0;
            this.questionsWrong = 0;
            this.answered = false;
            $("#question, #answers-div, #timer-area").show();
            $("#control-buttons, #message-area").empty();
            // Load the first question
            this.questionWriter(triviaGame.question1);
            // Start the timer
            this.timer();
            this.buttonTimeOut = setTimeout(this.wrong, 1000 * (triviaGame.questionTime));

        },
        openScreen: function () {
            $("#question, #answers-div, #timer-area").hide();
            $("#control-buttons").html(
                `<button id="start-game" class="btn btn-large btn-primary">START GAME</button>`
            )
        },
        timer: function () {
            triviaGame.currentTime = 10;
            $("#timer").text(triviaGame.currentTime);
            triviaGame.intervalHolder = setInterval(triviaGame.count, 1000);
        },
        count: function () {
            triviaGame.currentTime--;
            $("#timer").text(triviaGame.currentTime);
        },
        endGame: function () {
            $("#question, #answers-div, #timer-area").hide();
            $("#control-buttons").html(
                `<button id="start-game" class="btn btn-large btn-primary">RESTART GAME</button>`
            )
            $("#message-area").html(
                `<h4>Game Stats</h4>
                <p>Correct: ${triviaGame.questionsRight}</p>
                <p>Incorrect: ${triviaGame.questionsWrong}</p>`
            )
        }

    } // End trivia data object =======================================================================================

    // Load the start button
    triviaGame.openScreen();

    // Click in the answers-div
    $("#answers-div").on("click", ".btn", function () {
        var $this = this;
        var clickedId = $($this).attr("id");

        if (!triviaGame.answered) {
            triviaGame.answered += true;
            clearTimeout(triviaGame.buttonTimeOut);
            if (clickedId === "a1") {
                $($this).addClass("btn-success");
                triviaGame.right();
            }
            if (clickedId != "a1") {
                $($this).addClass("btn-danger");
                triviaGame.wrong();
            }
        }
    });

    // Start game click
    $("#control-buttons").on("click", "#start-game", function () {
        triviaGame.gameStart();
    });
});