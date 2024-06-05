let currentPage = 1;
const itemsPerPage = 20;
let allData = [];

async function fetchData(category, page = 1) {
    let url;
    if (category === 'dogs') {
        url = 'https://freetestapi.com/api/v1/dogs';
    } else if (category === 'cats') {
        url = 'https://freetestapi.com/api/v1/cats';
    } else if (category === 'birds') {
        url = 'https://freetestapi.com/api/v1/birds';
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not get anything');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        // Check for duplicates
        const duplicates = findDuplicates(data);
        if (duplicates.length > 0) {
            console.warn('Found duplicates:', duplicates);
        } else {
            console.log('No duplicates found.');
        }

        allData = data; // Store the full data for searching
        displayAnimals(data, page);
    } catch (error) {
        console.error(error);
        const galleryContent = document.getElementById('galleryContent');
        galleryContent.innerHTML = '<p>Failed to load images.</p>';
    }
}

function findDuplicates(data) {
    const seen = new Set();
    const duplicates = [];

    data.forEach(item => {
        if (seen.has(item.id)) {
            duplicates.push(item);
        } else {
            seen.add(item.id);
        }
    });

    return duplicates;
}

function displayAnimals(data, page) {
    const galleryContent = document.getElementById('galleryContent');
    galleryContent.innerHTML = ''; // Clear previous images

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const animalsToShow = data.slice(startIndex, endIndex);

    console.log('Displaying items from index', startIndex, 'to', endIndex);

    animalsToShow.forEach(animal => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const imgElement = document.createElement('img');
        imgElement.src = animal.image;
        imgElement.alt = `${animal.name} image`;
        imgElement.classList.add('animal-image');

        const infoElement = document.createElement('div');
        infoElement.classList.add('animal-info');
        infoElement.innerHTML = `
            <p>Name: <span class="animal-name">${animal.name || 'N/A'}</span></p>
            <p>Origin: <span class="animal-origin">${animal.origin || 'N/A'}</span></p>
        `;

        imgElement.addEventListener('click', () => {
            showPopup(animal);
        });

        galleryItem.appendChild(imgElement);
        galleryItem.appendChild(infoElement);
        galleryContent.appendChild(galleryItem);
    });

    // Add pagination controls
    const paginationControls = document.createElement('div');
    paginationControls.className = 'pagination-controls';

    if (page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => displayAnimals(data, page - 1);
        paginationControls.appendChild(prevButton);
    }

    if (endIndex < data.length) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => displayAnimals(data, page + 1);
        paginationControls.appendChild(nextButton);
    }

    galleryContent.appendChild(paginationControls);
    currentPage = page;
}

function showPopup(animal) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Construct the content dynamically based on available attributes
    let content = `<p>ID: ${animal.id || 'N/A'}</p>`;

    if (animal.name) {
        content += `<p>Name: ${animal.name}</p>`;
    }
    if (animal.size) {
        content += `<p>Size: ${animal.size}</p>`;
    } else if (animal.color) {
        content += `<p>Color: ${animal.color}</p>`;
    }
    if (animal.origin) {
        content += `<p>Origin: ${animal.origin}</p>`;
    }
    if (animal.lifespan) {
        content += `<p>Lifespan: ${animal.lifespan}</p>`;
    }
    if (animal.description) {
        content += `<p>Description: ${animal.description}</p>`;
    }

    // Add any additional attributes dynamically
    for (let key in animal) {
        if (!['id', 'name', 'size', 'color', 'origin', 'lifespan', 'description', 'image'].includes(key)) {
            content += `<p>${key.charAt(0).toUpperCase() + key.slice(1)}: ${animal[key]}</p>`;
        }
    }

    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-button">&times;</span>
            ${content}
        </div>
    `;

    const closeButton = popup.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    document.body.appendChild(popup);
}

function searchAnimals() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = allData.filter(animal => animal.name.toLowerCase().includes(searchInput));
    displayAnimals(filteredData, 1);
}

// Load the initial set of data
document.addEventListener('DOMContentLoaded', () => {
    fetchData('dogs'); // Change this to the category you want to load initially

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

