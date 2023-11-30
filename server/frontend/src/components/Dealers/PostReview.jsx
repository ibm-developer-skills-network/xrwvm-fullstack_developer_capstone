import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;

  const postreview = async ()=>{
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    if(name === ""){
      name = sessionStorage.getItem("username");
    }
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": name,
        "dealership": id,
        "review": review,
        "purchase": true,
        "purchase_date": date,
        "car_make": make,
        "car_model": model,
        "car_year": year,
      }),
  });

  const json = await res.json();
  if (json.status) {
      window.location.href = window.location.origin+"/dealer/"+id;
  }

  }
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }
  useEffect(() => {
    get_dealer();
  },[]);


  return (
    <div>
      <h1>{dealer.full_name}</h1>
      <textarea id='review' cols='70' rows='5' onChange={(e) => setReview(e.target.value)}></textarea>
      <div className='input_field'>
      Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)}/>
      </div>
      <div className='input_field'>
      Car Make <input type="text" onChange={(e) => setMake(e.target.value)}/>
      </div >
      <div className='input_field'>
      Car Model <input type="text" onChange={(e) => setModel(e.target.value)}/>
      </div>
      <div className='input_field'>
      Car Year <input type="int" onChange={(e) => setYear(e.target.value)}/>
      </div>


      <div>
      <button className='postreview' onClick={postreview}>Post Review</button>
      </div>
    </div>
  )
}
export default PostReview
