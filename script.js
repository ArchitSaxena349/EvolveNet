// Get all tabs and tab contents
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Add event listener to each tab
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and tab contents
    tabs.forEach((t) => t.classList.remove('active'));
    tabContents.forEach((tc) => tc.classList.remove('active'));

    // Add active class to the clicked tab and its corresponding content
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    const tabContent = document.querySelector(`.tab-content#${tabId}`);
    tabContent.classList.add('active');
  });
});