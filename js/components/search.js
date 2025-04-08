// js/components/search.js
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Mock data
    const MOCK_PROPERTIES = [
        {
            id: "prop-001",
            address: "123 Main Street, Cityville, State 12345",
            owner: "John & Mary Smith",
            parcelId: "AZ-12345-6789",
            area: "2,500 sq ft",
            type: "Residential",
            lastUpdated: "2023-09-15",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
            id: "prop-002",
            address: "456 Oak Avenue, Townsville, State 12346",
            owner: "Robert Johnson",
            parcelId: "AZ-23456-7890",
            area: "3,200 sq ft",
            type: "Residential",
            lastUpdated: "2023-10-20",
            image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
            id: "prop-003",
            address: "789 Pine Road, Villageton, State 12347",
            owner: "Jennifer Williams",
            parcelId: "AZ-34567-8901",
            area: "1,800 sq ft",
            type: "Residential",
            lastUpdated: "2023-11-05",
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        { id: "LAND-123456", address: "123 Main St", owner: "John Smith", taxStatus: "Paid", lastUpdated: "Jan 10, 2025" },
        { id: "LAND-789012", address: "456 Oak Ave", owner: "Jane Doe", taxStatus: "Pending", lastUpdated: "Dec 15, 2024" },
    ];

    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchQuery = document.getElementById('search-query');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    const resultsContainer = document.getElementById('results-container');
    const tabText = document.getElementById('tab-text');
    const tabMap = document.getElementById('tab-map');
    const tabContentText = document.getElementById('tab-content-text');
    const tabContentMap = document.getElementById('tab-content-map');
    const searchById = document.getElementById('search-by-id');
    const searchByName = document.getElementById('search-by-name');
    const searchByLocation = document.getElementById('search-by-location');

    // Tab Switching
    tabText.addEventListener('click', () => {
        tabText.classList.add('tab-active');
        tabMap.classList.remove('tab-active');
        tabContentText.classList.remove('hidden');
        tabContentMap.classList.add('hidden');
    });

    tabMap.addEventListener('click', () => {
        tabMap.classList.add('tab-active');
        tabText.classList.remove('tab-active');
        tabContentMap.classList.remove('hidden');
        tabContentText.classList.add('hidden');
    });

    // Search Functionality
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchQuery.value.trim();

        if (!query) {
            toast.show('Please enter a property ID, owner name, address, or parcel ID.');
            return;
        }

        searchResults.classList.remove('hidden');
        resultsContainer.innerHTML = '';

        const results = MOCK_PROPERTIES.filter(property =>
            property.id?.toLowerCase().includes(query.toLowerCase()) ||
            property.address?.toLowerCase().includes(query.toLowerCase()) ||
            property.owner?.toLowerCase().includes(query.toLowerCase()) ||
            property.parcelId?.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            toast.show(`Found ${results.length} record(s).`);
            results.forEach(property => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-lg shadow-md overflow-hidden grid md:grid-cols-[300px_1fr] gap-6 animate-fade-in';
                card.innerHTML = `
          <div class="h-[200px] md:h-full bg-gray-200">
            <img src="${property.image || 'https://via.placeholder.com/300x200'}" alt="${property.address || 'Property Image'}" class="w-full h-full object-cover">
          </div>
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-medium mb-2">${property.address || 'N/A'}</h3>
                <p class="text-sm text-gray-500 mb-4">Parcel ID: ${property.parcelId || property.id || 'N/A'}</p>
              </div>
              <button class="text-teal border border-teal px-3 py-1 rounded-md hover:bg-teal-50 transition-colors">View Details</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div class="flex items-start space-x-2">
                <i data-lucide="users" class="h-4 w-4 text-teal mt-0.5"></i>
                <div>
                  <p class="text-xs text-gray-500">Owner</p>
                  <p class="text-sm font-medium">${property.owner || 'N/A'}</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i data-lucide="home" class="h-4 w-4 text-teal mt-0.5"></i>
                <div>
                  <p class="text-xs text-gray-500">Property Type</p>
                  <p class="text-sm font-medium">${property.type || 'N/A'}</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i data-lucide="ruler" class="h-4 w-4 text-teal mt-0.5"></i>
                <div>
                  <p class="text-xs text-gray-500">Area</p>
                  <p class="text-sm font-medium">${property.area || 'N/A'}</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i data-lucide="calendar" class="h-4 w-4 text-teal mt-0.5"></i>
                <div>
                  <p class="text-xs text-gray-500">Last Updated</p>
                  <p class="text-sm font-medium">${property.lastUpdated || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 mt-6">
              <button class="text-teal border border-teal px-3 py-1 rounded-md text-xs flex items-center">
                <i data-lucide="file-text" class="h-3.5 w-3.5 mr-1"></i> View Documents
              </button>
              <button class="text-teal border border-teal px-3 py-1 rounded-md text-xs flex items-center">
                <i data-lucide="layers" class="h-3.5 w-3.5 mr-1"></i> Tax History
              </button>
              <button class="text-teal border border-teal px-3 py-1 rounded-md text-xs flex items-center">
                <i data-lucide="map-pin" class="h-3.5 w-3.5 mr-1"></i> View on Map
              </button>
            </div>
          </div>
        `;
                resultsContainer.appendChild(card);
            });
        } else {
            toast.show('No results found. Please try again.');
            resultsContainer.innerHTML = '<p class="text-center text-gray-500">No results found.</p>';
        }

        lucide.createIcons();
    });

    // Filter Button Placeholder Updates
    [searchById, searchByName, searchByLocation].forEach(btn => {
        btn.addEventListener('click', () => {
            searchQuery.placeholder = `Enter ${btn.textContent.replace('By ', '').toLowerCase()}...`;
        });
    });
});