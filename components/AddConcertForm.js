import { useState } from "react"
import supabase from "../utils/supabase"
import MultiSelect from "./MultiSelect"

export default function NewConcertForm({ bands, locations, cancelButton }) {
  const [selectedConcertBands, setSelectedConcertBands] = useState([])
  const [isFestival, setIsFestival] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const { data: insertConcert, insertConcertError } = await supabase
      .from('concerts')
      .insert([{
        date_start: event.target.dateStart.value,
        date_end: event.target.dateEnd?.value,
        band_ids: selectedConcertBands.map(item => item.id),
        location: event.target.location.value,
        description: event.target.description.value,
        name: event.target.name.value,
        is_festival: event.target.isFestival.checked,
      }])
      .single()

    if (insertConcertError) {
      alert(insertConcertError.message)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <h2 className="mb-0">Konzert hinzufügen</h2>
      <div className="form-control">
        <label>Name (optional)</label>
        <input type="text" name="name" id="name" placeholder="Wacken Open Air" />
      </div>
      <div className="form-control">
        <label>
          <input type="checkbox" name="isFestival" value="isFestival" checked={isFestival} onChange={() => setIsFestival(!isFestival)} />
          <span>Festival</span>
        </label>
      </div>
      <div className="flex gap-4">
        <div className="form-control">
          <label htmlFor="dateStart">Datum</label>
          <input type="date" name="dateStart" id="dateStart" />
        </div>
        {isFestival && (
          <div className="form-control">
            <label htmlFor="dateEnd">Enddatum</label>
            <input type="date" name="dateEnd" id="dateEnd" />
          </div>
        )}
      </div>
      <div className="form-control">
        <label htmlFor="bands">Bands</label>
        <MultiSelect
          name="bands"
          options={bands}
          selectedOptions={selectedConcertBands}
          setSelectedOptions={setSelectedConcertBands}
        />
      </div>
      <div className="form-control">
        <label htmlFor="location">Location</label>
        <select name="location" id="location">
          <option value={null}>Bitte wählen ...</option>
          {locations && locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label htmlFor="description">Beschreibung</label>
        <textarea name="description" id="description" placeholder="Schreib was Schönes ..." />
      </div>
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Konzert erstellen</button>
      </div>
    </form>
  )
}