document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Data load error');
            return response.json();
        })
        .then(data => {
            if (document.getElementById('dynamic-timeline')) {
                renderTimeline(data.events);
            }
            if (document.getElementById('persons-grid')) {
                renderPersons(data.persons);
            }
        })
        .catch(error => console.error(error));

    function renderTimeline(events) {
        const timelineContainer = document.getElementById('dynamic-timeline');
        let i = 0;
        while (i < events.length) {
            const event = events[i];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'timeline-item';
            itemDiv.innerHTML = `
                <span class="date">${event.year} рік</span>
                <span class="event">${event.title}</span>
                <button class="learn-more-btn" data-index="${i}">Дізнатися більше</button>
            `;
            // замість inline style -> клас
            if (event.year > 1900) {
                itemDiv.classList.add('timeline-item-modern');
            }
            timelineContainer.appendChild(itemDiv);
            i++;
        }
        setupModalEvents(events);
    }

    function renderPersons(persons) {
        const grid = document.getElementById('persons-grid');
        grid.innerHTML = ''; 
        persons.forEach(person => {
            const card = document.createElement('article');
            card.className = 'event-card';
            card.innerHTML = `
                <div class="person-img-container">
                    <img class="person-img" src="${person.image}" alt="${person.name}">
                </div>
                <h3>${person.name}</h3>
                <p><strong>${person.role}</strong></p>
                <p>${person.desc}</p>
            `;
            addHoverEffect(card);
            grid.appendChild(card);
        });
    }

    function setupModalEvents(events) {
        const modal = document.getElementById('event-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const closeBtn = document.querySelector('.close-btn');

        document.querySelectorAll('.learn-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                modalTitle.textContent = events[index].title;
                modalDesc.textContent = events[index].details;
                // показ модалки через клас
                modal.classList.add('modal-visible');
            });
        });

        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.remove('modal-visible');
            };
        }

        window.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('modal-visible');
            }
        };
    }

    const testSection = document.getElementById('testing');
    const toggleTestBtn = document.getElementById('toggle-test-btn');
    
    if (toggleTestBtn && testSection) {
        // початково прихований через клас
        testSection.classList.add('testing-hidden');

        toggleTestBtn.addEventListener('click', () => {
            const isHidden = testSection.classList.contains('testing-hidden');
            if (isHidden) {
                testSection.classList.remove('testing-hidden');
                testSection.classList.add('testing-visible');
                toggleTestBtn.textContent = 'Приховати тест';
            } else {
                testSection.classList.remove('testing-visible');
                testSection.classList.add('testing-hidden');
                toggleTestBtn.textContent = 'Тест';
            }
        });
    }

    const submitTestBtn = document.querySelector('#testing .btn-submit');
    if (submitTestBtn) {
        submitTestBtn.onclick = (e) => {
            e.preventDefault();
            let score = 0;
            const questions = document.querySelectorAll('#testing .question');
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');

            if (q1 && q1.value === "1991") { 
                highlightResult(questions[0], true); 
                score++; 
            } else { 
                highlightResult(questions[0], false); 
            }

            if (q2 && q2.value === "volodymyr") { 
                highlightResult(questions[1], true); 
                score++; 
            } else { 
                highlightResult(questions[1], false); 
            }

            displayScore(score, 2);
        };
    }

    function highlightResult(element, isCorrect) {
        element.classList.remove('question-correct', 'question-wrong');
        element.classList.add(isCorrect ? 'question-correct' : 'question-wrong');
    }

    function displayScore(score, total) {
        let msg = document.getElementById('test-result-msg') || document.createElement('h3');
        msg.id = 'test-result-msg';
        msg.textContent = `Твій результат: ${score} з ${total}`;
        msg.classList.remove('test-result-correct', 'test-result-partial');
        msg.classList.add(score === total ? 'test-result-correct' : 'test-result-partial');
        document.querySelector('.quiz-form').appendChild(msg);
    }

    const feedbackForm = document.getElementById('feedback-form');
    const feedbackList = document.getElementById('feedback-list');

    function renderFeedback(name, comment) {
        const item = document.createElement('div');
        item.className = 'feedback-item';
        item.innerHTML = `<strong>${name}</strong>: <p>${comment}</p>`;
        feedbackList.appendChild(item);
    }

    const savedFeedbacks = JSON.parse(localStorage.getItem('my_history_comments')) || [];
    savedFeedbacks.forEach(f => renderFeedback(f.name, f.comment));

    if (feedbackForm) {
        feedbackForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('name-input').value.trim();
            const comment = document.getElementById('comment-input').value.trim();
            if (!name || !comment) { 
                alert('Поля порожні!'); 
                return; 
            }
            renderFeedback(name, comment);
            savedFeedbacks.push({ name, comment });
            localStorage.setItem('my_history_comments', JSON.stringify(savedFeedbacks));
            feedbackForm.reset();
        };
    }

    function addHoverEffect(element) {
        element.addEventListener('mouseenter', function() {
            this.classList.add('event-card-hover');
        });
        element.addEventListener('mouseleave', function() {
            this.classList.remove('event-card-hover');
        });
    }

    document.querySelectorAll('.event-card').forEach(addHoverEffect);
});
