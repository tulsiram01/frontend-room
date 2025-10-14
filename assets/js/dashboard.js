const API_BASE = 'https://backend-room-e8i5.onrender.com/api';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    loadProperties();
});

// Load dashboard statistics
async function loadDashboardData() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        document.getElementById('userName').textContent = user.name || 'User';

        const response = await fetch(`${API_BASE}/properties`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
            const properties = data.data;
            const total = properties.length;
            const active = properties.filter(p => p.status === 'active' && p.isApproved).length;
            const pending = properties.filter(p => !p.isApproved).length;
            
            document.getElementById('totalProperties').textContent = total;
            document.getElementById('activeProperties').textContent = active;
            document.getElementById('pendingProperties').textContent = pending;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load owner's properties
async function loadProperties() {
    try {
        const response = await fetch(`${API_BASE}/properties`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayProperties(data.data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading properties:', error);
        showNotification('Error loading properties', 'error');
    }
}

// Display properties in table
function displayProperties(properties) {
    const tableBody = document.getElementById('propertiesTable');
    const emptyState = document.getElementById('emptyState');
    
    if (properties.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tableBody.innerHTML = properties.map(property => `
        <tr class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                        ${property.images && property.images.length > 0 ? 
                            `<img class="h-12 w-12 rounded-lg object-cover" src="https://backend-room-e8i5.onrender.com/${property.images[0].path}" alt="${property.title}">` :
                            `<div class="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <i class="fas fa-home text-gray-400"></i>
                            </div>`
                        }
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${property.title}</div>
                        <div class="text-sm text-gray-500">${property.bedrooms} bed, ${property.bathrooms} bath</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${property.city}, ${property.state}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">${property.address}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">₹${property.rent}/month</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="editProperty('${property._id}')" 
                        class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded text-xs">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="viewProperty('${property._id}')" 
                        class="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded text-xs">
                        <i class="fas fa-eye mr-1"></i>View
                    </button>
                    <button onclick="deleteProperty('${property._id}')" 
                        class="text-red-600 hover:text-red-900 bg-red-50 px-3py-1 rounded text-xs">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}


function editProperty(id) {
    window.location.href = `property-form.html?id=${id}`;
}

async function deleteProperty(id) {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/properties/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Property deleted successfully', 'success');
            loadProperties();
            loadDashboardData();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showNotification('Error deleting property', 'error');
    }
}