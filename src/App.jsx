import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from './lib/supabaseClient'

const emptyForm = { cliente_id: '', mesa_id: '', fecha_inicio: '', horas: 2, estado: 'reservado' }

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-GT', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function App() {
  const [data, setData] = useState({ clientes: [], mesas: [], accesorios: [], mesaAccesorios: [], alquileres: [] })
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(supabaseConfigured)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const mesaById = useMemo(() => new Map(data.mesas.map((mesa) => [mesa.id, mesa])), [data.mesas])
  const clienteById = useMemo(() => new Map(data.clientes.map((cliente) => [cliente.id, cliente])), [data.clientes])

  async function loadData() {
    if (!supabase) return
    setLoading(true)
    setError('')
    const queries = await Promise.all([
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('mesas').select('*').order('numero'),
      supabase.from('accesorios').select('*').order('nombre'),
      supabase.from('mesa_accesorios').select('*, mesas(numero), accesorios(nombre)'),
      supabase.from('alquileres').select('*, clientes(nombre), mesas(numero)').order('fecha_inicio', { ascending: false }),
    ])
    const failed = queries.find(({ error: queryError }) => queryError)
    if (failed?.error) setError(failed.error.message)
    setData({
      clientes: queries[0].data ?? [],
      mesas: queries[1].data ?? [],
      accesorios: queries[2].data ?? [],
      mesaAccesorios: queries[3].data ?? [],
      alquileres: queries[4].data ?? [],
    })
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  async function createAlquiler(event) {
    event.preventDefault()
    if (!supabase || !form.cliente_id || !form.mesa_id || !form.fecha_inicio) return
    setSaving(true)
    setMessage('')
    setError('')
    const { error: insertError } = await supabase.from('alquileres').insert({
      cliente_id: form.cliente_id,
      mesa_id: form.mesa_id,
      fecha_inicio: new Date(form.fecha_inicio).toISOString(),
      horas: Number(form.horas),
      estado: form.estado,
    })
    if (insertError) setError(insertError.message)
    else {
      setMessage('Alquiler registrado correctamente.')
      setForm(emptyForm)
      await loadData()
    }
    setSaving(false)
  }

  if (!supabaseConfigured) {
    return <main className="setup-screen"><section className="setup-card"><span className="eyebrow">ProBillar</span><h1>Configura Supabase para iniciar</h1><p>Copia <code>.env.example</code> como <code>.env.local</code> y completa la URL y la llave publicable de tu proyecto.</p><p className="muted">La aplicación no incluye credenciales y nunca debe recibir una llave secreta.</p></section></main>
  }

  return (
    <main className="app-shell">
      <header className="hero"><div><span className="eyebrow">Gestión de alquileres</span><h1>ProBillar</h1><p>Control sencillo de mesas, accesorios, clientes y reservas.</p></div><div className="hero-mark">PB</div></header>
      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}
      <section className="stats"><Stat label="Clientes" value={data.clientes.length} /><Stat label="Mesas" value={data.mesas.length} /><Stat label="Accesorios" value={data.accesorios.length} /><Stat label="Alquileres" value={data.alquileres.length} /></section>
      <div className="content-grid">
        <section className="panel form-panel"><div className="section-heading"><div><span className="eyebrow">Nueva reserva</span><h2>Registrar alquiler</h2></div></div><form onSubmit={createAlquiler}>
          <label>Cliente<select value={form.cliente_id} onChange={(event) => setForm({ ...form, cliente_id: event.target.value })} required><option value="">Selecciona un cliente</option>{data.clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}</select></label>
          <label>Mesa<select value={form.mesa_id} onChange={(event) => setForm({ ...form, mesa_id: event.target.value })} required><option value="">Selecciona una mesa</option>{data.mesas.filter((mesa) => mesa.estado === 'disponible').map((mesa) => <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero} · {mesa.tipo}</option>)}</select></label>
          <label>Inicio<input type="datetime-local" value={form.fecha_inicio} onChange={(event) => setForm({ ...form, fecha_inicio: event.target.value })} required /></label>
          <div className="form-row"><label>Horas<input type="number" min="1" max="24" value={form.horas} onChange={(event) => setForm({ ...form, horas: event.target.value })} required /></label><label>Estado<select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })}><option value="reservado">Reservado</option><option value="activo">Activo</option></select></label></div>
          <button disabled={saving} type="submit">{saving ? 'Guardando…' : 'Guardar alquiler'}</button>
        </form></section>
        <section className="panel"><div className="section-heading"><div><span className="eyebrow">Agenda</span><h2>Alquileres recientes</h2></div><button className="secondary" onClick={loadData}>Actualizar</button></div>{loading ? <p className="muted">Cargando datos…</p> : <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Mesa</th><th>Inicio</th><th>Estado</th></tr></thead><tbody>{data.alquileres.map((alquiler) => <tr key={alquiler.id}><td>{alquiler.clientes?.nombre ?? clienteById.get(alquiler.cliente_id)?.nombre ?? '—'}</td><td>Mesa {alquiler.mesas?.numero ?? mesaById.get(alquiler.mesa_id)?.numero ?? '—'}</td><td>{formatDate(alquiler.fecha_inicio)}</td><td><span className={`badge ${alquiler.estado}`}>{alquiler.estado}</span></td></tr>)}{!data.alquileres.length && <tr><td colSpan="4" className="muted">Todavía no hay alquileres.</td></tr>}</tbody></table></div>}</section>
      </div>
      <section className="panel"><div className="section-heading"><div><span className="eyebrow">Inventario</span><h2>Mesas, accesorios y relaciones</h2></div></div><div className="cards-grid"><InfoList title="Mesas" items={data.mesas.map((mesa) => `Mesa ${mesa.numero} · ${mesa.tipo} · ${mesa.estado}`)} /><InfoList title="Accesorios" items={data.accesorios.map((accesorio) => `${accesorio.nombre} · ${accesorio.cantidad} disponibles`)} /><InfoList title="Mesa-accesorios" items={data.mesaAccesorios.map((item) => `Mesa ${item.mesas?.numero ?? '—'} · ${item.accesorios?.nombre ?? '—'} × ${item.cantidad}`)} /></div></section>
    </main>
  )
}

function Stat({ label, value }) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div> }
function InfoList({ title, items }) { return <div className="info-list"><h3>{title}</h3>{items.length ? <ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p className="muted">Sin registros.</p>}</div> }

export default App
