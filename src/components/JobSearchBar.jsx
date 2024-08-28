import React, { useState, useCallback, useEffect, useRef } from 'react';

const keywordOptions = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer'];
const locationOptions = ['Mangalore', 'Bangalore', 'Kerala', 'Remote'];

const JobSearchBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openFilter, setOpenFilter] = useState('');
  const [filters, setFilters] = useState({
    Experience: [],
    'Job Type': [],
    Salary: [],
    Education: []
  });
  const [keyword, setKeyword] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [keywordSuggestions, setKeywordSuggestions] = useState(keywordOptions);
  const [locationSuggestions, setLocationSuggestions] = useState(locationOptions);
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const filterOptions = {
    Experience: ['Entry Level', 'Intermediate', 'Senior', 'Executive'],
    'Job Type': ['Full Time', 'Part Time', 'Contract', 'Internship'],
    Salary: ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'],
    Education: ['High School', "Bachelor's", "Master's", 'PhD']
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterClick = (event, filter) => {
    setAnchorEl(event.currentTarget);
    setOpenFilter(prevFilter => (prevFilter === filter ? '' : filter));
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenFilter('');
  };

  const handleFilterChange = (filter, option) => {
    setFilters(prev => ({
      ...prev,
      [filter]: prev[filter].includes(option)
        ? prev[filter].filter(item => item !== option)
        : [...prev[filter], option]
    }));
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    setKeywordSuggestions(
      keywordOptions.filter(keyword => keyword.toLowerCase().includes(value.toLowerCase()))
    );
    setShowKeywordSuggestions(true);
  };

  const handleJobLocationChange = (e) => {
    const value = e.target.value;
    setJobLocation(value);
    setLocationSuggestions(
      locationOptions.filter(location => location.toLowerCase().includes(value.toLowerCase()))
    );
    setShowLocationSuggestions(true);
  };

  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'keyword') {
      setKeyword(suggestion);
      setShowKeywordSuggestions(false);
    } else if (type === 'location') {
      setJobLocation(suggestion);
      setShowLocationSuggestions(false);
    }
  };

  const clearInput = (type) => {
    if (type === 'keyword') {
      setKeyword('');
      setKeywordSuggestions(keywordOptions); // Reset to all options
      setShowKeywordSuggestions(false); // Close suggestions
    } else if (type === 'location') {
      setJobLocation('');
      setLocationSuggestions(locationOptions); // Reset to all options
      setShowLocationSuggestions(false); // Close suggestions
    }
  };

  const handleBlur = useCallback((type) => {
    // Delay to allow for clicks on suggestions
    setTimeout(() => {
      if (type === 'keyword') {
        setShowKeywordSuggestions(false);
      } else if (type === 'location') {
        setShowLocationSuggestions(false);
      }
    }, 200);
  }, []);

  const renderFilterOptions = () => (
    filterOptions[openFilter]?.map(option => (
      <div key={option} style={styles.filterOption}>
        <label style={styles.filterOptionLabel}>
          {option}
        </label>
        <input
          type="checkbox"
          checked={filters[openFilter].includes(option)}
          onChange={() => handleFilterChange(openFilter, option)}
          style={styles.checkbox}
        />
      </div>
    ))
  );

  return (
    <div style={styles.container}>
      <div style={styles.searchBar}>
        <div style={styles.inputContainer}>
          <img src="/search.svg" alt="Search Icon" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Keyword, job title"
            value={keyword}
            onChange={handleKeywordChange}
            onFocus={() => setShowKeywordSuggestions(true)}
            onBlur={() => handleBlur('keyword')}
            style={styles.inputField}
          />
          {keyword && (
            <span style={styles.clearIcon} onClick={() => clearInput('keyword')}>✖</span>
          )}
          {showKeywordSuggestions && keywordSuggestions.length > 0 && (
            <div style={styles.suggestionsBox}>
              {keywordSuggestions.map(suggestion => (
                <div
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion, 'keyword')}
                  style={styles.suggestionItem}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.inputContainer}>
          <img src="/search.svg" alt="Search Icon" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Job location"
            value={jobLocation}
            onChange={handleJobLocationChange}
            onFocus={() => setShowLocationSuggestions(true)}
            onBlur={() => handleBlur('location')}
            style={styles.inputField}
          />
          {jobLocation && (
            <span style={styles.clearIcon} onClick={() => clearInput('location')}>✖</span>
          )}
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <div style={styles.suggestionsBox}>
              {locationSuggestions.map(suggestion => (
                <div
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion, 'location')}
                  style={styles.suggestionItem}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button style={styles.searchButton}>Search</button>
      </div>

      <div style={styles.filterBar}>
        {Object.keys(filterOptions).map(filter => (
          <button
            key={filter}
            onClick={(e) => handleFilterClick(e, filter)}
            style={{
              ...styles.filterButton,
              color: filter === 'Job Type' ? '#8050E0' : '#000',  // Specific text color for 'Job Type'
              border: `1px solid ${filter === 'Job Type' ? '#8050E0' : '#BFBFBF'}`  // Specific border color for 'Job Type'
            }}
          >
            <span style={{ ...styles.filterButtonText, color: filter === 'Job Type' ? '#8050E0' : '#000' }}>
              {filter}
            </span>
            <img 
              src={openFilter === filter ? "/up.svg" : "/down.svg"} 
              alt="Arrow Icon" 
              style={styles.arrowIcon} 
            />
          </button>
        ))}
      </div>

      {Boolean(anchorEl) && openFilter && (
        <div ref={dropdownRef} style={{ ...styles.filterPopover, left: anchorEl.offsetLeft }}>
          <div style={styles.filterContent}>
            <div style={styles.filterOptions}>
              {renderFilterOptions()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'relative'  // Ensure the popover is correctly positioned
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  inputContainer: {
    position: 'relative',
    flex: 1
  },
  inputField: {
    padding: '10px 10px 10px 30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#F5F5F5',
    width: '80%'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#007bf'
  },
  clearIcon: {
    position: 'absolute',
    right: '30px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#ccc'
  },
  searchButton: {
    padding: '11px 24px 11px 24px',
    border: 'none',
    width: '15%',
    borderRadius: '8px',
    backgroundColor: '#8050E0',
    color: '#fff',
    cursor: 'pointer'
  },
  filterBar: {
    display: 'flex',
    gap: '10px',
    marginLeft: '15px',
    marginBottom: '20px'
  },
  filterButton: {
    padding: '6px 34px 6px 34px',
    border: '1px solid #BFBFBF',
    borderRadius: '40px',
    backgroundColor: '#fff',
    color: '#000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  filterButtonText: {
    marginRight: '8px',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '30.9px',
    color: '#595959'
  },
  arrowIcon: {
    marginLeft: '8px',
    width: '18px',
    height: '18px'
  },
  filterPopover: {
    position: 'absolute',
    top: '85%',
    width: '280px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '12px',
    boxShadow: '5px 2px 11px 0px #5454540F',
    zIndex: 1
  },
  filterContent: {
    padding: '20px',
    position: 'relative'
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '15px',
    justifyContent: 'space-between'
    // marginBottom: '8px'
  },
  filterOptionLabel: {
    display: 'flex',
    alignItems: 'center',
    color: '#141414',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '30.9px',
    letterSpacing: '0.18px'
  },
  checkbox: {
    marginLeft: '8px',
    width: '18px',
    height: '18px',
    accentColor: '#141414'  // Adjust the color of the checkbox
  },
  suggestionsBox: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 2
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    color: '#141414',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '30.9px',
    letterSpacing: '0.18px'
  }
};

export default JobSearchBar;
