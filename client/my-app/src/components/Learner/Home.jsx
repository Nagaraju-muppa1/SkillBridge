function Home({ searchResults, openProfessional }) {
  return (
    <div>
      <h2>Search Results</h2>

      {searchResults && searchResults.length > 0 ? (
        searchResults.map((pro) => (
          <div
            key={pro._id}
            onClick={() => openProfessional(pro)}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <h3>{pro.username}</h3>
            <p>Skill: {pro.skill}</p>
            <p>Experience: {pro.experience} years</p>
            <small>Click to view videos</small>
          </div>
        ))
      ) : (
        <p>No professionals found</p>
      )}
    </div>
  );
}

export default Home;
