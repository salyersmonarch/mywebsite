// quote-loader.js

document.addEventListener("DOMContentLoaded", () => {
    const quoteElem = document.getElementById("motivationQuote");
    if (!quoteElem) {
      console.warn("No quote element found!");
      return;
    }
  
    const today = new Date().toDateString();
    const last = localStorage.getItem("quoteDate");
  
    if (last === today) {
      quoteElem.textContent = localStorage.getItem("quoteText") || "Quote not found.";
      return;
    }
  
    const quotes = [
      { name: "Tanjiro", quote: "Keep moving forward, even when you're hurting." },
      { name: "Rengoku", quote: "Set your heart ablaze." },
      { name: "Zenitsu", quote: "When you’re in pain, you should say it out loud!" },
      { name: "Kanao", quote: "It's your heart. So listen to what it says." }
    ];
  
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    const final = `“${pick.quote}” — ${pick.name}`;
  
    quoteElem.textContent = final;
    localStorage.setItem("quoteDate", today);
    localStorage.setItem("quoteText", final);
  });
  