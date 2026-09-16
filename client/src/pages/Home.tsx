import { useMemo, useState } from "react";
import { Dices, Download, Instagram, Menu, RotateCcw, Save, Send, Sparkles, X } from "lucide-react";

const chipPositions = [
  { top: "10%", left: "4%", rotate: "-18deg", color: "pink" },
  { top: "21%", right: "4%", rotate: "22deg", color: "black" },
  { top: "45%", left: "-6%", rotate: "12deg", color: "white" },
  { top: "65%", right: "-5%", rotate: "-14deg", color: "pink" },
  { top: "83%", left: "12%", rotate: "-26deg", color: "black" },
  { top: "90%", right: "15%", rotate: "16deg", color: "white" },
];

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CasinoChip({ color = "pink" }: { color?: string }) {
  return <span className={`casino-chip ${color}`} aria-hidden="true"><span>♠</span></span>;
}

export default function Home() {
  const [rate, setRate] = useState(5);
  const [customRate, setCustomRate] = useState("5");
  const [initial, setInitial] = useState("100,00");
  const [currentBank, setCurrentBank] = useState("100,00");
  const [menuOpen, setMenuOpen] = useState(false);
  const numericInitial = Number(initial.replace(/\\./g, "").replace(",", ".")) || 0;
  const numericCurrentBank = Number(currentBank.replace(/\./g, "").replace(",", ".")) || 0;
  const stopLossValue = numericCurrentBank * rate / 100;
  const protectedBank = Math.max(0, numericCurrentBank - stopLossValue);
  const rows = useMemo(() => Array.from({ length: 31 }, (_, i) => {
    const current = numericInitial * Math.pow(1 + rate / 100, i);
    const gain = current * rate / 100;
    return { day: i + 1, current, gain, total: current + gain };
  }), [numericInitial, rate]);

  const restore = () => { setRate(5); setCustomRate("5"); setInitial("100,00"); setCurrentBank("100,00"); };
  const save = () => localStorage.setItem("ale-cruz-planilha", JSON.stringify({ rate, customRate, initial, currentBank }));
  const exportCsv = () => {
    const csv = ["Dia;Banca atual;Valor a fazer;Total", ...rows.map(r => `${r.day};${r.current.toFixed(2).replace(".",",")};${r.gain.toFixed(2).replace(".",",")};${r.total.toFixed(2).replace(".",",")}`)].join("\\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "planilha-gerenciamento-ale-cruz.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="app-shell">
    <div className="chip-field">{chipPositions.map((p, i) => <div key={i} className="floating-chip" style={p as React.CSSProperties}><CasinoChip color={p.color} /></div>)}</div>
    <header className="topbar">
      <div className="brand-mark"><span className="brand-icon">AC</span><div><p>PLANILHA DE</p><strong>GERENCIAMENTO</strong></div></div>
      <div className="top-actions">
        <button className="icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X size={19}/> : <Menu size={19}/>}</button>
        <button className="icon-button" onClick={restore} aria-label="Restaurar planilha"><RotateCcw size={18}/></button>
        <button className="icon-button accent" onClick={save} aria-label="Salvar planilha"><Save size={18}/></button>
      </div>
    </header>

    {menuOpen && <div className="menu-popover"><button onClick={exportCsv}><Download size={16}/> Exportar tabela CSV</button><a href="https://www.instagram.com/alecruz.roleta" target="_blank" rel="noreferrer">Instagram @alecruz.roleta</a><a href="https://t.me/alecruzroleta" target="_blank" rel="noreferrer">Telegram @alecruzroleta</a></div>}

    <main className="content">
      <section className="hero-card">
        <div className="hero-image"><img src={`${import.meta.env.BASE_URL}ale-cruz-roleta.jpg`} alt="Alê Cruz na roleta"/><div className="hero-overlay"/></div>
        <div className="hero-copy" aria-hidden="true" />
        <div className="hero-name"><span>por</span><strong>Alê Cruz</strong></div>
      </section>
      <div className="under-hero-bar"><div className="hero-brand-line"><span>PLANEJAMENTO PESSOAL</span><small>Roleta & estratégia</small></div><div className="social-actions"><a className="social-pill instagram" href="https://www.instagram.com/alecruz.roleta" target="_blank" rel="noreferrer"><Instagram size={14}/> Instagram</a><a className="social-pill telegram" href="https://t.me/alecruzroleta" target="_blank" rel="noreferrer"><Send size={14}/> Telegram</a><a className="social-pill play-now" href="https://go.aff.bateu.bet.br/209vwkyd" target="_blank" rel="noreferrer"><Dices size={14}/> Jogue aqui!</a></div></div>

      <section className="control-card">
        <div className="section-heading"><div><p className="eyebrow">JUROS PARA TODOS OS DIAS</p><p className="subheading">Digite a porcentagem que quiser</p><p className="muted">O valor é totalmente editável e atualiza tudo automaticamente.</p></div><Sparkles className="sparkle" size={24}/></div>
        <div className="rate-grid"><div className="custom-rate active"><label htmlFor="custom-rate-input">PORCENTAGEM EDITÁVEL</label><div className="rate-input-wrap"><input id="custom-rate-input" value={customRate} onChange={e => { const value = e.target.value.replace(/[^0-9,.]/g, "").replace(".", ","); setCustomRate(value); const parsed = Number(value.replace(",", ".")); if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) setRate(parsed); }} aria-label="Porcentagem editável" inputMode="decimal" placeholder="Ex.: 1, 2, 3 ou 4"/><span>%</span></div><small>Você pode colocar 1%, 2%, 3%, 4% ou qualquer valor até 100%.</small></div></div>
        <div className="bank-input"><label>BANCA INICIAL</label><div className="input-wrap"><span>R$</span><input value={initial} onChange={e => setInitial(e.target.value.replace(/[^0-9,]/g, ""))} aria-label="Banca inicial"/><span className="input-caret">●</span></div><small>Digite o valor inicial para projetar a tabela de gerenciamento.</small></div>
        <div className="bank-input current-bank-input"><label>VALOR DA BANCA AGORA</label><div className="input-wrap"><span>R$</span><input value={currentBank} onChange={e => setCurrentBank(e.target.value.replace(/[^0-9,]/g, ""))} aria-label="Valor da banca agora" inputMode="decimal"/><span className="input-caret">●</span></div><small>Digite quanto você tem na banca agora. Este valor será usado no stop loss.</small></div>
        <div className="stop-loss-card"><div><p className="eyebrow">STOP LOSS CALCULADO</p><h3>Limite de perda</h3><p className="muted">{rate.toFixed(2).replace(".", ",")}% de {money(numericCurrentBank)} (banca atual)</p></div><div className="stop-loss-values"><div><span>Você pode perder até</span><strong>{money(stopLossValue)}</strong></div><div><span>Valor restante</span><strong>{money(protectedBank)}</strong></div></div></div>
      </section>

      <section className="table-card"><div className="table-head"><span>DIA</span><span>BANCA ATUAL</span><span>VALOR A FAZER</span><span>TOTAL</span></div>{rows.map(row => <div className="table-row" key={row.day}><strong>{row.day}</strong><span className="current-value">{money(row.current)}</span><span className="gain-value">{money(row.gain)}<small>{rate.toFixed(2)}%</small></span><strong className="total-value">{money(row.total)}</strong></div>)}</section>
      <p className="formula">Banca atual × (1 + juros) = total do dia</p>
      <footer>Feito para <strong>Alê Cruz</strong> <span>•</span> roleta com responsabilidade</footer>
    </main>
  </div>;
}
