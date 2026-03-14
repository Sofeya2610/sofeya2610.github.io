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
            if (event.year > 1900) {
                itemDiv.style.borderColor = "#27ae60";
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
            // Тут ми використовуємо person.image з твого JSON
            card.innerHTML = `
                <div class="person-img-container" style="height: 250px; overflow: hidden; border-radius: 4px; margin-bottom: 15px; background: #eee;">
                    <img src="${person.image}" alt="${person.name}" style="width: 100%; height: 100%; object-fit: cover;">
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
                modal.style.display = 'flex'; 
            });
        });

        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }

        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }

    const testSection = document.getElementById('testing');
    const toggleTestBtn = document.getElementById('toggle-test-btn');
    
    if (toggleTestBtn && testSection) {
        testSection.style.display = 'none';
        toggleTestBtn.addEventListener('click', () => {
            const isHidden = testSection.style.display === 'none' || testSection.style.display === '';
            testSection.style.display = isHidden ? 'block' : 'none';
            toggleTestBtn.textContent = isHidden ? 'Приховати тест' : 'Тест';
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

            if (q1 && q1.value === "1991") { highlightResult(questions[0], true); score++; }
            else { highlightResult(questions[0], false); }

            if (q2 && q2.value === "volodymyr") { highlightResult(questions[1], true); score++; }
            else { highlightResult(questions[1], false); }

            displayScore(score, 2);
        };
    }

    function highlightResult(element, isCorrect) {
        element.style.border = isCorrect ? "2px solid #27ae60" : "2px solid #e74c3c";
        element.style.backgroundColor = isCorrect ? "#eafaf1" : "#fdedec";
    }

    function displayScore(score, total) {
        let msg = document.getElementById('test-result-msg') || document.createElement('h3');
        msg.id = 'test-result-msg';
        msg.textContent = `Твій результат: ${score} з ${total}`;
        msg.style.textAlign = 'center';
        msg.style.color = score === total ? '#27ae60' : '#e67e22';
        document.querySelector('.quiz-form').appendChild(msg);
    }

    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('name-input').value.trim();
            const comment = document.getElementById('comment-input').value.trim();
            if (!name || !comment) { alert('Поля порожні!'); return; }
            const item = document.createElement('div');
            item.className = 'feedback-item';
            item.innerHTML = `<strong>${name}</strong>: <p>${comment}</p>`;
            document.getElementById('feedback-list').appendChild(item);
            feedbackForm.reset();
        };
    }

    function addHoverEffect(element) {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
            this.style.backgroundColor = '#fdf5e6';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'white';
        });
    }

    document.querySelectorAll('.event-card').forEach(addHoverEffect);
});