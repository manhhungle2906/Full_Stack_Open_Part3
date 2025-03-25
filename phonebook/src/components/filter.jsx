const Filter = ({ searchQuery, handleSearchChange }) => {
    return (
      <div>
        Search: <input value={searchQuery} onChange={handleSearchChange} />
      </div>
    );
  };
  
  export default Filter;
  