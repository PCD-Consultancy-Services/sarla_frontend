import { useState, useEffect } from 'react'
import { DebounceTimeout } from '../constants';



export const useDebounce = (value, milliSeconds=DebounceTimeout) => {

 const [debouncedValue, setDebouncedValue] = useState(value);

 useEffect(() => {
   const handler = setTimeout(() => {
     setDebouncedValue(value);
   }, milliSeconds);

   return () => {
     clearTimeout(handler);
   };
 }, [value, milliSeconds]);

 return debouncedValue;
};