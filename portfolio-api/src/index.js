export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/portfolio") {
      return new Response("Not found", { status: 404 });
    }

    try {
      // 1. Leer holdings desde D1
      const { results: holdings } = await env.DB.prepare(`
        SELECT ticker, SUM(shares) as total_shares, SUM(total_cost) as total_cost
        FROM purchases GROUP BY ticker
      `).all();

      // 2. Precios en tiempo real
      const pricePromises = holdings.map(async (h) => {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${h.ticker}&token=${env.FINNHUB_API_KEY}`);
        const data = await res.json();
        return {
          ticker: h.ticker,
          shares: parseFloat(h.total_shares),
          totalCost: parseFloat(h.total_cost),
          currentPrice: data.c || 0,
          changePercent: data.dp || 0,
        };
      });

      const stocks = await Promise.all(pricePromises);

      // 3. Cálculos del portafolio
      let totalValue = 0;
      let totalInvested = 0;
      stocks.forEach(s => {
        s.currentValue = s.shares * s.currentPrice;
        totalValue += s.currentValue;
        totalInvested += s.totalCost;
      });

      const totalGain = totalValue - totalInvested;
      const totalReturnPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

      // 4. Insight con IA (mejorado con error handling)
      let aiInsight = "Insight no disponible en este momento.";
      try {
        const aiPrompt = `
          Eres un asesor financiero amigable y conservador en español.
          Portafolio actual:
          - Valor total: $${totalValue.toFixed(2)}
          - Invertido: $${totalInvested.toFixed(2)}
          - Ganancia: $${totalGain.toFixed(2)} (${totalReturnPct.toFixed(2)}%)
          - Holdings: ${stocks.map(s => `${s.ticker} ×${s.shares.toFixed(4)} ($${s.currentValue.toFixed(2)})`).join(" | ")}

          Genera un resumen corto (máximo 4-5 oraciones) con:
          - Resumen del día
          - Un punto fuerte y uno débil
          - Un consejo práctico útil
        `;

        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: aiPrompt }],
            max_tokens: 280,
            temperature: 0.7
          })
        });

        if (!aiRes.ok) throw new Error(`OpenAI error: ${aiRes.status}`);

        const aiData = await aiRes.json();
        aiInsight = aiData.choices?.[0]?.message?.content || aiInsight;
      } catch (aiError) {
        console.error("AI Error:", aiError.message);   // ← verás esto en los logs
      }

      return Response.json({
        totalValue: totalValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        totalGain: totalGain.toFixed(2),
        totalReturnPct: totalReturnPct.toFixed(2),
        stocks,
        aiInsight,
        lastUpdated: new Date().toISOString(),
        count: stocks.length
      },{
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      }
    );

    } catch (err) {
      console.error(err);
      return Response.json({ error: err.message }, { status: 500 });
    }
  }
};
