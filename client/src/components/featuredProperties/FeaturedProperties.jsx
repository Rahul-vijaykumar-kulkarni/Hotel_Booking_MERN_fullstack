import useFetch from "../../hooks/useFetch";
   import "./featuredProperties.css";

   const FeaturedProperties = () => {
     const { data, loading, error } = useFetch("/hotels/?featured=true&limit=4");
   
       // Add a default value for data, assuming we might get an empty array if there are no featured properties.
      const hotelData = data || [];
   
     return (
       <div className="fp">
         {loading ? (
           "Loading"
         ) : error ? (
             "An error occurred while fetching data"
          ) : (
           <>
             {hotelData.length > 0 ? (
              hotelData.map((item) => (
               <div className="fpItem" key={item._id}>
                 <img src={item.photos[0]} alt="" className="fpImg" />
                 <span className="fpName">{item.name}</span>
                 <span className="fpCity">{item.city}</span>
                 <span className="fpPrice">
                   Starting from ${item.cheapestPrice}
                 </span>
                 {item.rating && (
                   <div className="fpRating">
                     <button>{item.rating}</button>
                     <span>Excellent</span>
                   </div>
                 )}
               </div>
              ))
             ) : (
               <p>No featured properties found.</p> 
             )}
           </>
         )}
       </div>
     );
   };

   export default FeaturedProperties;
