import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
  }, [dark]);
  return <button onClick={()=>setDark(prev=>!prev)}>{dark ? 'Light' : 'Dark'} Mode</button>;
};
export default DarkModeToggle;