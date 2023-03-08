
// Select the container element where you want to add the job listings
const container = document.querySelector('main');

// Store the current set of filters
const filters = {};
const filterValues = {};



// Fetch the data from the JSON file
// Fetch the data from the JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Store the jobs data in a variable
        const jobs = data;

        // Generate the HTML for all jobs and add them to the container
        const jobHTML = generateJobHTML(jobs);
        container.innerHTML = jobHTML;

        // Add click event listeners to each of the filter options
        const filterOptions = document.querySelectorAll('.right-container p');
        filterOptions.forEach(filter => {
            filter.addEventListener('click', () => {


                // Get the filter type and value
                const filterType = filter.className;
                const filterValue = filter.textContent;
                // Update the current set of filters
                filters[filterType] = filterValue;
                // Add the filter value to the filterValues object
                if (!filterValues[filterType]) {
                    filterValues[filterType] = [];
                }
                if (!filterValues[filterType].includes(filterValue)) {
                    filterValues[filterType].push(filterValue);
                }
                // Remove the "active" class from all filter options
                filterOptions.forEach(option => {
                    option.classList.remove('active');
                });
                const Active = document.createElement('div');

                // Add the "active" class to the clicked filter option
                filter.classList.add('active');

                // Filter and update the job listings
                updateJobListings(jobs, filters);
            });
        });
    });

// Function to generate HTML for the job listings
function generateJobHTML(jobs) {
    // Create an array to store the HTML for each job
    const jobHTML = [];


    jobs.forEach(job => {
        // Create a new container element for each job
        const jobContainer = document.createElement('div');
        jobContainer.classList.add('container');

        // Create the left container for the job image and info
        const leftContainer = document.createElement('div');
        leftContainer.classList.add('left-container');

        // Create the job image element
        const jobImage = document.createElement('img');
        jobImage.src = job.logo;
        jobImage.alt = `${job.company} logo`;
        jobImage.classList.add('job-image');
        leftContainer.appendChild(jobImage);

        // Create the info container for the job title, company name, and other info
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        // Create the info element for the job title, company name, and other info
        const info = document.createElement('div');
        info.classList.add('info');

        // Create the company name element
        const companyName = document.createElement('p');
        companyName.classList.add('company');
        companyName.textContent = job.company;
        info.appendChild(companyName);

        // Create the "new" badge element if the job is new
        if (job.new) {
            const newBadge = document.createElement('p');
            newBadge.classList.add('new');
            newBadge.textContent = 'New!';
            info.appendChild(newBadge);
        }

        // Create the "featured" badge element if the job is featured
        if (job.featured) {
            const featuredBadge = document.createElement('p');
            featuredBadge.classList.add('featured');
            featuredBadge.textContent = 'Featured';
            info.appendChild(featuredBadge);
        }

        infoContainer.appendChild(info);

        // Create the job title element
        const jobTitle = document.createElement('h3');
        jobTitle.classList.add('job-title');
        jobTitle.textContent = job.position;
        infoContainer.appendChild(jobTitle);

        // Create the small container for the duration, contract, and location info
        const smallContainer = document.createElement('div');
        smallContainer.classList.add('small-container');

        // Create the duration element
        const duration = document
            .createElement('p');
        duration.classList.add('duration');
        duration.textContent = job.postedAt;
        smallContainer.appendChild(duration);
        // Create the contract type element
        const contract = document.createElement('p');
        contract.classList.add('contract');
        contract.textContent = job.contract;
        smallContainer.appendChild(contract);

        // Create the location element
        const location = document.createElement('p');
        location.classList.add('location');
        location.textContent = job.location;
        smallContainer.appendChild(location);

        infoContainer.appendChild(smallContainer);

        leftContainer.appendChild(infoContainer);

        jobContainer.appendChild(leftContainer);

        // Create the right container for the job filters
        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container');

        // Create the filter elements for the job level, role, and languages
        const level = document.createElement('p');
        level.classList.add('level');
        level.textContent = job.level;
        rightContainer.appendChild(level);

        const role = document.createElement('p');
        role.classList.add('role');
        role.textContent = job.role;
        rightContainer.appendChild(role);

        if (job.languages) {
            job.languages.forEach(language => {
                const languageFilter = document.createElement('p');
                languageFilter.classList.add(`languages`);
                languageFilter.textContent = language;
                rightContainer.appendChild(languageFilter);
            });
        }

        if (job.tools) {
            job.tools.forEach(tool => {
                const toolFilter = document.createElement('p');
                toolFilter.classList.add('tools');
                toolFilter.textContent = tool;
                rightContainer.appendChild(toolFilter);
            });
        }

        jobContainer.appendChild(rightContainer);

        // Add the job container to the jobHTML array
        jobHTML.push(jobContainer.outerHTML);
    });

    // Join the jobHTML array into a single string and return it
    return jobHTML.join('');
}

// Function to filter and update the job listings based on the current set of filters
// Filter and update the job listings
function updateJobListings(jobs, filters) {
    // Filter the jobs based on the active filters
    const filteredJobs = jobs.filter(job => {
        // Check if the job matches all the active filters
        return Object.keys(filters).every(filterType => {
            const filterValue = filters[filterType];
            if (Array.isArray(job[filterType])) {
                // For array values, check if at least one value matches
                return job[filterType].some(value => value === filterValue);
            } else if (typeof job[filterType] === 'string') {
                // For string values, check if the filter value is a substring
                return job[filterType].toLowerCase().includes(filterValue.toLowerCase());
            } else {
                // For other values, check if they match exactly
                return job[filterType] === filterValue;
            }
        });
    });

    // Create an array of filtered values
    const filteredValues = Object.values(filters).filter(value => value !== '');

    // Generate the HTML for the filtered jobs and add them to the container
    const jobHTML = generateJobHTML(filteredJobs);
    container.innerHTML = jobHTML;

    // Create span elements inside the Active div for each filtered value
    // Create span elements inside the Active div for each filtered value
    const Active = document.createElement('div');
    Active.classList.add('active-tags');
    Active.classList.add('container');
    filteredValues.forEach(filterValue => {
        const Tag = document.createElement('span');
        Tag.classList.add('filter-tags');
        Tag.textContent = filterValue;

        const CrossButton = document.createElement('img');
        CrossButton.classList.add('cross-button');
        CrossButton.src = './images/icon-remove.svg';
        // Unicode character for a cross

        CrossButton.addEventListener('click', (event) => {
            // Get the filter type from the tag's data attribute
            const filterType = event.target.parentNode.dataset.filterType;

            // Remove the filter from the filters object
            delete filters[filterType];
            location.reload();

            // Update the job listings with the updated filters
            updateJobListings(jobs, filters);
        });

        // Set the filter type as a data attribute on the tag
        Tag.dataset.filterType = Object.keys(filters).find(filterType => filters[filterType] === filterValue);

        Tag.append(CrossButton);
        Active.append(Tag);
    });

    // Add the Active div to the container
    container.insertBefore(Active, container.firstChild);

}
