// Always open accordion.js
class AccordionGenerator {
    constructor(containerId, data = []) {
        this.container = document.getElementById(containerId);
        this.data = data;

        if (this.container) this.render();
    }

    #createItem(item, index) {
        const itemNumber = index + 1;
        const uniqueId = `panelsStayOpen-collapse${itemNumber}`;

        const wrapper = document.createElement('div');
        wrapper.className = 'accordion-item';
        
        wrapper.innerHTML = `
            <h2 class="accordion-header">
                <button 
                    class="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${uniqueId}" 
                    aria-expanded="false" 
                    aria-controls="${uniqueId}">
                    <span>${itemNumber}</span> ${item.question}
                </button>
            </h2>
            <div 
                id="${uniqueId}" 
                class="accordion-collapse collapse">
                <div class="accordion-body">
                    ${item.answer}
                </div>
            </div>`;
        return wrapper;
    }

    render() {
        if (!this.data || this.data.length === 0) return;
        const fragment = document.createDocumentFragment();
        this.data.forEach((item, index) => fragment.appendChild(this.#createItem(item, index)));
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
}

// Self-initializing on DOM ready
const init = () => new AccordionGenerator('accordionFaqs', accordionData);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
