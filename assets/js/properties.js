const API_BASE = 'http://localhost:5000/api';

// Load properties when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
});

// Load and display public properties
async function loadProperties() {
    const loading = document.getElementById('loading');
    const noProperties = document.getElementById('noProperties');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    try {
        const state = document.getElementById('stateFilter').value;
        const city = document.getElementById('cityFilter').value;
        const maxRent = document.getElementById('maxRentFilter').value;
        
        let url = `${API_BASE}/properties/public?`;
        const params = new URLSearchParams();
        
        if (state) params.append('state', state);
        if (city) params.append('city', city);
        if (maxRent) params.append('maxRent', maxRent);
        
        url += params.toString();
        
        const response = await fetch(url);
        const data = await response.json();
        
        loading.classList.add('hidden');
        
        if (data.success && data.data.length > 0) {
            noProperties.classList.add('hidden');
            displayProperties(data.data);
        } else {
            noProperties.classList.remove('hidden');
            propertiesGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading properties:', error);
        loading.classList.add('hidden');
        noProperties.classList.remove('hidden');
    }
}

// Display properties in grid
function displayProperties(properties) {
    const grid = document.getElementById('propertiesGrid');
    
    grid.innerHTML = properties.map(property => `
        <div class="property-card bg-white rounded-lg shadow-md overflow-hidden">
            ${property.images && property.images.length > 0 ? 
                `<img src="http://localhost:5000/${property.images[0].path}" alt="${property.title}" class="w-full h-48 object-cover">` :
                `<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-home text-gray-400 text-4xl"></i>
                </div>`
            }
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">${property.title}</h3>
                    <span class="text-2xl font-bold text-blue-600">₹ ${property.rent}</span>
                </div>
                
                <p class="text-gray-600 mb-4 line-clamp-2">${property.description}</p>
                
                <div class="flex items-center text-gray-500 mb-4">
                    <i class="fas fa-bed mr-2"></i>
                    <span class="mr-4">${property.bedrooms} beds</span>
                    <i class="fas fa-bath mr-2"></i>
                    <span class="mr-4">${property.bathrooms} baths</span>
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${property.city}, ${property.state}</span>
                </div>
                
                ${property.amenities && property.amenities.length > 0 ? `
                    <div class="mb-4">
                        <div class="flex flex-wrap gap-1">
                            ${property.amenities.slice(0, 3).map(amenity => `
                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${amenity}</span>
                            `).join('')}
                            ${property.amenities.length > 3 ? 
                                `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">+${property.amenities.length - 3} more</span>` : ''
                            }
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-600">Owner: ${property.owner.name}</p>
                        ${property.owner.phone ? `<p class="text-sm text-gray-600">Phone: ${property.owner.phone}</p>` : ''}
                    </div>
                    <button onclick="viewProperty('${property._id}')" 
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewProperty(id) {
    window.location.href = `property-details.html?id=${id}`;
}