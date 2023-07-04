async function reDirectPage(){
    const result = await fetch(`http://localhost:3001/auth/token`);
    if(result.ok) {
      window.location.href = "http://localhost:3001/memories";
    } else {
      window.location.href = "http://localhost:3001";
    }
}