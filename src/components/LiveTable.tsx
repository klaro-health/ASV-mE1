<div className="toolbar">
  <label htmlFor="viewMode" className="sr-only">Tabellenansicht</label>
  <select
    id="viewMode"
    name="viewMode"
    title="Tabellenansicht"
    aria-label="Tabellenansicht"
    className="btn"
    onChange={e=>setMode(e.target.value as any)}
    value={mode}
  >
    <option value="full">Normal</option>
    <option value="mini">Mini</option>
  </select>
</div>
