var hangman = {
    alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'
    ],
    context: null,
    stickman: null,
    questions: [
        {
            category: 'City',
            answer: 'Rome',
            hints: ['It is a city in Italy.', 'It is the one of the most famous city in Italy.']
        },
        {
            category: 'City',
            answer: 'Istanbul',
            hints: ['It is a city in Turkey.', 'It is the most famous city in Turkey.']
        },
        {
            category: 'Singer',
            answer: 'Taylor Swift',
            hints: ['She is a famous pop singer.', 'One of her songs is Shake It Off.']
        },
        {
            category: 'Singer',
            answer: 'Katy Perry',
            hints: ['She is a famous pop singer.', 'One of her songs is Dark Horse.']
        },
        {
            category: 'Singer',
            answer: 'Michael Jackson',
            hints: ['He is the "King of Pop".', 'One of his songs is Billie Jean.']
        },
        {
            category: 'Scientist',
            answer: 'Albert Einstein',
            hints: ['He is the German-born famous theortical physicist.', 'His best know equation is E=mc2']
        },
        {
            category: 'Scientist',
            answer: 'Isaac Newton',
            hints: ['He is the famous English mathematician', 'He is famous for his law of gravitation.']
        },
        {
            category: 'Scientist',
            answer: 'Nikola Tesla',
            hints: ['He is the famous Serbian inventor.', 'He is famous for Alternating Current.']
        },
        {
            category: 'Movie',
            answer: 'The Godfather',
            hints: ['The most popular movie of all time.', 'One of the actor\'s name is Marlon Brando']
        },
        {
            category: 'Movie',
            answer: 'Star Wars',
            hints: ['The most popular movie of all time.', 'This movie\'s director is George Lucas']
        },
        {
            category: 'Movie',
            answer: 'The Lord of The Rings',
            hints: ['The most popular movie of all time.', 'The movie is made from the novel written by J. R .R. Tolkien']
        },
        {
            category: 'Tv Show',
            answer: 'The Simpsons',
            hints: ['The most popular animated tv show of all time.']
        },
        {
            category: 'Tv Show',
            answer: 'Seinfeld',
            hints: ['The most popular sitcom tv show of all time.']
        }
    ],
    selectedCategory: null,
    categoryElement: null,
    livesElement: null,
    answerElement: null,
    hintElement: null,
    lives: null,
    win: false,

    draw: function ($pathFromx, $pathFromy, $pathTox, $pathToy) {
        this.context.moveTo($pathFromx, $pathFromy);
        this.context.lineTo($pathTox, $pathToy);
        this.context.stroke();
    },

    drawHead: function () {
        //this.context.beginPath();
        this.context.arc(60, 25, 10, 0, Math.PI * 2, true);
        this.context.stroke();
    },

    drawFrame1: function () {
        this.draw(0, 150, 150, 150);
    },

    drawFrame2: function () {
        this.draw(10, 0, 10, 600);
    },

    drawFrame3: function () {
        this.draw(0, 5, 70, 5);
    },

    drawFrame4: function () {
        this.draw(60, 5, 60, 15);
    },

    drawTorso: function () {
        this.draw(60, 36, 60, 70);
    },

    drawRightArm: function () {
        this.draw(60, 46, 100, 50);
    },

    drawLeftArm: function () {
        this.draw(60, 46, 20, 50);
    },

    drawRightLeg: function () {
        this.draw(60, 70, 100, 100);
    },

    drawLeftLeg: function () {
        this.draw(60, 70, 20, 100);
    },

    drawArray: [
        function () {
            hangman.drawRightLeg();
        },
        function () {
            hangman.drawLeftLeg();
        },
        function () {
            hangman.drawRightArm();
        },
        function () {
            hangman.drawLeftArm();
        },
        function () {
            hangman.drawTorso();
        }, 
        function () {
            hangman.drawHead();
        }, 
        function () {
            hangman.drawFrame4();
        }, 
        function () {
            hangman.drawFrame3();
        },
         function () {
            hangman.drawFrame2();
        }, 
        function () {
            hangman.drawFrame1();
        }],

    createButtons: function () {
        var myButtons = document.getElementById('buttons');
        while (myButtons.firstChild) {
            myButtons.removeChild(myButtons.firstChild);
        }
        var letters = document.createElement('ul');
        letters.id = 'alphabet';
        letters.classList.add('mx-auto');
        for (var i = 0; i < this.alphabet.length; i++) {
            var list = document.createElement('li');
            list.classList.add('bg-dark', 'text-white', 'text-center', 'text-uppercase', 'rounded-circle', 'border', 'border-success');
            list.id = 'letter-' + this.alphabet[i];
            list.classList.add('letter');
            list.innerHTML = this.alphabet[i];
            list.onclick = function () {
                hangman.check(this.innerText);
                this.classList.remove('text-white');
                this.classList.remove('border-success');
                this.classList.add('text-muted');
                this.classList.add('guessed');
                this.onmouseover = null;
                this.onmouseout = null;
                this.onclick = null;
            };
            list.onmouseover = function () {
                if (this.classList.contains('border-success')) {
                    this.classList.remove('border-success');
                    this.classList.add('border-white');
                }
            };
            list.onmouseout = function () {
                if (!this.classList.contains('guessed')) {
                    this.classList.remove('border-white');
                    this.classList.add('border-success');
                }
            };
            letters.appendChild(list);
        }
        myButtons.appendChild(letters);
    },

    showQuestion: function () {
        this.categoryElement.innerHTML = this.selectedCategory.category;
        console.log(this.selectedCategory);
        while(this.answerElement.firstChild)
        {
            this.answerElement.removeChild(this.answerElement.firstChild);
        }
        for(var i = 0; i < this.selectedCategory.answer.length; i++)
        {
            var list = document.createElement('li');
            list.id = 'guess-'+ i;
            list.classList.add('text-white', 'text-uppercase');
            if (this.selectedCategory.answer[i] === ' ')
            {
                list.innerHTML = '';
            }
            else {
                list.innerHTML = '_';
            }
            this.answerElement.appendChild(list);
        }
    },

    showLives: function () {
        this.livesElement.innerHTML = 'You have ' + this.lives + ' lives';
        if (this.lives < 1) {
            this.livesElement.innerHTML = '<b>Game Over</b>';
        }
        if (this.win){
            this.livesElement.innerHTML = 'You Win!';
        }
    },

    showHint: function() {
        this.hintElement.innerHTML = this.selectedCategory.hints[Math.floor(Math.random() * this.selectedCategory.hints.length)];
    },

    check: function ($letter) {
        var answer = this.selectedCategory.answer.toLowerCase();
        $letter = $letter.toLowerCase();
        if (answer.indexOf($letter) >= 0) {
            for(var i = 0; i < answer.length; i++)
            {
                if(answer[i].toLowerCase() === $letter)
                {
                    var element = document.getElementById('guess-' + i);
                    element.innerHTML = this.selectedCategory.answer[i];
                }
            }
            var isAllGuessed = true;
            for(var i = 0; i < this.answerElement.childNodes.length; i++)
            {
                var node = this.answerElement.childNodes[i];
                if (node.innerHTML === '_')
                {
                    isAllGuessed = false;
                }
            }
            if (isAllGuessed)
            {
                this.win = true;
                this.showLives();
            }
        }
        else {
            if (this.lives !== 0 || this.lives > 0) {
                this.lives--;
                this.drawArray[this.lives]();
            }
            this.showLives();
        }
    },

    play: function () {
        this.hintElement.innerHTML = '';
        this.selectedCategory = this.questions[Math.floor(Math.random() * this.questions.length)];
        this.lives = 10;
        this.win = false;
        this.context.clearRect(0,0,400,400);
        this.createButtons();
        this.showQuestion();
        this.showLives();
    },

    init: function () {
        this.stickman = document.getElementById("stickman");
        this.context = stickman.getContext('2d');
        this.categoryElement = document.getElementById('category');
        this.livesElement = document.getElementById('lives');
        var holdElement = document.getElementById('hold');
        var answerElement = document.createElement('ul');
        answerElement.id = 'my-word';
        holdElement.appendChild(answerElement);
        this.answerElement = answerElement;
        this.hintElement = document.getElementById('hint');
        this.context.beginPath();
        this.context.strokeStyle = "#fff";
        this.context.lineWidth = 2;
        this.play();
    },

};

window.onload = function () {
    hangman.init();
    var playAgainButton = document.getElementById('reset');
    playAgainButton.onclick = function() {
        hangman.play();
    }
    var hintButton = document.getElementById('getHint');
    hintButton.onclick = function() {
        hangman.showHint();
    }
    window.addEventListener('keyup', function (e) {
        var button = e.key.toLocaleLowerCase();
        if (hangman.alphabet.indexOf(button) >= 0) {
            var letter = document.getElementById('letter-' + e.key.toLocaleLowerCase());
            if (letter.onclick) {
                letter.onclick();
            }
        }
    });
}