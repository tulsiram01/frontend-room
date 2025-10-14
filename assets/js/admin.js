function displayProperties(properties) {
    const tbody = document.getElementById('propertiesTable');
    const emptyState = document.getElementById('propertiesEmpty');
    
    if (!properties || properties.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = properties.map(property => `
        <tr class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${property.title || 'Untitled'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${property.location || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${property.owner?.name || 'Unknown'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${property.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Unknown'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="viewPropertyDetails('${property._id}')"
                        class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded text-xs">
                        <i class="fas fa-eye mr-1"></i>View
                    </button>
                    <button onclick="togglePropertyStatus('${property._id}', ${property.isActive})"
                        class="${property.isActive ? 'text-red-600 hover:text-red-900 bg-red-50' : 'text-green-600 hover:text-green-900 bg-green-50'} px-3 py-1 rounded text-xs">
                        <i class="fas ${property.isActive ? 'fa-ban' : 'fa-check'} mr-1"></i>
                        ${property.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}
