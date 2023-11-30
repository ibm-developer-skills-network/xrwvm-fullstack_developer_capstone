import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf(window.location.path));
  let dealer_url = root_url+"djangoapp/get_dealers";

  const get_dealers = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers)
      setDealersList(all_dealers)
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  



return(
  <div>
     <table className='table'>
      <tr>
      <th>ID</th>
      <th>Dealer Name</th>
      <th>City</th>
      <th>Address</th>
      <th>Zip</th>
      <th>State</th>
      </tr>
     {dealersList.map(dealer => (
        <tr>
          <td>{dealer['id']}</td>
          <td><a href={'dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
        </tr>
      ))}
     </table>;
  </div>
)
}

export default Dealers
