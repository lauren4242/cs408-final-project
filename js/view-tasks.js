window.onload = function() {
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);
};

function handleSearch() {
    const category = document.getElementById('filterCategory').value;
    const priority = document.getElementById('filterPriority').value;
    const status = document.getElementById('filterStatus').value;
    
    // These are safe - all from dropdowns
    const filters = {
        category: category,
        priority: priority,
        status: status
    };
    
    console.log('Searching AWS with filters:', filters);
    // TODO: Query AWS with filters (conditional retrieval - not ALL data)
    
    // Show results count
    const resultsCount = document.getElementById('resultsCount');
    resultsCount.textContent = 'Searching AWS database...';
    
    // Mock result display
    setTimeout(() => {
        resultsCount.textContent = 'Found 0 tasks matching your filters.';
    }, 500);
}
