import './App.css'
import { useState } from 'react'
import { useEffect } from 'react';

export default function App(){
  const [name, setName] = useState('');
  const [Age, setAge] = useState();
  const [Nationality, setNationality] = useState();
  const [Gender, setGender] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getInfo(event){
    setLoading(true);
    setError(null); // Сбрасываем ошибку перед новым запросом
    try {
      let age = await fetch('https://api.agify.io/?name='+event)
      age = await age.json()
      setAge(age)
      let gender = await fetch('https://api.genderize.io/?name='+event)
      gender = await gender.json()
      console.log(gender)
      setGender(gender) 
      let nationality = await fetch('https://api.nationalize.io/?name='+event)
      nationality = await nationality.json();
      console.log(nationality)
      setNationality(nationality)
    }catch(err){
      setError('Ошибка при получении данных. Попробуйте еще раз.');
    } finally {
      setLoading(false)
    }
  }
  return(
  <>
    <h1>I'll guess your nationality, gender and age only by your name</h1>
    <p>Write your name right here:</p>
    <input 
      type="text" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      onKeyPress={(event) => {
          if (event.key === 'Enter') {
              getInfo(event.target.value);
          }
    }}/>
     {loading && <h2>Loading...</h2>}
     {error && <h2>{error}</h2>}
   {((typeof Age !== "undefined" && Age !== null)&&(typeof Gender !== "undefined" && Gender !== null)&&(typeof Nationality !== "undefined" && Nationality !== null)) ? (
    <>
          <h2>Your possible age is {Age.age || 'Error'}</h2>
          <h2>Your gender is {Gender.gender || 'Error'} with probability = {Gender.probability ? (Gender.probability * 100).toFixed(2) : 'Error'}</h2>
          <h2>And your nationality can be:</h2>
          <ul>
            {(Nationality.country && Nationality.country.length > 0)?(Nationality.country.map((item) => (
              <li key={item.country_id}>{item.country_id} with probability = {Math.round(item.probability * 100)}%</li>
            ))
            ):(
            <li>No nationality data available</li>
            )}
          </ul>
    </>
      ) : (
        ''
      )}

    </>
  )
}